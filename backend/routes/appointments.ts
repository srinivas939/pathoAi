// backend/routes/appointments.ts
// Express router for patient consultation booking, doctor approval, status update & prescriptions

import { Router } from 'express';
import { appointments, users, notifications, Appointment } from '../db/data.js';
import { saveAppointmentToMySQL } from '../db/mysql.js';

const router = Router();

// Book Appointment
router.post('/book', (req, res) => {
  const { patientId, patientName, doctorId, date, timeSlot, complaint, scanId } = req.body;
  const doc = users.find(u => u.id === doctorId && u.role === 'doctor');
  if (!doc) return res.status(404).json({ error: 'Selected doctor not found' });

  const newApp: Appointment = {
    id: `app-${Date.now()}`,
    patientId: patientId || 'pat-1',
    patientName: patientName || 'Patient',
    doctorId,
    doctorName: doc.name,
    doctorSpecialization: doc.specialization || 'Pathology Specialist',
    doctorHospital: doc.hospital || 'Medical Center',
    date: date || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '10:00 AM',
    complaint: complaint || 'Pathology scan consultation',
    scanId,
    status: 'pending',
    fee: doc.consultationFee || 100,
    createdAt: new Date().toISOString(),
  };

  appointments.unshift(newApp);
  saveAppointmentToMySQL(newApp);

  // Send notifications to both patient and doctor
  notifications.unshift({
    id: `notif-${Date.now()}-1`,
    userId: newApp.patientId,
    title: 'Booking Request Sent',
    message: `Your appointment request with ${newApp.doctorName} for ${newApp.date} at ${newApp.timeSlot} is pending doctor confirmation.`,
    type: 'appointment',
    read: false,
    createdAt: new Date().toISOString(),
  });

  notifications.unshift({
    id: `notif-${Date.now()}-2`,
    userId: doctorId,
    title: 'New Patient Booking Request',
    message: `${newApp.patientName} requested a consultation for ${newApp.date} at ${newApp.timeSlot}. Please review and Accept or Reject.`,
    type: 'appointment',
    read: false,
    createdAt: new Date().toISOString(),
  });

  return res.json(newApp);
});

// List Appointments
router.get('/', (req, res) => {
  const { patientId, doctorId } = req.query;
  let result = [...appointments];
  if (patientId) result = result.filter(a => a.patientId === patientId);
  if (doctorId) result = result.filter(a => a.doctorId === doctorId);
  return res.json(result);
});

// Update Appointment Status / Issue Prescription
router.put('/:id', (req, res) => {
  const appt = appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  const { status, date, timeSlot, prescription } = req.body;
  
  if (status) {
    appt.status = status;
    if (status === 'accepted') {
      notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: appt.patientId,
        title: 'Appointment Accepted!',
        message: `${appt.doctorName} ACCEPTED your consultation booking for ${appt.date} at ${appt.timeSlot}.`,
        type: 'appointment',
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (status === 'rejected') {
      notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: appt.patientId,
        title: 'Appointment Declined',
        message: `${appt.doctorName} was unable to accept your appointment request for ${appt.date} at ${appt.timeSlot}.`,
        type: 'appointment',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
  if (date) appt.date = date;
  if (timeSlot) appt.timeSlot = timeSlot;
  if (prescription) {
    appt.prescription = prescription;
    appt.status = 'completed';
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: appt.patientId,
      title: 'Prescription Issued',
      message: `${appt.doctorName} issued a medical prescription for your visit on ${appt.date}.`,
      type: 'doctor',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return res.json(appt);
});

// Cancel Appointment
router.delete('/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Appointment not found' });
  const [cancelled] = appointments.splice(index, 1);
  return res.json({ message: 'Appointment cancelled', appointment: cancelled });
});

export default router;
