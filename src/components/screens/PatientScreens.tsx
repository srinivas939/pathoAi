import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  FileText,
  Calendar,
  Activity,
  User,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  Stethoscope,
  Heart,
  Edit3,
  Save,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { apiGetScanHistory, apiGetAppointments, apiUpdateProfile } from '../../services/api';
import { ScanResult, Appointment } from '../../types';

// SCREEN 12: Patient Dashboard
export const PatientDashboardScreen: React.FC = () => {
  const { user, navigate } = useAuth();
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [scansData, apptsData] = await Promise.all([
          apiGetScanHistory(user?.id),
          apiGetAppointments(user?.id)
        ]);
        setRecentScans(scansData);
        setAppointments(apptsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-900/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-500/30 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PathoAI Active Diagnostics Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your personal pathology AI assistant is ready. Capture skin lesions, dermal specs, or cellular pathology for instant classification.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('scan_upload')}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-teal-500/30 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start New AI Pathology Scan</span>
            </button>

            <button
              onClick={() => navigate('doctor_directory')}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-700 transition-all"
            >
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>Consult Pathologist</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Health Vitals Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Scans</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{recentScans.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Appointments</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{appointments.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{user?.bloodGroup || 'A+'}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{user?.age || 34} / {user?.gender?.[0] || 'F'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Pathology Scans & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Recent Scans List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Pathology Scans</h2>
            </div>
            <button
              onClick={() => navigate('scan_history')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading scan history...</div>
          ) : recentScans.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No scan analysis records found yet.</p>
              <button
                onClick={() => navigate('scan_upload')}
                className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Perform First AI Scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.slice(0, 3).map(scan => (
                <div
                  key={scan.id}
                  onClick={() => navigate('scan_detail', { scanId: scan.id })}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 shadow-sm transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                          {scan.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          scan.severity === 'Severe' || scan.severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {scan.severity}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                        {scan.diseaseName}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Confidence: <span className="font-bold text-slate-800 dark:text-slate-200">{scan.confidence}%</span> • {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="hidden sm:inline text-xs text-teal-600 dark:text-teal-400 font-medium group-hover:underline">
                      View Report
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Upcoming Appointments Widget & Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Visits</h2>
            </div>
            <button
              onClick={() => navigate('appointment_list')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              All
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500">No consultations booked.</p>
              <button
                onClick={() => navigate('doctor_directory')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                Find a Pathologist
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 2).map(app => (
                <div key={app.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{app.doctorName}</h4>
                      <p className="text-[11px] text-slate-500">{app.doctorSpecialization}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-indigo-600">{app.date}</span>
                    <span>•</span>
                    <span>{app.timeSlot}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pathology Medical Guidelines Reminder Card */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Medical Safety Notice</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              PathoAI uses validated transfer-learning models (≥94.2% accuracy). Results with confidence &lt;70% are automatically flagged for doctor review.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

// SCREEN 15 & 16: Profile View & Edit Screen
export const ProfileScreen: React.FC = () => {
  const { user, navigate, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age?.toString() || '30',
    gender: user?.gender || 'Female',
    bloodGroup: user?.bloodGroup || 'A+',
    medicalHistory: user?.medicalHistory || '',
    specialization: user?.specialization || '',
    hospital: user?.hospital || '',
    consultationFee: user?.consultationFee ? String(user.consultationFee) : '100',
    licenseId: user?.licenseId || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        age: user.age ? String(user.age) : '30',
        gender: user.gender || 'Female',
        bloodGroup: user.bloodGroup || 'A+',
        medicalHistory: user.medicalHistory || '',
        specialization: user.specialization || '',
        hospital: user.hospital || '',
        consultationFee: user.consultationFee ? String(user.consultationFee) : '100',
        licenseId: user.licenseId || '',
        bio: user.bio || '',
      });
    }
  }, [user]);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiUpdateProfile({
        userId: user?.id,
        ...formData,
      });
      login(res.user, 'jwt_token');
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (e: any) {
      alert(e.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header Avatar Section */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-500/20"
            />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                {user?.role} Portal User
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Info or Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{user?.phone || 'Not provided'}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Age & Gender</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{user?.age || 34} Yrs / {user?.gender || 'Female'}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Type</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{user?.bloodGroup || 'A+'}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Member Since</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>

            <div className="sm:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Medical History & Allergies</p>
              <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {user?.medicalHistory || 'No baseline allergies or prior medical conditions reported.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical History</label>
              <textarea
                rows={3}
                value={formData.medicalHistory}
                onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

// NEW SCREEN: Patient Clinical Symptom Checker & Pre-Scan Assessment
export const PatientSymptomCheckerScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [category, setCategory] = useState<'dermatology' | 'hematology' | 'histopathology'>('dermatology');
  const [affectedArea, setAffectedArea] = useState('Forearm / Arm');
  const [duration, setDuration] = useState('3-7 days');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Erythema (Redness)', 'Pruritus (Itching)']);
  const [painLevel, setPainLevel] = useState(3);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const calculateRisk = () => {
    if (selectedSymptoms.length >= 3 || painLevel >= 7) return { level: 'High Risk / Clinical Evaluation Recommended', color: 'bg-rose-500 text-white', icon: AlertCircle };
    if (selectedSymptoms.length >= 2 || painLevel >= 4) return { level: 'Moderate Risk / Monitor & Scan Specimen', color: 'bg-amber-500 text-white', icon: ShieldAlert };
    return { level: 'Low Priority / Mild Clinical Presentation', color: 'bg-teal-500 text-white', icon: Activity };
  };

  const risk = calculateRisk();
  const RiskIcon = risk.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl text-white shadow-xl border border-teal-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-500/30 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Health Intake Assessment</span>
          </div>
          <h1 className="text-2xl font-extrabold">Clinical Symptom Checker</h1>
          <p className="text-xs text-slate-300 mt-1">Pre-evaluate dermatological, hematological, or cellular pathology symptoms prior to AI camera scanning.</p>
        </div>
        <button
          onClick={() => navigate('scan_upload')}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Proceed to AI Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Intake */}
        <div className="md:col-span-2 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">1. Select Pathology Specialty Category</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dermatology', title: 'Dermatology', desc: 'Skin, rash & lesions' },
                { id: 'hematology', title: 'Hematology', desc: 'Blood cell counts' },
                { id: 'histopathology', title: 'Histology', desc: 'Biopsy & tissue' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    category === cat.id
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{cat.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">2. Affected Anatomical Area</label>
            <input
              type="text"
              value={affectedArea}
              onChange={e => setAffectedArea(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">3. Select Active Clinical Symptoms</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Erythema (Redness)', 'Pruritus (Itching)', 'Edema (Swelling)',
                'Scaling / Flaking', 'Blistering / Vesicles', 'Pigmentation Change',
                'Bleeding / Oozing', 'Warmth / Inflammation'
              ].map(sym => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedSymptoms.includes(sym)
                      ? 'border-teal-500 bg-teal-500 text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{sym}</span>
                  {selectedSymptoms.includes(sym) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">4. Discomfort & Pain Level (1 to 10)</label>
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">{painLevel} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={painLevel}
              onChange={e => setPainLevel(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>
        </div>

        {/* Right Col: Live Risk Evaluation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Intake Risk Assessment</h3>

            <div className={`p-4 rounded-2xl flex items-center space-x-3 ${risk.color}`}>
              <RiskIcon className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-xs font-extrabold">{risk.level}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-semibold text-slate-900 dark:text-white">Recommended Clinical Steps:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Capture clear macro image using PathoAI Scanner.</li>
                <li>Avoid applying opaque topical ointments prior to scan.</li>
                <li>Schedule a Tele-consultation with a verified dermatopathologist if symptoms persist over 7 days.</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('scan_upload')}
              className="w-full bg-slate-900 dark:bg-teal-500 hover:bg-slate-800 dark:hover:bg-teal-600 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Camera Scanner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW SCREEN: Patient Treatment Plan & Medication Schedule Tracker
export const PatientMedTrackerScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [meds, setMeds] = useState([
    { id: 1, name: 'Hydrocortisone 1% Topical Cream', dosage: 'Thin layer twice daily', time: '08:00 AM & 08:00 PM', duration: '7 Days (Day 4 of 7)', status: 'Active', taken: true },
    { id: 2, name: 'Cetirizine Antihistamine 10mg', dosage: '1 tablet at bedtime', time: '09:30 PM', duration: '5 Days (Day 3 of 5)', status: 'Active', taken: false },
    { id: 3, name: 'Hypoallergenic Emollient Wash', dosage: 'Apply after bathing', time: '08:30 AM', duration: 'Ongoing Maintenance', status: 'Maintenance', taken: true },
  ]);

  const toggleMed = (id: number) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="p-6 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl text-white shadow-xl border border-cyan-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/30 mb-2">
            <Heart className="w-3.5 h-3.5" />
            <span>Prescription & Therapy Management</span>
          </div>
          <h1 className="text-2xl font-extrabold">Treatment Schedule Tracker</h1>
          <p className="text-xs text-slate-300 mt-1">Track daily topical applications, prescription dosages, and treatment adherence recommended by your doctor.</p>
        </div>
        <button
          onClick={() => navigate('appointment_list')}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>My Consultations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Daily Dose Schedule & Medication Log</span>
          </h2>

          <div className="space-y-3">
            {meds.map(med => (
              <div
                key={med.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  med.taken
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs">{med.name}</h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                      {med.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{med.dosage} • <span className="font-semibold text-slate-700 dark:text-slate-300">{med.time}</span></p>
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">{med.duration}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleMed(med.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    med.taken
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-cyan-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{med.taken ? 'Completed' : 'Mark Dose Taken'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Adherence Summary */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Treatment Adherence Score</h3>
          
          <div className="text-center py-4 space-y-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              88%
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">High Adherence Rating</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consistently completing prescribed treatment routines reduces pathology lesion recovery timeframe.
            </p>
          </div>

          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl border border-cyan-100 dark:border-cyan-900/40 text-xs space-y-1">
            <p className="font-bold text-cyan-900 dark:text-cyan-200">Doctor Instructions:</p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Apply topical cream following warm water cleansing. Re-evaluate with Dr. Vance if irritation persists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
