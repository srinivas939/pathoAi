# PathoAI - Frontend Architecture & UI Documentation

The **frontend** of PathoAI is built as a single-page React 19 application with full mobile responsiveness, offline-first state resilience, and native Capacitor shell support for Android Studio compilation.

---

## 📂 Directory Structure (`/frontend/src`)

```
frontend/src/
├── App.tsx                     # Main Router & View Container
├── main.tsx                    # React Root Entry Point
├── index.css                   # Tailwind v4 Global Styles & Typography
├── types.ts                    # Global TypeScript Interfaces (User, Scan, Doctor, etc.)
├── services/
│   └── api.ts                  # Axios/Fetch API Client for Express Backend
├── context/
│   └── AuthContext.tsx         # Session State, User Auth, Notifications & Role Switching
└── components/
    ├── common/
    │   ├── AdaptiveNavigation.tsx # Bottom Nav (Mobile) & Top Header (Desktop)
    │   ├── DeviceFrame.tsx     # Simulated Mobile / Tablet Preview Toggle
    │   ├── Header.tsx          # App Bar & Role Selector Dropdown
    │   └── PDFReportModal.tsx  # Hospital Pathology PDF Generation (jsPDF + html2canvas)
    └── screens/
        ├── AuthScreens.tsx          # Login, Register (Patient/Doctor), Reset Password
        ├── PatientScreens.tsx       # Patient Dashboard, Scan History, Doctor Booking
        ├── DoctorModuleScreens.tsx  # Doctor Dashboard, Appointment Queue, Prescriptions
        ├── ScanModuleScreens.tsx    # AI Pathology Camera/Upload & Instant Analysis
        ├── AdminScreens.tsx         # Admin Metrics, User Mgmt, Doctor Verification
        └── UtilityScreens.tsx       # Profile Editor, Feedback & Notifications
```

---

## 🛠️ Key UI Features

1. **Role-Based Workflows**:
   - **Patient**: AI Scan Upload, Disease Diagnostic Report, Specialist Search, Appointment Booking, PDF Download.
   - **Doctor**: Medical Credential Profile, Patient Consultation Queue (Accept/Decline), Digital Prescription Generator.
   - **Admin**: Doctor Verification, User Active Status Toggles, System Audit Logs, Disease Analytics.

2. **Mobile-First Responsive Design**:
   - Uses Tailwind v4 with touch-friendly 48px+ tap targets for mobile devices.
   - Includes an adaptive bottom navigation bar on mobile phones and a collapsible side bar on tablets/desktop.

3. **Capacitor Integration**:
   - When compiled into the `/android` directory via `npx cap sync`, the React SPA renders within a high-performance native WebView container.

---

## 💻 Modifying Frontend Code
To make visual or behavioral UI changes from your perspective:
- Edit React components inside `src/components/screens/` or `frontend/src/components/screens/`.
- Test real-time changes in browser via `npm run dev` at `http://localhost:3000`.
- Once satisfied, build the static assets for Android Studio:
  ```bash
  npm run build
  npx cap sync
  ```
