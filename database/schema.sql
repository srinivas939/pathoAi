-- PathoAI Database Schema (MySQL 8.0 / MariaDB / XAMPP Compatible)
-- Database: pathoai

CREATE DATABASE IF NOT EXISTS `pathoai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pathoai`;

-- 1. Users Table (Patients, Doctors, Admins)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(100) DEFAULT NULL,
  `role` VARCHAR(20) NOT NULL COMMENT 'patient | doctor | admin',
  `phone` VARCHAR(50) DEFAULT NULL,
  `age` INT DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `bloodGroup` VARCHAR(10) DEFAULT NULL,
  `medicalHistory` TEXT DEFAULT NULL,
  `qualification` VARCHAR(100) DEFAULT NULL,
  `specialization` VARCHAR(100) DEFAULT NULL,
  `licenseId` VARCHAR(50) DEFAULT NULL,
  `hospital` VARCHAR(150) DEFAULT NULL,
  `clinicAddress` VARCHAR(200) DEFAULT NULL,
  `experienceYears` INT DEFAULT 0,
  `consultationFee` INT DEFAULT 0,
  `consultationHours` VARCHAR(100) DEFAULT NULL,
  `approved` TINYINT(1) DEFAULT 1,
  `rating` FLOAT DEFAULT 5.0,
  `reviewsCount` INT DEFAULT 0,
  `bio` TEXT DEFAULT NULL,
  `availableDays` TEXT DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  `avatarUrl` TEXT DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_role` (`role`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Scans Table (AI Diagnostic Pathology Scans)
CREATE TABLE IF NOT EXISTS `scans` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `patientId` VARCHAR(50) DEFAULT NULL,
  `patientName` VARCHAR(100) DEFAULT NULL,
  `imageUrl` LONGTEXT DEFAULT NULL,
  `symptoms` TEXT DEFAULT NULL,
  `affectedArea` VARCHAR(100) DEFAULT NULL,
  `duration` VARCHAR(50) DEFAULT NULL,
  `diagnoses` LONGTEXT DEFAULT NULL COMMENT 'JSON array of diagnoses',
  `confidenceScore` FLOAT DEFAULT 0.0,
  `specialist` VARCHAR(100) DEFAULT NULL,
  `medicines` LONGTEXT DEFAULT NULL COMMENT 'JSON array of medicines',
  `diet` LONGTEXT DEFAULT NULL COMMENT 'JSON array of diet recommendations',
  `precautions` LONGTEXT DEFAULT NULL COMMENT 'JSON array of precautions',
  `doctorNotes` TEXT DEFAULT NULL,
  `reviewedByDoctor` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'completed' COMMENT 'pending | completed | reviewed',
  `createdAt` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_patientId` (`patientId`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `patientId` VARCHAR(50) NOT NULL,
  `patientName` VARCHAR(100) NOT NULL,
  `doctorId` VARCHAR(50) NOT NULL,
  `doctorName` VARCHAR(100) NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `time` VARCHAR(20) NOT NULL,
  `type` VARCHAR(20) DEFAULT 'online' COMMENT 'online | in-person',
  `status` VARCHAR(20) DEFAULT 'confirmed' COMMENT 'confirmed | completed | cancelled',
  `symptoms` TEXT DEFAULT NULL,
  `meetingLink` VARCHAR(255) DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_patientId` (`patientId`),
  INDEX `idx_doctorId` (`doctorId`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(20) DEFAULT 'info' COMMENT 'info | alert | appointment | scan',
  `read` TINYINT(1) DEFAULT 0,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_read` (`read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Feedback Table
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `userName` VARCHAR(100) NOT NULL,
  `userEmail` VARCHAR(100) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `rating` INT DEFAULT 5,
  `comment` TEXT NOT NULL,
  `reply` TEXT DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. System Logs Table (Admin Audit Trail)
CREATE TABLE IF NOT EXISTS `system_logs` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `performedBy` VARCHAR(100) NOT NULL,
  `target` VARCHAR(100) DEFAULT NULL,
  `details` TEXT DEFAULT NULL,
  `timestamp` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_performedBy` (`performedBy`),
  INDEX `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
