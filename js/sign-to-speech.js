// SIGN TO SPEECH MODULE — Camera-based gesture recognition


const SignToSpeech = {
    model: null,
    scaler: null,
    labels: null,
    handLandmarker: null,
    poseLandmarker: null,
    video: null,
    isRunning: false,
    lastVideoTime: -1,

    // Sentence tracking
    sentenceWords: [],
    currentSign: null,
    currentSignStartTime: 0,
    currentSignConfidences: [],
    handDetected: false,


    // SIMPLE MLP INFERENCE ENGINE

    SimpleModel: class {
        constructor(modelData) {
            this.layers = modelData.layers;
            this.inputSize = modelData.input_size;
            this.outputSize = modelData.output_size;
        }
        predict(input) {
            let x = input instanceof Float32Array ? input : new Float32Array(input);
            for (const layer of this.layers) {
                x = this._denseLayer(x, layer.weights, layer.bias, layer.activation);
            }
            return x;
        }
        _denseLayer(input, weights, bias, activation) {
            const outSize = weights.length;
            const output = new Float32Array(outSize);
            for (let i = 0; i < outSize; i++) {
                let sum = bias[i];
                const row = weights[i];
                for (let j = 0; j < row.length; j++) sum += row[j] * input[j];
                output[i] = sum;
            }
            if (activation === 'relu') {
                for (let i = 0; i < output.length; i++) { if (output[i] < 0) output[i] = 0; }
            } else if (activation === 'softmax') {
                let max = -Infinity;
                for (let i = 0; i < output.length; i++) { if (output[i] > max) max = output[i]; }
                let sum = 0;
                for (let i = 0; i < output.length; i++) { output[i] = Math.exp(output[i] - max); sum += output[i]; }
                for (let i = 0; i < output.length; i++) { output[i] /= sum; }
            }
            return output;
        }
    },


    // INITIALIZATION

    async init() {
        Utils.log('[Sign→Speech] Loading model...', 'info');

        // Load model weights
        const modelResp = await fetch(CONFIG.MODEL_PATH);
        if (!modelResp.ok) throw new Error('Model weights file not found');
        const modelData = await modelResp.json();
        this.model = new this.SimpleModel(modelData);
        Utils.log(`[Sign→Speech] Model loaded (${modelData.layers.length} layers, input=${modelData.input_size})`, 'success');

        // Load scaler
        const scalerResp = await fetch(CONFIG.SCALER_PATH);
        if (!scalerResp.ok) throw new Error('Scaler file not found');
        this.scaler = await scalerResp.json();
        Utils.log('[Sign→Speech] Scaler loaded', 'success');

        // Load labels
        const labelsResp = await fetch(CONFIG.LABELS_PATH);
        if (!labelsResp.ok) throw new Error('Labels file not found');
        this.labels = await labelsResp.json();
        Utils.log(`[Sign→Speech] ${Object.keys(this.labels).length} gesture classes loaded`, 'success');

        // Initialize MediaPipe landmarkers
        const vision = await window.FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );

        this.handLandmarker = await window.HandLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: CONFIG.HAND_LANDMARKER.modelAssetPath, delegate: 'GPU' },
            runningMode: 'VIDEO',
            numHands: CONFIG.HAND_LANDMARKER.numHands,
            minHandDetectionConfidence: CONFIG.HAND_LANDMARKER.minDetectionConfidence,
            minTrackingConfidence: CONFIG.HAND_LANDMARKER.minTrackingConfidence
        });

        this.poseLandmarker = await window.PoseLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: CONFIG.POSE_LANDMARKER.modelAssetPath, delegate: 'GPU' },
            runningMode: 'VIDEO',
            minPoseDetectionConfidence: CONFIG.POSE_LANDMARKER.minDetectionConfidence,
            minPosePresenceConfidence: CONFIG.POSE_LANDMARKER.minTrackingConfidence,
            outputSegmentationMasks: false
        });

        Utils.log('[Sign→Speech] MediaPipe landmarkers ready', 'success');
    },


    // CAMERA CONTROL

    async startCamera() {
        try {
            /* === TOGGLE: CAMERA ASPECT RATIO === */
            const isPortrait = CONFIG.CAMERA_ASPECT_RATIO === 'portrait';
            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: isPortrait ? 480 : 640 },
                    height: { ideal: isPortrait ? 640 : 480 }
                },
                audio: false
            };
            /* === END TOGGLE: CAMERA ASPECT RATIO === */

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video = document.getElementById('stsVideo');
            this.video.srcObject = stream;

            this.video.onloadedmetadata = () => {
                this.video.play();
                this.isRunning = true;
                this.lastVideoTime = -1;
                this.currentSign = null;
                this.currentSignStartTime = 0;
                this.currentSignConfidences = [];
                this.handDetected = false;

                document.getElementById('stsStartBtn').disabled = true;
                document.getElementById('stsStopBtn').disabled = false;
                this.showNoHandState();
                App.updateStatus('Camera active — show your hand gestures!', 'ready');
                Utils.log('[Sign→Speech] Camera started', 'success');
                requestAnimationFrame(() => this.inferenceLoop());
            };
        } catch (error) {
            Utils.log(`[Sign→Speech] Camera error: ${error.message}`, 'error');
            App.updateStatus(`Camera error: ${error.message}`, 'error');
        }
    },

    stopCamera() {
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        this.isRunning = false;
        document.getElementById('stsStartBtn').disabled = false;
        document.getElementById('stsStopBtn').disabled = true;
        Utils.log('[Sign→Speech] Camera stopped', 'info');
    },

    // INFERENCE LOOP

    inferenceLoop() {
        if (!this.isRunning || !this.handLandmarker || !this.poseLandmarker || !this.video) return;

        try {
            const currentTime = this.video.currentTime;
            if (currentTime !== this.lastVideoTime) {
                this.lastVideoTime = currentTime;

                const ts = performance.now();
                let handResults = this.handLandmarker.detectForVideo(this.video, ts);
                const poseResults = this.poseLandmarker.detectForVideo(this.video, ts);

                // Primary person detection: filter out bystanders' hands
                handResults = Utils.filterPrimaryPersonHands(handResults, poseResults);

                let keypoints = null;
                if (handResults.landmarks && handResults.landmarks.length > 0) {
                    keypoints = Utils.extractKeypoints(handResults.landmarks, poseResults.landmarks, handResults.handednesses);
                }

                if (keypoints) {
                    if (!this.handDetected) this.handDetected = true;
                    const prediction = this.predictGesture(keypoints);
                    if (prediction && prediction.confidence >= CONFIG.INFERENCE.minConfidence) {
                        this.updatePredictionDisplay(prediction);
                        this.trackSustainedSign(prediction.gesture, prediction.confidence);
                    }
                } else {
                    if (this.handDetected || this.currentSign !== null) {
                        this.handDetected = false;
                        this.currentSign = null;
                        this.currentSignStartTime = 0;
                        this.currentSignConfidences = [];
                    }
                    this.showNoHandState();
                }
            }
        } catch (error) {
            Utils.log(`[Sign→Speech] Inference error: ${error.message}`, 'error');
        }

        if (this.isRunning) requestAnimationFrame(() => this.inferenceLoop());
    },

    predictGesture(keypoints) {
        if (!keypoints || !this.model || !this.scaler) return null;
        try {
            const normalized = Utils.normalizeKeypoints(keypoints, this.scaler);
            if (!normalized) return null;
            const predArray = this.model.predict(normalized);
            let maxIdx = 0, maxConf = predArray[0];
            for (let i = 1; i < predArray.length; i++) {
                if (predArray[i] > maxConf) { maxConf = predArray[i]; maxIdx = i; }
            }
            return {
                gesture: this.labels[maxIdx.toString()] || 'Unknown',
                confidence: maxConf, index: maxIdx
            };
        } catch (error) {
            Utils.log(`[Sign→Speech] Prediction error: ${error.message}`, 'error');
            return null;
        }
    },


    // SUSTAINED SIGN TRACKING + SENTENCE

    trackSustainedSign(gesture, confidence) {
        const now = Date.now();
        if (gesture === this.currentSign) {
            this.currentSignConfidences.push(confidence);
            const duration = now - this.currentSignStartTime;
            if (duration >= CONFIG.INFERENCE.sustainedDuration) {
                const avg = this.currentSignConfidences.reduce((a, b) => a + b, 0) / this.currentSignConfidences.length;
                if (avg >= CONFIG.INFERENCE.sustainedConfidence) {
                    const last = this.sentenceWords.length > 0 ? this.sentenceWords[this.sentenceWords.length - 1] : null;
                    if (gesture !== last) {
                        this.addWordToSentence(gesture);
                        Utils.log(`[Sign→Speech] Word: ${gesture} (avg ${(avg * 100).toFixed(1)}%)`, 'success');
                    }
                }
                this.currentSignStartTime = now;
                this.currentSignConfidences = [confidence];
            }
        } else {
            this.currentSign = gesture;
            this.currentSignStartTime = now;
            this.currentSignConfidences = [confidence];
        }
    },

    addWordToSentence(word) {
        this.sentenceWords.push(word);
        if (this.sentenceWords.length > 10) this.sentenceWords.shift();
        this.renderSentence();
    },

    clearSentence() {
        this.sentenceWords = [];
        this.renderSentence();
    },

    // UI UPDATES

    showNoHandState() {
        const el = document.getElementById('stsGestureName');
        if (el) { el.textContent = '✋ Show your hand'; el.classList.add('no-hand'); }
        const conf = document.getElementById('stsConfidenceText');
        if (conf) conf.textContent = 'Confidence: --';
        const fill = document.getElementById('stsConfidenceFill');
        if (fill) fill.style.width = '0%';
    },

    updatePredictionDisplay(prediction) {
        const el = document.getElementById('stsGestureName');
        if (el) { el.textContent = prediction.gesture; el.classList.remove('no-hand'); }
        const pct = prediction.confidence * 100;
        const conf = document.getElementById('stsConfidenceText');
        if (conf) conf.textContent = `Confidence: ${pct.toFixed(1)}%`;
        const fill = document.getElementById('stsConfidenceFill');
        if (fill) {
            fill.style.width = pct.toFixed(1) + '%';
            if (prediction.confidence > 0.8) fill.style.background = 'linear-gradient(90deg, #48bb78, #38a169)';
            else if (prediction.confidence > 0.6) fill.style.background = 'linear-gradient(90deg, #ed8936, #dd6b20)';
            else fill.style.background = 'linear-gradient(90deg, #f56565, #e53e3e)';
        }
    },

    renderSentence() {
        const box = document.getElementById('stsSentenceBox');
        if (!box) return;
        box.innerHTML = '';
        if (this.sentenceWords.length === 0) {
            const ph = document.createElement('div');
            ph.className = 'sentence-placeholder';
            ph.textContent = 'Detected words will appear here...';
            box.appendChild(ph);
            return;
        }
        this.sentenceWords.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'sentence-word';
            span.textContent = word;
            if (i === this.sentenceWords.length - 1) {
                span.style.animation = 'wordPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)';
            } else {
                span.style.animation = 'none';
            }
            box.appendChild(span);
        });
    }
};
