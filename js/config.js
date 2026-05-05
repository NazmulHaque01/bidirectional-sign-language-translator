// CONFIG — Shared configuration for the Combined Translator


const CONFIG = {
    // Model paths (Sign → Speech)
    MODEL_PATH: './models/model_weights.json',
    SCALER_PATH: './data/scaler.json',
    LABELS_PATH: './data/class_labels.json',

    // Avatar path (Speech → Sign)
    AVATAR_DIR: './avatars/',

    // Hand Landmarker settings
    HAND_LANDMARKER: {
        numHands: 2,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
    },

    // Pose Landmarker settings
    POSE_LANDMARKER: {
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
    },

    // Inference settings
    INFERENCE: {
        minConfidence: 0.3,
        sustainedDuration: 1000,   // ms to hold a sign before adding to sentence
        sustainedConfidence: 0.86  // avg confidence threshold
    },

    // Feature extraction
    FEATURES: {
        landmarksPerHand: 21,
        coordsPerLandmark: 3,
        maxHands: 2,
        targetPoseIndices: [0, 2, 5, 7, 8, 11, 12, 13, 14],
        totalFeatures: 154  // 126 (Hands) + 27 (Pose) + 1 (has_pose flag)
    },

    // Primary person detection
    PRIMARY_PERSON: {
        wristProximityThreshold: 0.15  // max distance (normalized) between hand wrist and pose wrist
    },

    /* === TOGGLE: CAMERA ASPECT RATIO ===
     * Options: 'landscape' (640x480) or 'portrait' (480x640)
     * Change this value to switch the default camera mode.
     * The toggle button in the UI also controls this at runtime.
     */
    CAMERA_ASPECT_RATIO: 'landscape',

    /* === TOGGLE: MISSING AVATAR FALLBACK ===
     * Options: 'text' (show word in big font) or 'neutral' (show neutral pose image)
     * Change this value to switch the default fallback mode.
     * The toggle button in the UI also controls this at runtime.
     */
    MISSING_AVATAR_MODE: 'text',

    /* === TOGGLE: TEXT TO SPEECH ===
     * If true, detected words in the sentence box will be spoken out loud.
     */
    TTS_ENABLED: true
};
