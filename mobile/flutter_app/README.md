# PathoAI - Flutter Android & Flutter Web Application

PathoAI is built as a unified cross-platform **Flutter application** supporting **Android** and **Web**.

---

## 📂 Flutter Project Architecture (`/flutter_app`)

```
flutter_app/
├── pubspec.yaml                 # Flutter dependencies & configuration
├── lib/
│   ├── main.dart                # Main Flutter Application Entry & Theme
│   ├── models/                  # Strong Data Schemas
│   │   ├── user.dart            # Patient, Doctor & Admin User Models
│   │   ├── scan.dart            # Diagnostic Scan & Prescription Models
│   │   └── appointment.dart     # Consultation Booking Models
│   ├── services/
│   │   └── api_service.dart     # Http REST API Client connecting to Express Backend
│   ├── providers/
│   │   └── app_provider.dart    # Provider State Management Engine
│   └── screens/
│       ├── login_screen.dart           # Role Selection & Login Form
│       ├── patient_home_screen.dart    # Patient Diagnostic Dashboard & Actions
│       ├── ai_scan_screen.dart         # Camera/Upload & AI Vision Diagnosis
│       ├── doctor_dashboard_screen.dart # Specialist Queue & Consultation Requests
│       └── admin_dashboard_screen.dart  # Clinical Analytics & Doctor Approvals
├── web/
│   └── index.html               # Flutter Web Entry Shell
└── android/
    └── app/src/main/
        └── AndroidManifest.xml  # Native Android Permissions (Camera, Storage)
```

---

## 🚀 How to Run the Flutter App

### 1. Run Flutter Web
```bash
cd flutter_app
flutter pub get
flutter run -d chrome
```

### 2. Build Flutter Web Release
```bash
flutter build web
```

### 3. Run Flutter Android (Emulator or Phone)
```bash
flutter run -d android
```

### 4. Build Flutter Android APK
```bash
flutter build apk --release
```
The output APK will be generated at: `build/app/outputs/flutter-apk/app-release.apk`.

---

## 🔗 Connecting to Express Backend
- When running in **Android Emulator**, set the `baseUrl` in `lib/services/api_service.dart` to:
  ```dart
  static String baseUrl = 'http://10.0.2.2:3000/api';
  ```
- When running in **Flutter Web**, set the `baseUrl` to:
  ```dart
  static String baseUrl = 'http://localhost:3000/api';
  ```
