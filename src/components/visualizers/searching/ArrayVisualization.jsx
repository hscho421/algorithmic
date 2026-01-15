import { useEffect, useState } from 'react';
import { TEMPLATES } from '../../../lib/algorithms/searching/binarySearch';

export default function ArrayVisualization({ state }) {
  const { array, l, r, m, templateKey, done, target, comparison, result, iteration } = state;
  const template = TEMPLATES[templateKey];
  const n = array.length;

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

  const cellWidth = 60;
  const cellGap = 4;

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
        const offsetX = count === 1 ? 0 : (i - (count - 1) / 2) * 24;
        result.push({ ...p, offsetX });
      });
    });
    
    return result;
  };

  const pointersWithOffsets = getPointerGroups();

  return (
    <div className="space-y-6">
      {/* Interval type explanation */}
      <div className="flex justify-center">
        <div className={`
          inline-flex items-center gap-3 px-4 py-2 rounded-lg text-sm
          ${template.halfOpen 
            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400' 
            : 'bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400'
          }
        `}>
          <span className="font-mono font-bold">
            {template.halfOpen ? '[L, R)' : '[L, R]'}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            {template.halfOpen 
              ? 'Half-open: R is excluded from search range' 
              : 'Closed: Both L and R are included in search range'
            }
          </span>
        </div>
      </div>

      {/* Array visualization with sliding pointers */}
      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="relative">
          {/* Pointer track - positioned above cells */}
          <div 
            className="relative h-12 mb-2" 
            style={{ width: `${(n + (template.halfOpen ? 1 : 0)) * (cellWidth + cellGap)}px` }}
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
          <div className="flex items-end gap-1">
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
                      relative w-14 h-14 flex items-center justify-center rounded-lg
                      font-mono text-lg font-semibold transition-all duration-300
                      ${isResultCell
                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30'
                        : inRange
                          ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white shadow-lg shadow-zinc-900/20 dark:shadow-zinc-900/50'
                          : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                      }
                      ${isMiddle && !done ? 'ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950' : ''}
                      ${isTarget && comparison === 'equal' ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500' : ''}
                    `}
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
                  w-14 h-14 flex items-center justify-center rounded-lg 
                  border-2 border-dashed transition-all duration-300
                  ${r === n && !done
                    ? 'border-red-500/50 text-red-500 dark:text-red-400 bg-red-500/5'
                    : 'border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600'
                  }
                `}>
                  <span className="text-sm">end</span>
                </div>
                <span className="mt-2 text-xs font-mono text-zinc-400 dark:text-zinc-700">[{n}]</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison indicator - moved below array */}
      {m !== null && comparison && !done && (
        <div className="flex justify-center">
          <div
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${comparison === 'less' || comparison === 'less_or_equal' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' : ''}
              ${comparison === 'greater' || comparison === 'greater_or_equal' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : ''}
              ${comparison === 'equal' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : ''}
              ${comparison === 'ascending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' : ''}
              ${comparison === 'descending' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : ''}
              ${comparison === 'min_right' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' : ''}
              ${comparison === 'min_left' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : ''}
              ${comparison?.includes('sorted') ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800' : ''}
            `}
          >
            {comparison === 'less' && `a[${m}] = ${array[m]} < ${target} → go RIGHT`}
            {comparison === 'less_or_equal' && `a[${m}] = ${array[m]} ≤ ${target} → go RIGHT`}
            {comparison === 'greater' && `a[${m}] = ${array[m]} > ${target} → go LEFT`}
            {comparison === 'greater_or_equal' && `a[${m}] = ${array[m]} ≥ ${target} → go LEFT (keep M)`}
            {comparison === 'equal' && `a[${m}] = ${array[m]} = ${target} ✓ Found!`}
            {comparison === 'ascending' && `a[${m}] < a[${m + 1}] → peak is RIGHT`}
            {comparison === 'descending' && `a[${m}] ≥ a[${m + 1}] → peak is HERE or LEFT`}
            {comparison === 'min_right' && `a[${m}] > a[${r}] → min is in RIGHT half`}
            {comparison === 'min_left' && `a[${m}] ≤ a[${r}] → min is HERE or LEFT`}
            {comparison === 'left_sorted_go_left' && `Left sorted, target in range → go LEFT`}
            {comparison === 'left_sorted_go_right' && `Left sorted, target out of range → go RIGHT`}
            {comparison === 'right_sorted_go_right' && `Right sorted, target in range → go RIGHT`}
            {comparison === 'right_sorted_go_left' && `Right sorted, target out of range → go LEFT`}
          </div>
        </div>
      )}

      {/* Pointer status bar */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-zinc-600 dark:text-zinc-400 font-mono">= {l}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded flex items-center justify-center ${m !== null ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-zinc-600 dark:text-zinc-400 font-mono">= {m ?? '—'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="text-zinc-600 dark:text-zinc-400 font-mono">= {r}</span>
          {template.halfOpen && (
            <span className="text-zinc-400 dark:text-zinc-500 text-xs">(excluded)</span>
          )}
        </div>
      </div>

      {/* Search range indicator */}
      {!done && (
        <div className="flex justify-center">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Searching indices{' '}
            <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
              {template.halfOpen ? `[${l}, ${r})` : `[${l}, ${r}]`}
            </span>
            {' '}→{' '}
            <span className="font-mono">
              {template.halfOpen ? r - l : r - l + 1}
            </span>
            {' '}element{(template.halfOpen ? r - l : r - l + 1) !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}