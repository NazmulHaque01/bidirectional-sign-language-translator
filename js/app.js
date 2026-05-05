// APP CONTROLLER — Layout toggle, settings, initialization

const App = {
    activePanel: 'both', // 'both', 'sign-to-speech', 'speech-to-sign'




    // INITIALIZATION
    async init() {
        Utils.log('App initializing...', 'info');
        
        // Setup UI listeners immediately so buttons work even while loading
        this.setupEventListeners();
        this.setupMobileToggle();
        
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

        // Info Icon Toggle (for Missing Avatar description)
        const infoIcon = document.querySelector('.info-icon');
        const infoTooltip = document.querySelector('.info-tooltip');
        if (infoIcon && infoTooltip) {
            infoIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                infoTooltip.classList.toggle('show');
            });
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
                
                // Highlight active label
                document.getElementById('cameraRatioLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('cameraRatioLabelRight')?.classList.toggle('active', e.target.checked);

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
                
                // Highlight active label
                document.getElementById('fallbackModeLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('fallbackModeLabelRight')?.classList.toggle('active', e.target.checked);
                
                Utils.log(`Fallback mode: ${CONFIG.MISSING_AVATAR_MODE}`, 'info');
            });
        }
        /* === END TOGGLE: MISSING AVATAR FALLBACK === */

        /* === TOGGLE: TEXT TO SPEECH === */
        const ttsToggle = document.getElementById('ttsToggle');
        if (ttsToggle) {
            ttsToggle.checked = CONFIG.TTS_ENABLED;
            ttsToggle.addEventListener('change', (e) => {
                CONFIG.TTS_ENABLED = e.target.checked;
                
                // Highlight active label
                document.getElementById('ttsLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('ttsLabelRight')?.classList.toggle('active', e.target.checked);
                
                Utils.log(`TTS enabled: ${CONFIG.TTS_ENABLED}`, 'info');
            });
        }
        /* === END TOGGLE: TEXT TO SPEECH === */

        /* === TOGGLE: TTS LANGUAGE === */
        const ttsLangToggle = document.getElementById('ttsLangToggle');
        if (ttsLangToggle) {
            ttsLangToggle.addEventListener('change', (e) => {
                CONFIG.TTS_LANGUAGE = e.target.checked ? 'en' : 'bn';
                
                // Highlight active label
                document.getElementById('ttsLangLabelLeft')?.classList.toggle('active', !e.target.checked);
                document.getElementById('ttsLangLabelRight')?.classList.toggle('active', e.target.checked);
                
                // Re-render sentence box to update word languages
                SignToSpeech.renderSentence();
                
                Utils.log(`TTS language: ${CONFIG.TTS_LANGUAGE}`, 'info');
            });
        }
        /* === END TOGGLE: TTS LANGUAGE === */
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
