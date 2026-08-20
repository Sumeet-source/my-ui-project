// Haptic feedback utility - Vibration only (No Audio)

// Fallback for devices that don't support vibration (like iOS)
// We use a tiny CSS animation to simulate a "tap" feeling instead
const simulateTapFeedback = (intensity = 'light') => {
  // Create a temporary feedback element
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: ${intensity === 'heavy' ? '20px' : '10px'};
    height: ${intensity === 'heavy' ? '20px' : '10px'};
    background: transparent;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 999999;
    transition: none;
  `;
  document.body.appendChild(feedback);

  // Trigger the animation (scale up and fade out instantly)
  requestAnimationFrame(() => {
    feedback.style.transition = 'transform 0.05s, opacity 0.05s';
    feedback.style.transform = 'translate(-50%, -50%) scale(4)';
    feedback.style.opacity = '0';
  });

  // Clean up the element after animation
  setTimeout(() => {
    if (feedback.parentNode) feedback.parentNode.removeChild(feedback);
  }, 100);
};

export const triggerHaptic = (type = 'light') => {
  // 1. Check if native vibration API is available (Android, Chrome, etc.)
  if (navigator.vibrate) {
    const patterns = {
      light: 5,      // Very short, barely noticeable buzz
      medium: 15,    // Standard short buzz
      heavy: 30,     // Strong buzz
      success: [15, 20, 15],
      error: [30, 20, 30],
      warning: [15, 15, 15],
      double: [10, 20, 10],
      long: 50,
    };

    const pattern = patterns[type] || patterns.medium;
    
    if (typeof pattern === 'number') {
      navigator.vibrate(pattern);
    } else {
      navigator.vibrate(pattern);
    }
    return; // Exit after vibrating
  }

  // 2. Fallback for iOS / Browsers without vibrate API
  // We use a visual feedback simulation instead of playing any audio
  simulateTapFeedback(type);
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