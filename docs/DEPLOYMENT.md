# PathoAI Deployment Guide

This guide covers local development, production web building, database initialization, and Android APK compilation.

---

## 🛠️ Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+
- **MySQL / XAMPP**: Optional for database persistence (in-memory mode acts as automatic fallback)
- **Android Studio / SDK**: Required for compiling native `.apk` files

---

## 🚀 1. Local Development Setup

```bash
# Install dependencies
npm install

# Start Express server & Vite HMR dev environment
npm run dev
```
Access the application at `http://localhost:3000`.

---

## 📦 2. Production Web Build

```bash
# Build React web bundle and Node.js production server
npm run build
```
Build outputs:
- `dist/index.html` & `dist/assets/` (Web SPA)
- `dist/server.cjs` (Production Node server)

Run production server:
```bash
npm run start
```

---

## 🗄️ 3. Database Setup (MySQL / XAMPP)

1. Open XAMPP Control Panel and start MySQL service.
2. Import database schema:
   ```bash
   mysql -u root < database/schema.sql
   mysql -u root < database/seed.sql
   ```

---

## 📱 4. Android APK Compilation

1. Build static web assets:
   ```bash
   npm run build
   ```
2. Sync assets with Capacitor Android:
   ```bash
   npx cap sync android
   ```
3. Open in Android Studio or compile APK via Gradle:
   ```bash
   npx cap open android
   ```
   Or via command line (Windows):
   ```cmd
   cd android
   gradlew assembleDebug
   ```
   The generated APK will be located at:
   `android/app/build/outputs/apk/debug/app-debug.apk`
