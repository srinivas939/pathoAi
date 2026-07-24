// flutter_app/lib/screens/doctor_dashboard_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class DoctorDashboardScreen extends StatelessWidget {
  const DoctorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.currentUser;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Doctor Profile Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Color(0xFF0284C7),
                  child: Icon(Icons.medical_services_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user?.name ?? 'Dr. Marcus Vance, MD',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '${user?.specialization ?? "Dermatopathologist"} • ${user?.hospital ?? "Johns Hopkins Medical"}',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
                Chip(
                  label: const Text('Verified MD'),
                  backgroundColor: const Color(0xFFDCFCE7),
                  labelStyle: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold),
                )
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Appointment Requests Section
          const Text(
            'Patient Consultation Requests',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 12),

          if (provider.appointmentsList.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Center(
                child: Text('No pending consultation requests.'),
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: provider.appointmentsList.length,
              itemBuilder: (context, index) {
                final appt = provider.appointmentsList[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    title: Text(appt.patientName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('${appt.date} at ${appt.timeSlot} • Complaint: ${appt.complaint}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.check_circle_rounded, color: Colors.green),
                          onPressed: () {
                            provider.updateAppointmentStatus(appt.id, 'accepted');
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.cancel_rounded, color: Colors.red),
                          onPressed: () {
                            provider.updateAppointmentStatus(appt.id, 'rejected');
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
