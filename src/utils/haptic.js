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
// Haptic feedback utility for iOS & Android

let audioCtx = null;

// 🟢 iOS-friendly haptic using Audio Context
const playIOSHaptic = (intensity = 0.05) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.value = 150;
    osc.type = 'sine';
    gain.gain.value = intensity;
    
    osc.start(0);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    osc.stop(audioCtx.currentTime + 0.05);
    
    return true;
  } catch (e) {
    console.log('Haptic not supported');
    return false;
  }
};

export const triggerHaptic = (type = 'light') => {
  // iOS: Use Audio Context (since vibrate API is not supported)
  if (!navigator.vibrate) {
    const intensityMap = {
      light: 0.03,
      medium: 0.05,
      heavy: 0.08,
      success: 0.06,
      error: 0.08,
      warning: 0.05,
      double: 0.04,
      long: 0.07,
    };
    playIOSHaptic(intensityMap[type] || 0.05);
    return;
  }

  // Android: Use vibration API
  const patterns = {
    light: 10,
    medium: 20,
    heavy: 40,
    success: [30, 50, 30],
    error: [50, 30, 50, 30, 100],
    warning: [20, 30, 20],
    double: [15, 30, 15],
    long: 80,
  };

  const pattern = patterns[type] || patterns.medium;
  
  if (typeof pattern === 'number') {
    navigator.vibrate(pattern);
  } else {
    navigator.vibrate(pattern);
  }
};

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
