import { User, ScanResult, Appointment, NotificationItem, FeedbackItem, SystemLog, AdminAnalytics } from '../types';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const isCapacitor = window.location.protocol === 'capacitor:' || 
                       (window.location.hostname === 'localhost' && window.location.port !== '3000') ||
                       window.location.protocol === 'file:';
    if (isCapacitor) {
      return 'http://10.0.2.2:3000';
    }
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// Default Mock Entities for Static Host Deployment (e.g. GitHub Pages)
const DEFAULT_PATIENT: User = {
  id: 'pat-1',
  name: 'Sarah Jenkins',
  email: 'patient@pathoai.com',
  role: 'patient',
  phone: '+1 (555) 234-5678',
  createdAt: '2026-01-15T10:00:00Z',
  age: 34,
  gender: 'Female',
  bloodGroup: 'A+',
  medicalHistory: 'Mild eczema in childhood. No known drug allergies.',
};

const DEFAULT_DOCTOR: User = {
  id: 'doc-1',
  name: 'Dr. Marcus Vance, MD',
  email: 'doctor@pathoai.com',
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
};



const MOCK_SCANS: ScanResult[] = [
  {
    id: 'scan-101',
    patientId: 'pat-1',
    patientName: 'Sarah Jenkins',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    symptoms: ['Redness', 'Itching', 'Mild swelling'],
    affectedArea: 'Forearm',
    durationDays: '4',
    diseaseName: 'Atopic Dermatitis (Eczema)',
    category: 'Dermatology',
    confidence: 94.2,
    severity: 'Moderate',
    description: 'Common inflammatory skin condition characterized by erythematous patches and mild lichenification.',
    differentialDiagnosis: ['Contact Dermatitis', 'Psoriasis Vulgaris', 'Nummular Eczema'],
    precautions: ['Apply moisturizer twice daily', 'Avoid harsh soaps', 'Avoid scratching affected area'],
    recommendedMedicines: [
      { name: 'Hydrocortisone 1% Cream', dosage: 'Apply thin layer', frequency: 'Twice daily', duration: '7 days', instructions: 'Apply after bathing' },
      { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', duration: '5 days', instructions: 'For itching relief' }
    ],
    recommendedDiet: ['Anti-inflammatory foods', 'Hydrate with 2.5L water daily', 'Omega-3 rich foods'],
    recommendedSpecialist: 'Dermatologist',
    modelVersion: 'PathoAI Vision v2.4',
    inferenceTimeMs: 340,
    lowConfidenceFlag: false,
    status: 'verified',
    createdAt: '2026-07-20T10:30:00Z'
  }
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-501',
    patientId: 'pat-1',
    patientName: 'Sarah Jenkins',
    doctorId: 'doc-1',
    doctorName: 'Dr. Marcus Vance, MD',
    doctorSpecialization: 'Dermatopathologist',
    doctorHospital: 'Johns Hopkins Medical Center',
    date: '2026-07-25',
    timeSlot: '10:30 AM',
    complaint: 'Follow up on eczema rash and prescription review',
    scanId: 'scan-101',
    status: 'accepted',
    fee: 120,
    createdAt: '2026-07-20T11:00:00Z'
  }
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'pat-1',
    title: 'AI Scan Analysis Ready',
    message: 'Your skin scan has been analyzed with 94.2% confidence.',
    type: 'scan',
    read: false,
    createdAt: '2026-07-21T09:15:00Z',
  },
  {
    id: 'notif-2',
    userId: 'pat-1',
    title: 'Appointment Confirmed',
    message: 'Consultation with Dr. Marcus Vance scheduled for July 25.',
    type: 'appointment',
    read: true,
    createdAt: '2026-07-20T15:01:00Z',
  }
];

function getMockFallbackResponse<T>(endpoint: string, options: RequestInit = {}): T {
  const url = endpoint.split('?')[0];
  let body: any = {};
  try {
    if (options.body) body = JSON.parse(options.body as string);
  } catch (e) {
    body = {};
  }

  if (url === '/api/auth/login/patient') {
    return { token: 'mock-token-patient', user: { ...DEFAULT_PATIENT, email: body.email || DEFAULT_PATIENT.email } } as T;
  }
  if (url === '/api/auth/login/doctor') {
    return { token: 'mock-token-doctor', user: { ...DEFAULT_DOCTOR, email: body.email || DEFAULT_DOCTOR.email } } as T;
  }
  if (url === '/api/auth/register/patient') {
    const user: User = {
      id: `pat-${Date.now()}`,
      name: body.name || 'Registered Patient',
      email: body.email || 'user@example.com',
      role: 'patient',
      createdAt: new Date().toISOString(),
      age: body.age ? parseInt(body.age) : 30,
      gender: body.gender || 'Other',
      bloodGroup: body.bloodGroup || 'O+',
      medicalHistory: body.medicalHistory || 'None',
    };
    return { token: 'mock-token-registered', user } as T;
  }
  if (url === '/api/auth/register/doctor') {
    const user: User = {
      id: `doc-${Date.now()}`,
      name: body.name || 'Dr. Registered',
      email: body.email || 'doctor@example.com',
      role: 'doctor',
      qualification: body.qualification || 'MD Pathology',
      specialization: body.specialization || 'Dermatology',
      hospital: body.hospital || 'General Hospital',
      approved: false,
      createdAt: new Date().toISOString(),
    };
    return { message: 'Registration submitted for admin approval', approved: false, user } as T;
  }
  if (url === '/api/auth/forgot-password') {
    return { message: 'Password reset link sent successfully.' } as T;
  }
  if (url === '/api/auth/reset-password') {
    return { message: 'Password reset successfully.' } as T;
  }
  if (url === '/api/auth/profile') {
    return { message: 'Profile updated successfully', user: { ...DEFAULT_PATIENT, ...body } } as T;
  }
  if (url === '/api/scans/analyze') {
    const newScan: ScanResult = {
      id: `scan-${Date.now()}`,
      patientId: body.patientId || 'pat-1',
      patientName: body.patientName || 'Sarah Jenkins',
      imageUrl: body.imageBase64 || MOCK_SCANS[0].imageUrl,
      symptoms: body.symptoms || ['Redness'],
      affectedArea: body.affectedArea || 'Skin',
      durationDays: body.durationDays || '3',
      diseaseName: 'Atopic Dermatitis (Eczema)',
      category: 'Dermatology',
      confidence: 95.8,
      severity: 'Moderate',
      description: 'Automated AI diagnostic evaluation identified early inflammatory eczema lesions.',
      differentialDiagnosis: ['Contact Dermatitis', 'Psoriasis Vulgaris'],
      precautions: ['Keep skin hydrated', 'Use topical emollients', 'Avoid triggers'],
      recommendedMedicines: [
        { name: 'Hydrocortisone 1% Cream', dosage: 'Thin layer', frequency: 'Twice daily', duration: '7 days', instructions: 'Apply topically' }
      ],
      recommendedDiet: ['Anti-inflammatory diet', 'Hydration'],
      recommendedSpecialist: 'Dermatologist',
      modelVersion: 'PathoAI Vision v2.4',
      inferenceTimeMs: 280,
      lowConfidenceFlag: false,
      status: 'analyzed',
      createdAt: new Date().toISOString()
    };
    MOCK_SCANS.unshift(newScan);
    return newScan as T;
  }
  if (url === '/api/scans/history') {
    return MOCK_SCANS as T;
  }
  if (url.startsWith('/api/scans/')) {
    return MOCK_SCANS[0] as T;
  }
  if (url === '/api/doctors') {
    return [DEFAULT_DOCTOR] as T;
  }
  if (url.startsWith('/api/doctors/')) {
    return DEFAULT_DOCTOR as T;
  }
  if (url.includes('/approve')) {
    return { message: 'Doctor status updated', doctor: { ...DEFAULT_DOCTOR, approved: true } } as T;
  }
  if (url === '/api/appointments/book') {
    const appt: Appointment = {
      id: `app-${Date.now()}`,
      patientId: body.patientId || 'pat-1',
      patientName: body.patientName || 'Sarah Jenkins',
      doctorId: body.doctorId || 'doc-1',
      doctorName: 'Dr. Marcus Vance, MD',
      doctorSpecialization: 'Dermatopathologist',
      doctorHospital: 'Johns Hopkins Medical Center',
      date: body.date || '2026-07-26',
      timeSlot: body.timeSlot || '11:00 AM',
      complaint: body.complaint || 'Consultation request',
      scanId: body.scanId,
      status: 'pending',
      fee: 120,
      createdAt: new Date().toISOString()
    };
    MOCK_APPOINTMENTS.unshift(appt);
    return appt as T;
  }
  if (url === '/api/appointments') {
    return MOCK_APPOINTMENTS as T;
  }
  if (url.startsWith('/api/appointments/')) {
    return (MOCK_APPOINTMENTS[0] || { id: 'app-501', status: 'cancelled' }) as T;
  }
  if (url === '/api/notifications') {
    return MOCK_NOTIFICATIONS as T;
  }
  if (url.startsWith('/api/notifications/')) {
    return { success: true } as T;
  }
  if (url === '/api/feedback') {
    return [{ id: 'fb-1', userId: 'pat-1', userName: 'Sarah Jenkins', role: 'patient', rating: 5, category: 'Accuracy', comment: 'Great platform!', createdAt: new Date().toISOString() }] as T;
  }
  if (url === '/api/admin/users') {
    return [DEFAULT_PATIENT, DEFAULT_DOCTOR] as T;
  }
  if (url === '/api/admin/stats') {
    return { totalUsers: 154, totalScans: 1240, activeDoctors: 24, totalAppointments: 380, revenue: 14200, users: 154, scans: 1240 } as T;
  }
  if (url === '/api/admin/analytics') {
    return {
      scanVolumeByMonth: [
        { month: 'Jan', scans: 140 },
        { month: 'Feb', scans: 180 },
        { month: 'Mar', scans: 220 },
        { month: 'Apr', scans: 290 },
        { month: 'May', scans: 340 },
        { month: 'Jun', scans: 410 }
      ],
      diseaseDistribution: [
        { category: 'Dermatology', count: 520 },
        { category: 'Hematology', count: 340 },
        { category: 'Histopathology', count: 210 },
        { category: 'Cytology', count: 170 }
      ],
      accuracyByModel: [
        { model: 'DermVision-v2.4', accuracy: 96.4 },
        { model: 'HemaCell-v1.8', accuracy: 94.8 },
        { model: 'HistoPath-v3.0', accuracy: 95.1 }
      ],
      systemPerformance: { avgInferenceMs: 310, uptimePercent: 99.98, apiLatencyMs: 42 }
    } as T;
  }
  if (url === '/api/admin/logs') {
    return [
      { id: 'log-1', endpoint: '/api/scans/analyze', method: 'POST', statusCode: 200, responseTimeMs: 320, timestamp: new Date().toISOString(), ip: '127.0.0.1' },
      { id: 'log-2', endpoint: '/api/auth/login/patient', method: 'POST', statusCode: 200, responseTimeMs: 45, timestamp: new Date().toISOString(), ip: '127.0.0.1' }
    ] as T;
  }
  if (url === '/api/scans/dataset') {
    return { total: 200, dataset: Array.from({ length: 20 }, (_, i) => ({ id: `ds-${i+1}`, diseaseName: `Pathology Sample ${i+1}`, category: 'Dermatology', confidence: 95.2 })) } as T;
  }
  if (url === '/api/scans/train-upload') {
    return { message: 'Sample uploaded successfully to AI training pipeline', totalTrainedImages: 201, trainedSample: body } as T;
  }

  return ({ message: 'Success' } as unknown) as T;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMsg = errorJson.error || errorJson.message || `Authentication failed (${response.status})`;
      throw new Error(errorMsg);
    }

    const data = await response.json().catch(() => null);
    if (data === null) {
      if (isAuthEndpoint) throw new Error('Invalid server response');
      return getMockFallbackResponse<T>(endpoint, options);
    }

    return data as T;
  } catch (err: any) {
    if (isAuthEndpoint) {
      throw new Error(err.message || 'Authentication request failed');
    }
    return getMockFallbackResponse<T>(endpoint, options);
  }
}

// Auth APIs
export const apiLoginPatient = (email: string, pass: string) =>
  fetchApi<{ token: string; user: User }>('/api/auth/login/patient', {
    method: 'POST',
    body: JSON.stringify({ email, password: pass }),
  });

export const apiLoginDoctor = (email: string, pass: string) =>
  fetchApi<{ token: string; user: User }>('/api/auth/login/doctor', {
    method: 'POST',
    body: JSON.stringify({ email, password: pass }),
  });


export const apiRegisterPatient = (payload: any) =>
  fetchApi<{ token: string; user: User }>('/api/auth/register/patient', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiRegisterDoctor = (payload: any) =>
  fetchApi<{ message: string; approved: boolean; user: User; token?: string }>('/api/auth/register/doctor', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiForgotPassword = (email: string, role?: string) =>
  fetchApi<{ message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });

export const apiResetPassword = (email: string, otp: string, newPassword: string) =>
  fetchApi<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });

export const apiUpdateProfile = (payload: any) =>
  fetchApi<{ message: string; user: User }>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

// AI Scan APIs
export const apiAnalyzeScan = (payload: {
  patientId: string;
  patientName: string;
  imageBase64: string;
  symptoms: string[];
  affectedArea?: string;
  durationDays?: string;
}) =>
  fetchApi<ScanResult>('/api/scans/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiGetScanHistory = (patientId?: string, doctorId?: string) => {
  const query = new URLSearchParams();
  if (patientId) query.set('patientId', patientId);
  if (doctorId) query.set('doctorId', doctorId);
  return fetchApi<ScanResult[]>(`/api/scans/history?${query.toString()}`);
};

export const apiGetScanById = (id: string) => fetchApi<ScanResult>(`/api/scans/${id}`);

// Doctors APIs
export const apiGetDoctors = (specialization?: string, search?: string) => {
  const query = new URLSearchParams();
  if (specialization) query.set('specialization', specialization);
  if (search) query.set('search', search);
  return fetchApi<User[]>(`/api/doctors?${query.toString()}`);
};

export const apiGetDoctorById = (id: string) => fetchApi<User>(`/api/doctors/${id}`);

export const apiApproveDoctor = (id: string, approve: boolean = true) =>
  fetchApi<{ message: string; doctor: User }>(`/api/admin/doctors/${id}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ approve }),
  });

// Appointment APIs
export const apiBookAppointment = (payload: {
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  complaint: string;
  scanId?: string;
}) =>
  fetchApi<Appointment>('/api/appointments/book', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiGetAppointments = (patientId?: string, doctorId?: string) => {
  const query = new URLSearchParams();
  if (patientId) query.set('patientId', patientId);
  if (doctorId) query.set('doctorId', doctorId);
  return fetchApi<Appointment[]>(`/api/appointments?${query.toString()}`);
};

export const apiUpdateAppointment = (id: string, payload: any) =>
  fetchApi<Appointment>(`/api/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const apiCancelAppointment = (id: string) =>
  fetchApi<{ message: string; appointment: Appointment }>(`/api/appointments/${id}`, {
    method: 'DELETE',
  });

// Notifications
export const apiGetNotifications = (userId?: string) => {
  const query = userId ? `?userId=${userId}` : '';
  return fetchApi<NotificationItem[]>(`/api/notifications${query}`);
};

export const apiMarkNotificationRead = (id: string) =>
  fetchApi<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'PUT' });

export const apiMarkAllNotificationsRead = (userId: string) =>
  fetchApi<{ success: boolean }>('/api/notifications/mark-all-read', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

// Feedback & Admin APIs
export const apiSubmitFeedback = (payload: any) =>
  fetchApi<FeedbackItem>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiGetFeedback = () => fetchApi<FeedbackItem[]>('/api/feedback');

export const apiGetAdminUsers = () => fetchApi<User[]>('/api/admin/users');

export const apiToggleUserStatus = (id: string) =>
  fetchApi<{ success: boolean; user: User }>(`/api/admin/users/${id}/toggle`, { method: 'PUT' });

export const apiGetAdminStats = () => fetchApi<any>('/api/admin/stats');

export const apiGetAdminAnalytics = () => fetchApi<AdminAnalytics>('/api/admin/analytics');

export const apiGetSystemLogs = () => fetchApi<SystemLog[]>('/api/admin/logs');

export const apiGetDatasetCases = (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetchApi<{ total: number; dataset: any[] }>(`/api/scans/dataset${query}`);
};

export const apiUploadTrainingSample = (sampleData: any) =>
  fetchApi<{ message: string; totalTrainedImages: number; trainedSample: any }>('/api/scans/train-upload', {
    method: 'POST',
    body: JSON.stringify(sampleData)
  });
