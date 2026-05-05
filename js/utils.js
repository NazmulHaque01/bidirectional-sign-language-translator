// UTILS — Shared utility functions


class Utils {
    /**
     * Extract and normalize keypoints (V3 — Hands + Upper Body Pose)
     * Sorts hands by handedness [Left, Right], uses smart reference + scale.
     */
    static extractKeypoints(handLandmarks, poseLandmarksArray, handednessArray) {
        if (!handLandmarks || handLandmarks.length === 0) return null;

        // ========== Sort hands by handedness [Left, Right] ==========
        let leftHandLandmarks = null;
        let rightHandLandmarks = null;

        if (handednessArray && handednessArray.length > 0) {
            for (let idx = 0; idx < handednessArray.length; idx++) {
                const category = handednessArray[idx][0].categoryName;
                if (category === 'Left' && leftHandLandmarks === null) {
                    leftHandLandmarks = handLandmarks[idx];
                } else if (category === 'Right' && rightHandLandmarks === null) {
                    rightHandLandmarks = handLandmarks[idx];
                }
            }
        } else {
            if (handLandmarks.length >= 1) leftHandLandmarks = handLandmarks[0];
            if (handLandmarks.length >= 2) rightHandLandmarks = handLandmarks[1];
        }

        // Build hand features [Left=63, Right=63]
        let handKps = [];
        if (leftHandLandmarks) {
            for (const lm of leftHandLandmarks) handKps.push(lm.x, lm.y, lm.z);
        } else {
            for (let i = 0; i < 63; i++) handKps.push(0.0);
        }
        if (rightHandLandmarks) {
            for (const lm of rightHandLandmarks) handKps.push(lm.x, lm.y, lm.z);
        } else {
            for (let i = 0; i < 63; i++) handKps.push(0.0);
        }

        // ========== Process pose ==========
        let poseDetected = false;
        let poseKps = [];
        let noseCoords = null;
        let shoulderDistance = null;

        if (poseLandmarksArray && poseLandmarksArray.length > 0) {
            const poseLandmarks = poseLandmarksArray[0];
            noseCoords = [poseLandmarks[0].x, poseLandmarks[0].y, poseLandmarks[0].z];
            const lSh = [poseLandmarks[11].x, poseLandmarks[11].y, poseLandmarks[11].z];
            const rSh = [poseLandmarks[12].x, poseLandmarks[12].y, poseLandmarks[12].z];
            shoulderDistance = Math.sqrt(
                Math.pow(lSh[0] - rSh[0], 2) + Math.pow(lSh[1] - rSh[1], 2) + Math.pow(lSh[2] - rSh[2], 2)
            );
            if (shoulderDistance < 1e-6) {
                shoulderDistance = null;
                noseCoords = null;
            } else {
                poseDetected = true;
                for (const idx of CONFIG.FEATURES.targetPoseIndices) {
                    const lm = poseLandmarks[idx];
                    poseKps.push(lm.x, lm.y, lm.z);
                }
            }
        }
        if (!poseDetected) {
            poseKps = [];
            for (let i = 0; i < 27; i++) poseKps.push(0.0);
        }

        // ========== Reference point and scale ==========
        let referencePoint, scale;
        if (poseDetected) {
            referencePoint = noseCoords;
            scale = shoulderDistance;
        } else {
            const firstHand = leftHandLandmarks || rightHandLandmarks;
            const wrist = [firstHand[0].x, firstHand[0].y, firstHand[0].z];
            const mcp = [firstHand[9].x, firstHand[9].y, firstHand[9].z];
            const handSize = Math.sqrt(
                Math.pow(mcp[0] - wrist[0], 2) + Math.pow(mcp[1] - wrist[1], 2) + Math.pow(mcp[2] - wrist[2], 2)
            );
            if (handSize < 1e-6) return null;
            referencePoint = wrist;
            scale = handSize;
        }

        // ========== Combine, center, scale ==========
        let combined = handKps.concat(poseKps);
        for (let i = 0; i < combined.length; i += 3) {
            if (combined[i] !== 0 || combined[i + 1] !== 0 || combined[i + 2] !== 0) {
                combined[i] = (combined[i] - referencePoint[0]) / scale;
                combined[i + 1] = (combined[i + 1] - referencePoint[1]) / scale;
                combined[i + 2] = (combined[i + 2] - referencePoint[2]) / scale;
            }
        }
        combined.push(poseDetected ? 1.0 : 0.0);
        return combined.slice(0, CONFIG.FEATURES.totalFeatures);
    }

    /**
     * Normalize keypoints using StandardScaler parameters
     */
    static normalizeKeypoints(keypoints, scaler) {
        if (!keypoints || !scaler) return null;
        const normalized = new Float32Array(keypoints.length);
        for (let i = 0; i < keypoints.length; i++) {
            const mean = scaler.mean[i];
            const sc = scaler.scale[i] || Math.sqrt(scaler.var[i] + 1e-7);
            normalized[i] = (keypoints[i] - mean) / sc;
        }
        return normalized;
    }

    /**
     * Filter hands to keep only primary person's hands.
     * Uses pose wrist proximity to discard hands from bystanders.
     */
    static filterPrimaryPersonHands(handResults, poseResults) {
        if (!handResults.landmarks || handResults.landmarks.length === 0) return handResults;
        if (!poseResults || !poseResults.landmarks || poseResults.landmarks.length === 0) return handResults;

        const pose = poseResults.landmarks[0];
        const poseLeftWrist = pose[15];
        const poseRightWrist = pose[16];
        const threshold = CONFIG.PRIMARY_PERSON.wristProximityThreshold;

        const filteredLandmarks = [];
        const filteredHandednesses = [];

        for (let i = 0; i < handResults.landmarks.length; i++) {
            const handWrist = handResults.landmarks[i][0];
            const distL = Math.sqrt(Math.pow(handWrist.x - poseLeftWrist.x, 2) + Math.pow(handWrist.y - poseLeftWrist.y, 2));
            const distR = Math.sqrt(Math.pow(handWrist.x - poseRightWrist.x, 2) + Math.pow(handWrist.y - poseRightWrist.y, 2));
            if (Math.min(distL, distR) < threshold) {
                filteredLandmarks.push(handResults.landmarks[i]);
                if (handResults.handednesses) filteredHandednesses.push(handResults.handednesses[i]);
            }
        }

        return { landmarks: filteredLandmarks, handednesses: filteredHandednesses };
    }

    /** Get top N predictions from output array */
    static getTopPredictions(predictions, labels, n = 3) {
        const indexed = Array.from(predictions).map((val, idx) => ({
            index: idx, label: labels[idx.toString()] || 'Unknown', confidence: val
        }));
        return indexed.sort((a, b) => b.confidence - a.confidence).slice(0, n);
    }

    /** Format confidence as percentage */
    static formatConfidence(conf) { return (conf * 100).toFixed(1) + '%'; }

    /** Console log with emoji prefix */
    static log(message, type = 'info') {
        const prefix = { 'info': '📘', 'success': '✅', 'error': '❌', 'warning': '⚠️' }[type] || '📌';
        console.log(`${prefix} ${message}`);
    }
}
