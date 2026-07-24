// backend/db/data.ts
// In-Memory Database and Data Models for PathoAI Clinical Platform

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  createdAt: string;
  avatarUrl?: string;
  isActive?: boolean;
  
  // Patient specific fields
  age?: number;
  gender?: string;
  bloodGroup?: string;
  medicalHistory?: string;

  // Doctor specific fields
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

export interface ScanRecord {
  id: string;
  patientId: string;
  patientName: string;
  imageUrl: string;
  symptoms: string[];
  affectedArea: string;
  durationDays: string;
  diseaseName: string;
  category: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  description: string;
  differentialDiagnosis: string[];
  precautions: string[];
  recommendedMedicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  recommendedDiet: string[];
  recommendedSpecialist: string;
  modelVersion: string;
  inferenceTimeMs: number;
  lowConfidenceFlag: boolean;
  status: 'analyzed' | 'under_review' | 'verified';
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
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  fee: number;
  prescription?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'scan' | 'appointment' | 'doctor' | 'system';
  read: boolean;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  role: 'patient' | 'doctor' | 'admin';
  rating: number;
  category: string;
  comment: string;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  responseTimeMs: number;
  timestamp: string;
  ip: string;
}

// Global In-Memory Database Collections
export const users: User[] = [
  {
    id: 'pat-1',
    name: 'Sarah Jenkins',
    email: 'patient@pathoai.com',
    password: 'password123',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    createdAt: '2026-01-15T10:00:00Z',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    medicalHistory: 'Mild eczema in childhood. No known drug allergies.',
    isActive: true,
  },
  {
    id: 'doc-1',
    name: 'Dr. Marcus Vance, MD',
    email: 'doctor@pathoai.com',
    password: 'password123',
    role: 'doctor',
    phone: '+1 (555) 876-5432',
    createdAt: '2025-11-20T08:30:00Z',
    qualification: 'MD Pathology, FCAP',
    specialization: 'Dermatopathologist',
    licenseId: 'MD-NY-98231',
    hospital: 'Johns Hopkins Medical Center',
    clinicAddress: '742 Evergreen Medical Parkway, Suite 400',
    experienceYears: 14,
    consultationFee: 120,
    consultationHours: '09:00 AM - 05:00 PM',
    approved: true,
    rating: 4.9,
    reviewsCount: 128,
    bio: 'Board-certified Dermatopathologist specializing in melanoma detection, digital lesion classification, and autoimmune skin pathologies.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    isActive: true,
  },
  {
    id: 'adm-1',
    name: 'Chief Admin',
    email: 'admin@pathoai.com',
    password: 'password123',
    role: 'admin',
    phone: '+1 (555) 000-1111',
    createdAt: '2025-01-01T00:00:00Z',
    isActive: true,
  },
];

export const scans: ScanRecord[] = [];

export const appointments: Appointment[] = [];

export const notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'pat-1',
    title: 'AI Scan Analysis Ready',
    message: 'Your recent skin scan scan-102 has been analyzed with 91.8% confidence.',
    type: 'scan',
    read: false,
    createdAt: '2026-07-21T09:15:00Z',
  },
  {
    id: 'notif-2',
    userId: 'pat-1',
    title: 'Appointment Confirmed',
    message: 'Your consultation with Dr. Marcus Vance is scheduled for July 25 at 10:30 AM.',
    type: 'appointment',
    read: true,
    createdAt: '2026-07-20T15:01:00Z',
  },
];

export const feedbackList: FeedbackItem[] = [
  {
    id: 'fb-1',
    userId: 'pat-1',
    userName: 'Sarah Jenkins',
    role: 'patient',
    rating: 5,
    category: 'Accuracy',
    comment: 'The AI detected my rash accurately before I even saw my doctor! Very comforting and fast.',
    createdAt: '2026-07-20T16:00:00Z',
  },
];

export const systemLogs: SystemLog[] = [];

export function addLog(endpoint: string, method: string, statusCode: number, responseTimeMs: number, ip: string) {
  systemLogs.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    endpoint,
    method,
    statusCode,
    responseTimeMs,
    timestamp: new Date().toISOString(),
    ip: ip || '127.0.0.1',
  });
  if (systemLogs.length > 100) systemLogs.pop();
}
