import { useEffect } from 'react';

export default function useKeyboardShortcuts({
  onStep,
  onBack,
  onRunToggle,
  onReset,
  onToggleCode,
  onToggleInfo,
  onSpeedDecrease,
  onSpeedIncrease,
  onStop,
  onShowHelp,
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Check for modifier keys to avoid conflicts
      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (e.shiftKey && onBack) {
            onBack();
          } else if (onStep) {
            onStep();
          }
          break;

        case 'Enter':
          if (!hasModifier && onRunToggle) {
            e.preventDefault();
            onRunToggle();
          }
          break;

        case 'r':
        case 'R':
          if (!hasModifier && onReset) {
            e.preventDefault();
            onReset();
          }
          break;

        case 'c':
        case 'C':
          if (!hasModifier && onToggleCode) {
            e.preventDefault();
            onToggleCode();
          }
          break;

        case 'i':
        case 'I':
          if (!hasModifier && onToggleInfo) {
            e.preventDefault();
            onToggleInfo();
          }
          break;

        case '[':
          if (!hasModifier && onSpeedDecrease) {
            e.preventDefault();
            onSpeedDecrease();
          }
          break;

        case ']':
          if (!hasModifier && onSpeedIncrease) {
            e.preventDefault();
            onSpeedIncrease();
          }
          break;

        case 'Escape':
          if (onStop) {
            e.preventDefault();
            onStop();
          }
          break;

        case '?':
          if (!hasModifier && onShowHelp) {
            e.preventDefault();
            onShowHelp();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onStep,
    onBack,
    onRunToggle,
    onReset,
    onToggleCode,
    onToggleInfo,
    onSpeedDecrease,
    onSpeedIncrease,
    onStop,
    onShowHelp,
  ]);
}
