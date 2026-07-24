-- PathoAI Database Initial Seed Data

USE `pathoai`;

-- Insert Initial Users (Patients, Doctors, Admin)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `specialization`, `approved`, `rating`, `createdAt`) VALUES
('u1', 'Rahul Sharma', 'rahul@patient.com', 'password', 'patient', '+91 98765 43210', NULL, 1, 5.0, NOW()),
('u2', 'Dr. Ananya Roy', 'ananya@doctor.com', 'password', 'doctor', '+91 98765 43211', 'Dermatology & Histopathology', 1, 4.9, NOW()),
('u3', 'Dr. Vikram Patel', 'vikram@doctor.com', 'password', 'doctor', '+91 98765 43212', 'General Pathology', 1, 4.8, NOW()),
('u4', 'Admin System', 'admin@pathoai.com', 'admin123', 'admin', '+91 98765 43213', NULL, 1, 5.0, NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Insert Sample System Log
INSERT INTO `system_logs` (`id`, `action`, `performedBy`, `target`, `details`, `timestamp`) VALUES
('log1', 'Database Seeded', 'System', 'All Tables', 'Initial seed data populated successfully', NOW())
ON DUPLICATE KEY UPDATE `action` = VALUES(`action`);
