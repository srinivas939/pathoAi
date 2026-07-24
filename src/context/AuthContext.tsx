import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, ScreenId, ScanResult, Appointment } from '../types';
import { apiGetNotifications, apiMarkAllNotificationsRead } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  currentScreen: ScreenId;
  screenHistory: ScreenId[];
  activeScan: ScanResult | null;
  activeDoctorId: string | null;
  activeScanId: string | null;
  activeAppointmentId: string | null;
  isDarkMode: boolean;
  viewMode: 'web' | 'android';
  unreadNotifsCount: number;
  
  // Navigation
  navigate: (screen: ScreenId, params?: { scanId?: string; doctorId?: string; appointmentId?: string }) => void;
  goBack: () => void;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setActiveScan: (scan: ScanResult | null) => void;
  toggleDarkMode: () => void;
  setViewMode: (mode: 'web' | 'android') => void;
  refreshNotifications: () => void;
  clearAllNotifs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default pre-seeded logged-in user as Patient Sarah Jenkins for instant smooth experience
  const defaultPatientUser: User = {
    id: 'pat-1',
    name: 'Sarah Jenkins',
    email: 'patient@pathoai.com',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-15T10:00:00Z',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    medicalHistory: 'Mild eczema in childhood. No known drug allergies.',
  };

  const [user, setUser] = useState<User | null>(defaultPatientUser);
  const [role, setRole] = useState<Role | null>('patient');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('patient_dashboard');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['splash', 'patient_dashboard']);
  
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>('doc-1');
  const [activeScanId, setActiveScanId] = useState<string | null>('scan-101');
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>('app-501');
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'web' | 'android'>('web');
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(2);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const navigate = (screen: ScreenId, params?: { scanId?: string; doctorId?: string; appointmentId?: string }) => {
    if (params?.scanId) setActiveScanId(params.scanId);
    if (params?.doctorId) setActiveDoctorId(params.doctorId);
    if (params?.appointmentId) setActiveAppointmentId(params.appointmentId);

    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      // Default screen by role
      if (role === 'patient') setCurrentScreen('patient_dashboard');
      else if (role === 'doctor') setCurrentScreen('doctor_dashboard');
      else if (role === 'admin') setCurrentScreen('admin_dashboard');
      else setCurrentScreen('role_select');
    }
  };

  const login = (newUser: User, _token: string) => {
    setUser(newUser);
    setRole(newUser.role);
    
    // Navigate to role dashboard
    if (newUser.role === 'patient') {
      navigate('patient_dashboard');
    } else if (newUser.role === 'doctor') {
      navigate('doctor_dashboard');
    } else if (newUser.role === 'admin') {
      navigate('admin_dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setCurrentScreen('role_select');
    setScreenHistory(['role_select']);
  };

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const notifs = await apiGetNotifications(user.id);
      const unread = notifs.filter(n => !n.read).length;
      setUnreadNotifsCount(unread);
    } catch (e) {
      // quiet catch
    }
  };

  const clearAllNotifs = async () => {
    if (!user) return;
    try {
      await apiMarkAllNotificationsRead(user.id);
      setUnreadNotifsCount(0);
    } catch (e) {
      setUnreadNotifsCount(0);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        currentScreen,
        screenHistory,
        activeScan,
        activeDoctorId,
        activeScanId,
        activeAppointmentId,
        isDarkMode,
        viewMode,
        unreadNotifsCount,
        navigate,
        goBack,
        login,
        logout,
        setActiveScan,
        toggleDarkMode,
        setViewMode,
        refreshNotifications,
        clearAllNotifs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
