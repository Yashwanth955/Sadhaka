import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class StreaksScreen extends StatefulWidget {
  const StreaksScreen({super.key});

  @override
  State<StreaksScreen> createState() => _StreaksScreenState();
}

class _StreaksScreenState extends State<StreaksScreen> {
  // --- State Variables ---
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  late final Map<DateTime, List<String>> _events;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;

    // Sample data for tests taken on specific days.
    // In a real app, you would fetch this from a database.
    _events = {
      DateTime.utc(2025, 9, 18): ['Push-up Test', '1.6km Run Test'],
      DateTime.utc(2025, 9, 20): ['Standing Broad Jump'],
      DateTime.utc(2025, 9, 21): ['Sit and Reach Test'],
      DateTime.utc(2025, 9, 22): ['4*10mts Shuttle Run', 'Push-up Test'],
      DateTime.utc(2025, 9, 23): ['1.6km Run Test'], // Today
    };
  }

  // A helper function to get the tests for a specific day.
  List<String> _getEventsForDay(DateTime day) {
    // Important: Use `isSameDay` from the package to ignore time differences.
    return _events[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);
    final selectedDayEvents = _getEventsForDay(_selectedDay!);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Consistency & Streaks', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          // A simple card to show the current streak
          _buildStreakCounter(),

          // The Calendar Widget
          TableCalendar(
            firstDay: DateTime.utc(2024, 1, 1),
            lastDay: DateTime.utc(2026, 12, 31),
            focusedDay: _focusedDay,
            calendarFormat: CalendarFormat.month,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            eventLoader: _getEventsForDay, // Marks the days with tests
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay; // update `_focusedDay` here as well
              });
            },
            // --- UI Customization for the calendar ---
            calendarStyle: CalendarStyle(
              // Style for the markers (dots) indicating a test was taken
              markerDecoration: const BoxDecoration(
                color: primaryGreen,
                shape: BoxShape.circle,
              ),
              // Style for the selected day
              selectedDecoration: BoxDecoration(
                color: primaryGreen.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              // Style for today's date
              todayDecoration: BoxDecoration(
                color: Colors.grey.shade300,
                shape: BoxShape.circle,
              ),
            ),
            headerStyle: const HeaderStyle(
              titleCentered: true,
              formatButtonVisible: false,
            ),
          ),
          const SizedBox(height: 16.0),

          // --- The list of tests taken on the selected day ---
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Text(
                    'Tests on ${_selectedDay!.day}/${_selectedDay!.month}/${_selectedDay!.year}',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                const Divider(height: 24),
                Expanded(
                  child: selectedDayEvents.isEmpty
                      ? const Center(child: Text('No tests were taken on this day.'))
                      : ListView.builder(
                    itemCount: selectedDayEvents.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        leading: const Icon(Icons.assignment_turned_in, color: primaryGreen),
                        title: Text(selectedDayEvents[index]),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStreakCounter() {
    return Container(
      margin: const EdgeInsets.all(16.0),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F5E9), // Light green background
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.local_fire_department, color: Colors.orange),
          SizedBox(width: 8),
          Text(
            'Current Streak: 3 Days!',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ],
      ),
    );
  }
}