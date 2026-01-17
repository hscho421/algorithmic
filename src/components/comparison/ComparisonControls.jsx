import { useEffect } from 'react';

export default function ComparisonControls({
  isRunning,
  canStep,
  canBack,
  speed,
  onStep,
  onBack,
  onReset,
  onTogglePlay,
  onSpeedChange,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (e.shiftKey && canBack) {
            onBack();
          } else if (canStep) {
            onStep();
          }
          break;
        case 'Enter':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onReset();
          break;
        case '[':
          e.preventDefault();
          onSpeedChange(Math.min(speed + 100, 2000));
          break;
        case ']':
          e.preventDefault();
          onSpeedChange(Math.max(speed - 100, 100));
          break;
        case 'Escape':
          e.preventDefault();
          if (isRunning) {
            onTogglePlay();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, canStep, canBack, speed, onStep, onBack, onReset, onTogglePlay, onSpeedChange]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            disabled={!canBack}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            title="Step Back (Shift + Space)"
          >
            ← Back
          </button>
          <button
            onClick={onStep}
            disabled={!canStep || isRunning}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            title="Step Forward (Space)"
          >
            Step →
          </button>
          <button
            onClick={onTogglePlay}
            disabled={!canStep && !isRunning}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }
            `}
            title="Run/Pause (Enter)"
          >
            {isRunning ? '⏸ Pause' : '▶ Run'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-medium"
            title="Reset (R)"
          >
            ↻ Reset
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Speed:
          </label>
          <button
            onClick={() => onSpeedChange(Math.min(speed + 100, 2000))}
            className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center"
            title="Slower ([)"
          >
            −
          </button>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-32"
          />
          <button
            onClick={() => onSpeedChange(Math.max(speed - 100, 100))}
            className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center"
            title="Faster (])"
          >
            +
          </button>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[60px]">
            {speed}ms
          </span>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Space</kbd> Step</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Shift+Space</kbd> Back</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Enter</kbd> Run/Pause</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">R</kbd> Reset</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">[</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">]</kbd> Speed</span>
        </div>
      </div>
    </div>
  );
}
