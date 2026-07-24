// flutter_app/lib/models/scan.dart

class PrescriptionMedicine {
  final String name;
  final String dosage;
  final String frequency;
  final String duration;
  final String instructions;

  PrescriptionMedicine({
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.duration,
    required this.instructions,
  });

  factory PrescriptionMedicine.fromJson(Map<String, dynamic> json) {
    return PrescriptionMedicine(
      name: json['name'] ?? '',
      dosage: json['dosage'] ?? '',
      frequency: json['frequency'] ?? '',
      duration: json['duration'] ?? '',
      instructions: json['instructions'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'dosage': dosage,
    'frequency': frequency,
    'duration': duration,
    'instructions': instructions,
  };
}

class ScanModel {
  final String id;
  final String patientId;
  final String patientName;
  final String imageUrl;
  final List<String> symptoms;
  final String affectedArea;
  final String durationDays;
  final String diseaseName;
  final String category;
  final double confidence;
  final String severity; // Low, Moderate, High, Severe
  final String description;
  final List<String> differentialDiagnosis;
  final List<String> precautions;
  final List<PrescriptionMedicine> recommendedMedicines;
  final List<String> recommendedDiet;
  final String recommendedSpecialist;
  final String modelVersion;
  final int inferenceTimeMs;
  final bool lowConfidenceFlag;
  final String status;
  final String createdAt;

  ScanModel({
    required this.id,
    required this.patientId,
    required this.patientName,
    required this.imageUrl,
    required this.symptoms,
    required this.affectedArea,
    required this.durationDays,
    required this.diseaseName,
    required this.category,
    required this.confidence,
    required this.severity,
    required this.description,
    required this.differentialDiagnosis,
    required this.precautions,
    required this.recommendedMedicines,
    required this.recommendedDiet,
    required this.recommendedSpecialist,
    required this.modelVersion,
    required this.inferenceTimeMs,
    required this.lowConfidenceFlag,
    required this.status,
    required this.createdAt,
  });

  factory ScanModel.fromJson(Map<String, dynamic> json) {
    return ScanModel(
      id: json['id'] ?? '',
      patientId: json['patientId'] ?? '',
      patientName: json['patientName'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      symptoms: List<String>.from(json['symptoms'] ?? []),
      affectedArea: json['affectedArea'] ?? 'General',
      durationDays: json['durationDays'] ?? 'Recent',
      diseaseName: json['diseaseName'] ?? 'Unknown Condition',
      category: json['category'] ?? 'Dermatology',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 90.0,
      severity: json['severity'] ?? 'Moderate',
      description: json['description'] ?? '',
      differentialDiagnosis: List<String>.from(json['differentialDiagnosis'] ?? []),
      precautions: List<String>.from(json['precautions'] ?? []),
      recommendedMedicines: (json['recommendedMedicines'] as List? ?? [])
          .map((m) => PrescriptionMedicine.fromJson(m))
          .toList(),
      recommendedDiet: List<String>.from(json['recommendedDiet'] ?? []),
      recommendedSpecialist: json['recommendedSpecialist'] ?? 'Specialist',
      modelVersion: json['modelVersion'] ?? 'EfficientNetB0-v2',
      inferenceTimeMs: json['inferenceTimeMs'] ?? 350,
      lowConfidenceFlag: json['lowConfidenceFlag'] ?? false,
      status: json['status'] ?? 'analyzed',
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
    );
  }
}
