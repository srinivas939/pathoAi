export type Role = 'patient' | 'doctor';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive?: boolean;
  // Patient specific
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  medicalHistory?: string;
  // Doctor specific
  qualification?: string;
  specialization?: string;
  licenseId?: string;
  hospital?: string;
  clinicAddress?: string;
  experienceYears?: number;
  consultationFee?: number;
  consultationHours?: string;
  approved?: boolean;
  rating?: number;
  reviewsCount?: number;
  bio?: string;
  availableDays?: string[];
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ScanResult {
  id: string;
  patientId: string;
  patientName: string;
  imageUrl: string;
  symptoms: string[];
  affectedArea?: string;
  durationDays?: string;
  
  diseaseName: string;
  category: string; // e.g., 'Dermatology', 'Histopathology', 'Hematology'
  confidence: number; // percentage (e.g. 96.4)
  severity: SeverityLevel;
  description: string;
  differentialDiagnosis: string[];
  precautions: string[];
  recommendedMedicines: Medicine[];
  recommendedDiet: string[];
  recommendedSpecialist: string;
  
  modelVersion: string; // e.g. 'EfficientNetB0-v2.1 (Ensemble ResNet50)'
  inferenceTimeMs: number; // e.g. 420
  lowConfidenceFlag?: boolean;
  
  reviewedByDoctorId?: string;
  doctorNotes?: string;
  status: 'analyzed' | 'doctor_reviewed' | 'pending_review' | 'verified';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorHospital: string;
  date: string;
  timeSlot: string;
  complaint: string;
  scanId?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'upcoming' | 'completed' | 'cancelled';
  fee: number;
  createdAt: string;
  prescription?: {
    diagnosis: string;
    medicines: Medicine[];
    notes: string;
    signedByDoctorName: string;
    signedAt: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'scan' | 'appointment' | 'system' | 'doctor';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  rating: number; // 1-5
  category: 'Accuracy' | 'UI/UX' | 'Doctor Service' | 'General';
  comment: string;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  timestamp: string;
  ip: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  pendingDoctorApprovals: number;
  totalScans: number;
  totalAppointments: number;
  averageAccuracy: number;
  scansByDisease: { disease: string; count: number }[];
  scansOverTime: { date: string; scans: number }[];
  scansBySeverity: { severity: string; count: number }[];
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'role_select'
  | 'login_patient'
  | 'login_doctor'
  | 'login_admin'
  | 'register_patient'
  | 'register_doctor'
  | 'forgot_password'
  | 'reset_password'
  | 'email_verify'
  | 'patient_dashboard'
  | 'doctor_dashboard'
  | 'admin_dashboard'
  | 'profile'
  | 'profile_edit'
  | 'scan_upload'
  | 'symptom_entry'
  | 'prediction_loading'
  | 'prediction_result'
  | 'scan_history'
  | 'scan_detail'
  | 'doctor_directory'
  | 'doctor_detail'
  | 'appointment_booking'
  | 'appointment_list'
  | 'appointment_detail'
  | 'doctor_queue'
  | 'prescription_editor'
  | 'pdf_preview'
  | 'notifications'
  | 'notification_center'
  | 'admin_users'
  | 'admin_doctor_approval'
  | 'admin_doctor_approvals'
  | 'admin_analytics'
  | 'admin_logs'
  | 'patient_symptom_checker'
  | 'patient_med_tracker'
  | 'admin_ai_retraining'
  | 'admin_security_audit';
