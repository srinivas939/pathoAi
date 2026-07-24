// flutter_app/lib/providers/app_provider.dart

import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/scan.dart';
import '../models/appointment.dart';
import '../services/api_service.dart';

class AppProvider extends ChangeNotifier {
  UserModel? currentUser;
  String? token;
  List<ScanModel> scansHistory = [];
  List<UserModel> doctorsList = [];
  List<AppointmentModel> appointmentsList = [];

  bool isLoading = false;
  String? errorMessage;

  AppProvider() {
    _initDefaultUser();
    loadDoctors();
  }

  void _initDefaultUser() {
    // Default Patient
    currentUser = UserModel(
      id: 'pat-1',
      name: 'Sarah Jenkins',
      email: 'patient@pathoai.com',
      role: UserRole.patient,
      phone: '+1 (555) 234-5678',
      age: 34,
      gender: 'Female',
      bloodGroup: 'A+',
      medicalHistory: 'Mild eczema in childhood.',
      createdAt: DateTime.now().toIso8601String(),
    );
  }

  void switchRole(UserRole newRole) {
    if (newRole == UserRole.patient) {
      currentUser = UserModel(
        id: 'pat-1',
        name: 'Sarah Jenkins',
        email: 'patient@pathoai.com',
        role: UserRole.patient,
        phone: '+1 (555) 234-5678',
        age: 34,
        gender: 'Female',
        bloodGroup: 'A+',
        medicalHistory: 'Mild eczema in childhood.',
        createdAt: DateTime.now().toIso8601String(),
      );
    } else if (newRole == UserRole.doctor) {
      currentUser = UserModel(
        id: 'doc-1',
        name: 'Dr. Marcus Vance, MD',
        email: 'doctor@pathoai.com',
        role: UserRole.doctor,
        phone: '+1 (555) 876-5432',
        qualification: 'MD Pathology, FCAP',
        specialization: 'Dermatopathologist',
        hospital: 'Johns Hopkins Medical Center',
        experienceYears: 14,
        consultationFee: 120.0,
        approved: true,
        rating: 4.9,
        createdAt: DateTime.now().toIso8601String(),
      );
    } else if (newRole == UserRole.admin) {
      currentUser = UserModel(
        id: 'adm-1',
        name: 'Chief Pathology Admin',
        email: 'admin@pathoai.com',
        role: UserRole.admin,
        createdAt: DateTime.now().toIso8601String(),
      );
    }
    notifyListeners();
  }

  Future<void> login(String email, String password, UserRole role) async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      Map<String, dynamic> res;
      if (role == UserRole.doctor) {
        res = await ApiService.loginDoctor(email, password);
      } else if (role == UserRole.admin) {
        res = await ApiService.loginAdmin(email, password);
      } else {
        res = await ApiService.loginPatient(email, password);
      }

      token = res['token'];
      currentUser = UserModel.fromJson(res['user']);
    } catch (e) {
      errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadDoctors() async {
    try {
      doctorsList = await ApiService.fetchDoctors();
      notifyListeners();
    } catch (_) {}
  }

  Future<ScanModel?> submitScan({
    required String imageBase64,
    required List<String> symptoms,
    required String affectedArea,
    required String durationDays,
  }) async {
    isLoading = true;
    notifyListeners();

    try {
      final newScan = await ApiService.analyzeScan(
        patientId: currentUser?.id ?? 'pat-1',
        patientName: currentUser?.name ?? 'Sarah Jenkins',
        imageBase64: imageBase64,
        symptoms: symptoms,
        affectedArea: affectedArea,
        durationDays: durationDays,
      );

      scansHistory.insert(0, newScan);
      return newScan;
    } catch (e) {
      errorMessage = 'Scan analysis failed: $e';
      return null;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> bookConsultation({
    required String doctorId,
    required String date,
    required String timeSlot,
    required String complaint,
    String? scanId,
  }) async {
    isLoading = true;
    notifyListeners();

    try {
      final appt = await ApiService.bookAppointment(
        patientId: currentUser?.id ?? 'pat-1',
        patientName: currentUser?.name ?? 'Sarah Jenkins',
        doctorId: doctorId,
        date: date,
        timeSlot: timeSlot,
        complaint: complaint,
        scanId: scanId,
      );

      appointmentsList.insert(0, appt);
      return true;
    } catch (e) {
      errorMessage = 'Booking failed: $e';
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void updateAppointmentStatus(String id, String status, {String? prescription}) {
    final index = appointmentsList.indexWhere((a) => a.id == id);
    if (index != -1) {
      final old = appointmentsList[index];
      appointmentsList[index] = AppointmentModel(
        id: old.id,
        patientId: old.patientId,
        patientName: old.patientName,
        doctorId: old.doctorId,
        doctorName: old.doctorName,
        doctorSpecialization: old.doctorSpecialization,
        doctorHospital: old.doctorHospital,
        date: old.date,
        timeSlot: old.timeSlot,
        complaint: old.complaint,
        scanId: old.scanId,
        status: status,
        fee: old.fee,
        prescription: prescription ?? old.prescription,
        createdAt: old.createdAt,
      );
      notifyListeners();
    }
  }
}
