# PathoAI System Architecture & Technical Specifications

```
                     ┌───────────────────────────────────────┐
                     │          USER INTERACTION             │
                     ├──────────────────┬────────────────────┤
                     │  Web Application │   Mobile App       │
                     │   (React SPA)    │ (Capacitor/Android)│
                     └────────┬─────────┴─────────┬──────────┘
                              │                   │
                              └─────────┬─────────┘
                                        │ HTTP REST
                               ┌────────▼────────┐
                               │ Express Backend │
                               │  (Port 3000)    │
                               └────────┬────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
           ┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
           │ MySQL Database  │ │ Google Gemini   │ │ Local Logs &   │
           │ (XAMPP / DB)    │ │ AI Service API  │ │ Reports        │
           └─────────────────┘ └─────────────────┘ └────────────────┘
```

## Module Breakdown

### 1. Frontend SPA (`/src`)
- **React 19 & TypeScript**: Single Page Application structure with modular component views in `src/components/screens/`.
- **State Resilience**: Global `AuthContext` managing patient, doctor, and admin user sessions.
- **Styling**: Modern Tailwind CSS v4 styling with responsive mobile/desktop navigation.

### 2. Express Backend (`/backend`)
- **App Entry (`backend/app.ts`)**: CORS enabled, JSON body parsers, and modular route mounting.
- **Route Modules (`backend/routes/`)**: Encapsulated controller logic for authentication, pathology scans, appointments, doctor directory, notifications, feedback, and audit logs.
- **Database Driver (`backend/db/mysql.ts`)**: MySQL connection pool with automatic fallback to memory data store if database connection is unavailable.

### 3. Database Layer (`/database`)
- **SQL Schema (`database/schema.sql`)**: Standardized InnoDB MySQL schema with index optimizations on key lookup fields (`role`, `patientId`, `doctorId`, `date`).
- **Seed Script (`database/seed.sql`)**: Includes initial patient, doctor, and admin accounts for testing and evaluation.

### 4. Native Mobile Packaging (`/android`)
- **Capacitor 8 Container**: Native Android Studio gradle project wrapping web dist build (`dist/`) into an installable APK package.
