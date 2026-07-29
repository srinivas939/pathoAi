// flutter_app/lib/screens/admin_dashboard_screen.dart

import 'package:flutter/material.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'System Administration & Clinical Analytics',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 16),

          // Stat Cards Grid
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.5,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              _buildMetricCard('Total Users', '142', Icons.people_outline, const Color(0xFF0284C7)),
              _buildMetricCard('Pathology Scans', '389', Icons.biotech_outlined, const Color(0xFF10B981)),
              _buildMetricCard('Model Accuracy', '94.6%', Icons.verified_outlined, const Color(0xFF8B5CF6)),
              _buildMetricCard('Verified Doctors', '18', Icons.medical_services_outlined, const Color(0xFFF59E0B)),
            ],
          ),
          const SizedBox(height: 24),

          // Doctor Licensing Approvals
          const Text(
            'Pending Doctor Licenses for Verification',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),

          Card(
            child: ListTile(
              leading: const CircleAvatar(child: Text('DR')),
              title: const Text('Dr. Eleanor Vance, MD'),
              subtitle: const Text('License: MD-NY-98231 • Johns Hopkins'),
              trailing: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Doctor License Approved & Verified!')),
                  );
                },
                child: const Text('Approve MD'),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String val, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            val,
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    );
  }
}
