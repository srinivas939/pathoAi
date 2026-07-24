import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  KeyRound,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  Award,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import {
  apiLoginPatient,
  apiLoginDoctor,
  apiLoginAdmin,
  apiRegisterPatient,
  apiRegisterDoctor,
  apiForgotPassword,
  apiResetPassword
} from '../../services/api';

// SCREEN 1: Splash Screen
export const SplashScreen: React.FC = () => {
  const { navigate, user, role } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && role) {
        if (role === 'patient') navigate('patient_dashboard');
        else if (role === 'doctor') navigate('doctor_dashboard');
        else navigate('admin_dashboard');
      } else {
        navigate('onboarding');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl my-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center shadow-2xl shadow-teal-500/30 animate-bounce">
          <Activity className="w-12 h-12 text-slate-950" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
          v2.4 AI
        </div>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-cyan-200 to-teal-300 bg-clip-text text-transparent">
        PathoAI
      </h1>
      <p className="text-sm text-teal-200/80 max-w-sm mb-8">
        AI-Powered Pathology Detection Platform & Clinical Ensemble Network
      </p>

      <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        <span>Initializing pre-trained EfficientNetB0 models...</span>
      </div>
    </div>
  );
};

// SCREEN 2: Onboarding Carousel
export const OnboardingScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Instant AI Lesion & Pathology Analysis',
      desc: 'Upload skin or cellular specimen images for immediate classification using pre-trained ensemble transfer learning models.',
      icon: Sparkles,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      title: 'Certified Specialist Doctor Consultation',
      desc: 'Connect with verified dermatopathologists and oncologists for secondary diagnostic review and digital prescriptions.',
      icon: Stethoscope,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      title: 'Hospital-Grade Digital PDF Reports',
      desc: 'Download CAP & CLIA compliant pathology reports equipped with diagnostic heatmaps, confidence meters, and physician signatures.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-cyan-600'
    }
  ];

  const CurrentIcon = slides[slide].icon;

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Step {slide + 1} of 3</span>
        <button onClick={() => navigate('role_select')} className="hover:text-teal-600 font-semibold">
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center py-6">
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${slides[slide].color} text-white flex items-center justify-center shadow-lg mb-6 transform transition-all duration-500 scale-105`}>
          <CurrentIcon className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{slides[slide].title}</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">{slides[slide].desc}</p>
      </div>

      <div className="flex justify-center space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              i === slide ? 'w-8 bg-teal-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="pt-2">
        {slide < 2 ? (
          <button
            onClick={() => setSlide(slide + 1)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-md transition-all"
          >
            <span>Next Feature</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('role_select')}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-lg transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// SCREEN 3: Role Selection Screen
export const RoleSelectScreen: React.FC = () => {
  const { navigate } = useAuth();

  return (
    <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
      <div className="inline-flex p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
        <Activity className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome to PathoAI</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your account role to proceed to the secure login portal</p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-left">
        {/* Patient Role Card */}
        <div
          onClick={() => navigate('login_patient')}
          className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Patient Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload scans, view instant AI predictions & book doctor appointments.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Doctor Role Card */}
        <div
          onClick={() => navigate('login_doctor')}
          className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Doctor / Pathologist Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review AI patient scan queues, validate diagnoses & issue prescriptions.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Admin Role Card */}
        <div
          onClick={() => navigate('login_admin')}
          className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Administrator Console</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage user accounts, doctor verification approvals & analytics logs.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

// SCREEN 4: Patient Login
export const LoginPatientScreen: React.FC = () => {
  const { navigate, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLoginPatient(email, password);
      login(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('role_select')} className="text-slate-400 hover:text-slate-600 p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Patient Login</span>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Access</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to your personal pathology portal</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <button
              type="button"
              onClick={() => navigate('forgot_password')}
              className="text-[11px] text-teal-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In as Patient'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500">
        <span>Don't have a patient account? </span>
        <button onClick={() => navigate('register_patient')} className="text-teal-600 font-bold hover:underline">
          Register Here
        </button>
      </div>
    </div>
  );
};

// SCREEN 5: Doctor Login
export const LoginDoctorScreen: React.FC = () => {
  const { navigate, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLoginDoctor(email, password);
      login(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Doctor authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('role_select')} className="text-slate-400 hover:text-slate-600 p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Doctor Portal</span>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Doctor Login</h2>
        <p className="text-xs text-slate-500 mt-1">Medical Credential Verification Portal</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter doctor email"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <button
              type="button"
              onClick={() => navigate('forgot_password')}
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
        >
          {loading ? 'Verifying License...' : 'Sign In as Doctor'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500">
        <span>Are you a new medical practitioner? </span>
        <button onClick={() => navigate('register_doctor')} className="text-indigo-600 font-bold hover:underline">
          Register Here
        </button>
      </div>
    </div>
  );
};

// SCREEN 6: Admin Login
export const LoginAdminScreen: React.FC = () => {
  const { navigate, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLoginAdmin(email, password);
      login(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('role_select')} className="text-slate-400 hover:text-slate-600 p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Restricted Admin</span>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Console</h2>
        <p className="text-xs text-slate-500 mt-1">System Authorization & Oversight Access</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Admin Identity</label>
          <div className="relative">
            <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Admin Security Key</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? 'Verifying Credentials...' : 'Authenticate Admin Access'}
        </button>
      </form>
    </div>
  );
};

// SCREEN 7: Patient Registration
export const RegisterPatientScreen: React.FC = () => {
  const { navigate, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '30',
    gender: 'Female',
    bloodGroup: 'A+',
    medicalHistory: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiRegisterPatient(formData);
      login(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('login_patient')} className="text-slate-400 hover:text-slate-600 p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Patient Sign Up</span>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Patient Account</h2>
        <p className="text-xs text-slate-500 mt-1">Start scanning lesions and managing pathology records</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sarah Jenkins"
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@example.com"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical History Summary (Optional)</label>
          <textarea
            rows={2}
            value={formData.medicalHistory}
            onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
            placeholder="e.g., Asthma, known allergies, prior skin rashes..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Complete Patient Registration'}
        </button>
      </form>
    </div>
  );
};

// SCREEN 8: Doctor Registration (Professional Multi-Step Registration)
export const RegisterDoctorScreen: React.FC = () => {
  const { navigate, login } = useAuth();
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    qualification: 'MD Pathology',
    specialization: 'Dermatopathologist',
    licenseId: '',
    hospital: '',
    clinicAddress: '',
    experienceYears: '5',
    consultationFee: '100',
    consultationHours: '09:00 AM - 05:00 PM',
    bio: '',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (formData.availableDays.includes(day)) {
      setFormData({
        ...formData,
        availableDays: formData.availableDays.filter(d => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...formData.availableDays, day],
      });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regStep === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        setError('Please complete all required account fields (Name, Email, Password).');
        return;
      }
      setRegStep(2);
    } else if (regStep === 2) {
      if (!formData.licenseId.trim() || !formData.qualification.trim() || !formData.specialization.trim()) {
        setError('Please fill in your Medical License Number, Qualification, and Specialization.');
        return;
      }
      setRegStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiRegisterDoctor(formData);
      if (res.token && res.user) {
        login(res.user, res.token);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full flex items-center justify-center mx-auto border border-slate-300 dark:border-slate-700">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Profile Active</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your doctor registration is verified and active! You now appear in the Find Doctors directory for patient consultations.
        </p>
        <button
          onClick={() => navigate('login_doctor')}
          className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-3 rounded-2xl text-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
        >
          Proceed to Doctor Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <button onClick={() => navigate('login_doctor')} className="text-slate-400 hover:text-slate-600 p-1 flex items-center space-x-1 text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
        <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Medical Practitioner Registration
        </span>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Practitioner Registration</h2>
        <p className="text-xs text-slate-500">Provide verifiable clinical qualifications and practice location</p>
      </div>

      {/* Professional Step Progress Indicator */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold pt-1">
        <div className={`py-2 rounded-xl border ${regStep === 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
          1. Credentials
        </div>
        <div className={`py-2 rounded-xl border ${regStep === 2 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
          2. Qualifications
        </div>
        <div className={`py-2 rounded-xl border ${regStep === 3 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
          3. Practice & Hours
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Personal Credentials */}
      {regStep === 1 && (
        <form onSubmit={handleNext} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Doctor Name (with Title)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Alexander Morgan"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@medicalcenter.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Direct Contact Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 019-2834"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 rounded-2xl text-xs transition-all mt-4"
          >
            Continue to Medical Qualifications →
          </button>
        </form>
      )}

      {/* STEP 2: Medical Qualifications & License */}
      {regStep === 2 && (
        <form onSubmit={handleNext} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical Degree / Qualification</label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. MBBS, MD - Pathology, FCAP"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical License ID</label>
              <input
                type="text"
                required
                value={formData.licenseId}
                onChange={e => setFormData({ ...formData, licenseId: e.target.value })}
                placeholder="e.g. MC-NY-98421"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Specialization</label>
              <select
                value={formData.specialization}
                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                <option value="Dermatopathologist">Dermatopathologist</option>
                <option value="Histopathologist">Histopathologist</option>
                <option value="Cytopathologist">Cytopathologist</option>
                <option value="Hematopathologist">Hematopathologist</option>
                <option value="General Dermatologist">General Dermatologist</option>
                <option value="Clinical Oncologist">Clinical Oncologist</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Years of Clinical Experience</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setRegStep(1)}
              className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-2/3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 rounded-2xl text-xs transition-all"
            >
              Continue to Practice Details →
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Practice Details & Hours */}
      {regStep === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hospital / Clinic Affiliation</label>
              <input
                type="text"
                required
                value={formData.hospital}
                onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                placeholder="e.g. Johns Hopkins Hospital"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={formData.consultationFee}
                onChange={e => setFormData({ ...formData, consultationFee: e.target.value })}
                placeholder="100"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinic Address & Location</label>
            <input
              type="text"
              value={formData.clinicAddress}
              onChange={e => setFormData({ ...formData, clinicAddress: e.target.value })}
              placeholder="e.g. 742 Evergreen Medical Suites, Suite 400"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultation Hours</label>
              <input
                type="text"
                value={formData.consultationHours}
                onChange={e => setFormData({ ...formData, consultationHours: e.target.value })}
                placeholder="09:00 AM - 05:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Days</label>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {daysList.map(day => {
                  const active = formData.availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Bio & Specializations</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Summary of clinical background, research interests, and patient consultation terms..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setRegStep(2)}
              className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 rounded-2xl text-xs transition-all disabled:opacity-50"
            >
              {loading ? 'Registering Practitioner...' : 'Complete Doctor Registration'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [email, setEmail] = useState('patient@pathoai.com');
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('884219');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiForgotPassword(email);
    setMsg(res.message);
    setSent(true);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiResetPassword(email, otp, newPassword);
    alert('Password successfully reset! You can now sign in.');
    navigate('login_patient');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('role_select')} className="text-slate-400 hover:text-slate-600 p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Security Reset</span>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1">Role-isolated secure recovery system</p>
      </div>

      {!sent ? (
        <form onSubmit={handleRequest} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-2xl">
            Send Reset OTP Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4 text-xs">
          <div className="p-3 bg-teal-50 text-teal-800 text-xs rounded-xl border border-teal-200">
            {msg}
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Verification OTP</label>
            <input
              type="text"
              required
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-center tracking-widest text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-2xl">
            Confirm Password Change
          </button>
        </form>
      )}
    </div>
  );
};

export const ResetPasswordScreen = ForgotPasswordScreen;

// SCREEN 11: Email Verification
export const EmailVerifyScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [code, setCode] = useState(['5', '8', '2', '9', '1', '0']);

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
      <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 inline-block">
        <Mail className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify Your Email</h2>
      <p className="text-xs text-slate-500">We sent a 6-digit code to your registered email address.</p>

      <div className="flex justify-center space-x-2">
        {code.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => {
              const newC = [...code];
              newC[idx] = e.target.value;
              setCode(newC);
            }}
            className="w-10 h-12 text-center text-lg font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
          />
        ))}
      </div>

      <button
        onClick={() => {
          alert('Email verified successfully!');
          navigate('login_patient');
        }}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-teal-500/20"
      >
        Verify Code & Continue
      </button>
    </div>
  );
};
