// SPEECH TO SIGN MODULE — Voice/text input → Avatar display

// Word to image mapping using avatar files
const wordImageMap = {
    // Single words
    "অপেক্ষা করো": "অপেক্ষা করো_Wait.png",
    "অফিস": "অফিস_Office.png",
    "আইন": "আইন_Law.png",
    "আজ": "আজ_Today.png",
    "আট": "আট_Eight.png",
    "আমার": "আমার_My.png",
    "এখন": "এখন_Now.png",
    "এটি": "এটি_This.png",
    "ওটা": "ওটা(সেটা)_That.png",
    "সেটা": "ওটা(সেটা)_That.png",
    "ওয়াই-ফাই": "ওয়াই-ফাই_Wi-Fi.png",
    "কখন": "কখন_When.png",
    "কাঁধ": "কাঁধ_Shoulder.png",
    "কাজ": "কাজ_Work.png",
    "কাঠ": "কাঠ_Wood.png",
    "কে": "কে_Who.png",
    "ক্লান্ত": "ক্লান্ত_Tired.png",
    "খাওয়া": "খাওয়া_Eating.png",
    "খারাপ": "খারাপ_Bad.png",
    "গরু": "গরু_Cow.png",
    "গলা": "গলা_Neck.png",
    "গুণ": "গুণ_Multiplication.png",
    "ঘড়ি": "ঘড়ি_Clock.png",
    "ঘুমানো": "ঘুমানো_Sleeping.png",
    "চট্টগ্রাম": "চট্টগ্রাম_Chittagong.png",
    "চাচা": "চাচা(মামা)_Uncle.png",
    "মামা": "চাচা(মামা)_Uncle.png",
    "চার": "চার_Four.png",
    "চুপ করো": "চুপ করো_Shut up.png",
    "চোখ": "চোখ_Eye.png",
    "ছয়": "ছয়_Six.png",
    "ছোট": "ছোট_Small.png",
    "জুতো": "জুতো_Shoe.png",
    "জেল": "জেল_Prison.png",
    "জ্বর": "জ্বর_Fever.png",
    "টুপি": "টুপি_Cap.png",
    "ঠান্ডা": "ঠান্ডা_Cold.png",
    "ডাক্তার": "ডাক্তার_Doctor.png",
    "ডান": "ডান_Right.png",
    "ডিম": "ডিম_Egg.png",
    "তার": "তার_His.png",
    "তিন": "তিন_Three.png",
    "তুমি": "তুমি(আপনি)_You.png",
    "আপনি": "তুমি(আপনি)_You.png",
    "তোমার": "তোমার(আপনার)_Your.png",
    "আপনার": "তোমার(আপনার)_Your.png",
    "থামো": "থামো_Stop.png",
    "দাঁড়াও": "দাঁড়াও_Stand.png",
    "দাঁত মাজা": "দাঁত মাজা_Brush teeth.png",
    "দাঁত": "দাঁত_Teeth.png",
    "দুঃখিত": "দুঃখিত_Sorry.png",
    "দৃষ্টি": "দৃষ্টি_Sight.png",
    "নয়": "নয়_Nine.png",
    "নাক": "নাক_Nose.png"
};

// Word variations and synonyms
const wordVariations = {
    "অপেক্ষাকরো": "অপেক্ষা করো",
    "অপেক্ষা কর": "অপেক্ষা করো",
    "অপেক্ষাকর": "অপেক্ষা করো",
    "অপেক্ষা": "অপেক্ষা করো",
    "ওয়াইফাই": "ওয়াই-ফাই",
    "ওয়াই ফাই": "ওয়াই-ফাই",
    "wifi": "ওয়াই-ফাই",
    "সেইটা": "ওটা",
    "ওইটা": "ওটা",
    "এইটা": "এটি",
    "এইটি": "এটি",
    "এটা": "এটি",
    "আজকে": "আজ",
    "আজকের": "আজ",
    "এখনই": "এখন",
    "কবে": "কখন",
    "কারা": "কে",
    "খাচ্ছি": "খাওয়া",
    "খাচ্ছে": "খাওয়া",
    "খাবো": "খাওয়া",
    "খেয়ে": "খাওয়া",
    "খাই": "খাওয়া",
    "খেতে": "খাওয়া",
    "খেলাম": "খাওয়া",
    "ঘুমাবো": "ঘুমানো",
    "ঘুমাও": "ঘুমানো",
    "ঘুমাচ্ছে": "ঘুমানো",
    "ঘুমাচ্ছি": "ঘুমানো",
    "ঘুম": "ঘুমানো",
    "ঘুমিয়ে": "ঘুমানো",
    "ঘুমাতে": "ঘুমানো",
    "চুপকরো": "চুপ করো",
    "চুপ কর": "চুপ করো",
    "চুপ": "চুপ করো",
    "ছোটো": "ছোট",
    "জুতা": "জুতো",
    "শীত": "ঠান্ডা",
    "ঠাণ্ডা": "ঠান্ডা",
    "ডক্টর": "ডাক্তার",
    "চিকিৎসক": "ডাক্তার",
    "মামার": "মামা",
    "চাচার": "চাচা",
    "দাঁড়া": "দাঁড়াও",
    "দাঁড়ান": "দাঁড়াও",
    "দাঁতমাজা": "দাঁত মাজা",
    "মাফ": "দুঃখিত",
    "মাফ করবেন": "দুঃখিত",
    "সরি": "দুঃখিত",
    "sorry": "দুঃখিত",
    "থাম": "থামো",
    "থামুন": "থামো",
    "গাভী": "গরু",
    "তাঁর": "তার",
    "তাহার": "তার"
};

const SpeechToSign = {
    recognition: null,
    isListening: false,
    silenceTimeout: null,
    isAnimating: false,
    SILENCE_DURATION: 2000,
    neutralPose: 'NeutralPose.png',

    // INITIALIZATION
    async init() {
        Utils.log('[Speech→Sign] Initializing...', 'info');

        // Pre-load neutral pose image
        const neutralImg = new Image();
        neutralImg.src = CONFIG.AVATAR_DIR + this.neutralPose;

        // Warn if page is not served securely (Web Speech API needs HTTPS)
        if (window.location.protocol === 'file:' ||
            (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
            Utils.log('[Speech→Sign] WARNING: Voice input requires HTTPS. Run "python serve.py" to use voice.', 'warning');
        }

        // Browser check: Suggest Chrome for best speech support
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (!isChrome) {
            this.showError('Best experience in Google Chrome. Other browsers may have limited voice support.');
            Utils.log('[Speech→Sign] Non-Chrome browser detected. Voice recognition may be unstable.', 'info');
        }

        // Setup speech recognition
        this.setupSpeechRecognition();
        Utils.log('[Speech→Sign] Ready', 'success');
    },

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            const btn = document.getElementById('sptsVoiceBtn');
            if (btn) { btn.disabled = true; btn.textContent = '🎤 Not Supported'; }
            Utils.log('[Speech→Sign] Speech recognition not supported', 'warning');
            return;
        }

        this.recognition = new SpeechRecognition();

        // Edge backend (Azure) struggles with bn-BD, but accepts bn-IN more reliably.
        // Chrome/Google backend handles bn-BD perfectly.
        const isEdge = navigator.userAgent.indexOf("Edg") > -1;
        this.recognition.lang = isEdge ? 'bn-IN' : (navigator.language.startsWith('bn') ? navigator.language : 'bn-BD');

        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
            this.isListening = true;
            const btn = document.getElementById('sptsVoiceBtn');
            if (btn) { btn.classList.add('recording'); btn.textContent = '🎤 Listening...'; }
            const status = document.getElementById('sptsVoiceStatus');
            if (status) {
                status.className = 'voice-status listening';
                status.textContent = '🎙️ Listening... Speak now';
            }
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalTranscript += transcript + ' ';
                else interimTranscript += transcript;
            }

            if (finalTranscript) {
                const input = document.getElementById('sptsTextInput');
                if (input) {
                    const current = input.value;
                    input.value = current + (current.length > 0 ? ' ' : '') + finalTranscript.trim();
                }
                if (this.silenceTimeout) clearTimeout(this.silenceTimeout);
                this.silenceTimeout = setTimeout(() => {
                    if (this.isListening) {
                        this.recognition.stop();
                        const status = document.getElementById('sptsVoiceStatus');
                        if (status) status.textContent = '⏹️ Stopped (2s silence)';
                    }
                }, this.SILENCE_DURATION);
            }

            if (interimTranscript) {
                const status = document.getElementById('sptsVoiceStatus');
                if (status) status.textContent = `🎙️ "${interimTranscript}"`;
            }
        };

        this.recognition.onerror = (event) => {
            const status = document.getElementById('sptsVoiceStatus');
            if (status) {
                status.className = 'voice-status error';

                // Provide specific, actionable messages for known errors
                const errorMessages = {
                    'network': '❌ Network error',
                    'not-allowed': '❌ Microphone permission denied — Click the lock icon in the address bar to allow',
                    'no-speech': '🔇 No speech detected — Try again',
                    'audio-capture': '❌ No microphone found — Check your audio device',
                    'aborted': '⏹️ Voice input cancelled',
                    'service-not-allowed': '❌ Speech service blocked — Use Chrome or Edge browser'
                };

                status.textContent = errorMessages[event.error] || `❌ Error: ${event.error}`;


            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            const btn = document.getElementById('sptsVoiceBtn');
            if (btn) { btn.classList.remove('recording'); btn.textContent = '🎤 Voice Input'; }
            if (this.silenceTimeout) clearTimeout(this.silenceTimeout);
        };
    },

    // VOICE CONTROL
    toggleVoice() {
        if (!this.recognition) return;
        if (this.isListening) {
            this.recognition.stop();
            if (this.silenceTimeout) clearTimeout(this.silenceTimeout);
        } else {
            const input = document.getElementById('sptsTextInput');
            if (input) input.focus();
            this.recognition.start();
        }
    },


    // TEXT PROCESSING — Smart Bangla word matching

    normalizeText(text) {
        return text.normalize('NFKC');
    },

    removePunctuation(word) {
        return word.replace(/^[^\u0980-\u09FF0-9_a-zA-Z]+|[^\u0980-\u09FF0-9_a-zA-Z]+$/g, '');
    },

    splitIntoWords(text) {
        text = this.normalizeText(text);
        return text.split(/\s+/).map(w => this.removePunctuation(w)).filter(w => w.length > 0);
    },

    getBaseWord(word) {
        const normalized = this.normalizeText(word);

        // Check if word is a variation
        if (wordVariations[normalized]) {
            return wordVariations[normalized];
        }

        // Check exact match in map
        if (wordImageMap[normalized]) {
            return normalized;
        }

        // Check root and common suffixes
        const suffixes = ["তে", "ছি", "ছে", "ছিল", "বো", "বে", "গুলো", "গুলি", "দের", "কে", "তা", "টা", "টি", "র", "ের", "এ", "য়"];
        const sortedSuffixes = [...suffixes].sort((a, b) => b.length - a.length);

        for (const suffix of sortedSuffixes) {
            if (normalized.length > suffix.length && normalized.endsWith(suffix)) {
                const root = normalized.slice(0, -suffix.length);
                if (root.length < 2) continue;

                if (wordImageMap[root]) return root;
                if (wordVariations[root]) return wordVariations[root];
            }
        }

        return null;
    },

    getImagePath(word) {
        const baseWord = this.getBaseWord(word);
        if (baseWord && wordImageMap[baseWord]) {
            return wordImageMap[baseWord];
        }
        return null;
    },

    /**
     * Process text: handle multi-word phrases first, then individual words
     */
    processText(text) {
        const words = this.splitIntoWords(text);
        const result = [];
        let i = 0;

        while (i < words.length) {
            let matched = false;

            // Try longest phrase first (up to 3 words)
            for (let len = Math.min(3, words.length - i); len > 1; len--) {
                const phrase = words.slice(i, i + len).join(' ');
                const imagePath = this.getImagePath(phrase);
                if (imagePath) {
                    result.push({ word: phrase, avatar: imagePath });
                    i += len;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                const imagePath = this.getImagePath(words[i]);
                result.push({ word: words[i], avatar: imagePath }); // avatar may be null
                i++;
            }
        }

        return result;
    },

    // ANIMATION — Show avatars sequentially
    async translate() {
        const input = document.getElementById('sptsTextInput');
        if (!input || !input.value.trim()) {
            this.showError('Please enter Bengali text or use voice input');
            return;
        }

        const items = this.processText(input.value.trim());
        if (items.length === 0) {
            this.showError('No words found');
            return;
        }

        this.hideError();
        this.isAnimating = true;
        document.getElementById('sptsTranslateBtn').disabled = true;
        document.getElementById('sptsVoiceBtn').disabled = true;

        try {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const info = document.getElementById('sptsSignInfo');
                if (info) info.textContent = `${i + 1}/${items.length}: ${item.word}`;

                if (item.avatar) {
                    // Has avatar — show it
                    this.showAvatar(CONFIG.AVATAR_DIR + item.avatar, item.word);
                } else {
                    // No avatar — use fallback
                    this.showFallback(item.word);
                }

                await this.sleep(1000);
            }

            const info = document.getElementById('sptsSignInfo');
            if (info) info.textContent = '✓ Complete!';
            this.showAvatarPlaceholder();
        } catch (error) {
            this.showError(`Animation error: ${error.message}`);
        } finally {
            this.isAnimating = false;
            document.getElementById('sptsTranslateBtn').disabled = false;
            const voiceBtn = document.getElementById('sptsVoiceBtn');
            if (voiceBtn) voiceBtn.disabled = !this.recognition;
        }
    },

    showAvatar(src, label) {
        const display = document.getElementById('sptsSignImage');
        if (!display) return;
        display.innerHTML = '';
        const img = new Image();
        img.className = 'avatar-img';
        img.alt = label;
        img.onload = () => { display.innerHTML = ''; display.appendChild(img); };
        img.onerror = () => { this.showFallback(label); };
        img.src = src;
    },

    /* === TOGGLE: MISSING AVATAR FALLBACK === */
    showFallback(word) {
        const display = document.getElementById('sptsSignImage');
        if (!display) return;
        display.innerHTML = '';

        if (CONFIG.MISSING_AVATAR_MODE === 'text') {
            // Mode A: Show word in big font
            const div = document.createElement('div');
            div.className = 'fallback-text';
            div.textContent = word;
            display.appendChild(div);
        } else {
            // Mode B: Show neutral pose
            const img = new Image();
            img.className = 'avatar-img';
            img.alt = word;
            img.src = CONFIG.AVATAR_DIR + this.neutralPose;
            const label = document.createElement('div');
            label.className = 'fallback-label';
            label.textContent = word;
            display.appendChild(img);
            display.appendChild(label);
        }
    },
    /* === END TOGGLE: MISSING AVATAR FALLBACK === */

    showAvatarPlaceholder() {
        const display = document.getElementById('sptsSignImage');
        if (display) display.innerHTML = '<p class="avatar-placeholder">Sign gestures will appear here</p>';
    },

    // HELPERS
    clearInput() {
        const input = document.getElementById('sptsTextInput');
        if (input) input.value = '';
        this.showAvatarPlaceholder();
        const info = document.getElementById('sptsSignInfo');
        if (info) info.textContent = 'Ready';
        const status = document.getElementById('sptsVoiceStatus');
        if (status) { status.textContent = ''; status.className = 'voice-status'; }
        this.hideError();
    },

    showError(msg) {
        const el = document.getElementById('sptsError');
        if (el) { el.textContent = msg; el.classList.add('show'); }
    },

    hideError() {
        const el = document.getElementById('sptsError');
        if (el) { el.textContent = ''; el.classList.remove('show'); }
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
