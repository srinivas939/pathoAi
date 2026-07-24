import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Sparkles,
  FileText,
  Calendar,
  Users,
  Search,
  Bell,
  BarChart3,
  UserCheck,
  ShieldAlert,
  Sliders,
  HelpCircle,
  Activity,
  PlusCircle,
  FileCheck
} from 'lucide-react';

export const AdaptiveNavigation: React.FC = () => {
  const { role, currentScreen, navigate, unreadNotifsCount } = useAuth();

  if (!role) return null;

  // Nav items per role
  const getNavItems = () => {
    if (role === 'patient') {
      return [
        { id: 'patient_dashboard', label: 'Home', icon: Home },
        { id: 'scan_upload', label: 'AI Scan', icon: Sparkles, highlight: true },
        { id: 'scan_history', label: 'Past Scans', icon: FileText },
        { id: 'doctor_directory', label: 'Find Doctors', icon: Search },
        { id: 'appointment_list', label: 'Appointments', icon: Calendar },
        { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotifsCount },
      ];
    } else if (role === 'doctor') {
      return [
        { id: 'doctor_dashboard', label: 'Dashboard', icon: Home },
        { id: 'doctor_queue', label: 'Patient Queue', icon: UserCheck, badge: 2 },
        { id: 'appointment_list', label: 'Appointments', icon: Calendar },
        { id: 'scan_history', label: 'Scans Directory', icon: FileText },
        { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotifsCount },
      ];
    } else {
      // Admin
      return [
        { id: 'admin_dashboard', label: 'Overview', icon: Home },
        { id: 'admin_users', label: 'Users', icon: Users },
        { id: 'admin_doctor_approval', label: 'Approvals', icon: UserCheck, badge: 1 },
        { id: 'admin_analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'admin_logs', label: 'System Logs', icon: Activity },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Desktop Web Side Rail (Hidden on small screens) */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4 justify-between">
        <div className="space-y-6">
          
          {/* Navigation Group Header */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
              {role} portal
            </p>
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20'
                        : item.highlight
                        ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-teal-600' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Special Quick Actions Box */}
          <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 dark:from-slate-800 dark:via-teal-950/30 dark:to-slate-800 rounded-2xl p-3.5 border border-teal-100 dark:border-teal-900/50">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                AI Accuracy 94.6%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              EfficientNetB0 ensemble pre-trained model fine-tuned for transfer learning.
            </p>
            <button
              onClick={() => navigate(role === 'patient' ? 'scan_upload' : 'doctor_directory')}
              className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold py-2 rounded-xl transition-all shadow-sm"
            >
              {role === 'patient' ? 'Start Instant Scan' : 'Browse Directory'}
            </button>
          </div>

        </div>

        {/* Footer info in rail */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>PathoAI Engine</span>
            <span className="text-teal-600 dark:text-teal-400 font-mono font-semibold">Ready</span>
          </div>
        </div>
      </aside>

      {/* Mobile / Android Bottom Navigation Bar (Visible on mobile screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id as any)}
              className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
              {item.badge ? (
                <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </>
  );
};
