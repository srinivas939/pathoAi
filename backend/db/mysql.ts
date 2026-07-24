// backend/db/mysql.ts
// MySQL / XAMPP Database Connection & Auto-Migration Layer for PathoAI

import mysql from 'mysql2/promise';
import { users, scans, appointments, notifications, feedbackList, systemLogs, User, ScanRecord, Appointment, NotificationItem, FeedbackItem, SystemLog } from './data.js';

export let dbPool: mysql.Pool | null = null;
export let isMySQLConnected = false;

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pathoai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export async function initMySQLDatabase() {
  try {
    console.log(`Connecting to MySQL database '${DB_CONFIG.database}' on ${DB_CONFIG.host}:${DB_CONFIG.port}...`);
    
    // First connect to MySQL server without database to ensure database exists
    const rootConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    // Create database if not exists
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    await rootConnection.end();

    // Now create pool with database
    dbPool = mysql.createPool(DB_CONFIG);
    
    // Test connection
    const conn = await dbPool.getConnection();
    conn.release();
    isMySQLConnected = true;
    console.log(`✅ Successfully connected to XAMPP MySQL database '${DB_CONFIG.database}' on port ${DB_CONFIG.port}`);

    // Run table migrations & seed initial data
    await setupTablesAndSeed();
  } catch (err: any) {
    console.warn(`⚠️ MySQL Connection Warning: Could not connect to MySQL server at ${DB_CONFIG.host}:${DB_CONFIG.port}.`);
    console.warn(`Reason: ${err.message}`);
    console.warn(`Fallback: Running in-memory database mode for PathoAI.`);
    isMySQLConnected = false;
  }
}

async function setupTablesAndSeed() {
  if (!dbPool || !isMySQLConnected) return;

  try {
    // 1. Users Table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100),
        role VARCHAR(20) NOT NULL,
        phone VARCHAR(50),
        age INT,
        gender VARCHAR(20),
        bloodGroup VARCHAR(10),
        medicalHistory TEXT,
        qualification VARCHAR(100),
        specialization VARCHAR(100),
        licenseId VARCHAR(50),
        hospital VARCHAR(150),
        clinicAddress VARCHAR(200),
        experienceYears INT,
        consultationFee INT,
        consultationHours VARCHAR(100),
        approved TINYINT(1) DEFAULT 1,
        rating FLOAT DEFAULT 5.0,
        reviewsCount INT DEFAULT 0,
        bio TEXT,
        availableDays TEXT,
        isActive TINYINT(1) DEFAULT 1,
        avatarUrl TEXT,
        createdAt VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Scans Table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS scans (
        id VARCHAR(50) PRIMARY KEY,
        patientId VARCHAR(50),
        patientName VARCHAR(100),
        imageUrl LONGTEXT,
        symptoms TEXT,
        affectedArea VARCHAR(100),
        durationDays VARCHAR(50),
        diseaseName VARCHAR(150),
        category VARCHAR(100),
        confidence FLOAT,
        severity VARCHAR(50),
        description TEXT,
        differentialDiagnosis TEXT,
        precautions TEXT,
        recommendedMedicines TEXT,
        recommendedDiet TEXT,
        recommendedSpecialist VARCHAR(100),
        modelVersion VARCHAR(50),
        inferenceTimeMs INT,
        lowConfidenceFlag TINYINT(1) DEFAULT 0,
        status VARCHAR(50),
        createdAt VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Appointments Table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        patientId VARCHAR(50),
        patientName VARCHAR(100),
        doctorId VARCHAR(50),
        doctorName VARCHAR(100),
        doctorSpecialization VARCHAR(100),
        doctorHospital VARCHAR(150),
        date VARCHAR(50),
        timeSlot VARCHAR(50),
        complaint TEXT,
        scanId VARCHAR(50),
        status VARCHAR(50),
        fee INT,
        prescription TEXT,
        createdAt VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Notifications Table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50),
        title VARCHAR(150),
        message TEXT,
        type VARCHAR(50),
        \`read\` TINYINT(1) DEFAULT 0,
        createdAt VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. System Logs Table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id VARCHAR(100) PRIMARY KEY,
        endpoint VARCHAR(150),
        method VARCHAR(10),
        statusCode INT,
        responseTimeMs INT,
        timestamp VARCHAR(50),
        ip VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed initial users into MySQL if empty
    const [rows]: any = await dbPool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      for (const u of users) {
        await saveUserToMySQL(u);
      }
      console.log(`🌱 Seeded ${users.length} initial users into XAMPP MySQL database 'pathoai'`);
    } else {
      // Sync memory users from MySQL database
      const [dbUsers]: any = await dbPool.query('SELECT * FROM users');
      if (Array.isArray(dbUsers) && dbUsers.length > 0) {
        users.length = 0;
        dbUsers.forEach((u: any) => {
          users.push({
            ...u,
            approved: Boolean(u.approved),
            isActive: Boolean(u.isActive),
            availableDays: u.availableDays ? JSON.parse(u.availableDays) : [],
          });
        });
        console.log(`📥 Loaded ${users.length} users from XAMPP MySQL 'pathoai' database`);
      }
    }

    // Load initial scans from MySQL
    const [dbScans]: any = await dbPool.query('SELECT * FROM scans');
    if (Array.isArray(dbScans) && dbScans.length > 0) {
      scans.length = 0;
      dbScans.forEach((s: any) => {
        scans.push({
          ...s,
          symptoms: s.symptoms ? JSON.parse(s.symptoms) : [],
          differentialDiagnosis: s.differentialDiagnosis ? JSON.parse(s.differentialDiagnosis) : [],
          precautions: s.precautions ? JSON.parse(s.precautions) : [],
          recommendedMedicines: s.recommendedMedicines ? JSON.parse(s.recommendedMedicines) : [],
          recommendedDiet: s.recommendedDiet ? JSON.parse(s.recommendedDiet) : [],
          lowConfidenceFlag: Boolean(s.lowConfidenceFlag),
        });
      });
      console.log(`📥 Loaded ${scans.length} diagnostic scan records from XAMPP MySQL database`);
    }

  } catch (err: any) {
    console.error('Error executing MySQL migration queries:', err.message);
  }
}

export async function saveUserToMySQL(user: User) {
  if (!dbPool || !isMySQLConnected) return;
  try {
    await dbPool.query(
      `INSERT INTO users (
        id, name, email, password, role, phone, age, gender, bloodGroup, medicalHistory,
        qualification, specialization, licenseId, hospital, clinicAddress, experienceYears,
        consultationFee, consultationHours, approved, rating, reviewsCount, bio, availableDays, isActive, avatarUrl, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name), phone = VALUES(phone), age = VALUES(age), gender = VALUES(gender),
        medicalHistory = VALUES(medicalHistory), qualification = VALUES(qualification),
        specialization = VALUES(specialization), hospital = VALUES(hospital),
        consultationFee = VALUES(consultationFee), consultationHours = VALUES(consultationHours),
        approved = VALUES(approved), rating = VALUES(rating), availableDays = VALUES(availableDays);`,
      [
        user.id,
        user.name,
        user.email,
        user.password || 'password123',
        user.role,
        user.phone || '',
        user.age || null,
        user.gender || '',
        user.bloodGroup || '',
        user.medicalHistory || '',
        user.qualification || '',
        user.specialization || '',
        user.licenseId || '',
        user.hospital || '',
        user.clinicAddress || '',
        user.experienceYears || null,
        user.consultationFee || null,
        user.consultationHours || '',
        user.approved ? 1 : 0,
        user.rating || 5.0,
        user.reviewsCount || 0,
        user.bio || '',
        JSON.stringify(user.availableDays || []),
        user.isActive ? 1 : 0,
        user.avatarUrl || '',
        user.createdAt || new Date().toISOString(),
      ]
    );
  } catch (err: any) {
    console.error('Error saving user to MySQL:', err.message);
  }
}

export async function saveScanToMySQL(scan: ScanRecord) {
  if (!dbPool || !isMySQLConnected) return;
  try {
    await dbPool.query(
      `INSERT INTO scans (
        id, patientId, patientName, imageUrl, symptoms, affectedArea, durationDays,
        diseaseName, category, confidence, severity, description, differentialDiagnosis,
        precautions, recommendedMedicines, recommendedDiet, recommendedSpecialist,
        modelVersion, inferenceTimeMs, lowConfidenceFlag, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status), diseaseName = VALUES(diseaseName), severity = VALUES(severity);`,
      [
        scan.id,
        scan.patientId,
        scan.patientName,
        scan.imageUrl,
        JSON.stringify(scan.symptoms || []),
        scan.affectedArea,
        scan.durationDays,
        scan.diseaseName,
        scan.category,
        scan.confidence,
        scan.severity,
        scan.description,
        JSON.stringify(scan.differentialDiagnosis || []),
        JSON.stringify(scan.precautions || []),
        JSON.stringify(scan.recommendedMedicines || []),
        JSON.stringify(scan.recommendedDiet || []),
        scan.recommendedSpecialist,
        scan.modelVersion,
        scan.inferenceTimeMs,
        scan.lowConfidenceFlag ? 1 : 0,
        scan.status,
        scan.createdAt,
      ]
    );
  } catch (err: any) {
    console.error('Error saving scan to MySQL:', err.message);
  }
}

export async function saveAppointmentToMySQL(app: Appointment) {
  if (!dbPool || !isMySQLConnected) return;
  try {
    await dbPool.query(
      `INSERT INTO appointments (
        id, patientId, patientName, doctorId, doctorName, doctorSpecialization,
        doctorHospital, date, timeSlot, complaint, scanId, status, fee, prescription, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status), prescription = VALUES(prescription);`,
      [
        app.id,
        app.patientId,
        app.patientName,
        app.doctorId,
        app.doctorName,
        app.doctorSpecialization,
        app.doctorHospital,
        app.date,
        app.timeSlot,
        app.complaint,
        app.scanId || '',
        app.status,
        app.fee,
        app.prescription ? JSON.stringify(app.prescription) : '',
        app.createdAt,
      ]
    );
  } catch (err: any) {
    console.error('Error saving appointment to MySQL:', err.message);
  }
}
