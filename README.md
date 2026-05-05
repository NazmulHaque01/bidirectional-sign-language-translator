<p align="center">
  <img src="assets/banner.png" alt="Bangla Sign Language Translator Banner" width="800">
</p>

<h1 align="center">🤟 Bidirectional Bangla Sign Language Translator</h1>

<p align="center">
  <strong>Real-time Sign Language ↔ Speech translation running entirely in the browser</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web%20Browser-blue?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/Language-JavaScript-yellow?style=flat-square" alt="Language">
  <img src="https://img.shields.io/badge/ML-MediaPipe%20%2B%20Custom%20MLP-green?style=flat-square" alt="ML">
  <img src="https://img.shields.io/badge/Classes-60%20Gestures-purple?style=flat-square" alt="Classes">
  <img src="https://img.shields.io/badge/Accuracy-92%25-brightgreen?style=flat-square" alt="Accuracy">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square" alt="License">
</p>

---

## 📖 Overview

A **bidirectional** web application that translates between **Bangla Sign Language** and **spoken Bengali**, running entirely client-side in the browser with no backend server required.

| Direction | Input | Output | Technology |
|-----------|-------|--------|------------|
| **Sign → Speech** | Camera (hand gestures) | Detected Bengali word + sentence | MediaPipe Landmarks + Custom MLP Neural Network |
| **Speech → Sign** | Voice / text input | Avatar animation sequence | Web Speech API + Word-to-Avatar mapping |

### ✨ Key Features

- 🖐️ **Real-time gesture recognition** — 60 Bangla sign language gestures detected via webcam
- 🗣️ **Voice input** — Speak in Bengali, see avatar sign animations
- ⌨️ **Text input** — Type Bengali text, get sign language translation
- 🧠 **Smart word matching** — Handles Bangla verb conjugations, synonyms, and suffix stripping
- 📱 **Responsive design** — Side-by-side on desktop, swipeable tabs on mobile
- ⚡ **No backend needed** — Runs entirely in the browser using pure JavaScript inference
- 🎯 **Primary person detection** — Filters out bystanders' hands using pose-wrist proximity

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Browser (Client-Side)                   │
├─────────────────────────┬─────────────────────────────────┤
│   Sign → Speech         │       Speech → Sign             │
│                         │                                 │
│  Camera Feed            │  Voice Input (Web Speech API)   │
│       ↓                 │  Text Input                     │
│  MediaPipe Hands+Pose   │       ↓                         │
│       ↓                 │  Smart Bangla Tokenizer         │
│  154 Keypoints          │       ↓                         │
│       ↓                 │  Word → Avatar Mapping          │
│  StandardScaler         │  (51 avatars + fallback)        │
│       ↓                 │       ↓                         │
│  MLP Neural Network     │  Sequential Animation           │
│  (154→256→128→64→60)    │                                 │
│       ↓                 │                                 │
│  Predicted Gesture      │  Avatar Display                 │
└─────────────────────────┴─────────────────────────────────┘
```

---

## 📁 Project Structure

```
├── index.html              # Main HTML page
├── css/
│   └── style.css           # Complete styling + responsive design
├── js/
│   ├── config.js           # Shared configuration & settings
│   ├── utils.js            # Keypoint extraction, normalization, utilities
│   ├── sign-to-speech.js   # Gesture recognition module (camera → prediction)
│   ├── speech-to-sign.js   # Voice/text → avatar translation module
│   └── app.js              # App controller, event listeners, bootstrap
├── models/
│   └── model_weights.json  # Extracted MLP weights (from TFLite)
├── data/
│   ├── class_labels.json   # 60 gesture class labels
│   └── scaler.json         # StandardScaler parameters (mean, scale, var)
├── avatars/                # 51 avatar images (PNG) for sign animations
├── serve.py                # Local development server
└── README.md
```

---

## 🚀 Quick Start

### Option 1 — GitHub Pages (Recommended)

Simply visit the live demo:

👉 **[https://NazmulHaque01.github.io/bidirectional-sign-language-translator/](https://NazmulHaque01.github.io/bidirectional-sign-language-translator/)**

> Voice input works automatically on GitHub Pages (HTTPS).

### Option 2 — Run Locally

```bash
# Clone the repository
git clone https://github.com/NazmulHaque01/bidirectional-sign-language-translator.git
cd bidirectional-sign-language-translator

# Start local server
python serve.py
```

Then open **http://localhost:8000** in Chrome or Edge.

> **Why a server?** The Web Speech API (voice input) requires a secure context (`https://` or `localhost`). Opening `index.html` directly via `file://` will cause a "network" error for voice input.

---

## 🎮 How to Use

### Sign → Speech (Left Panel)
1. Click **📷 Start Camera** and allow camera permission
2. Show Bangla sign language gestures to the webcam
3. Hold a gesture steady for ~1 second — it gets added to the sentence
4. View the predicted gesture name, confidence score, and accumulated sentence

### Speech → Sign (Right Panel)
1. Click **🎤 Voice Input** and speak in Bengali, OR type Bengali text in the text box
2. Click **▶️ Translate**
3. Watch avatar animations play sequentially for each recognized word
4. Words without a matching avatar show either the word in large text or a neutral pose (configurable in Settings)

### ⚙️ Settings
- **📐 Camera** — Toggle between Landscape (4:3) and Portrait (3:4) camera mode
- **🖼️ Missing Avatar** — Toggle between "Show Text" and "Neutral Pose" fallback

---

## 🧠 Model Details

| Property | Value |
|----------|-------|
| **Model Type** | Multi-Layer Perceptron (MLP) |
| **Architecture** | 154 → 256 → 128 → 64 → 60 |
| **Input Features** | 126 (hand landmarks) + 27 (pose landmarks) + 1 (pose flag) = 154 |
| **Output Classes** | 60 Bangla sign gestures |
| **Accuracy** | ~92% |
| **Inference** | Pure JavaScript (no TensorFlow.js needed) |
| **Landmark Detection** | MediaPipe Hands + Pose (via CDN) |

### Feature Extraction Pipeline
1. **MediaPipe** detects hand landmarks (21×3×2 hands) and pose landmarks (9 upper body points × 3)
2. Hands are **sorted by handedness** (Left first, Right second)
3. **Primary person filtering** discards hands not belonging to the nearest person
4. Landmarks are **centered** on nose (if pose detected) or wrist, and **scaled** by shoulder distance or hand size
5. **StandardScaler** normalizes features using pre-computed mean and variance
6. **MLP inference** runs through 4 dense layers with ReLU + Softmax

---

## 🌐 Browser Compatibility

| Browser | Sign → Speech | Speech → Sign (Voice) | Speech → Sign (Text) |
|---------|:---:|:---:|:---:|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Firefox | ✅ | ❌ (no Speech API) | ✅ |
| Safari | ✅ | ⚠️ (partial) | ✅ |

> **Note:** Voice input uses the Web Speech API which is primarily supported in Chromium-based browsers (Chrome, Edge).

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **ML Inference:** Pure JavaScript MLP engine (no frameworks)
- **Hand/Pose Detection:** [MediaPipe Tasks Vision](https://developers.google.com/mediapipe) (v0.10.14)
- **Voice Recognition:** Web Speech API (browser-native)
- **Design:** Responsive CSS Grid, Glassmorphism, Inter font
- **Deployment:** GitHub Pages (static hosting)

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ for Bangla Sign Language accessibility
</p>
