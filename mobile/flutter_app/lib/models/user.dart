// flutter_app/lib/models/user.dart

enum UserRole { patient, doctor, admin }

class UserModel {
  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String phone;
  final String avatarUrl;
  final bool isActive;
  final String createdAt;

  // Patient fields
  final int? age;
  final String? gender;
  final String? bloodGroup;
  final String? medicalHistory;

  // Doctor fields
  final String? qualification;
  final String? specialization;
  final String? licenseId;
  final String? hospital;
  final String? clinicAddress;
  final int? experienceYears;
  final double? consultationFee;
  final String? consultationHours;
  final bool? approved;
  final double? rating;
  final int? reviewsCount;
  final String? bio;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone = '',
    this.avatarUrl = '',
    this.isActive = true,
    required this.createdAt,
    this.age,
    this.gender,
    this.bloodGroup,
    this.medicalHistory,
    this.qualification,
    this.specialization,
    this.licenseId,
    this.hospital,
    this.clinicAddress,
    this.experienceYears,
    this.consultationFee,
    this.consultationHours,
    this.approved,
    this.rating,
    this.reviewsCount,
    this.bio,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    UserRole parsedRole = UserRole.patient;
    if (json['role'] == 'doctor') parsedRole = UserRole.doctor;
    if (json['role'] == 'admin') parsedRole = UserRole.admin;

    return UserModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: parsedRole,
      phone: json['phone'] ?? '',
      avatarUrl: json['avatarUrl'] ?? '',
      isActive: json['isActive'] ?? true,
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
      age: json['age'],
      gender: json['gender'],
      bloodGroup: json['bloodGroup'],
      medicalHistory: json['medicalHistory'],
      qualification: json['qualification'],
      specialization: json['specialization'],
      licenseId: json['licenseId'],
      hospital: json['hospital'],
      clinicAddress: json['clinicAddress'],
      experienceYears: json['experienceYears'],
      consultationFee: (json['consultationFee'] as num?)?.toDouble(),
      consultationHours: json['consultationHours'],
      approved: json['approved'],
      rating: (json['rating'] as num?)?.toDouble(),
      reviewsCount: json['reviewsCount'],
      bio: json['bio'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role.name,
      'phone': phone,
      'avatarUrl': avatarUrl,
      'isActive': isActive,
      'createdAt': createdAt,
      'age': age,
      'gender': gender,
      'bloodGroup': bloodGroup,
      'medicalHistory': medicalHistory,
      'qualification': qualification,
      'specialization': specialization,
      'licenseId': licenseId,
      'hospital': hospital,
      'clinicAddress': clinicAddress,
      'experienceYears': experienceYears,
      'consultationFee': consultationFee,
      'consultationHours': consultationHours,
      'approved': approved,
      'rating': rating,
      'reviewsCount': reviewsCount,
      'bio': bio,
    };
  }
}
