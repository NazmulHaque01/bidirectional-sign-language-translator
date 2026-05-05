// APP CONTROLLER — Layout toggle, settings, initialization

const App = {
    activePanel: 'both', // 'both', 'sign-to-speech', 'speech-to-sign'




    // INITIALIZATION
    async init() {
        Utils.log('App initializing...', 'info');
        this.updateStatus('Loading...', 'loading');

        try {
            // Wait for MediaPipe
            await this.waitForMediaPipe();
            Utils.log('MediaPipe loaded', 'success');

            // Initialize both modules in parallel — both preloaded
            await Promise.all([
                SignToSpeech.init(),
                SpeechToSign.init()
            ]);

            this.setupEventListeners();
            this.setupMobileToggle();
            this.updateStatus('Ready! Both translators loaded.', 'ready');
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
                const label = document.getElementById('cameraRatioLabel');
                if (label) label.textContent = CONFIG.CAMERA_ASPECT_RATIO === 'portrait' ? 'Portrait' : 'Landscape';

                // Update video container aspect ratio via CSS class
                const container = document.getElementById('stsVideoContainer');
                if (container) {
                    container.classList.toggle('portrait', CONFIG.CAMERA_ASPECT_RATIO === 'portrait');
                }

                // If camera is running, restart to apply new ratio
                if (SignToSpeech.isRunning) {
                    SignToSpeech.stopCamera();
                    setTimeout(() => SignToSpeech.startCamera(), 300);
                }
                Utils.log(`Camera ratio: ${CONFIG.CAMERA_ASPECT_RATIO}`, 'info');
            });
        }
        /* === END TOGGLE: CAMERA ASPECT RATIO === */

        /* === TOGGLE: MISSING AVATAR FALLBACK === */
        const fallbackToggle = document.getElementById('fallbackModeToggle');
        if (fallbackToggle) {
            fallbackToggle.addEventListener('change', (e) => {
                CONFIG.MISSING_AVATAR_MODE = e.target.checked ? 'neutral' : 'text';
                const label = document.getElementById('fallbackModeLabel');
                if (label) label.textContent = CONFIG.MISSING_AVATAR_MODE === 'text' ? 'Show Text' : 'Neutral Pose';
                Utils.log(`Fallback mode: ${CONFIG.MISSING_AVATAR_MODE}`, 'info');
            });
        }
        /* === END TOGGLE: MISSING AVATAR FALLBACK === */
    },



    // MOBILE PANEL TOGGLE

    setupMobileToggle() {
        const tabs = document.querySelectorAll('.mobile-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.panel;
                this.switchPanel(target);
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Touch swipe detection on mobile
        const panelContainer = document.getElementById('panelContainer');
        if (panelContainer) {
            let touchStartX = 0;
            panelContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            panelContainer.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 60) { // Min swipe distance
                    if (diff > 0) {
                        // Swiped left → show Speech→Sign
                        this.switchPanel('speech-to-sign');
                        document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
                        document.querySelector('[data-panel="speech-to-sign"]')?.classList.add('active');
                    } else {
                        // Swiped right → show Sign→Speech
                        this.switchPanel('sign-to-speech');
                        document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
                        document.querySelector('[data-panel="sign-to-speech"]')?.classList.add('active');
                    }
                }
            }, { passive: true });
        }
    },

    switchPanel(panel) {
        const container = document.getElementById('panelContainer');
        if (!container) return;

        if (panel === 'sign-to-speech') {
            container.style.transform = 'translateX(0)';
        } else if (panel === 'speech-to-sign') {
            container.style.transform = 'translateX(-50%)';
        }
        this.activePanel = panel;
    },


    // STATUS BAR

    updateStatus(message, type = 'info') {
        const text = document.getElementById('statusText');
        const icon = document.getElementById('statusIcon');
        const bar = document.getElementById('status');
        if (text) text.textContent = message;
        if (bar) { bar.className = 'status'; bar.classList.add(type); }
        const icons = { 'loading': '⏳', 'ready': '✅', 'error': '❌', 'info': 'ℹ️' };
        if (icon) icon.textContent = icons[type] || '🔔';
    }
};


// BOOTSTRAP

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
window.addEventListener('beforeunload', () => SignToSpeech.stopCamera());
