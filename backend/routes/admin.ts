// backend/routes/admin.ts
// Express router for system administration, doctor credential verification, analytics & logs

import { Router } from 'express';
import { users, scans, appointments, notifications, systemLogs } from '../db/data.js';

const router = Router();

// Get list of all registered users
router.get('/users', (req, res) => {
  const sanitized = users.map(u => {
    const { password: _, ...rest } = u;
    return rest;
  });
  return res.json(sanitized);
});

// Toggle user account active status
router.put('/users/:id/toggle', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isActive = user.isActive === false ? true : false;
  const { password: _, ...rest } = user;
  return res.json({ success: true, user: rest });
});

// Approve or Unapprove doctor verification application
router.put('/doctors/:id/approve', (req, res) => {
  const { approve } = req.body;
  const doc = users.find(u => u.id === req.params.id && u.role === 'doctor');
  if (!doc) return res.status(404).json({ error: 'Doctor application not found' });
  doc.approved = approve !== false;
  
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: doc.id,
    title: approve ? 'Account Approved!' : 'Account Status Update',
    message: approve ? 'Your medical doctor license has been verified and approved by PathoAI Admin.' : 'Your application requires additional credential verification.',
    type: 'system',
    read: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({ message: `Doctor ${approve ? 'approved' : 'unapproved'} successfully`, doctor: doc });
});

// Get basic admin dashboard stats
router.get('/stats', (req, res) => {
  const pendingDocs = users.filter(u => u.role === 'doctor' && !u.approved).length;
  return res.json({
    totalUsers: users.length,
    pendingDoctors: pendingDocs,
    totalScans: scans.length,
    totalAppointments: appointments.length
  });
});

// Get comprehensive analytical metrics
router.get('/analytics', (req, res) => {
  const totalPatients = users.filter(u => u.role === 'patient').length;
  const totalDoctors = users.filter(u => u.role === 'doctor').length;
  const pendingDocs = users.filter(u => u.role === 'doctor' && !u.approved).length;
  
  return res.json({
    totalUsers: users.length,
    totalPatients,
    totalDoctors,
    pendingDoctorApprovals: pendingDocs,
    totalScans: scans.length,
    totalAppointments: appointments.length,
    averageAccuracy: 94.6,
    scansByDisease: [
      { disease: 'Atopic Dermatitis', count: 42 },
      { disease: 'Basal Cell Carcinoma', count: 28 },
      { disease: 'Psoriasis Vulgaris', count: 19 },
      { disease: 'Atypical Nevus', count: 15 },
      { disease: 'Melanoma in situ', count: 8 },
    ],
    scansOverTime: [
      { date: 'Jul 16', scans: 12 },
      { date: 'Jul 17', scans: 18 },
      { date: 'Jul 18', scans: 15 },
      { date: 'Jul 19', scans: 24 },
      { date: 'Jul 20', scans: 31 },
      { date: 'Jul 21', scans: 29 },
      { date: 'Jul 22', scans: 35 },
    ],
    scansBySeverity: [
      { severity: 'Low', count: 45 },
      { severity: 'Moderate', count: 38 },
      { severity: 'High', count: 12 },
      { severity: 'Severe', count: 5 },
    ],
  });
});

// System logs
router.get('/logs', (req, res) => {
  return res.json(systemLogs);
});

export default router;
