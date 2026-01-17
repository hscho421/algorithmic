// Shared DP Table Visualization Component
// Used for visualizing 1D and 2D DP tables
import { useEffect, useRef, useState } from 'react';

const useContainerWidth = (ref) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect) {
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

  const gap = Math.max(minGap, Math.min(baseGap, Math.floor(containerWidth / 120)));
  const totalGap = gap * Math.max(0, count - 1);
  const available = Math.max(0, containerWidth - totalGap);
  const cell = Math.floor(available / count);

  return {
    cell: Math.max(minCell, Math.min(maxCell, cell)),
    gap,
  };
};

export function DPTable1D({ dp, highlightIndex, label = 'dp', comparing = [] }) {
  if (!dp || dp.length === 0) {
    return <div className="text-zinc-500 dark:text-zinc-400 text-sm">No data to display</div>;
  }

  const containerRef = useRef(null);
  const containerWidth = useContainerWidth(containerRef);
  const labelWidth = 64;
  const { cell: cellWidth, gap: cellGap } = getCellMetrics(
    Math.max(0, containerWidth - labelWidth),
    dp.length,
    {
      minCell: 28,
      maxCell: 56,
      baseGap: 4,
      minGap: 2,
    },
  );
  const indexHeight = Math.max(24, Math.min(32, Math.round(cellWidth * 0.6)));
  const valueHeight = Math.max(32, Math.min(56, Math.round(cellWidth * 1)));

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div className="flex flex-col gap-3 min-w-0">
        {/* Index row */}
        <div className="flex" style={{ gap: cellGap }}>
          <div
            className="flex items-center justify-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
            style={{ width: labelWidth }}
          >
            {label}
          </div>
          {dp.map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center text-xs font-mono text-zinc-500 dark:text-zinc-400"
              style={{ width: cellWidth, height: indexHeight }}
            >
              [{idx}]
            </div>
          ))}
        </div>

        {/* Value row */}
        <div className="flex" style={{ gap: cellGap }}>
          <div
            className="flex items-center justify-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
            style={{ width: labelWidth }}
          >
            value
          </div>
          {dp.map((value, idx) => {
            const isHighlighted = highlightIndex === idx;
            const isComparing = comparing.includes(idx);
            const isInfinity = value === Infinity;

            return (
              <div
                key={idx}
                className={`
                  flex items-center justify-center rounded-lg
                  font-mono text-sm font-semibold transition-all duration-300
                  ${
                    isHighlighted
                      ? 'bg-emerald-500 border-2 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30'
                      : isComparing
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                        : value === 0
                          ? 'bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
                          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                  }
                `}
                style={{ width: cellWidth, height: valueHeight }}
              >
                {isInfinity ? '∞' : value}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DPTable2D({
  dp,
  rowLabels = [],
  colLabels = [],
  highlightCell = null,
  comparing = [],
  rowHeader = 'i',
  colHeader = 'j',
}) {
  if (!dp || dp.length === 0 || !dp[0] || dp[0].length === 0) {
    return <div className="text-zinc-500 dark:text-zinc-400 text-sm">No data to display</div>;
  }

  const rows = dp.length;
  const cols = dp[0].length;

  const isHighlighted = (i, j) => {
    if (!highlightCell) return false;
    return highlightCell[0] === i && highlightCell[1] === j;
  };

  const isComparing = (i, j) => {
    return comparing.some(([ci, cj]) => ci === i && cj === j);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 flex justify-center">
      <div className="flex flex-col gap-1 min-w-min">
        {/* Column headers */}
        <div className="flex gap-1">
          {/* Empty space for row header alignment */}
          <div className="w-24 h-10 flex items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {/* Only show header if it's meaningful (not 'i', 'j', 'text1', 'text2') */}
          </div>
          {colLabels.map((label, idx) => (
            <div
              key={idx}
              className="w-12 h-10 flex flex-col items-center justify-center text-xs font-mono"
            >
              <span className="text-zinc-400 dark:text-zinc-500">[{idx}]</span>
              {label !== undefined && label !== null && (
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                  {label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {dp.map((row, i) => (
          <div key={i} className="flex gap-1">
            {/* Row header */}
            <div className="w-24 flex items-center justify-end pr-3 text-xs font-mono gap-2">
              <span className="text-zinc-400 dark:text-zinc-500">[{i}]</span>
              {rowLabels[i] !== undefined && rowLabels[i] !== null && (
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                  {rowLabels[i]}
                </span>
              )}
            </div>

            {/* Cells */}
            {row.map((value, j) => {
              const highlighted = isHighlighted(i, j);
              const isComp = isComparing(i, j);
              const isZero = value === 0;

              return (
                <div
                  key={j}
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-lg
                    font-mono text-sm font-semibold transition-all duration-300
                    ${
                      highlighted
                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30 z-10'
                        : isComp
                          ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                          : isZero
                            ? 'bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
                            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                    }
                  `}
                >
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecursionTreeVisualization({ callStack, memo, completedCalls }) {
  if (!callStack && !completedCalls) return null;

  const allCalls = [...(callStack || []), ...(completedCalls || [])];

  if (allCalls.length === 0) {
    return <div className="text-zinc-500 dark:text-zinc-400 text-sm">No calls to display</div>;
  }

  const maxDepth = Math.max(...allCalls.map((c) => c.depth || 0), 0);

  return (
    <div className="w-full overflow-x-auto pb-4 flex justify-center">
      <div className="flex flex-col gap-4 min-w-min py-4">
        {/* Render by depth level */}
        {Array.from({ length: maxDepth + 1 }, (_, depth) => {
          const callsAtDepth = allCalls.filter((c) => c.depth === depth);

          return (
            <div key={depth} className="flex justify-center gap-4">
              {callsAtDepth.map((call) => {
                const isActive = callStack?.some((c) => c.id === call.id);
                const isCompleted = completedCalls?.some((c) => c.id === call.id);
                const memoized = memo?.[call.n] !== undefined;

                return (
                  <div
                    key={call.id}
                    className={`
                      relative px-4 py-2 rounded-lg border-2 font-mono text-sm font-semibold
                      transition-all duration-300
                      ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-200'
                          : isCompleted && memoized
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-400 text-emerald-900 dark:text-emerald-200'
                            : isCompleted
                              ? 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                              : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>fib({call.n})</span>
                      {call.result !== undefined && (
                        <span className="text-xs opacity-70">= {call.result}</span>
                      )}
                      {memoized && isCompleted && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500"></div>
            <span>Memoized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-100 dark:bg-zinc-800/50 border-2 border-zinc-400"></div>
            <span>Computed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
