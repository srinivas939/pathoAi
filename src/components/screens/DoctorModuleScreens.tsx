import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  Award,
  Star,
  DollarSign,
  ChevronRight,
  Plus,
  Trash2,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  apiGetDoctors,
  apiGetDoctorById,
  apiBookAppointment,
  apiGetAppointments,
  apiUpdateAppointment,
  apiCancelAppointment,
  apiGetScanHistory
} from '../../services/api';
import { User, Appointment, ScanResult, Medicine } from '../../types';

// SCREEN 13: Doctor Dashboard
export const DoctorDashboardScreen: React.FC = () => {
  const { user, navigate } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [appts, scanHistory] = await Promise.all([
        apiGetAppointments(undefined, user?.id),
        apiGetScanHistory(undefined, user?.id)
      ]);
      setAppointments(appts);
      setScans(scanHistory);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const handleUpdateStatus = async (appointmentId: string, status: 'accepted' | 'rejected') => {
    setActionLoading(appointmentId);
    try {
      await apiUpdateAppointment(appointmentId, { status });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update appointment');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingAppts = appointments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Doctor Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl border border-indigo-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Medical Practitioner Portal
          </span>
          <h1 className="text-2xl font-extrabold">{user?.name}</h1>
          <p className="text-xs text-indigo-200/80">{user?.specialization || 'Pathology Specialist'} • {user?.hospital || 'General Medical Center'}</p>
        </div>

        <button
          onClick={() => navigate('doctor_queue')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all"
        >
          Review Patient Scan Queue
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Consultations</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{appointments.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Pending Requests</p>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{pendingAppts.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor Rating</p>
          <p className="text-xl font-extrabold text-amber-500">⭐ {user?.rating || 5.0}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Consult Fee</p>
          <p className="text-xl font-extrabold text-emerald-600">${user?.consultationFee || 100}</p>
        </div>
      </div>

      {/* Appointments & Patient Queue Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Patient Booking Requests</h3>
              <p className="text-[11px] text-slate-500">Accept or decline pending patient appointments</p>
            </div>
            <button onClick={() => navigate('appointment_list')} className="text-xs text-indigo-600 font-semibold hover:underline">View All</button>
          </div>

          {appointments.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No appointments scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map(app => (
                <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{app.patientName}</h4>
                      <p className="text-[11px] text-slate-500">{app.date} at {app.timeSlot}</p>
                      {app.complaint && <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">"{app.complaint}"</p>}
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : app.status === 'accepted' || app.status === 'upcoming'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : app.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {app.status === 'pending' ? 'Pending Approval' : app.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Actions depending on status */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/50 flex justify-end space-x-2">
                    {app.status === 'pending' ? (
                      <>
                        <button
                          disabled={actionLoading === app.id}
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all"
                        >
                          Reject
                        </button>
                        <button
                          disabled={actionLoading === app.id}
                          onClick={() => handleUpdateStatus(app.id, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-4 py-1.5 rounded-xl shadow-sm transition-all"
                        >
                          Accept Booking
                        </button>
                      </>
                    ) : app.status === 'accepted' || app.status === 'upcoming' ? (
                      <button
                        onClick={() => navigate('prescription_editor', { appointmentId: app.id })}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] px-4 py-1.5 rounded-xl transition-all"
                      >
                        Issue Prescription
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent AI Pathology Scans</h3>
            <button onClick={() => navigate('doctor_queue')} className="text-xs text-indigo-600 font-semibold hover:underline">Review Queue</button>
          </div>

          <div className="space-y-3">
            {scans.slice(0, 4).map(scan => (
              <div key={scan.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{scan.diseaseName}</h4>
                  <p className="text-[11px] text-teal-600 font-mono font-bold">{scan.confidence}% AI Confidence</p>
                </div>
                <button
                  onClick={() => navigate('scan_detail', { scanId: scan.id })}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all"
                >
                  Inspect Specimen
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// SCREEN 23 & 24: Doctor Directory & Detail
export const DoctorDirectoryScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const docs = await apiGetDoctors(specialization, search);
        setDoctors(docs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [specialization, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Find Medical Specialists</h1>
          <p className="text-xs text-slate-500">Verified medical practitioners registered on PathoAI</p>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search doctor, degree, or clinic location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading registered doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Registered Doctors Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When doctors register their profile via Doctor Registration, their medical qualification, license ID, and clinic details will appear here for patient bookings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map(doc => {
            const initials = doc.name.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'MD';
            return (
              <div
                key={doc.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-400 dark:hover:border-slate-600 transition-all"
              >
                <div className="flex space-x-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 shrink-0 text-sm">
                    {initials}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h3>
                      <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                        {doc.qualification || 'MD'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500">{doc.hospital || 'Private Clinic'} {doc.clinicAddress ? `• ${doc.clinicAddress}` : ''}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p><strong>License ID:</strong> {doc.licenseId || 'Verified'}</p>
                  <p><strong>Hours:</strong> {doc.consultationHours || '09:00 AM - 05:00 PM'}</p>
                  {doc.availableDays && doc.availableDays.length > 0 && (
                    <p><strong>Available:</strong> {doc.availableDays.join(', ')}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white">{doc.experienceYears || 5} Yrs Exp</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900 dark:text-white">${doc.consultationFee || 100}</span>
                  </div>

                  <button
                    onClick={() => navigate('doctor_detail', { doctorId: doc.id })}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    View Details & Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const DoctorDetailScreen: React.FC = () => {
  const { activeDoctorId, navigate } = useAuth();
  const [doc, setDoc] = useState<User | null>(null);

  useEffect(() => {
    if (activeDoctorId) {
      apiGetDoctorById(activeDoctorId).then(setDoc).catch(console.error);
    }
  }, [activeDoctorId]);

  if (!doc) return <div className="p-8 text-center text-xs text-slate-400">Loading practitioner details...</div>;

  const initials = doc.name.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'MD';

  return (
    <div className="max-w-2xl mx-auto space-y-6 my-6">
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 shrink-0 text-base">
            {initials}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{doc.name}</h1>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{doc.specialization} ({doc.qualification || 'MD'})</p>
            <p className="text-xs text-slate-500">{doc.hospital} • License No: {doc.licenseId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">CLINIC / HOSPITAL</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.hospital || 'General Clinic'}</span>
            {doc.clinicAddress && <p className="text-[11px] text-slate-500 mt-0.5">{doc.clinicAddress}</p>}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold">WORKING HOURS & DAYS</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.consultationHours || '09:00 AM - 05:00 PM'}</span>
            {doc.availableDays && <p className="text-[11px] text-slate-500 mt-0.5">{doc.availableDays.join(', ')}</p>}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-bold text-slate-900 dark:text-white mb-1">Clinical Background & Bio</p>
          <p className="leading-relaxed">{doc.bio || 'No biographic notes provided.'}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block font-bold">Consultation Fee</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">${doc.consultationFee || 100}</span>
          </div>

          <button
            onClick={() => navigate('appointment_booking', { doctorId: doc.id })}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs px-6 py-3 rounded-2xl transition-all"
          >
            Book Appointment Slot
          </button>
        </div>
      </div>
    </div>
  );
};

// SCREEN 25, 26, 27: Booking & Appointment Management
export const AppointmentBookingScreen: React.FC = () => {
  const { user, activeDoctorId, activeScanId, navigate } = useAuth();
  const [doc, setDoc] = useState<User | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeDoctorId) apiGetDoctorById(activeDoctorId).then(setDoc);
  }, [activeDoctorId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc) return;
    setLoading(true);
    try {
      await apiBookAppointment({
        patientId: user?.id || '',
        patientName: user?.name || 'Patient',
        doctorId: doc.id,
        date,
        timeSlot,
        complaint: complaint || 'General Consultation Request',
        scanId: activeScanId || undefined,
      });
      alert('Appointment request submitted successfully!');
      navigate('appointment_list');
    } catch (e: any) {
      alert(e.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book Consultation</h2>
        <p className="text-xs text-slate-500">With {doc?.name || 'Pathology Specialist'}</p>
      </div>

      <form onSubmit={handleBook} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Appointment Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
          <select
            value={timeSlot}
            onChange={e => setTimeSlot(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
          >
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="04:15 PM">04:15 PM</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Chief Complaint & Symptoms</label>
          <textarea
            rows={3}
            value={complaint}
            onChange={e => setComplaint(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-teal-500/20"
        >
          {loading ? 'Confirming...' : `Confirm Booking ($${doc?.consultationFee || 100})`}
        </button>
      </form>
    </div>
  );
};

export const AppointmentListScreen: React.FC = () => {
  const { user, navigate } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedRx, setSelectedRx] = useState<Appointment['prescription'] | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appts = await apiGetAppointments(
        user?.role === 'patient' ? user.id : undefined,
        user?.role === 'doctor' ? user.id : undefined
      );
      setAppointments(appts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const handleUpdateStatus = async (appointmentId: string, status: 'accepted' | 'rejected') => {
    setActionId(appointmentId);
    try {
      await apiUpdateAppointment(appointmentId, { status });
      await fetchAppointments();
    } catch (e: any) {
      alert(e.message || 'Error updating appointment');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Appointments & Consultations</h1>
          <p className="text-xs text-slate-500">Track and manage upcoming and past pathology visits</p>
        </div>
        {user?.role === 'patient' && (
          <button
            onClick={() => navigate('doctor_directory')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Find Doctor
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          No appointments recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(app => {
            const isDoctor = user?.role === 'doctor';
            const counterPartyName = isDoctor ? app.patientName : app.doctorName;

            return (
              <div
                key={app.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : app.status === 'accepted' || app.status === 'upcoming'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {app.status === 'pending'
                          ? 'Awaiting Approval'
                          : app.status === 'accepted' || app.status === 'upcoming'
                          ? 'Accepted / Confirmed'
                          : app.status === 'rejected'
                          ? 'Declined by Doctor'
                          : 'Completed'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {isDoctor ? `Patient: ${app.patientName}` : `Doctor: ${app.doctorName}`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      📅 Date: {app.date} • 🕒 Slot: {app.timeSlot} • Fee: ${app.fee}
                    </p>
                  </div>

                  {/* Actions for doctor */}
                  {isDoctor && app.status === 'pending' && (
                    <div className="flex space-x-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        disabled={actionId === app.id}
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                      >
                        Reject
                      </button>
                      <button
                        disabled={actionId === app.id}
                        onClick={() => handleUpdateStatus(app.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
                      >
                        Accept
                      </button>
                    </div>
                  )}

                  {/* Actions for doctor if accepted */}
                  {isDoctor && (app.status === 'accepted' || app.status === 'upcoming') && (
                    <button
                      onClick={() => navigate('prescription_editor', { appointmentId: app.id })}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all shrink-0"
                    >
                      Issue Prescription
                    </button>
                  )}

                  {/* View Rx for Patient */}
                  {app.prescription && (
                    <button
                      onClick={() => setSelectedRx(app.prescription || null)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all shrink-0"
                    >
                      View Digital Rx
                    </button>
                  )}
                </div>

                {app.complaint && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Patient Complaint: </span>
                    {app.complaint}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Prescription Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Official Medical Prescription</h2>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Diagnosis</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedRx.diagnosis}</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Doctor Remarks</span>
                <p className="text-slate-700 dark:text-slate-300">{selectedRx.notes}</p>
              </div>

              {selectedRx.medicines && selectedRx.medicines.length > 0 && (
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2">Prescribed Medications</span>
                  <div className="space-y-2">
                    {selectedRx.medicines.map((m, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                        <p className="text-slate-500">{m.dosage} • {m.frequency} • {m.duration}</p>
                        {m.instructions && <p className="text-teal-600 font-semibold">{m.instructions}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Signed by: <strong className="text-slate-800 dark:text-slate-200">{selectedRx.signedByDoctorName}</strong></span>
                <span>{new Date(selectedRx.signedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRx(null)}
              className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs"
            >
              Close Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// SCREEN 28 & 29: Doctor Queue & Prescription Editor
export const DoctorQueueScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    apiGetScanHistory().then(setScans);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Doctor's Patient Scan Review Queue</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scans.map(s => (
          <div key={s.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex space-x-4">
            <img src={s.imageUrl} alt={s.diseaseName} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="space-y-1 text-xs flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white">{s.diseaseName}</h3>
              <p className="text-slate-500">Patient: {s.patientName}</p>
              <p className="text-teal-600 font-mono font-bold">{s.confidence}% AI Confidence</p>
              <button
                onClick={() => navigate('scan_detail', { scanId: s.id })}
                className="mt-2 bg-slate-800 text-white font-bold px-3 py-1 rounded-lg text-[10px]"
              >
                Review Specimen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrescriptionEditorScreen: React.FC = () => {
  const { activeAppointmentId, user, navigate } = useAuth();
  const [diagnosis, setDiagnosis] = useState('Atopic Eczema with Secondary Epidermal Scaling');
  const [notes, setNotes] = useState('Apply topical cream twice daily. Hydrate skin regularly.');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: 'Hydrocortisone 1% Cream', dosage: 'Thin layer', frequency: 'Twice daily', duration: '7 days', instructions: 'Topical application' }
  ]);

  const handleSendRx = async () => {
    if (!activeAppointmentId) return;
    await apiUpdateAppointment(activeAppointmentId, {
      prescription: {
        diagnosis,
        medicines,
        notes,
        signedByDoctorName: user?.name || 'Dr. Marcus Vance',
        signedAt: new Date().toISOString()
      }
    });
    alert('Medical prescription issued successfully to patient!');
    navigate('doctor_dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Prescription Editor</h2>
      
      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={e => setDiagnosis(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Doctor Remarks & Precautions</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none"
          />
        </div>

        <button
          onClick={handleSendRx}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl"
        >
          Digitally Sign & Issue Prescription
        </button>
      </div>
    </div>
  );
};
