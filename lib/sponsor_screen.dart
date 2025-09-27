import 'package:flutter/material.dart';

class SponsorScreen extends StatelessWidget {
  const SponsorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sponsor Matching'),
      ),
      body: const Center(
        child: Text('Sponsor Matching Screen'),
      ),
    );
  }
}
