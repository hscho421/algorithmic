import { useMemo } from 'react';
import useAuthContext from '../../../context/useAuthContext';

export default function ProgressPanel({ progress, isLoading, onResume, onClear }) {
  const { isAuthenticated } = useAuthContext();

  const lastSeen = useMemo(() => {
    if (!progress?.last_seen_at) return null;
    try {
      return new Date(progress.last_seen_at).toLocaleString();
    } catch {
      return null;
    }
  }, [progress?.last_seen_at]);

  return (
    <div className="mt-6 space-y-3">
      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        Progress
      </div>
      {!isAuthenticated && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Sign in to track your progress.
        </div>
      )}
      {isLoading && <div className="text-xs text-zinc-500">Loading…</div>}
      {!isLoading && isAuthenticated && !progress && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400">No saved progress yet.</div>
      )}
      {!isLoading && progress && (
        <div className="rounded-lg border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
          <div className="flex items-center justify-between">
            <span>Last step: {progress.last_step ?? 0}</span>
            {lastSeen && <span className="text-zinc-400">{lastSeen}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResume}
              className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-rose-500 hover:text-rose-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
