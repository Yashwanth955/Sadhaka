// Fitness Assessment & Tracking App — Design System Palette
// Clean Light Mode Foundation + High-Contrast Dark Recording/Analysis Interface

export const colors = {
  // 🎨 Primary & Accent Colors (Energy & Motivation)
  primary: '#2563EB',          // Electric Blue (Tailwind blue-600) — Primary CTAs, active items
  primaryLight: '#3B82F6',     // Electric Blue Light (Tailwind blue-500) — Hover, charts, badges
  primaryContainer: '#EFF6FF', // Light blue fill container
  onPrimary: '#FFFFFF',        // Text on primary button
  onPrimaryContainer: '#1D4ED8',

  // Success / Positive Feedback
  success: '#10B981',          // Vibrant Mint (Tailwind emerald-500) — Validated posture, completed status
  successLight: '#22C55E',     // Green 500 — Positive streak counters, "Good Rep" tags
  excellent: '#10B981',        // Benchmark Excellent tier

  // Motivation & Caution
  amber: '#F59E0B',            // Warm Amber (Tailwind amber-500) — Trophy icons, improvement tips
  gold: '#EAB308',             // Yellow 500 — Achievement stars, caution badges
  average: '#F59E0B',          // Benchmark Average tier
  good: '#3B82F6',             // Benchmark Good tier

  // Attention & Warnings
  danger: '#EF4444',           // Coral / Attention Red (Tailwind red-500) — Form correction warnings
  coral: '#F43F5E',            // Rose 500 — Retake tags, error states
  needsImprovement: '#EF4444', // Benchmark Needs Improvement tier

  // ☀️ Light Theme (Dashboard, Progress, Authentication, Profile)
  background: '#F8FAFC',       // Slate 50 — Main app background
  backgroundEnd: '#EEF2F6',    // Subtle linear gradient end
  surface: '#FFFFFF',          // Card / Surface background (White)
  surfaceVariant: '#F1F5F9',   // Slate 100
  surfaceContainer: '#F8FAFC',
  surfaceContainerHighest: '#F1F5F9',
  surfaceContainerLow: '#FFFFFF',
  border: '#E2E8F0',           // Card Borders / Dividers (Slate 200)
  divider: '#F1F5F9',          // Slate 100
  interactiveFill: '#F1F5F9',  // Secondary button fill
  interactiveFillHover: '#E2E8F0',

  // Light Theme Typography
  textPrimary: '#0F172A',      // Slate 900 — Main readable text
  textSecondary: '#64748B',    // Slate 500 — Muted / secondary text
  onSurface: '#0F172A',        // Slate 900
  onSurfaceVariant: '#64748B',  // Slate 500
  outline: '#94A3B8',          // Slate 400
  outlineVariant: '#E2E8F0',   // Slate 200

  // 🌙 Dark Theme (Video Recording & Real-time AI Analysis Pages)
  darkCanvas: '#0B0F19',       // Deep Obsidian / Pitch Slate — Camera / canvas background
  darkSurface: 'rgba(15, 23, 42, 0.75)', // Overlay card surfaces
  darkSurfaceElevated: 'rgba(30, 41, 59, 0.85)',
  darkBorder: 'rgba(255, 255, 255, 0.12)', // Surface borders
  darkTextPrimary: '#F8FAFC',  // Slate 50
  darkTextSecondary: '#94A3B8',// Slate 400
  hudCyan: '#06B6D4',          // Neon Cyan — High contrast AI skeleton pose overlay
  hudLime: '#84CC16',          // Electric Lime — Pose alignment indicator lines

  // 📊 Data Visualization & Graph Palette
  chartTargetLine: '#3B82F6',  // Electric Blue
  chartComparison: '#94A3B8',  // Dashed Gray
  chartAreaFill: 'rgba(59, 130, 246, 0.25)',
  benchmarkGreen: '#10B981',   // Emerald Green / SAI standard

  // Base Utilities
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export default colors;
