# 📱 Android App (APK) Conversion Guide

This document outlines the exact process used to convert the web-based **Bangla Sign Language Translator** into a fully functional, lightweight native Android App (.apk) without losing any AI model performance.

---

## Part 1: How the Web App Was Prepared (PWA Setup)
To convert a web app into a mobile app easily, it must first be turned into a **Progressive Web App (PWA)**. This was accomplished by adding three critical components to the project:

1. **`manifest.json` (Web App Manifest):**
   This file acts as the ID card for the app. It tells Android the name of the app ("Sign Translator"), what color the top status bar should be (Indigo), and what orientation to lock into (Portrait).

2. **`sw.js` (Service Worker):**
   A background JavaScript file that runs independently of the web page. Its job is to cache the core files (HTML, CSS, JS) so the app interface can load instantly, even on slow networks, mimicking a true native app experience.

3. **App Icons (`icon-192.png` & `icon-512.png`):**
   Android requires very specific icon sizes to generate an APK. A custom, minimalist flat-design icon was generated, converted to true PNG format, and resized to both 192x192 and 512x512 pixels to satisfy strict build requirements.

---

## Part 2: Step-by-Step Guide to Generating the APK
With the PWA setup complete and hosted on GitHub Pages, we used Microsoft's **PWABuilder** to wrap the code into an Android app. 

If you ever need to generate the APK again (for example, if you make major updates), follow these steps:

### 1. Ensure Your Website is Live
* Your project must be hosted online with HTTPS. 
* Go to your repository settings on GitHub, navigate to **Pages**, and ensure your site is deployed from the `main` branch.
* Copy your live URL (e.g., `https://nazmulhaque01.github.io/bidirectional-sign-language-translator/`).

### 2. Scan with PWABuilder
* Go to **[PWABuilder.com](https://www.pwabuilder.com/)**.
* Paste your live URL into the search bar and click **Start**.
* The scanner will detect the `manifest.json`, the Service Worker, and the PNG icons we set up. You should see a high passing score.

### 3. Package the App
* Click the **Package for Android** button.
* In the popup menu, you can configure your app details:
  * **Package ID:** The unique identifier for your app (e.g., `com.nazmul.signtranslator`).
  * **Name / Launcher Name:** `Sign Translator`
  * **Version:** Leave as default (e.g., `1.0.0.0`).
* Click **Generate App**.

---

## Part 3: How to Use the Output (Installation)
Once PWABuilder finishes generating your app, it will download a `.zip` file to your computer.

1. **Extract the Zip File:**
   Unzip the downloaded file on your computer. Inside, you will find several files, but the most important one is **`app-release.apk`**.

2. **Transfer to your Phone:**
   Send `app-release.apk` to your Android device via USB cable, Google Drive, or email.

3. **Install the APK (Sideloading):**
   * Open a File Manager on your phone and tap the `app-release.apk` file.
   * If your phone blocks the installation, tap **Settings** on the warning popup and toggle on **"Allow from this source"** (Unknown Sources).
   * Tap **Install**.

### What to Expect
* **File Size:** The APK is incredibly lightweight (usually under 3 MB).
* **Performance:** Because PWABuilder uses Android's "Trusted Web Activity" (TWA), it relies on the phone's highly optimized built-in Chrome engine. This means your MediaPipe AI models will utilize 100% of the hardware acceleration available, running exactly as fast as they do in the browser.
* **Updates:** Because it's a web wrapper, any time you push new HTML/CSS/JS changes to your GitHub repository, the app on your phone will **automatically update** the next time you open it! (You don't need to generate a new APK for minor code updates).
