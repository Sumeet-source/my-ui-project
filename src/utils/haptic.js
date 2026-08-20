// Haptic feedback utility for mobile devices
export const triggerHaptic = (type = 'light') => {
  // Check if device supports vibration
  if (!navigator.vibrate) return;

  const patterns = {
    light: 10,        // Very light tap
    medium: 20,       // Normal tap
    heavy: 40,        // Strong tap
    success: [30, 50, 30],  // Success pattern
    error: [50, 30, 50, 30, 100], // Error pattern
    warning: [20, 30, 20],  // Warning pattern
    double: [15, 30, 15],   // Double tap
    long: 80,         // Long press
  };

  const pattern = patterns[type] || patterns.medium;
  
  if (typeof pattern === 'number') {
    navigator.vibrate(pattern);
  } else {
    navigator.vibrate(pattern);
  }
};

// Shortcut methods
export const haptic = {
  tap: () => triggerHaptic('light'),
  click: () => triggerHaptic('medium'),
  heavy: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  error: () => triggerHaptic('error'),
  warning: () => triggerHaptic('warning'),
  double: () => triggerHaptic('double'),
  long: () => triggerHaptic('long'),
};
