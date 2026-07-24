# PathoAI - Complete Architecture & Flutter Build Guide (Android + Web)

This repository contains the full source code for **PathoAI**, featuring a complete **Flutter Application** (`/flutter_app`) for **Android & Web**, accompanied by an **Express.js API Backend** (`/backend`) and a Node web preview server (`/server.ts`).

---

## 🏗️ 1. Project Directory Structure

```
/
├── flutter_app/                # 📱 FLUTTER CROSS-PLATFORM APP (Android + Web)
│   ├── pubspec.yaml            # Flutter package manifest & dependencies
│   ├── lib/
│   │   ├── main.dart           # Flutter app entry point, Material 3 theme & Shell
│   │   ├── models/             # User, Scan, Appointment & Prescription models
│   │   ├── services/           # ApiService connecting to Express backend
│   │   ├── providers/          # AppProvider (State management via Provider)
│   │   └── screens/            # Flutter screens: Login, Patient, Doctor, Admin, AI Scan
│   ├── web/                    # Flutter Web index.html and web manifest
│   └── android/                # Native Android Gradle configuration & AndroidManifest.xml
│
├── backend/                    # ⚙️ EXPRESS.JS REST API BACKEND
│   ├── app.ts                  # Express application setup & middleware
│   ├── db/data.ts              # In-memory pathology database & schemas
│   ├── services/gemini.ts      # Google GenAI Vision diagnostic engine
│   └── routes/                 # REST endpoints (auth, scans, doctors, appointments, admin)
│
├── frontend/                   # 🌐 REACT WEB SPA (Port 3000 AI Studio Live Preview)
│   ├── src/                    # React 19 + Tailwind CSS v4 UI components
│   └── README.md
│
├── server.ts                   # 🚀 Full-stack Express server entry point
└── APP_BUILD_AND_ARCHITECTURE.md
```

---

## 📱 2. Flutter Application Architecture (`/flutter_app`)

The Flutter application is structured following clean architecture principles with Provider state management:

### 📄 Key Flutter Source Files:
1. **`pubspec.yaml`**: Configured with `http`, `provider`, `google_fonts`, `image_picker`, `pdf`, `printing`, and `fl_chart`.
2. **`lib/main.dart`**: Sets up `MaterialApp` with Material 3 styling, `Color(0xFF0284C7)` primary theme, and role-based screen routing.
3. **`lib/models/`**:
   - `user.dart`: User roles (`patient`, `doctor`, `admin`) and doctor qualification attributes.
   - `scan.dart`: AI pathology scan result, differential diagnoses, precautions, and prescription medicines.
   - `appointment.dart`: Doctor consultation booking, status, and digital prescriptions.
4. **`lib/services/api_service.dart`**: Connects to the Express backend endpoints (`/api/auth`, `/api/scans`, `/api/doctors`, `/api/appointments`). Includes automatic local fallback if offline.
5. **`lib/providers/app_provider.dart`**: Reactive state manager handling user logins, AI scan submissions, and doctor booking state.
6. **`lib/screens/`**:
   - `login_screen.dart`: Multi-role login view with one-click demo account shortcuts.
   - `patient_home_screen.dart`: Patient dashboard, scan list, and doctor consultation trigger.
   - `ai_scan_screen.dart`: Interactive symptom picker, body location dropdown, and AI pathology analysis.
   - `doctor_dashboard_screen.dart`: Specialist queue for accepting/declining consultation requests.
   - `admin_dashboard_screen.dart`: System analytical metrics and doctor license verification.

---

## 🚀 3. How to Build & Run Flutter (Android & Web)

### 🛠️ Prerequisites
- **Flutter SDK**: 3.19.0 or higher (`flutter doctor`)
- **Android Studio**: Ladybug / Jellyfish with Android SDK 33+ and JDK 17
- **VS Code**: With Flutter and Dart plugins

### 🅰️ Running Flutter Web
```bash
# 1. Navigate to flutter_app
cd flutter_app

# 2. Get dependencies
flutter pub get

# 3. Run in Chrome browser
flutter run -d chrome
```

### 🅱️ Building Flutter Web Release
```bash
flutter build web
```
*Output directory:* `flutter_app/build/web`

---

### 🅲 Running Flutter Android
1. Open terminal in `flutter_app`:
   ```bash
   cd flutter_app
   flutter pub get
   ```
2. Start your Android Emulator or connect a USB physical phone.
3. Run:
   ```bash
   flutter run -d android
   ```

### 🅹 Building Flutter Android APK
```bash
flutter build apk --release
```
*Output APK location:* `flutter_app/build/app/outputs/flutter-apk/app-release.apk`

---

## ⚡ 4. Express Backend API Endpoints (`/backend`)

The backend runs on Node.js/Express and serves the following REST endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login/patient` | Authenticates patient users |
| `POST` | `/api/auth/login/doctor` | Authenticates medical doctors |
| `POST` | `/api/auth/login/admin` | Authenticates system administrators |
| `POST` | `/api/scans/analyze` | Receives image & symptoms, runs Gemini AI vision model |
| `GET` | `/api/scans/history` | Retrieves patient diagnostic scan records |
| `GET` | `/api/doctors` | Returns directory of verified medical doctors |
| `POST` | `/api/appointments/book` | Submits consultation booking to doctor |
| `PUT` | `/api/appointments/:id` | Doctor accepts/declines appointment or issues prescription |
| `GET` | `/api/admin/analytics` | Returns diagnostic accuracy and disease statistics |

---

## 🎨 5. Making Customizations from Your Perspective

- **Adding new Flutter UI screens**: Create new files in `flutter_app/lib/screens/` and import them in `main.dart`.
- **Modifying backend logic or AI models**: Edit `backend/services/gemini.ts` or `backend/routes/`.
- **Changing API Base URL**: Edit `baseUrl` in `flutter_app/lib/services/api_service.dart`:
  - Android Emulator: `http://10.0.2.2:3000/api`
  - Web Localhost: `http://localhost:3000/api`
  - Production Server: `https://your-custom-backend.com/api`
