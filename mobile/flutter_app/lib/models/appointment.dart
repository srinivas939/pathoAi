// flutter_app/lib/models/appointment.dart

class AppointmentModel {
  final String id;
  final String patientId;
  final String patientName;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialization;
  final String doctorHospital;
  final String date;
  final String timeSlot;
  final String complaint;
  final String? scanId;
  final String status; // pending, accepted, rejected, completed, cancelled
  final double fee;
  final String? prescription;
  final String createdAt;

  AppointmentModel({
    required this.id,
    required this.patientId,
    required this.patientName,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialization,
    required this.doctorHospital,
    required this.date,
    required this.timeSlot,
    required this.complaint,
    this.scanId,
    required this.status,
    required this.fee,
    this.prescription,
    required this.createdAt,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      id: json['id'] ?? '',
      patientId: json['patientId'] ?? '',
      patientName: json['patientName'] ?? '',
      doctorId: json['doctorId'] ?? '',
      doctorName: json['doctorName'] ?? '',
      doctorSpecialization: json['doctorSpecialization'] ?? 'Specialist',
      doctorHospital: json['doctorHospital'] ?? 'Hospital',
      date: json['date'] ?? '',
      timeSlot: json['timeSlot'] ?? '',
      complaint: json['complaint'] ?? '',
      scanId: json['scanId'],
      status: json['status'] ?? 'pending',
      fee: (json['fee'] as num?)?.toDouble() ?? 100.0,
      prescription: json['prescription'],
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
    );
  }
}
