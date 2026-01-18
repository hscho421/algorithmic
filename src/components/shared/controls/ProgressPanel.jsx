import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAuthContext from '../../../context/useAuthContext';
import useUserPreferences from '../../../context/useUserPreferences';
import { PRO_CHECKPOINT_LIMIT } from '../../../constants';

export default function ProgressPanel({
  progress,
  isLoading,
  onResume,
  onClear,
  checkpoints = [],
  onSaveCheckpoint,
  onLoadCheckpoint,
  onDeleteCheckpoint,
}) {
  const { isAuthenticated } = useAuthContext();
  const { isPro } = useUserPreferences();

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
      {isAuthenticated && !isPro && (
        <div className="rounded-lg border border-dashed border-amber-200/70 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-300">
          Checkpoints are Pro-only.{' '}
          <Link to="/pricing" className="underline hover:text-amber-500">
            Go Pro to save checkpoints
          </Link>
          .
        </div>
      )}
      {isAuthenticated && isPro && (
        <div className="rounded-lg border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
          <div className="flex items-center justify-between">
            <span>Checkpoints</span>
            <button
              type="button"
              onClick={() => onSaveCheckpoint?.()}
              className="text-teal-600 dark:text-teal-400 hover:text-teal-500"
            >
              Save checkpoint
            </button>
          </div>
          {checkpoints.length === 0 && (
            <div className="text-zinc-500 dark:text-zinc-400">
              No checkpoints yet. (Up to {PRO_CHECKPOINT_LIMIT}.)
            </div>
          )}
          {checkpoints.map((checkpoint) => (
            <div
              key={checkpoint.id}
              className="flex items-center justify-between gap-2 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 px-2 py-1"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{checkpoint.label}</div>
                <div className="text-[11px] text-zinc-400">
                  {checkpoint.savedAt}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLoadCheckpoint?.(checkpoint.payload)}
                  className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCheckpoint?.(checkpoint.id)}
                  className="text-rose-500 hover:text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
