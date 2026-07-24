// flutter_app/lib/screens/patient_home_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import 'ai_scan_screen.dart';

class PatientHomeScreen extends StatelessWidget {
  const PatientHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.currentUser;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome Header Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0284C7), Color(0xFF0369A1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back, ${user?.name ?? "Patient"}!',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'AI-Powered Pathology Diagnosis & Doctor Consultations',
                        style: TextStyle(
                          color: Color(0xFFBAE6FD),
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const AIScanScreen(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.camera_alt_rounded, size: 18),
                        label: const Text('Start New Pathology Scan'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF0284C7),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 12,
                          ),
                        ),
                      )
                    ],
                  ),
                ),
                const Icon(
                  Icons.biotech_rounded,
                  size: 80,
                  color: Colors.white24,
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // Quick Action Cards
          Row(
            children: [
              Expanded(
                child: _buildActionCard(
                  title: 'Upload Lesion Image',
                  subtitle: 'Instant AI Classification',
                  icon: Icons.add_a_photo_outlined,
                  color: const Color(0xFF0EA5E9),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AIScanScreen()),
                    );
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildActionCard(
                  title: 'Book Doctor Visit',
                  subtitle: 'Consult Dermatopathologist',
                  icon: Icons.calendar_month_outlined,
                  color: const Color(0xFF10B981),
                  onTap: () {
                    _showDoctorBookingDialog(context, provider);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),

          // Diagnostic History Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recent Pathology Scans',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              TextButton(
                onPressed: () {},
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (provider.scansHistory.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Center(
                child: Column(
                  children: const [
                    Icon(
                      Icons.folder_open_rounded,
                      size: 48,
                      color: Color(0xFF94A3B8),
                    ),
                    SizedBox(height: 12),
                    Text(
                      'No Pathology Scans Yet',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF475569),
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Tap "Start New Pathology Scan" above to analyze skin lesions.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                    )
                  ],
                ),
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: provider.scansHistory.length,
              itemBuilder: (context, index) {
                final scan = provider.scansHistory[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    leading: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE0F2FE),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.biotech_outlined,
                        color: Color(0xFF0284C7),
                      ),
                    ),
                    title: Text(
                      scan.diseaseName,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      'Confidence: ${scan.confidence}% • Severity: ${scan.severity}',
                      style: const TextStyle(fontSize: 12),
                    ),
                    trailing: const Icon(Icons.chevron_right_rounded),
                  ),
                );
              },
            )
        ],
      ),
    );
  }

  Widget _buildActionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 8,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
            ),
          ],
        ),
      ),
    );
  }

  void _showDoctorBookingDialog(BuildContext context, AppProvider provider) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Book Specialist Consultation'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Available Dermatopathologists:'),
              const SizedBox(height: 12),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFF0284C7),
                  child: Text('DV', style: TextStyle(color: Colors.white)),
                ),
                title: const Text('Dr. Marcus Vance, MD'),
                subtitle: const Text('Johns Hopkins Medical Center • \$120'),
                trailing: ElevatedButton(
                  onPressed: () {
                    provider.bookConsultation(
                      doctorId: 'doc-1',
                      date: '2026-07-25',
                      timeSlot: '10:30 AM',
                      complaint: 'Skin Lesion Pathology Consultation',
                    );
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Appointment Request Sent to Doctor!'),
                      ),
                    );
                  },
                  child: const Text('Book'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
