# PathoAI - Clinical AI Pathology & Diagnostic Platform

PathoAI is a comprehensive clinical AI pathology platform featuring automated specimen diagnostics, verified specialist bookings, hospital report generation, and medical practitioner management.

---

## 🚀 CI/CD E2E Web Testing & Deployment
This project has integrated E2E Web Selenium Testing (1,100 Assertions across 110 categories) and automated deployment to GitHub Pages.

- **HTML report link**: `https://srinivas939.github.io/pathoAi/reports/latest/execution-report.html`
- **Excel report link**: `https://srinivas939.github.io/pathoAi/reports/latest/selenium-report.xlsx`

---

## 📱 Android Studio Setup & Deployment

To run and deploy PathoAI on Android devices or Android Studio emulators:

👉 **[Read the Full Android Studio Setup Guide (ANDROID_SETUP_README.md)](./ANDROID_SETUP_README.md)**

### Quick Android Commands:
```bash
# 1. Install dependencies
npm install

# 2. Build web assets & sync to Android shell
npm run cap:sync

# 3. Launch project in Android Studio
npm run cap:open:android
```

---

## 💻 Web Development & Testing

### Local Development Server
To start the full-stack server (Express API + Vite frontend) on port 3000:

```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Motion
- **Mobile Container**: Capacitor 8 for Android Studio & APK generation
- **Backend API**: Express.js, Node.js, @google/genai SDK
- **Documents**: jsPDF, html2canvas (Hospital PDF Generation)
