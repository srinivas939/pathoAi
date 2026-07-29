# PathoAI - Android Studio Setup & Deployment Guide

This document provides a comprehensive step-by-step guide to run, build, and deploy the **PathoAI** application in **Android Studio** on Android Emulators or physical mobile devices.

---

## 📱 App Architecture

- **Frontend Shell**: React 19 + TypeScript + Vite + Tailwind CSS (bundled via **Ionic Capacitor** into Android Studio).
- **Mobile Container**: Native Android WebView container (`com.pathoai.app`) compiled using Android Gradle Plugin.
- **Backend Service**: Express.js Node API Server (runs locally on port 3000 or on Cloud Run).

---

## 🛠️ Prerequisites

Before starting, ensure you have the following installed on your computer:

1. **Node.js** (v18.0 or v20+ recommended) & **npm**: [Download Node.js](https://nodejs.org/)
2. **Android Studio** (2024.1+ / Ladybug, Jellyfish, or newer): [Download Android Studio](https://developer.android.com/studio)
3. **Android SDK** (API Level 33 / 34 / 35 installed via Android Studio SDK Manager)
4. **JDK (Java Development Kit)**: JDK 17 or JDK 21 (bundled automatically with Android Studio).

---

## 🚀 Quick Start: Building & Opening in Android Studio

Follow these simple terminal commands to generate the native Android project and open it in Android Studio:

### Step 1: Clone or Download Project
Open your terminal in the project root directory.

```bash
# Install node dependencies (includes @capacitor/core, @capacitor/android, @capacitor/cli)
npm install
```

### Step 2: Build the Web App Assets
Compile the React frontend into the static production directory (`dist/`):

```bash
npm run build
```

### Step 3: Add the Native Android Platform
Generate the native Android Studio project files (`/android` directory):

```bash
npx cap add android
```
*(Or run `npm run cap:add:android`)*

### Step 4: Sync Assets to Android Project
Copy the compiled web app (`dist/`) into the native Android platform shell:

```bash
npx cap sync
```
*(Or run `npm run cap:sync`)*

### Step 5: Open directly in Android Studio
Launch Android Studio with the `/android` folder auto-loaded:

```bash
npx cap open android
```
*(Or run `npm run cap:open:android`)*

---

## 🖥️ Running the App in Android Studio

Once Android Studio opens:

1. **Gradle Sync**: Wait 1–2 minutes for Android Studio to index files and perform the initial Gradle Sync (watch status bar at bottom right).
2. **Select Target Device**:
   - **Emulator**: Click *Device Manager* -> *Create Virtual Device* (e.g. Pixel 8 running Android 14 / API 34).
   - **Physical Phone**: Enable **USB Debugging** on your Android phone, connect via USB, and select your phone in the top toolbar dropdown.
3. **Run Application**: Click the green **Play (Run 'app')** button or press `Shift + F10` (macOS: `Control + R`).
4. The PathoAI native app will compile and launch smoothly on your device/emulator!

---

## 🌐 Connecting to the Backend Server

When running the Android app inside an **Android Emulator**:
- `localhost` inside an emulator refers to the emulator itself, **not** your host computer.
- To connect the Android app to your locally running backend (`npm run dev`), use the special Android host IP:
  ```
  http://10.0.2.2:3000
  ```
- If your backend is deployed live to Cloud Run / Vercel, simply use your live production URL (e.g., `https://your-app-domain.com`).

---

## 📦 Building a Production APK or App Bundle (.aab)

To generate an installable APK or Google Play release bundle from Android Studio:

1. In Android Studio menu, go to **Build** -> **Generate Signed Bundle / APK...**
2. Select **APK** (for direct installation) or **Android App Bundle** (for Google Play Console submission).
3. Create or select your **Keystore** signing key.
4. Select build variant `release` and click **Create**.
5. Your signed APK will be generated in `android/app/release/app-release.apk`.

---

## 🔧 Useful Maintenance Commands

| Command | Action |
| :--- | :--- |
| `npm run build` | Compiles React web frontend to `/dist` |
| `npx cap sync` | Syncs latest web build to Android project |
| `npx cap open android` | Opens project in Android Studio |
| `npm run dev` | Runs Express & Vite dev server locally on port 3000 |

---

## 💡 Troubleshooting Common Issues

### 1. `Cleartext HTTP traffic not permitted`
`capacitor.config.json` is already configured with `"cleartext": true` and `androidScheme: "https"`. If testing local HTTP servers (`http://10.0.2.2:3000`), ensure `android:usesCleartextTraffic="true"` is present in `android/app/src/main/AndroidManifest.xml`.

### 2. Gradle Sync Failed / JAVA_HOME mismatch
In Android Studio, go to **Settings/Preferences** -> **Build, Execution, Deployment** -> **Build Tools** -> **Gradle** -> Set **Gradle JDK** to `Embedded JDK (JDK 17 or 21)`.

### 3. Android SDK location not found
Create a `local.properties` file inside the generated `/android` folder specifying your SDK location:
- macOS: `sdk.dir=/Users/YOUR_USER/Library/Android/sdk`
- Windows: `sdk.dir=C\:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk`
