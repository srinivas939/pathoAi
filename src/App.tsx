import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { AdaptiveNavigation } from './components/common/AdaptiveNavigation';
import { DeviceFrame } from './components/common/DeviceFrame';

// Import Screens
import {
  SplashScreen,
  OnboardingScreen,
  RoleSelectScreen,
  LoginPatientScreen,
  LoginDoctorScreen,
  LoginAdminScreen,
  RegisterPatientScreen,
  RegisterDoctorScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  EmailVerifyScreen
} from './components/screens/AuthScreens';

import {
  PatientDashboardScreen,
  ProfileScreen
} from './components/screens/PatientScreens';

import {
  ScanUploadScreen,
  PredictionLoadingScreen,
  PredictionResultScreen,
  ScanHistoryScreen,
  ScanDetailScreen
} from './components/screens/ScanModuleScreens';

import {
  DoctorDashboardScreen,
  DoctorDirectoryScreen,
  DoctorDetailScreen,
  AppointmentBookingScreen,
  AppointmentListScreen,
  DoctorQueueScreen,
  PrescriptionEditorScreen
} from './components/screens/DoctorModuleScreens';

import {
  AdminDashboardScreen,
  AdminUserManagementScreen,
  AdminDoctorApprovalQueueScreen,
  AdminAnalyticsDashboardScreen,
  AdminSystemLogsAndFeedbackScreen
} from './components/screens/AdminScreens';

import { NotificationCenterScreen } from './components/screens/UtilityScreens';

const AppContent: React.FC = () => {
  const { currentScreen, isMobileFrame, setIsMobileFrame } = useAuth();

  const renderScreen = () => {
    switch (currentScreen) {
      // Auth Flow Screens (1-11)
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'role_select':
        return <RoleSelectScreen />;
      case 'login_patient':
        return <LoginPatientScreen />;
      case 'login_doctor':
        return <LoginDoctorScreen />;
      case 'login_admin':
        return <LoginAdminScreen />;
      case 'register_patient':
        return <RegisterPatientScreen />;
      case 'register_doctor':
        return <RegisterDoctorScreen />;
      case 'forgot_password':
        return <ForgotPasswordScreen />;
      case 'reset_password':
        return <ResetPasswordScreen />;
      case 'email_verify':
        return <EmailVerifyScreen />;

      // Patient Screens (12, 15, 16)
      case 'patient_dashboard':
        return <PatientDashboardScreen />;
      case 'profile':
      case 'profile_edit':
        return <ProfileScreen />;

      // Scan Module Screens (17-22)
      case 'scan_upload':
      case 'symptom_entry':
        return <ScanUploadScreen />;
      case 'prediction_loading':
        return <PredictionLoadingScreen />;
      case 'prediction_result':
        return <PredictionResultScreen />;
      case 'scan_history':
        return <ScanHistoryScreen />;
      case 'scan_detail':
        return <ScanDetailScreen />;

      // Doctor & Appointment Module Screens (13, 23-29)
      case 'doctor_dashboard':
        return <DoctorDashboardScreen />;
      case 'doctor_directory':
        return <DoctorDirectoryScreen />;
      case 'doctor_detail':
        return <DoctorDetailScreen />;
      case 'appointment_booking':
        return <AppointmentBookingScreen />;
      case 'appointment_list':
      case 'appointment_detail':
        return <AppointmentListScreen />;
      case 'doctor_queue':
        return <DoctorQueueScreen />;
      case 'prescription_editor':
        return <PrescriptionEditorScreen />;

      // Admin Screens (14, 32-35)
      case 'admin_dashboard':
        return <AdminDashboardScreen />;
      case 'admin_users':
        return <AdminUserManagementScreen />;
      case 'admin_doctor_approvals':
        return <AdminDoctorApprovalQueueScreen />;
      case 'admin_analytics':
        return <AdminAnalyticsDashboardScreen />;
      case 'admin_logs':
        return <AdminSystemLogsAndFeedbackScreen />;

      // Utility Screens (30-31)
      case 'notification_center':
        return <NotificationCenterScreen />;

      default:
        return <PatientDashboardScreen />;
    }
  };

  const isAuthScreen = [
    'splash', 'onboarding', 'role_select', 'login_patient',
    'login_doctor', 'login_admin', 'register_patient',
    'register_doctor', 'forgot_password', 'reset_password', 'email_verify'
  ].includes(currentScreen);

  return (
    <DeviceFrame isMobileFrame={isMobileFrame} onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
        {!isAuthScreen && <Header />}

        <div className="flex-1 flex overflow-hidden">
          {!isAuthScreen && <AdaptiveNavigation />}

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderScreen()}
            </div>
          </main>
        </div>
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
