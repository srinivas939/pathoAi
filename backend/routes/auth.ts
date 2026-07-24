// backend/routes/auth.ts
// Express router for user authentication, registration, profiles & password recovery

import { Router } from 'express';
import { users } from '../db/data.js';
import { saveUserToMySQL } from '../db/mysql.js';

const router = Router();

// Register Patient
router.post('/register/patient', (req, res) => {
  const { name, email, password, phone, age, gender, bloodGroup, medicalHistory } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }
  const newUser = {
    id: `pat-${Date.now()}`,
    name,
    email,
    password,
    role: 'patient' as const,
    phone: phone || '',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    age: age ? Number(age) : 30,
    gender: gender || 'Other',
    bloodGroup: bloodGroup || 'O+',
    medicalHistory: medicalHistory || 'None reported',
    isActive: true,
  };
  users.push(newUser);
  saveUserToMySQL(newUser);
  const token = `jwt_patient_${newUser.id}_${Date.now()}`;
  const { password: _, ...userNoPass } = newUser;
  return res.json({ token, user: userNoPass });
});

// Register Doctor
router.post('/register/doctor', (req, res) => {
  const { name, email, password, phone, qualification, specialization, licenseId, hospital, clinicAddress, experienceYears, consultationFee, consultationHours, bio, availableDays } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }
  const newDoctor = {
    id: `doc-${Date.now()}`,
    name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
    email,
    password,
    role: 'doctor' as const,
    phone: phone || '',
    createdAt: new Date().toISOString(),
    qualification: qualification || 'MD / MBBS Pathology',
    specialization: specialization || 'General Pathology',
    licenseId: licenseId || `MD-LIC-${Math.floor(10000 + Math.random() * 90000)}`,
    hospital: hospital || 'General Medical Center',
    clinicAddress: clinicAddress || '',
    experienceYears: experienceYears ? Number(experienceYears) : 5,
    consultationFee: consultationFee ? Number(consultationFee) : 100,
    consultationHours: consultationHours || '09:00 AM - 05:00 PM',
    approved: true,
    rating: 5.0,
    reviewsCount: 0,
    bio: bio || 'Dedicated medical pathology practitioner.',
    availableDays: Array.isArray(availableDays) && availableDays.length > 0 ? availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    isActive: true,
  };
  users.push(newDoctor);
  saveUserToMySQL(newDoctor);
  const token = `jwt_doctor_${newDoctor.id}_${Date.now()}`;
  const { password: _, ...docNoPass } = newDoctor;
  return res.json({ 
    token,
    message: 'Doctor account created successfully and active.',
    approved: true,
    user: docNoPass 
  });
});

// Login Patient
router.post('/login/patient', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid patient email or password' });
  }
  if (user.role !== 'patient') {
    return res.status(403).json({ error: `Access denied. Account is registered as a ${user.role}. Please use ${user.role} login.` });
  }
  const token = `jwt_patient_${user.id}_${Date.now()}`;
  const { password: _, ...userNoPass } = user;
  return res.json({ token, user: userNoPass });
});

// Login Doctor
router.post('/login/doctor', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid doctor credentials' });
  }
  if (user.role !== 'doctor') {
    return res.status(403).json({ error: `Access denied. Account is a ${user.role}. Use doctor login.` });
  }
  if (!user.approved) {
    return res.status(403).json({ error: 'Doctor account is pending admin verification and approval.' });
  }
  const token = `jwt_doctor_${user.id}_${Date.now()}`;
  const { password: _, ...userNoPass } = user;
  return res.json({ token, user: userNoPass });
});

// Login Admin
router.post('/login/admin', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Account does not have admin privileges.' });
  }
  const token = `jwt_admin_${user.id}_${Date.now()}`;
  const { password: _, ...userNoPass } = user;
  return res.json({ token, user: userNoPass });
});

// Forgot Password
router.post('/forgot-password', (req, res) => {
  const { email, role } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No user account found with that email address.' });
  }
  if (role && user.role !== role) {
    return res.status(400).json({ error: `Account email belongs to a ${user.role}, not a ${role}.` });
  }
  return res.json({ message: 'Reset code sent. Verification OTP is 884219.' });
});

// Reset Password
router.post('/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) return res.status(404).json({ error: 'Account not found' });
  if (otp !== '884219' && otp !== '123456') {
    return res.status(400).json({ error: 'Invalid reset code OTP' });
  }
  user.password = newPassword;
  return res.json({ message: 'Password updated successfully. You can now login.' });
});

// Get User Profile
router.get('/profile', (req, res) => {
  const userId = (req.query.userId as string) || 'pat-1';
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userNoPass } = user;
  return res.json(userNoPass);
});

// Update Profile
router.put('/profile', (req, res) => {
  const { userId, name, phone, age, gender, bloodGroup, medicalHistory, bio, hospital, specialization, licenseId, experienceYears, consultationFee, availableDays } = req.body;
  const user = users.find(u => u.id === (userId || 'pat-1'));
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (age) user.age = Number(age);
  if (gender) user.gender = gender;
  if (bloodGroup) user.bloodGroup = bloodGroup;
  if (medicalHistory) user.medicalHistory = medicalHistory;
  if (bio) user.bio = bio;
  if (hospital) user.hospital = hospital;
  if (specialization) user.specialization = specialization;
  if (licenseId) user.licenseId = licenseId;
  if (experienceYears) user.experienceYears = Number(experienceYears);
  if (consultationFee) user.consultationFee = Number(consultationFee);
  if (availableDays && Array.isArray(availableDays)) user.availableDays = availableDays;
  
  const { password: _, ...userNoPass } = user;
  return res.json({ message: 'Profile updated successfully', user: userNoPass });
});

export default router;


// Generic Login (auto-detects role)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.role === 'doctor' && !user.approved) {
    return res.status(403).json({ error: 'Doctor account pending admin approval' });
  }
  const token = `jwt_${user.role}_${user.id}_${Date.now()}`;
  const { password: _, ...userNoPass } = user;
  return res.json({ token, user: userNoPass });
});

// Generic Register (auto-assigns role based on fields or defaults to patient)
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  
  const userRole = (role === 'doctor' || role === 'patient' || role === 'admin') ? role : 'patient';
  
  if (userRole === 'doctor') {
    return res.status(400).json({ error: 'Use /register/doctor for doctor registration' });
  }
  
  // Default to patient registration
  const newUser = {
    id: `pat-${Date.now()}`,
    name,
    email,
    password,
    role: 'patient' as const,
    phone: req.body.phone || '',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    age: req.body.age ? Number(req.body.age) : 30,
    gender: req.body.gender || 'Other',
    bloodGroup: req.body.bloodGroup || 'O+',
    medicalHistory: req.body.medicalHistory || 'None',
    isActive: true,
  };
  users.push(newUser);
  saveUserToMySQL(newUser);
  const token = `jwt_patient_${newUser.id}_${Date.now()}`;
  const { password: _, ...userNoPass } = newUser;
  return res.json({ token, user: userNoPass });
});
