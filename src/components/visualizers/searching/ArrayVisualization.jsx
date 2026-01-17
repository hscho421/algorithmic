import { useEffect, useRef, useState } from 'react';
import { TEMPLATES } from '../../../lib/algorithms/searching/binarySearch';

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

// Helper component for pointer indicators
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

// Helper component for comparison badges
function ComparisonBadge({ comparison, m, array, target, r }) {
  const getComparisonStyle = () => {
    if (['less', 'less_or_equal', 'ascending', 'min_right'].includes(comparison)) {
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
    if (['greater', 'greater_or_equal'].includes(comparison)) {
      return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    }
    if (comparison === 'equal') {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
    if (['descending', 'min_left'].includes(comparison)) {
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
    if (comparison?.includes('sorted')) {
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    }
    return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
  };

  const getComparisonText = () => {
    const messages = {
      less: `a[${m}] = ${array[m]} < ${target} → go RIGHT`,
      less_or_equal: `a[${m}] = ${array[m]} ≤ ${target} → go RIGHT`,
      greater: `a[${m}] = ${array[m]} > ${target} → go LEFT`,
      greater_or_equal: `a[${m}] = ${array[m]} ≥ ${target} → go LEFT (keep M)`,
      equal: `a[${m}] = ${array[m]} = ${target} ✓ Found!`,
      ascending: `a[${m}] < a[${m + 1}] → peak is RIGHT`,
      descending: `a[${m}] ≥ a[${m + 1}] → peak is HERE or LEFT`,
      min_right: `a[${m}] > a[${r}] → min is in RIGHT half`,
      min_left: `a[${m}] ≤ a[${r}] → min is HERE or LEFT`,
      left_sorted_go_left: 'Left sorted, target in range → go LEFT',
      left_sorted_go_right: 'Left sorted, target out of range → go RIGHT',
      right_sorted_go_right: 'Right sorted, target in range → go RIGHT',
      right_sorted_go_left: 'Right sorted, target out of range → go LEFT',
    };
    return messages[comparison] || comparison;
  };

  return (
    <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${getComparisonStyle()}`}>
      {getComparisonText()}
    </div>
  );
}

export default function ArrayVisualization({ state }) {
  // Handle both 'array' (binary search) and 'items' (sliding window)
  const arrayData = state?.array || state?.items;

  if (!state || !arrayData || arrayData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 dark:text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

  const array = arrayData;
  const { l, r, m, templateKey, done, target, comparison, result, iteration } = state;
  const template = TEMPLATES[templateKey] || {};
  const n = array.length;
  const containerRef = useRef(null);
  const containerWidth = useContainerWidth(containerRef);
  const totalCells = n + (template.halfOpen ? 1 : 0);

  // Track previous positions for animation
  const [, setPrevPositions] = useState({ l: 0, r: n, m: null });

  // Update previous positions when state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevPositions({ l, r, m });
    }, 400);
    return () => clearTimeout(timer);
  }, [l, r, m, iteration]);

  if (n === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 dark:text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

  const { cell: cellWidth, gap: cellGap } = getCellMetrics(containerWidth, totalCells, {
    minCell: 24,
    maxCell: 60,
    baseGap: 4,
    minGap: 2,
  });
  const cellSize = Math.max(24, Math.min(56, cellWidth));
  const totalWidth = totalCells * cellWidth + (totalCells - 1) * cellGap;
  const pointerSpread = Math.max(10, Math.min(24, Math.round(cellWidth * 0.4)));

  const isInRange = (idx) => {
    if (done) return idx === result && result !== -1;
    return template.halfOpen ? idx >= l && idx < r : idx >= l && idx <= r;
  };

  const isResultIndex = (idx) => {
    return done && result !== -1 && idx === result;
  };

  // Calculate pixel position for a pointer at given index
  const getPointerX = (idx) => {
    if (idx === null || idx === undefined) return 0;
    return idx * (cellWidth + cellGap) + cellWidth / 2;
  };

  // Determine which pointers exist and their positions
  const getPointers = () => {
    if (done) return [];
    
    const pointers = [];
    
    pointers.push({ label: 'L', color: '#3b82f6', idx: l, priority: 1 });
    
    if (m !== null) {
      pointers.push({ label: 'M', color: '#10b981', idx: m, priority: 2 });
    }
    
    // R position depends on interval type
    const rIdx = template.halfOpen ? r : r;
    pointers.push({ label: 'R', color: '#ef4444', idx: rIdx, priority: 3 });
    
    return pointers;
  };

  // Group pointers by index and calculate offsets
  const getPointerGroups = () => {
    const pointers = getPointers();
    const groups = {};
    
    pointers.forEach((p) => {
      const key = p.idx;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(p);
    });
    
    // Calculate offsets for each pointer
    const result = [];
    Object.values(groups).forEach((group) => {
      const count = group.length;
      group.forEach((p, i) => {
        // Spread pointers horizontally when overlapping
        const offsetX = count === 1 ? 0 : (i - (count - 1) / 2) * pointerSpread;
        result.push({ ...p, offsetX });
      });
    });
    
    return result;
  };

  const pointersWithOffsets = getPointerGroups();

  return (
    <div className="space-y-8 w-full">
      {/* Interval type badge */}
      <div className="flex justify-center">
        <div className={`
          inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-sm font-medium
          ${template.halfOpen
            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400'
            : 'bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400'
          }
        `}>
          <span className="font-mono font-bold text-base">
            {template.halfOpen ? '[L, R)' : '[L, R]'}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400 text-xs">
            {template.halfOpen ? 'R excluded' : 'L and R included'}
          </span>
        </div>
      </div>

      {/* Array visualization with sliding pointers */}
      <div className="flex justify-center pb-2">
        <div className="w-full max-w-full" ref={containerRef}>
          <div className="relative mx-auto" style={{ width: `${totalWidth}px` }}>
            {/* Pointer track - positioned above cells */}
            <div
              className="relative h-12 mb-2"
              style={{ width: `${totalWidth}px` }}
            >
              {pointersWithOffsets.map((p) => (
                <div
                  key={p.label}
                  className="absolute flex flex-col items-center transition-all duration-400 ease-out"
                  style={{
                    left: `${getPointerX(p.idx) + p.offsetX}px`,
                    transform: 'translateX(-50%)',
                    top: 0,
                    zIndex: p.priority,
                  }}
                >
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: p.color, color: 'white' }}
                  >
                    {p.label}
                  </span>
                  <svg
                    width="12"
                    height="16"
                    viewBox="0 0 12 16"
                    className="mt-0.5"
                  >
                    <path
                      d={`M6 0 L6 12 L2 8 M6 12 L10 8`}
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

          {/* Array cells */}
            <div className="flex items-end" style={{ gap: `${cellGap}px` }}>
              {array.map((value, idx) => {
                const inRange = isInRange(idx);
                const isMiddle = idx === m && !done;
                const isTarget = value === target && isMiddle;
                const isResultCell = isResultIndex(idx);

                return (
                  <div key={idx} className="flex flex-col items-center" style={{ width: cellWidth }}>
                    {/* Array cell */}
                    <div
                      className={`
                        relative flex items-center justify-center rounded-lg
                        font-mono text-lg font-semibold transition-all duration-300
                        ${isResultCell
                          ? 'bg-emerald-500 border-2 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30'
                          : inRange
                            ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white shadow-lg shadow-zinc-900/20 dark:shadow-[0_6px_16px_rgba(0,0,0,0.55)]'
                            : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                        }
                        ${isMiddle && !done ? 'ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950' : ''}
                        ${isTarget && comparison === 'equal' ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500' : ''}
                      `}
                      style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    >
                      {value}
                    </div>

                  {/* Index label */}
                    <span className={`mt-2 text-xs font-mono transition-colors duration-300 ${
                      isResultCell
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : inRange
                          ? 'text-zinc-600 dark:text-zinc-400'
                          : 'text-zinc-400 dark:text-zinc-700'
                    }`}>
                      [{idx}]
                    </span>
                  </div>
                );
              })}

            {/* End marker for half-open intervals */}
              {template.halfOpen && (
                <div className="flex flex-col items-center" style={{ width: cellWidth }}>
                  <div className={`
                    flex items-center justify-center rounded-lg 
                    border-2 border-dashed transition-all duration-300
                    ${r === n && !done
                      ? 'border-red-500/50 text-red-500 dark:text-red-400 bg-red-500/5'
                      : 'border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600'
                    }
                  `}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}>
                    <span className="text-sm">end</span>
                  </div>
                  <span className="mt-2 text-xs font-mono text-zinc-400 dark:text-zinc-700">[{n}]</span>
                </div>
              )}
          </div>
          </div>
        </div>
      </div>

      {/* Comparison indicator */}
      {m !== null && comparison && !done && (
        <div className="flex justify-center px-4">
          <ComparisonBadge comparison={comparison} m={m} array={array} target={target} r={r} />
        </div>
      )}

      {/* Pointer status and search range */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-6 text-sm">
          <PointerIndicator label="L" value={l} color="bg-blue-500" />
          <PointerIndicator label="M" value={m ?? '—'} color={m !== null ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'} />
          <PointerIndicator
            label="R"
            value={r}
            color="bg-red-500"
            suffix={template.halfOpen ? '(excluded)' : undefined}
          />
        </div>

        {!done && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Range: {template.halfOpen ? `[${l}, ${r})` : `[${l}, ${r}]`} = {' '}
            {template.halfOpen ? r - l : r - l + 1} element{(template.halfOpen ? r - l : r - l + 1) !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
