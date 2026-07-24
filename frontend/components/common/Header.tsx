import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Bell,
  Sun,
  Moon,
  Smartphone,
  Globe,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    role,
    currentScreen,
    navigate,
    logout,
    isDarkMode,
    toggleDarkMode,
    viewMode,
    setViewMode,
    unreadNotifsCount,
  } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(role === 'patient' ? 'patient_dashboard' : role === 'doctor' ? 'doctor_dashboard' : role === 'admin' ? 'admin_dashboard' : 'role_select')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-600 dark:from-white dark:via-cyan-300 dark:to-teal-400 bg-clip-text text-transparent">
                PathoAI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                v2.4 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              AI-Powered Diagnostic Pathology Platform
            </p>
          </div>
        </div>

        {/* E2E Reports Links */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <a
            href="reports/latest/execution-report.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-300 transition-all"
            title="Open HTML E2E Test Report"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>HTML Report</span>
          </a>
          <a
            href="reports/latest/selenium-report.xlsx"
            download
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-300 transition-all"
            title="Download Excel E2E Test Report"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel Report</span>
          </a>
        </div>

        {/* Target Platform Switcher (Flutter Web <-> Android Mobile) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('web')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'web'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
            title="Switch to Web View (Responsive Desktop/Tablet)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Flutter Web</span>
          </button>
          <button
            onClick={() => setViewMode('android')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'android'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
            title="Switch to Android Phone View Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Android Frame</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick AI Scan Action Button */}
          {role === 'patient' && (
            <button
              onClick={() => navigate('scan_upload')}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-sm transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">New AI Scan</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Dropdown Button */}
          {user && (
            <button
              onClick={() => navigate('notifications')}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Notification Center"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'UI'}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:inline">
                  {user.name.split(' ')[0]}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                  user.role === 'doctor' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' :
                  'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300'
                }`}>
                  {user.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setShowProfileMenu(false); navigate('profile'); }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <span>View Profile</span>
                    </button>

                    {role === 'patient' && (
                      <>
                        <button
                          onClick={() => { setShowProfileMenu(false); navigate('scan_history'); }}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <FileText className="w-4 h-4 text-cyan-600" />
                          <span>My Pathology Scans</span>
                        </button>
                        <button
                          onClick={() => { setShowProfileMenu(false); navigate('appointment_list'); }}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span>My Appointments</span>
                        </button>
                      </>
                    )}

                    {role === 'doctor' && (
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate('doctor_queue'); }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span>Patient Scan Review Queue</span>
                      </button>
                    )}

                    {role === 'admin' && (
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate('admin_analytics'); }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Admin Console</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('role_select')}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
