import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Award,
  Activity,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  MessageSquare,
  Terminal,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  apiGetAdminStats,
  apiGetAdminUsers,
  apiApproveDoctor,
  apiToggleUserStatus,
  apiGetSystemLogs,
  apiGetFeedback
} from '../../services/api';
import { User, SystemLog, FeedbackItem } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

// SCREEN 14: Admin Dashboard
export const AdminDashboardScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiGetAdminStats().then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl shadow-xl border border-amber-900/40">
        <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
          Administrator Command Center
        </span>
        <h1 className="text-2xl font-extrabold mt-2">Platform Infrastructure Dashboard</h1>
        <p className="text-xs text-amber-200/80">Manage security credentials, practitioner verification & system logs</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 12}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor Approvals Pending</p>
          <p className="text-2xl font-black text-amber-600">{stats?.pendingDoctors || 1}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Scans Analyzed</p>
          <p className="text-2xl font-black text-teal-600">{stats?.totalScans || 45}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">AI Model Accuracy</p>
          <p className="text-2xl font-black text-emerald-600">96.4%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('admin_doctor_approvals')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-left hover:border-amber-500 transition-all shadow-sm"
        >
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Doctor License Approval Queue</h3>
            <p className="text-xs text-slate-500">Review medical IDs, license numbers and clinic accreditations</p>
          </div>
          <Award className="w-6 h-6 text-amber-500" />
        </button>

        <button
          onClick={() => navigate('admin_analytics')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-left hover:border-teal-500 transition-all shadow-sm"
        >
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pathology Analytics & Charts</h3>
            <p className="text-xs text-slate-500">Disease distribution stats and model inference times</p>
          </div>
          <BarChart3 className="w-6 h-6 text-teal-500" />
        </button>
      </div>
    </div>
  );
};

// SCREEN 32: User Management
export const AdminUserManagementScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiGetAdminUsers().then(setUsers);
  }, []);

  const toggleStatus = async (id: string) => {
    await apiToggleUserStatus(id);
    const updated = await apiGetAdminUsers();
    setUsers(updated);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">User Account Administration</h1>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                <td className="p-4 uppercase font-bold text-[10px]">{u.role}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${u.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {u.isActive !== false ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    {u.isActive !== false ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SCREEN 33: Doctor Approval Queue
export const AdminDoctorApprovalQueueScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiGetAdminUsers().then(list => setUsers(list.filter(u => u.role === 'doctor')));
  }, []);

  const handleApprove = async (id: string) => {
    await apiApproveDoctor(id);
    const updated = await apiGetAdminUsers();
    setUsers(updated.filter(u => u.role === 'doctor'));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Doctor License Audit & Verification Queue</h1>
      <div className="space-y-3">
        {users.map(doc => (
          <div key={doc.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h3>
              <p className="text-slate-500">{doc.specialization} • License ID: <span className="font-mono font-bold">{doc.licenseId}</span></p>
              <p className="text-slate-400">{doc.hospital}</p>
            </div>
            {doc.isApproved ? (
              <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">Approved Practitioner</span>
            ) : (
              <button
                onClick={() => handleApprove(doc.id)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl"
              >
                Approve License
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// SCREEN 34: Admin Analytics
export const AdminAnalyticsDashboardScreen: React.FC = () => {
  const data = [
    { name: 'Dermatitis', count: 18 },
    { name: 'Psoriasis', count: 12 },
    { name: 'Melanoma', count: 6 },
    { name: 'Urticaria', count: 9 },
  ];

  const pieData = [
    { name: 'High Confidence (≥90%)', value: 38, color: '#0d9488' },
    { name: 'Moderate (70-89%)', value: 8, color: '#f59e0b' },
    { name: 'Doctor Flagged (<70%)', value: 2, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Pathology AI Analytics & Performance Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Disease Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Model Confidence Calibration</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// SCREEN 35: System Logs & Feedback
export const AdminSystemLogsAndFeedbackScreen: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    apiGetSystemLogs().then(setLogs);
    apiGetFeedback().then(setFeedback);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">System Logs & User Feedback</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-sm space-y-3 font-mono text-xs">
          <h3 className="font-bold text-teal-400 flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>Audit System Log Stream</span>
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500">{new Date(l.createdAt).toLocaleTimeString()}</span>
                <p className="font-bold text-teal-300">{l.action}</p>
                <p className="text-slate-400">{l.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>User Feedback & Bug Reports</span>
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {feedback.map(f => (
              <div key={f.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>{f.userName}</span>
                  <span className="text-amber-500">⭐ {f.rating}/5</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{f.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW SCREEN: Admin AI Model Retraining & Dataset Hub Screen
export const AdminAIRetrainingScreen: React.FC = () => {
  const [datasetCount, setDatasetCount] = useState(2710);
  const [isRetraining, setIsRetraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const startRetraining = () => {
    setIsRetraining(true);
    setProgress(10);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="p-6 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl text-white shadow-xl border border-amber-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transfer Learning Fine-Tuning Pipeline</span>
          </div>
          <h1 className="text-2xl font-extrabold">AI Dataset & Model Retraining Hub</h1>
          <p className="text-xs text-slate-300 mt-1">Manage pathology specimen datasets, inspect class distributions, and execute model fine-tuning jobs.</p>
        </div>

        <button
          onClick={startRetraining}
          disabled={isRetraining}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-3 rounded-2xl shadow-lg flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isRetraining ? `Retraining (${progress}%)` : 'Trigger Fine-Tuning Job'}</span>
        </button>
      </div>

      {isRetraining && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between font-bold text-amber-900 dark:text-amber-200">
            <span>Executing EfficientNetB0 Fine-Tuning Epochs...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-amber-200 dark:bg-amber-900 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase">Dermatology Dataset</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white">1,240 Images</p>
          <p className="text-xs text-slate-500">Classes: Eczema, Basal Cell, Psoriasis, Melanoma, Nevi</p>
          <span className="inline-block text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Accuracy 96.4%</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase">Hematology Dataset</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white">850 Images</p>
          <p className="text-xs text-slate-500">Classes: WBC Differentials, RBC Anomaly, Platelets</p>
          <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Accuracy 94.8%</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase">Histopathology Dataset</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white">620 Images</p>
          <p className="text-xs text-slate-500">Classes: Biopsy Tissue, Cellular Dysplasia, Mitotic Index</p>
          <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Accuracy 95.1%</span>
        </div>
      </div>
    </div>
  );
};

// NEW SCREEN: Admin Security, Rate Limiting & Access Audit Screen
export const AdminSecurityAuditScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>SAST & System Rate Throttling</span>
          </div>
          <h1 className="text-2xl font-extrabold">Security & API Access Audit</h1>
          <p className="text-xs text-slate-300 mt-1">Real-time inspection of API rate limits, CORS policies, failed authentication attempts, and SSL headers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase text-[10px]">Global Rate Limit</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">100 req/min</p>
          <p className="text-emerald-600 font-semibold text-[11px]">Enforced via Express IP Throttle</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase text-[10px]">CORS Policy Status</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">Subdomain Restricted</p>
          <p className="text-emerald-600 font-semibold text-[11px]">Wildcard Exfiltrate Blocked</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase text-[10px]">Payload Upload Cap</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">15 MB Limit</p>
          <p className="text-emerald-600 font-semibold text-[11px]">Protecting Disk Space</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase text-[10px]">Failed Auth Threshold</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">0 Suspicious IPs</p>
          <p className="text-emerald-600 font-semibold text-[11px]">Clean Security Monitor</p>
        </div>
      </div>
    </div>
  );
};
