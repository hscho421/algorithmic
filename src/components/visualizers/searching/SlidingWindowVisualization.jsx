export default function SlidingWindowVisualization({ state }) {
  const {
    items = [],
    itemType = 'number',
    l,
    r,
    activeIndex,
    bestRange,
    done,
  } = state || {};

  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-40 text-zinc-500 dark:text-zinc-500 italic">
        Empty input — add values to visualize
      </div>
    );
  }

  const cellWidth = 56;
  const cellGap = 6;
  const hasWindow = l !== null && r !== null;

  const isInWindow = (idx) => hasWindow && idx >= l && idx <= r;
  const isInBestRange = (idx) => bestRange && idx >= bestRange[0] && idx <= bestRange[1];

  const pointerX = (idx) => idx * (cellWidth + cellGap) + cellWidth / 2;

  const pointers = [];
  if (hasWindow) {
    pointers.push({ label: 'L', idx: l, color: '#3b82f6' });
    pointers.push({ label: 'R', idx: r, color: '#f59e0b' });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200/70 dark:border-emerald-700/40 bg-emerald-50/70 dark:bg-emerald-900/20 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          Best window
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="relative">
          <div
            className="relative h-10 mb-2"
            style={{ width: `${items.length * (cellWidth + cellGap)}px` }}
          >
            {pointers.map((p) => (
              <div
                key={p.label}
                className="absolute flex flex-col items-center transition-all duration-300 ease-out"
                style={{
                  left: `${pointerX(p.idx)}px`,
                  transform: 'translateX(-50%)',
                  top: 0,
                }}
              >
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: p.color, color: 'white' }}
                >
                  {p.label}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="mt-0.5">
                  <path
                    d="M6 0 L6 8 L3 5 M6 8 L9 5"
                    fill="none"
                    stroke={p.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-1">
            {items.map((value, idx) => {
              const inWindow = isInWindow(idx);
              const isBest = isInBestRange(idx);
              const isActive = idx === activeIndex && !done;

              return (
                <div key={idx} className="flex flex-col items-center" style={{ width: cellWidth }}>
                  <div
                    className={`
                      relative w-14 h-14 flex items-center justify-center rounded-lg
                      font-mono text-lg font-semibold transition-all duration-300
                      ${isBest
                        ? 'bg-emerald-500/90 border-2 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                        : inWindow
                          ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white'
                          : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                      }
                      ${isActive ? 'ring-2 ring-amber-400/70 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950' : ''}
                    `}
                  >
                    {itemType === 'number' ? value : value || '•'}
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono transition-colors duration-300 ${
                      isBest
                        ? 'text-emerald-500 font-semibold'
                        : inWindow
                          ? 'text-zinc-600 dark:text-zinc-400'
                          : 'text-zinc-400 dark:text-zinc-700'
                    }`}
                  >
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
