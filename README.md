# 🏥 PathoAI — AI-Powered Diagnostic Pathology Platform

PathoAI is a comprehensive, production-grade clinical AI pathology platform featuring automated specimen diagnostics, verified specialist bookings, hospital PDF report generation, and multi-role medical management.

---

## 📁 Modular Project Architecture

The codebase is organized into clear, decoupled modules for Frontend, Backend, Database, Mobile Apps, Tests, and Documentation:

```
pathoAi/
├── 🌐 src/                     # React 19 + Vite + Tailwind CSS Web Application
│   ├── components/             # React Screens, Navigation, Modals & UI Components
│   ├── context/                # AuthContext & Session Management
│   ├── services/               # Frontend API Client Services
│   ├── App.tsx                 # Main React Router & View Container
│   └── types.ts                # TypeScript Interfaces & Models
│
├── ⚙️ backend/                 # Node.js + Express REST API Server
│   ├── app.ts                  # Express App Setup & Middleware
│   ├── db/                     # MySQL Connection Pool & In-Memory Fallback
│   ├── routes/                 # REST Endpoints (Auth, Doctors, Scans, Appointments)
│   └── services/               # Gemini AI Pathology Diagnostic Engine
│
├── 🗄️ database/               # Relational Database SQL Schemas & Seed Data
│   ├── schema.sql              # MySQL DDL (users, scans, appointments, etc.)
│   └── seed.sql                # Initial Seed Data for Patients, Doctors, Admin
│
├── 📱 mobile/                  # Native Mobile App Projects
│   ├── android/                # Capacitor Native Android App Project (Gradle)
│   └── flutter_app/            # Flutter Cross-Platform Mobile App Codebase
│
├── 🧪 tests/                   # Automated E2E Test Suites
│   └── mega_web_1100.test.cjs  # Web Assertion Suite (1,100 Tests)
│
├── 🛠️ utils/                  # HTML & Excel Report Generation Utilities
│   ├── excelReporter.cjs       # Custom Excel (.xlsx) Report Generator
│   └── htmlReportGenerator.cjs # Dark Theme HTML Execution Reporter
│
├── 📈 scripts/                 # Performance, Load Testing & Utility Scripts
│   └── runLoadTestLocal.cjs    # Local Load Test Simulator
│
└── 📖 docs/                    # Architectural & Operational Documentation
    ├── API.md                  # REST API Reference
    ├── ARCHITECTURE.md         # Full-Stack System Architecture Overview
    ├── DEPLOYMENT.md           # Local, Web Production, & Android Build Guide
    └── FRONTEND_ARCHITECTURE.md# React UI Component Hierarchy & Features
```

---

## 📚 Technical Documentation

- 🔗 [API Documentation](file:///c:/Users/srinivasa%20reddy/Downloads/pathoai%20(1)/docs/API.md)
- 🔗 [System Architecture](file:///c:/Users/srinivasa%20reddy/Downloads/pathoai%20(1)/docs/ARCHITECTURE.md)
- 🔗 [Deployment & Build Guide](file:///c:/Users/srinivasa%20reddy/Downloads/pathoai%20(1)/docs/DEPLOYMENT.md)
- 🔗 [Frontend UI Architecture](file:///c:/Users/srinivasa%20reddy/Downloads/pathoai%20(1)/docs/FRONTEND_ARCHITECTURE.md)

---

## 🚀 Quick Start Commands

```bash
# 1. Install all dependencies
npm install

# 2. Start Full-Stack Dev Server (Express API + Vite Web)
npm run dev

# 3. Build Production Bundle & Sync to Android App
npm run build
npx cap sync android

# 4. Run E2E Test Suite (No network/browser dependencies)
npm run test
```
