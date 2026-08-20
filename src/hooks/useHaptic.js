import { useCallback } from 'react';
import { haptic } from '../utils/haptic';

export const useHaptic = () => {
  const tap = useCallback(() => haptic.tap(), []);
  const click = useCallback(() => haptic.click(), []);
  const heavy = useCallback(() => haptic.heavy(), []);
  const success = useCallback(() => haptic.success(), []);
  const error = useCallback(() => haptic.error(), []);
  const warning = useCallback(() => haptic.warning(), []);
  const double = useCallback(() => haptic.double(), []);
  const long = useCallback(() => haptic.long(), []);

  return { tap, click, heavy, success, error, warning, double, long };
};
