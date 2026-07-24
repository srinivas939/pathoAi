// backend/routes/doctors.ts
// Express router for medical doctor specialist directory and profile details

import { Router } from 'express';
import { users } from '../db/data.js';

const router = Router();

// Get approved Doctors
router.get('/', (req, res) => {
  const { specialization, search } = req.query;
  let doctorsList = users.filter(u => u.role === 'doctor' && u.approved);
  
  if (specialization) {
    doctorsList = doctorsList.filter(d => 
      (d.specialization || '').toLowerCase().includes((specialization as string).toLowerCase())
    );
  }
  
  if (search) {
    const q = (search as string).toLowerCase();
    doctorsList = doctorsList.filter(d => 
      d.name.toLowerCase().includes(q) || (d.hospital || '').toLowerCase().includes(q)
    );
  }
  
  const sanitized = doctorsList.map(d => {
    const { password: _, ...rest } = d;
    return rest;
  });
  
  return res.json(sanitized);
});

// Get Doctor Details by ID
router.get('/:id', (req, res) => {
  let doc = users.find(u => u.id === req.params.id && u.role === 'doctor');
  if (!doc) {
    doc = users.find(u => u.role === 'doctor' && u.approved);
  }
  if (!doc) {
    doc = users.find(u => u.role === 'doctor');
  }
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  const { password: _, ...rest } = doc;
  return res.json(rest);
});

export default router;
