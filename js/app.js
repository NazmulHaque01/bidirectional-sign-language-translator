// APP CONTROLLER — Layout toggle, settings, initialization

const App = {
    // INITIALIZATION
    async init() {
        Utils.log('App initializing...', 'info');
        
        // Setup UI listeners immediately so buttons work even while loading
        this.setupEventListeners();
        
        this.updateStatus('Loading AI Models...', 'loading');

        try {
            // Wait for MediaPipe
            await this.waitForMediaPipe();
            Utils.log('MediaPipe loaded', 'success');

            // Initialize both modules in parallel — both preloaded
            await Promise.all([
                SignToSpeech.init(),
                SpeechToSign.init()
            ]);

            this.updateStatus('Ready!', 'ready');
            Utils.log('App fully initialized', 'success');
        } catch (error) {
            Utils.log(`Init error: ${error.message}`, 'error');
            console.error('Full init error:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    },

    waitForMediaPipe(timeout = 30000) {
        return new Promise((resolve, reject) => {
            if (window.FilesetResolver && window.HandLandmarker && window.PoseLandmarker) {
                resolve(); return;
            }
            const start = Date.now();
            const check = () => {
                if (window.FilesetResolver && window.HandLandmarker && window.PoseLandmarker) resolve();
                else if (Date.now() - start > timeout) reject(new Error('MediaPipe load timeout'));
                else setTimeout(check, 100);
            };
            check();
        });
    },

    // EVENT LISTENERS
    setupEventListeners() {
        // Settings Modal Toggle
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                settingsModal.classList.toggle('show');
            });
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (settingsModal.classList.contains('show') && !settingsModal.contains(e.target) && e.target !== settingsBtn) {
                    settingsModal.classList.remove('show');
                }
            });
            
            // Prevent clicks inside modal from closing it
            settingsModal.addEventListener('click', (e) => e.stopPropagation());
        }

        // Sign→Speech controls
        document.getElementById('stsStartBtn').addEventListener('click', () => SignToSpeech.startCamera());
        document.getElementById('stsStopBtn').addEventListener('click', () => SignToSpeech.stopCamera());
        document.getElementById('stsClearBtn').addEventListener('click', () => SignToSpeech.clearSentence());

        // Speech→Sign controls
        document.getElementById('sptsVoiceBtn').addEventListener('click', () => SpeechToSign.toggleVoice());
        document.getElementById('sptsTranslateBtn').addEventListener('click', () => SpeechToSign.translate());
        document.getElementById('sptsClearBtn').addEventListener('click', () => SpeechToSign.clearInput());

        /* === TOGGLE: CAMERA ASPECT RATIO === */
        const ratioToggle = document.getElementById('cameraRatioToggle');
        if (ratioToggle) {
            ratioToggle.addEventListener('change', (e) => {
                CONFIG.CAMERA_ASPECT_RATIO = e.target.checked ? 'portrait' : 'landscape';
                
                document.getElementById('cameraRatioLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('cameraRatioLabelRight')?.classList.toggle('active', e.target.checked);

                const container = document.getElementById('stsVideoContainer');
                if (container) {
                    container.classList.toggle('portrait', CONFIG.CAMERA_ASPECT_RATIO === 'portrait');
                }

                if (SignToSpeech.isRunning) {
                    SignToSpeech.stopCamera();
                    setTimeout(() => SignToSpeech.startCamera(), 300);
                }
            });
        }

        /* === TOGGLE: MISSING AVATAR FALLBACK === */
        const fallbackToggle = document.getElementById('fallbackModeToggle');
        if (fallbackToggle) {
            fallbackToggle.addEventListener('change', (e) => {
                CONFIG.MISSING_AVATAR_MODE = e.target.checked ? 'neutral' : 'text';
                
                document.getElementById('fallbackModeLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('fallbackModeLabelRight')?.classList.toggle('active', e.target.checked);
            });
        }

        /* === TOGGLE: TEXT TO SPEECH === */
        const ttsToggle = document.getElementById('ttsToggle');
        if (ttsToggle) {
            ttsToggle.checked = CONFIG.TTS_ENABLED;
            ttsToggle.addEventListener('change', (e) => {
                CONFIG.TTS_ENABLED = e.target.checked;
                
                document.getElementById('ttsLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('ttsLabelRight')?.classList.toggle('active', e.target.checked);
            });
        }

        /* === TOGGLE: TTS LANGUAGE === */
        const ttsLangToggle = document.getElementById('ttsLangToggle');
        if (ttsLangToggle) {
            ttsLangToggle.addEventListener('change', (e) => {
                CONFIG.TTS_LANGUAGE = e.target.checked ? 'en' : 'bn';
                
                document.getElementById('ttsLangLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('ttsLangLabelRight')?.classList.toggle('active', e.target.checked);
                
                SignToSpeech.renderSentence();
            });
        }

        /* === TOGGLE: TEXT SCALE === */
        const textScaleToggle = document.getElementById('textScaleToggle');
        if (textScaleToggle) {
            textScaleToggle.addEventListener('change', (e) => {
                const html = document.documentElement;
                html.classList.remove('text-scale-small', 'text-scale-normal', 'text-scale-large');
                
                if (e.target.checked) {
                    html.classList.add('text-scale-normal');
                    document.getElementById('textScaleSmall')?.classList.remove('active');
                    document.getElementById('textScaleNormal')?.classList.add('active');
                } else {
                    html.classList.add('text-scale-small');
                    document.getElementById('textScaleSmall')?.classList.add('active');
                    document.getElementById('textScaleNormal')?.classList.remove('active');
                }
            });
        }

        /* === PERMISSIONS TRIGGERS === */
        const handlePermToggle = async (toggleId, constraints, labelOn, labelOff) => {
            const toggle = document.getElementById(toggleId);
            if (!toggle) return;
            
            toggle.addEventListener('change', async (e) => {
                if (e.target.checked) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia(constraints);
                        stream.getTracks().forEach(track => track.stop()); // Stop immediately
                        document.getElementById(labelOff)?.classList.remove('active');
                        document.getElementById(labelOn)?.classList.add('active');
                        Utils.log(`${toggleId} permission granted.`, 'success');
                    } catch (err) {
                        e.target.checked = false; // revert toggle if denied
                        Utils.log(`${toggleId} permission denied: ${err.message}`, 'error');
                        alert("Permission denied. Please enable it in your browser settings.");
                    }
                } else {
                    document.getElementById(labelOff)?.classList.add('active');
                    document.getElementById(labelOn)?.classList.remove('active');
                }
            });
        };

        handlePermToggle('cameraPermToggle', { video: true }, 'cameraPermOn', 'cameraPermOff');
        handlePermToggle('micPermToggle', { audio: true }, 'micPermOn', 'micPermOff');
        
        const mediaPermToggle = document.getElementById('mediaPermToggle');
        if (mediaPermToggle) {
            mediaPermToggle.addEventListener('change', (e) => {
                document.getElementById('mediaPermOff')?.classList.toggle('active', !e.target.checked);
                document.getElementById('mediaPermOn')?.classList.toggle('active', e.target.checked);
                CONFIG.TTS_ENABLED = e.target.checked;
            });
        }
    },

    // STATUS BAR
    updateStatus(message, type = 'info') {
        const text = document.getElementById('statusText');
        const icon = document.getElementById('statusIcon');
        const bar = document.getElementById('status');
        
        if (bar) bar.classList.remove('hidden');
        if (text) text.textContent = message;
        
        if (icon) {
            if (type === 'loading') {
                icon.innerHTML = '<i data-lucide="loader-2" class="spin"></i>';
            } else if (type === 'ready') {
                icon.innerHTML = '<i data-lucide="check-circle" style="color:var(--primary)"></i>';
            } else if (type === 'error') {
                icon.innerHTML = '<i data-lucide="alert-circle" style="color:var(--danger)"></i>';
            } else {
                icon.innerHTML = '<i data-lucide="info"></i>';
            }
            if(window.lucide) window.lucide.createIcons();
        }

        if (type === 'ready') {
            setTimeout(() => {
                if (bar) bar.classList.add('hidden');
            }, 2500);
        }
    }
};

// BOOTSTRAP
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
window.addEventListener('beforeunload', () => SignToSpeech.stopCamera());
