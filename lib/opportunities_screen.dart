// lib/opportunities_screen.dart
import 'package:flutter/material.dart';
import 'isar_service.dart';
import 'match_model.dart';

class OpportunitiesScreen extends StatelessWidget {
  const OpportunitiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isarService = IsarService();
    return Scaffold(
      appBar: AppBar(title: const Text('Your Opportunities')),
      body: FutureBuilder<List<Match>>(
        future:isarService.getMatches(), // Corrected from getmatches to getMatches
        builder: (context, snapshot) {
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No new opportunities right now. Keep up the great work!'));
          }
          final matches = snapshot.data!;
          return ListView.builder(
            itemCount: matches.length,
            itemBuilder: (context, index) {
              final match = matches[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.handshake, color: Colors.green),
                  title: Text(match.sponsorName, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(match.matchReason),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () { /* Navigate to a detail screen for the match */ },
                ),
              );
            },
          );
        },
      ),
    );
  }
}