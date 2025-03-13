export default {
  // Base Colors
  black: '#000000',
  white: '#FFFFFF',

  // Theme Colors
  primary: '#FF7675', // Coral pink - main brand color
  primary_light: '#FF8E8D',
  primary_dark: '#E66867',

  // Background Colors
  bg_dark: '#1A1A1A', // Main dark background
  bg_darker: '#222222', // Navigation bar background
  surface_dark: '#333333', // Cards and elevated surfaces

  // Text Colors
  text_primary: '#FFFFFF', // Primary text on dark background
  text_secondary: '#AAAAAA', // Secondary/subtitle text
  text_tertiary: '#CCCCCC', // Less prominent text

  // UI Element Colors
  border: '#333333', // Border color for dividers
  accent_blue: '#3B82F6', // For special actions/links
  accent_orange: '#EAB308', // For warnings/special states

  // Status Colors
  success: '#4AAE70', // Success states (lighter_primary)
  success_dark: '#0E6C38', // Dark success (darker_primary)
  error: '#FF5252', // Error states
  warning: '#EAB308', // Warning states
} as const;
