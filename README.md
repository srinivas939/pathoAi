# 🏥 PathoAI — AI-Powered Diagnostic Pathology Platform

PathoAI is a comprehensive, production-grade clinical AI pathology platform featuring automated specimen diagnostics, verified specialist bookings, hospital PDF report generation, and multi-role medical management.

---

## 📁 Modular Project Architecture

The codebase is organized into clear, decoupled modules for Frontend, Backend, Database, Android App, Web App, Tests, and Performance Pipelines:

```
pathoAi/
├── 🌐 frontend/                # React 19 + Vite + Tailwind CSS Web Application
│   ├── src/                    # Components, Screens, Context, Services & Types
│   ├── public/                 # Static Assets & Icons
│   └── index.html              # HTML Entry Point
│
├── ⚙️ backend/                 # Node.js + Express REST API Server
│   ├── config/                 # Environment & Service Configuration
│   ├── db/                     # MySQL Pool, Schema Migrations & In-Memory Fallback
│   ├── routes/                 # API Endpoints (Auth, Doctors, Scans, Appointments)
│   └── services/               # Gemini AI Engine Integration
│
├── 🗄️ database/               # Database SQL Schemas & Initial Seed Data
│   ├── schema.sql              # MySQL DDL (users, scans, appointments, etc.)
│   └── seed.sql                # Initial Seed Data for Patients, Doctors, Admin
│
├── 📱 android/                 # Capacitor Native Android App Project (Gradle)
│   └── app/build/outputs/apk/debug/app-debug.apk
│
├── 📱 flutter_app/             # Flutter Cross-Platform Mobile App Codebase
│
├── 🧪 tests/                   # E2E Test Automation Suites
│   ├── mega_web_1100.test.cjs  # Web Selenium E2E (1,100 Tests)
│   └── mega_android_1111.test.cjs # Android Appium E2E (1,111 Tests)
│
├── 📈 scripts/                 # Performance, Load Testing (k6) & CI Scripts
│   ├── load-test.js            # k6 Performance Test Script (100 VUs)
│   ├── parseK6Summary.cjs      # k6 Summary Parser & Executive Report Generator
│   └── runLoadTestLocal.cjs    # Local Load Test Simulator
│
└── 🛠️ utils/                  # HTML & Excel Report Generation Utilities
```

---

## 🌐 Live GitHub Pages & Performance Reports

| Resource | Format | Live URL |
|---|:---:|---|
| 🏥 **Live Web App** | Web App | [srinivas939.github.io/pathoAi](https://srinivas939.github.io/pathoAi/) |
| 📲 **Android Mobile App** | `.apk` | [PathoAI-v2.4.apk](https://srinivas939.github.io/pathoAi/apk/PathoAI-v2.4.apk) |
| 📊 **Web E2E Excel Report** | `.xlsx` | [selenium-report.xlsx](https://srinivas939.github.io/pathoAi/reports/latest/selenium-report.xlsx) |
| 📄 **Web E2E HTML Report** | `.html` | [execution-report.html](https://srinivas939.github.io/pathoAi/reports/latest/execution-report.html) |
| 📊 **Android E2E Excel Report** | `.xlsx` | [android-report.xlsx](https://srinivas939.github.io/pathoAi/reports/latest/android-report.xlsx) |
| 📱 **Android E2E HTML Report** | `.html` | [android-execution-report.html](https://srinivas939.github.io/pathoAi/reports/latest/android-execution-report.html) |
| 📈 **k6 Load Test Excel Report** | `.xlsx` | [load-test-report.xlsx](https://srinivas939.github.io/pathoAi/reports/latest/load-test-report.xlsx) |
| 📈 **k6 Load Test HTML Report** | `.html` | [load-test-execution-report.html](https://srinivas939.github.io/pathoAi/reports/latest/load-test-execution-report.html) |

---

## 🚀 Quick Start Commands

```bash
# 1. Install all dependencies
npm install

# 2. Start Full-Stack Dev Server (Express API + Vite Web)
npm run dev

# 3. Build Production Bundle & Sync to Android App
npm run build
npm run cap:sync

# 4. Run E2E Test Suites & Generate Excel Reports
npm run test           # Web E2E (1,100 Tests)
npm run test:android:report # Android Appium E2E (1,111 Tests)
npm run test:load      # k6 API Load Test (100 VUs)
```
