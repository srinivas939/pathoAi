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

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If endpoint is relative, prepend the API_BASE_URL
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}: Request failed`);
  }

  return data as T;
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

export const apiLoginAdmin = (email: string, pass: string) =>
  fetchApi<{ token: string; user: User }>('/api/auth/login/admin', {
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


