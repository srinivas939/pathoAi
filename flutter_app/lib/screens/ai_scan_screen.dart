// flutter_app/lib/screens/ai_scan_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/scan.dart';

class AIScanScreen extends StatefulWidget {
  const AIScanScreen({super.key});

  @override
  State<AIScanScreen> createState() => _AIScanScreenState();
}

class _AIScanScreenState extends State<AIScanScreen> {
  final List<String> _selectedSymptoms = ['Pigmented Mole Border', 'Erythema (Redness)'];
  String _affectedArea = 'Arm / Leg';
  String _durationDays = '3-5 days';
  ScanModel? _analyzedResult;

  final List<String> _symptomOptions = [
    'Pigmented Mole Border',
    'Erythema (Redness)',
    'Scaling / Silvery Plaques',
    'Itching (Pruritus)',
    'Bleeding / Crust',
  ];

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Pathology Scanner'),
        backgroundColor: const Color(0xFF0284C7),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image Upload Placeholder Container
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: const Color(0xFF0284C7).withOpacity(0.4),
                  style: BorderStyle.solid,
                  width: 2,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(
                    Icons.cloud_upload_outlined,
                    size: 48,
                    color: Color(0xFF0284C7),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Upload Skin / Pathology Scan Image',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'JPEG, PNG high-resolution dermoscopy scan',
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Symptoms Checklist
            const Text(
              'Select Primary Symptoms:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _symptomOptions.map((sym) {
                final isChecked = _selectedSymptoms.contains(sym);
                return FilterChip(
                  label: Text(sym),
                  selected: isChecked,
                  selectedColor: const Color(0xFFE0F2FE),
                  checkmarkColor: const Color(0xFF0284C7),
                  onSelected: (val) {
                    setState(() {
                      if (val) {
                        _selectedSymptoms.add(sym);
                      } else {
                        _selectedSymptoms.remove(sym);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Affected Area Dropdown
            DropdownButtonFormField<String>(
              value: _affectedArea,
              decoration: InputDecoration(
                labelText: 'Affected Body Location',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              items: ['Arm / Leg', 'Torso / Back', 'Face / Neck', 'Scalp', 'Hands / Feet']
                  .map((loc) => DropdownMenuItem(value: loc, child: Text(loc)))
                  .toList(),
              onChanged: (val) => setState(() => _affectedArea = val!),
            ),
            const SizedBox(height: 24),

            // Analyze Button
            ElevatedButton.icon(
              onPressed: provider.isLoading
                  ? null
                  : () async {
                      final result = await provider.submitScan(
                        imageBase64: 'mock_dermoscopy_base64',
                        symptoms: _selectedSymptoms,
                        affectedArea: _affectedArea,
                        durationDays: _durationDays,
                      );
                      setState(() {
                        _analyzedResult = result;
                      });
                    },
              icon: const Icon(Icons.biotech_rounded),
              label: provider.isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('Run Gemini AI Pathology Analysis'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284C7),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 28),

            // Diagnostic Results Render Card
            if (_analyzedResult != null) ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF0284C7)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Chip(
                          label: Text('${_analyzedResult!.confidence}% Confidence'),
                          backgroundColor: const Color(0xFFE0F2FE),
                          labelStyle: const TextStyle(color: Color(0xFF0284C7), fontWeight: FontWeight.bold),
                        ),
                        Chip(
                          label: Text('Severity: ${_analyzedResult!.severity}'),
                          backgroundColor: const Color(0xFFFEF3C7),
                          labelStyle: const TextStyle(color: Color(0xFFD97706), fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _analyzedResult!.diseaseName,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _analyzedResult!.description,
                      style: const TextStyle(color: Color(0xFF475569), fontSize: 13),
                    ),
                    const Divider(height: 24),

                    const Text('Recommended Precautions:', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    ..._analyzedResult!.precautions.map((p) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_outline, size: 16, color: Color(0xFF10B981)),
                              const SizedBox(width: 8),
                              Expanded(child: Text(p, style: const TextStyle(fontSize: 12))),
                            ],
                          ),
                        )),
                  ],
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }
}
