# PathoAI REST API Documentation

Base URL: `http://localhost:3000/api`

---

## 🔐 Authentication Endpoints

### 1. Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123",
    "role": "patient",
    "phone": "+1234567890",
    "age": 30,
    "gender": "Female"
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "success": true,
    "user": { "id": "u-123", "name": "Jane Doe", "email": "jane@example.com", "role": "patient" },
    "token": "mock-jwt-token"
  }
  ```

### 2. Login User
- **POST** `/api/auth/login` (Also handles `/api/auth/login/patient`, `/api/auth/login/doctor`, `/api/auth/login/admin`)
- **Body**:
  ```json
  {
    "email": "patient@pathoai.com",
    "password": "password123"
  }
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "user": { "id": "p-101", "name": "Sarah Connor", "role": "patient" },
    "token": "mock-jwt-token"
  }
  ```

---

## 🧪 Pathology Scans API

### 1. Upload Scan for AI Diagnosis
- **POST** `/api/scans`
- **Body**:
  ```json
  {
    "patientId": "p-101",
    "patientName": "Sarah Connor",
    "imageUrl": "data:image/png;base64,...",
    "symptoms": "Skin redness and irritation",
    "affectedArea": "Arm",
    "duration": "3 days"
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "id": "scan-501",
    "status": "completed",
    "diagnoses": [{ "condition": "Eczema / Contact Dermatitis", "probability": 0.92 }],
    "confidenceScore": 92.0
  }
  ```

### 2. Get Patient Scans
- **GET** `/api/scans?patientId=p-101`

---

## 📅 Appointments API

### 1. Book Appointment
- **POST** `/api/appointments`
- **Body**:
  ```json
  {
    "patientId": "p-101",
    "patientName": "Sarah Connor",
    "doctorId": "doc-201",
    "doctorName": "Dr. Aris Thorne",
    "date": "2026-08-01",
    "time": "10:00 AM",
    "type": "online"
  }
  ```

### 2. List Appointments
- **GET** `/api/appointments?patientId=p-101`

---

## 👨‍⚕️ Doctors & Admin API

### 1. List Approved Doctors
- **GET** `/api/doctors`

### 2. Admin System Audit Logs
- **GET** `/api/admin/logs`
- **POST** `/api/admin/logs`
