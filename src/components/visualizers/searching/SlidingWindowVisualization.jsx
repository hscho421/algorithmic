import { useEffect, useRef, useState } from 'react';

const useContainerWidth = (ref) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return width;
};

const getCellMetrics = (containerWidth, count, { minCell, maxCell, baseGap, minGap }) => {
  if (!containerWidth || count <= 0) {
    return { cell: maxCell, gap: baseGap };
  }

  let gap = baseGap;
  let available = containerWidth - gap * (count - 1);
  let cell = Math.floor(available / count);

  if (cell < minCell) {
    gap = minGap;
    available = containerWidth - gap * (count - 1);
    cell = Math.floor(available / count);
  }

  cell = Math.max(12, Math.min(maxCell, cell));
  return { cell, gap };
};

function PointerIndicator({ label, value, color, suffix }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded ${color} flex items-center justify-center shadow-sm`}>
        <span className="text-white text-xs font-bold">{label}</span>
      </div>
      <span className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">= {value}</span>
      {suffix && <span className="text-zinc-400 dark:text-zinc-500 text-xs">{suffix}</span>}
    </div>
  );
}

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

  const containerRef = useRef(null);
  const containerWidth = useContainerWidth(containerRef);
  const { cell: cellWidth, gap: cellGap } = getCellMetrics(containerWidth, items.length, {
    minCell: 24,
    maxCell: 56,
    baseGap: 6,
    minGap: 2,
  });
  const cellSize = Math.max(24, Math.min(56, cellWidth));
  const totalWidth = items.length * cellWidth + (items.length - 1) * cellGap;
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

      <div className="flex justify-center pb-2">
        <div className="w-full max-w-full" ref={containerRef}>
          <div className="relative mx-auto" style={{ width: `${totalWidth}px` }}>
            <div
              className="relative h-10 mb-2"
              style={{ width: `${totalWidth}px` }}
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

            <div className="flex items-end" style={{ gap: `${cellGap}px` }}>
              {items.map((value, idx) => {
                const inWindow = isInWindow(idx);
                const isBest = isInBestRange(idx);
                const isActive = idx === activeIndex && !done;

                return (
                  <div key={idx} className="flex flex-col items-center" style={{ width: cellWidth }}>
                    <div
                      className={`
                        relative flex items-center justify-center rounded-lg
                        font-mono text-lg font-semibold transition-all duration-300
                        ${isBest
                          ? 'bg-emerald-500/90 border-2 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                          : inWindow
                            ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white'
                            : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                        }
                        ${isActive ? 'ring-2 ring-amber-400/70 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950' : ''}
                      `}
                      style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
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

      {hasWindow && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-6 text-sm">
            <PointerIndicator label="L" value={l} color="bg-blue-500" />
            <PointerIndicator label="R" value={r} color="bg-amber-500" />
          </div>
          {!done && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Window: [{l}, {r}] = {r - l + 1} element{r - l + 1 !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
