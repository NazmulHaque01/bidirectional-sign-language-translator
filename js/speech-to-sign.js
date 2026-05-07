// SPEECH TO SIGN MODULE — Voice/text input → Avatar display

const wordImageMap = {
    "তোমার(আপনার)": "তোমার(আপনার)_Your.webp",
    "কখন": "কখন_When.webp",
    "আজ": "আজ_Today.webp",
    "ছয়": "ছয়_Six.webp",
    "টুপি": "টুপি_Cap.webp",
    "ডান": "ডান_Right.webp",
    "চুপ করো": "চুপ করো_Shut up.webp",
    "তার": "তার_His.webp",
    "কাঠ": "কাঠ_Wood.webp",
    "আইন": "আইন_Law.webp",
    "নয়": "নয়_Nine.webp",
    "কাঁধ": "কাঁধ_Shoulder.webp",
    "জুতো": "জুতো_Shoe.webp",
    "ঘুমানো": "ঘুমানো_Sleeping.webp",
    "ওটা(সেটা)": "ওটা(সেটা)_That.webp",
    "গরু": "গরু_Cow.webp",
    "দাঁড়াও": "দাঁড়াও_Stand.webp",
    "আমার": "আমার_My.webp",
    "ডাক্তার": "ডাক্তার_Doctor.webp",
    "তিন": "তিন_Three.webp",
    "আট": "আট_Eight.webp",
    "চাচা(মামা)": "চাচা(মামা)_Uncle.webp",
    "অপেক্ষা করো": "অপেক্ষা করো_Wait.webp",
    "খারাপ": "খারাপ_Bad.webp",
    "চট্টগ্রাম": "চট্টগ্রাম_Chittagong.webp",
    "থামো": "থামো_Stop.webp",
    "দুঃখিত": "দুঃখিত_Sorry.webp",
    "কে": "কে_Who.webp",
    "জ্বর": "জ্বর_Fever.webp",
    "ডিম": "ডিম_Egg.webp",
    "দাঁড়াও_Stand": "দাঁড়াও_Stand.webp",
    "নাক": "নাক_Nose.webp",
    "গুণ": "গুণ_Multiplication.webp",
    "ক্লান্ত": "ক্লান্ত_Tired.webp",
    "জেল": "জেল_Prison.webp",
    "ওয়াই-ফাই": "ওয়াই-ফাই_Wi-Fi.webp",
    "গলা": "গলা_Neck.webp",
    "অফিস": "অফিস_Office.webp",
    "ঘড়ি": "ঘড়ি_Clock.webp",
    "এখন": "এখন_Now.webp",
    "ছোট": "ছোট_Small.webp",
    "খাওয়া": "খাওয়া_Eating.webp",
    "কাজ": "কাজ_Work.webp",
    "চোখ": "চোখ_Eye.webp",
    "ঠান্ডা": "ঠান্ডা_Cold.webp",
    "দৃষ্টি": "দৃষ্টি_Sight.webp",
    "দাঁত":"দাঁত_Teeth.webp",
    "দাঁত মাজা": "দাঁত মাজা_Brush teeth.webp",
    "চার": "চার_Four.webp",
    "তুমি(আপনি)": "তুমি(আপনি)_You.webp",
    "এটি": "এটি_This.webp",
    "ওটা": "ওটা(সেটা)_That.webp",
    "চাচা": "চাচা(মামা)_Uncle.webp",
    "তুমি": "তুমি(আপনি)_You.webp",
    "তোমার": "তোমার(আপনার)_Your.webp"
};
const wordVariations = {
    "অপেক্ষা করছি": "অপেক্ষা করো",
    "অপেক্ষা করুন": "অপেক্ষা করো",
    "অপেক্ষা করবে": "অপেক্ষা করো",
    "অফিসে": "অফিস",
    "অফিসের": "অফিস",
    "অফিসগুলো": "অফিস",
    "আইনে": "আইন",
    "আইনের": "আইন",
    "আইনগত": "আইন",
    "আঙুলে": "আঙুল",
    "আঙুলের": "আঙুল",
    "আঙুলগুলো": "আঙুল",
    "আজকে": "আজ",
    "আজকের": "আজ",
    "আটে": "আট",
    "আটের": "আট",
    "আদার": "আদা",
    "আদায়": "আদা",
    "আমারে": "আমার",
    "আমারগুলো": "আমার",
    "আমাকে": "আমি",
    "আমায়": "আমি",
    "আয়নায়": "আয়না",
    "আয়নার": "আয়না",
    "আয়নাগুলো": "আয়না",
    "ইনস্টাগ্রামে": "ইনস্টাগ্রাম",
    "ইনস্টাগ্রামের": "ইনস্টাগ্রাম",
    "একে": "এক",
    "একের": "এক",
    "এখনই": "এখন",
    "এখনকার": "এখন",
    "এটিকে": "এটি",
    "এটির": "এটি",
    "ওটাকে": "ওটা",
    "ওটার": "ওটা",
    "সেটাকে": "ওটা",
    "সেটার": "ওটা",
    "ওয়াই-ফাইতে": "ওয়াই-ফাই",
    "ওয়াই-ফাইয়ের": "ওয়াই-ফাই",
    "কখনকার": "কখন",
    "কখনোই": "কখন",
    "কর্মচারীরা": "কর্মচারী",
    "কর্মচারীদের": "কর্মচারী",
    "কর্মচারীকে": "কর্মচারী",
    "কাঁধে": "কাঁধ",
    "কাঁধের": "কাঁধ",
    "কাঁধগুলো": "কাঁধ",
    "কাজে": "কাজ",
    "কাজের": "কাজ",
    "কাজগুলো": "কাজ",
    "কাঠে": "কাঠ",
    "কাঠের": "কাঠ",
    "কাঠগুলো": "কাঠ",
    "কানে": "কান",
    "কানের": "কান",
    "কানগুলো": "কান",
    "কীসের": "কী",
    "কাকে": "কে",
    "কার": "কে",
    "কাদের": "কে",
    "ক্লান্তিতে": "ক্লান্ত",
    "ক্লান্তির": "ক্লান্ত",
    "ক্লান্তকে": "ক্লান্ত",
    "ক্ষুধার্তকে": "ক্ষুধার্ত",
    "ক্ষুধার্তদের": "ক্ষুধার্ত",
    "খাচ্ছি": "খাওয়া",
    "খাবো": "খাওয়া",
    "খেয়েছে": "খাওয়া",
    "খান": "খাওয়া",
    "খারাপকে": "খারাপ",
    "খারাপের": "খারাপ",
    "খারাপভাবে": "খারাপ",
    "গণিতে": "গণিত",
    "গণিতের": "গণিত",
    "গরুকে": "গরু",
    "গরুর": "গরু",
    "গরুগুলো": "গরু",
    "গরুটি": "গরু",
    "গলায়": "গলা",
    "গলার": "গলা",
    "গলাগুলো": "গলা",
    "গাধার": "গাধা",
    "গাধাকে": "গাধা",
    "গাধাগুলো": "গাধা",
    "গুণের": "গুণ",
    "গুণে": "গুণ",
    "গুণফল": "গুণ",
    "ঘুমাচ্ছে": "ঘুমানো",
    "ঘুমাবো": "ঘুমানো",
    "ঘুমিয়েছে": "ঘুমানো",
    "ঘুমাচ্ছি": "ঘুমানো",
    "ঘোড়ার": "ঘোড়া",
    "ঘোড়াকে": "ঘোড়া",
    "ঘোড়াগুলো": "ঘোড়া",
    "চোখে": "চোখ",
    "চোখের": "চোখ",
    "চোখগুলো": "চোখ",
    "ছাগলকে": "ছাগল",
    "ছাগলের": "ছাগল",
    "ছাগলগুলো": "ছাগল",
    "ছোটর": "ছোট",
    "ছোটকে": "ছোট",
    "ছোটটি": "ছোট",
    "চুলে": "চুল",
    "চুলের": "চুল",
    "চুলগুলো": "চুল",
    "জিহ্বায়": "জিহ্বা",
    "জিহ্বার": "জিহ্বা",
    "জেলের": "জেল",
    "জেলে": "জেল",
    "জেলখানা": "জেল",
    "টয়লেটে": "টয়লেট",
    "টয়লেটের": "টয়লেট",
    "ঠান্ডায়": "ঠান্ডা",
    "ঠান্ডার": "ঠান্ডা",
    "ঠান্ডাকে": "ঠান্ডা",
    "ডাক্তারকে": "ডাক্তার",
    "ডাক্তারের": "ডাক্তার",
    "ডাক্তাররা": "ডাক্তার",
    "ডানে": "ডান",
    "ডানের": "ডান",
    "দাঁড়াচ্ছে": "দাঁড়াও",
    "দাঁড়াবো": "দাঁড়াও",
    "দাঁড়িয়েছে": "দাঁড়াও",
    "দাঁড়ান": "দাঁড়াও",
    "দাঁতে": "দাঁত",
    "দাঁতের": "দাঁত",
    "দাঁতগুলো": "দাঁত",
    "দাঁত মাজছে": "দাঁত মাজা",
    "দাঁত মাজবো": "দাঁত মাজা",
    "দাঁত মেজেছে": "দাঁত মাজা",
    "দাঁত মাজছি": "দাঁত মাজা",
    "দুঃখিতের": "দুঃখিত",
    "দুঃখিতরা": "দুঃখিত",
    "দুঃখিতভাবে": "দুঃখিত",
    "দেশের": "দেশ",
    "দেশে": "দেশ",
    "দেশগুলো": "দেশ",
    "ধর্মে": "ধর্ম",
    "ধর্মের": "ধর্ম",
    "ধর্মীয়": "ধর্ম",
    "নারীর": "নারী",
    "নারীকে": "নারী",
    "নারীরা": "নারী",
    "নাচের": "নাচ",
    "নাচে": "নাচ",
    "নাচগুলো": "নাচ",
    "নাচছে": "নাচ",
    "নাটকের": "নাটক",
    "নাটকে": "নাটক",
    "নাটকগুলো": "নাটক",
    "নাটকটি": "নাটক",
    "নাকে": "নাক",
    "নাকের": "নাক",
    "নাকগুলো": "নাক",
    "নিচের": "নিচে",
    "নিচেতে": "নিচে",
    "নির্বাচনে": "নির্বাচন",
    "নির্বাচনের": "নির্বাচন",
    "নির্বাচনী": "নির্বাচন",
    "নেতার": "নেতা",
    "নেতাকে": "নেতা",
    "নেতারা": "নেতা",
    "নেতৃত্ব": "নেতা",
    "নয়ে": "নয়",
    "নয়ের": "নয়",
    "পরিবারে": "পরিবার",
    "পরিবারের": "পরিবার",
    "পরিবারগুলো": "পরিবার",
    "অপেক্ষাকরো": "অপেক্ষা করো",
    "অপেক্ষা কর": "অপেক্ষা করো",
    "অপেক্ষাকর": "অপেক্ষা করো",
    "অপেক্ষা": "অপেক্ষা করো",
    "অপেক্ষায়": "অপেক্ষা করো",
    "দাঁড়ান একটু": "অপেক্ষা করো",
    "একটু দাঁড়াও": "অপেক্ষা করো",
    "দফতর": "অফিস",
    "দপ্তরে": "অফিস",
    "কর্মস্থল": "অফিস",
    "অফিসটা": "অফিস",
    "আইনকানুন": "আইন",
    "আইনগুলো": "আইন",
    "নিয়মকানুন": "আইন",
    "নিয়ম": "আইন",
    "আটটা": "আট",
    "আটটি": "আট",
    "মোর": "আমার",
    "আমারটা": "আমার",
    "আমাদিগের": "আমার",
    "বর্তমানে": "এখন",
    "এক্ষুনি": "এখন",
    "এইমাত্র": "এখন",
    "এইটা": "এটি",
    "এইটি": "এটি",
    "এটা": "এটি",
    "ইহা": "এটি",
    "সেইটা": "ওটা",
    "ওইটা": "ওটা",
    "সেটি": "ওটা",
    "সেটা": "ওটা",
    "উহা": "ওটা",
    "ঐটা": "ওটা",
    "ওয়াইফাই": "ওয়াই-ফাই",
    "ওয়াই ফাই": "ওয়াই-ফাই",
    "wifi": "ওয়াই-ফাই",
    "ইন্টারনেট": "ওয়াই-ফাই",
    "নেট": "ওয়াই-ফাই",
    "কবে": "কখন",
    "কখনও": "কখন",
    "কোন্ সময়": "কখন",
    "কখনো": "কখন",
    "কাঁধটা": "কাঁধ",
    "স্কন্ধ": "কাঁধ",
    "কাজটা": "কাজ",
    "কাজকর্ম": "কাজ",
    "ডিউটি": "কাজ",
    "কর্ম": "কাজ",
    "কাষ্ঠ": "কাঠ",
    "কেটা": "কে",
    "কারা": "কে",
    "কাহারা": "কে",
    "ক্লান্তি": "ক্লান্ত",
    "টায়ার্ড": "ক্লান্ত",
    "অবসন্ন": "ক্লান্ত",
    "শ্রান্ত": "ক্লান্ত",
    "খাচ্ছে": "খাওয়া",
    "খেয়ে": "খাওয়া",
    "খাই": "খাওয়া",
    "খেতে": "খাওয়া",
    "খেলাম": "খাওয়া",
    "খাবার": "খাওয়া",
    "খাব": "খাওয়া",
    "খাইছি": "খাওয়া",
    "খাইছে": "খাওয়া",
    "খারাপটা": "খারাপ",
    "বাজে": "খারাপ",
    "মন্দ": "খারাপ",
    "অশুভ": "খারাপ",
    "গরুটা": "গরু",
    "গাভী": "গরু",
    "গো": "গরু",
    "গলাটা": "গলা",
    "ঘাড়": "গলা",
    "গুন": "গুণ",
    "ঘড়িটা": "ঘড়ি",
    "ঘড়িতে": "ঘড়ি",
    "ঘুমাও": "ঘুমানো",
    "ঘুম": "ঘুমানো",
    "ঘুমিয়ে": "ঘুমানো",
    "ঘুমাতে": "ঘুমানো",
    "ঘুমাল": "ঘুমানো",
    "ঘুমাই": "ঘুমানো",
    "ঘুমাইছে": "ঘুমানো",
    "চাটগাঁ": "চট্টগ্রাম",
    "চিটাগং": "চট্টগ্রাম",
    "চাটগাঁইয়া": "চট্টগ্রাম",
    "চট্রগ্রাম": "চট্টগ্রাম",
    "কাকা": "চাচা",
    "মামা": "চাচা",
    "খালু": "চাচা",
    "ফুফা": "চাচা",
    "চাচার": "চাচা",
    "মামার": "চাচা",
    "কাকু": "চাচা",
    "চারটা": "চার",
    "চারটি": "চার",
    "৪": "চার",
    "চুপকরো": "চুপ করো",
    "চুপ কর": "চুপ করো",
    "চুপ": "চুপ করো",
    "চুপচাপ": "চুপ করো",
    "চুপটি": "চুপ করো",
    "চুপ থাক": "চুপ করো",
    "চুপ থাকুন": "চুপ করো",
    "নয়ন": "চোখ",
    "আঁখি": "চোখ",
    "ছয়টা": "ছয়",
    "ছয়টি": "ছয়",
    "৬": "ছয়",
    "ছোটো": "ছোট",
    "ক্ষুদ্র": "ছোট",
    "ছোট্ট": "ছোট",
    "জুতা": "জুতো",
    "জুতোগুলো": "জুতো",
    "জুতাগুলো": "জুতো",
    "কারাগার": "জেল",
    "কয়েদখানা": "জেল",
    "জ্বরটা": "জ্বর",
    "অসুখ": "জ্বর",
    "টুপিটা": "টুপি",
    "হ্যাট": "টুপি",
    "টুপিতে": "টুপি",
    "শীত": "ঠান্ডা",
    "ঠাণ্ডা": "ঠান্ডা",
    "শীতল": "ঠান্ডা",
    "সর্দি": "ঠান্ডা",
    "ডক্টর": "ডাক্তার",
    "চিকিৎসক": "ডাক্তার",
    "ডাক্তারবাবু": "ডাক্তার",
    "ডানদিকে": "ডান",
    "ডাইনে": "ডান",
    "ডানদিক": "ডান",
    "ডিমটা": "ডিম",
    "ডিমগুলো": "ডিম",
    "অণ্ড": "ডিম",
    "তাঁর": "তার",
    "তাহার": "তার",
    "তারটা": "তার",
    "তাঁহার": "তার",
    "তিনটি": "তিন",
    "তিনটা": "তিন",
    "৩": "তিন",
    "আপনি": "তুমি",
    "তোমাকে": "তুমি",
    "তোমায়": "তুমি",
    "আপনাকে": "তুমি",
    "তুই": "তুমি",
    "তোরা": "তুমি",
    "তোমারা": "তুমি",
    "তোদের": "তোমার",
    "আপনারা": "তুমি",
    "আপনার": "তোমার",
    "তোর": "তোমার",
    "তোমাদের": "তোমার",
    "আপনাদের": "তোমার",
    "থামুন": "থামো",
    "থাম": "থামো",
    "থেমে": "থামো",
    "থামানো": "থামো",
    "দাঁড়া": "দাঁড়াও",
    "দাঁড়িয়ে": "দাঁড়াও",
    "দাঁড়ানোর": "দাঁড়াও",
    "উঠে দাঁড়াও": "দাঁড়াও",
    "দাঁতমাজা": "দাঁত মাজা",
    "ব্রাশ": "দাঁত মাজা",
    "দাঁত ব্রাশ": "দাঁত মাজা",
    "মাফ": "দুঃখিত",
    "মাফ করবেন": "দুঃখিত",
    "সরি": "দুঃখিত",
    "sorry": "দুঃখিত",
    "ক্ষমা": "দুঃখিত",
    "দৃষ্টিশক্তি": "দৃষ্টি",
    "নয়টি": "নয়",
    "নয়টা": "নয়",
    "৯": "নয়",
    "নাকটা": "নাক"
};



const SpeechToSign = {
    recognition: null,
    isListening: false,
    silenceTimeout: null,
    isAnimating: false,
    SILENCE_DURATION: 2000,
    AVATAR_DISPLAY_TIME: 1000, // Minimum time (in ms) to show each avatar AFTER it loads
    neutralPose: 'NeutralPose.webp',

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

        // Show default neutral pose
        this.showAvatarPlaceholder();

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

            // Capture the existing text in the input box when the session starts
            const input = document.getElementById('sptsTextInput');
            this.baseText = input ? input.value.trim() : '';

            const btn = document.getElementById('sptsVoiceBtn');
            if (btn) { btn.classList.add('recording'); btn.textContent = '🎤 Listening...'; }
            const status = document.getElementById('sptsVoiceStatus');
            if (status) {
                status.className = 'voice-status listening';
                status.textContent = '🎙️ Listening... Speak now';
            }
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let sessionFinals = [];

            // 1. Collect all finals and interims from the event
            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript.trim();
                if (event.results[i].isFinal) {
                    sessionFinals.push(transcript);
                } else {
                    interimTranscript += transcript + ' ';
                }
            }

            // 2. Reconstruct the clean session text
            let reconstructedSessionText = '';
            for (let chunk of sessionFinals) {
                // If the new chunk starts with our accumulated text, it's the Android cumulative bug.
                // Or if it's identical, it's Android repeating the same final.
                if (reconstructedSessionText && chunk.toLowerCase().startsWith(reconstructedSessionText.toLowerCase())) {
                    reconstructedSessionText = chunk;
                } else {
                    reconstructedSessionText = (reconstructedSessionText + ' ' + chunk).trim();
                }
            }

            // 3. Instead of appending, we completely overwrite the input with baseText + new session text
            const input = document.getElementById('sptsTextInput');
            if (input) {
                const finalStr = (this.baseText + (this.baseText && reconstructedSessionText ? ' ' : '') + reconstructedSessionText).trim();
                input.value = finalStr;
            }

            // 4. Reset silence timeout
            if (this.silenceTimeout) clearTimeout(this.silenceTimeout);
            this.silenceTimeout = setTimeout(() => {
                if (this.isListening) {
                    this.isListening = false;

                    // Force UI update directly here for mobile
                    const status = document.getElementById('sptsVoiceStatus');
                    if (status) status.textContent = '⏹️ Stopped (2s silence)';
                    const btn = document.getElementById('sptsVoiceBtn');
                    if (btn) { btn.classList.remove('recording'); btn.textContent = '🎤 Voice Input'; }

                    try { this.recognition.stop(); } catch (e) { }
                }
            }, 2000); // 2 second silence timeout

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
                    'network': '❌ Network error, Use Chrome Browser, it should fix this',
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
                    // Has avatar — wait for it to load and show it
                    await this.showAvatar(CONFIG.AVATAR_DIR + item.avatar, item.word);
                } else {
                    // No avatar — use fallback
                    await this.showFallback(item.word);
                }

                // Wait minimum display time AFTER the image has fully loaded
                await this.sleep(this.AVATAR_DISPLAY_TIME);
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
        return new Promise((resolve) => {
            const display = document.getElementById('sptsSignImage');
            if (!display) {
                resolve();
                return;
            }

            const img = new Image();
            img.className = 'avatar-img';
            img.alt = label;
            img.onload = () => {
                display.innerHTML = '';
                display.appendChild(img);
                resolve();
            };
            img.onerror = () => {
                this.showFallback(label).then(resolve);
            };
            img.src = src;
        });
    },

    /* === TOGGLE: MISSING AVATAR FALLBACK === */
    showFallback(word) {
        return new Promise((resolve) => {
            const display = document.getElementById('sptsSignImage');
            if (!display) {
                resolve();
                return;
            }
            display.innerHTML = '';

            if (CONFIG.MISSING_AVATAR_MODE === 'text') {
                // Mode A: Show word in big font
                const div = document.createElement('div');
                div.className = 'fallback-text';
                div.textContent = word;
                display.appendChild(div);
                resolve();
            } else {
                // Mode B: Show neutral pose
                const img = new Image();
                img.className = 'avatar-img';
                img.alt = word;
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = CONFIG.AVATAR_DIR + this.neutralPose;
                const label = document.createElement('div');
                label.className = 'fallback-label';
                label.textContent = word;
                display.appendChild(img);
                display.appendChild(label);
            }
        });
    },
    /* === END TOGGLE: MISSING AVATAR FALLBACK === */

    showAvatarPlaceholder() {
        const display = document.getElementById('sptsSignImage');
        if (display) {
            display.innerHTML = '';
            const img = new Image();
            img.className = 'avatar-img';
            img.alt = 'Waiting for input...';
            img.src = CONFIG.AVATAR_DIR + this.neutralPose;
            display.appendChild(img);
        }
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
