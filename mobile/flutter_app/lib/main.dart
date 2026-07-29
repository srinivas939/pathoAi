// flutter_app/lib/main.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart';
import 'models/user.dart';
import 'screens/login_screen.dart';
import 'screens/patient_home_screen.dart';
import 'screens/doctor_dashboard_screen.dart';
import 'screens/admin_dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppProvider(),
      child: const PathoAIApp(),
    ),
  );
}

class PathoAIApp extends StatelessWidget {
  const PathoAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PathoAI - Medical Pathology & Diagnostic Platform',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          primary: const Color(0xFF0284C7),
          surface: const Color(0xFFF8FAFC),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
        ),
      ),
      home: const MainShellScreen(),
    );
  }
}

class MainShellScreen extends StatelessWidget {
  const MainShellScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.currentUser;

    if (user == null) {
      return const LoginScreen();
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.biotech_rounded, color: Color(0xFF0284C7)),
            ),
            const SizedBox(width: 10),
            const Text(
              'PathoAI',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          // Role Quick Switcher for testing
          DropdownButton<UserRole>(
            value: user.role,
            underline: const SizedBox(),
            items: const [
              DropdownMenuItem(value: UserRole.patient, child: Text('Patient View')),
              DropdownMenuItem(value: UserRole.doctor, child: Text('Doctor View')),
              DropdownMenuItem(value: UserRole.admin, child: Text('Admin View')),
            ],
            onChanged: (role) {
              if (role != null) provider.switchRole(role);
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () {
              provider.currentUser = null;
              provider.notifyListeners();
            },
          )
        ],
      ),
      body: _buildRoleScreen(user.role),
    );
  }

  Widget _buildRoleScreen(UserRole role) {
    switch (role) {
      case UserRole.patient:
        return const PatientHomeScreen();
      case UserRole.doctor:
        return const DoctorDashboardScreen();
      case UserRole.admin:
        return const AdminDashboardScreen();
    }
  }
}
