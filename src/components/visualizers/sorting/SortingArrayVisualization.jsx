import { useEffect, useRef, useState } from 'react';

const useContainerSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
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

  cell = Math.max(8, Math.min(maxCell, cell));
  return { cell, gap };
};

export default function SortingArrayVisualization({ state }) {
  // Handle both 'array' (sorting/binary search) and 'items' (sliding window)
  const arrayData = state.array || state.items || [];
  const { highlights = [], ranges = [], leftCopy, rightCopy, leftPointer, rightPointer, l, r, m } = state;

  const mainRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const mainSize = useContainerSize(mainRef);
  const leftSize = useContainerSize(leftRef);
  const rightSize = useContainerSize(rightRef);
  const mainWidth = mainSize.width;
  const leftWidth = leftSize.width;
  const rightWidth = rightSize.width;

  if (!arrayData || arrayData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

  const array = arrayData;

  // Detect if this is a pointer-based algorithm (binary search, sliding window)
  const isPointerBased = (l !== undefined || r !== undefined) && !ranges.length;

  const maxVal = Math.max(...array, 1);

  const getHighlightType = (idx) => {
    const highlight = highlights.find((h) => h.index === idx);
    return highlight?.type || null;
  };

  const getRangeType = (idx) => {
    for (const range of ranges) {
      if (idx >= range.l && idx <= range.r) {
        return range.type;
      }
    }
    return null;
  };

  const getBarColor = (idx) => {
    const highlightType = getHighlightType(idx);
    const rangeType = getRangeType(idx);

    // For pointer-based algorithms (binary search, sliding window)
    if (isPointerBased) {
      if (idx === m) return 'bg-purple-500'; // Mid pointer
      if (idx === l) return 'bg-blue-500';   // Left pointer
      if (idx === r) return 'bg-rose-500';   // Right pointer
      // Sliding window range highlighting
      if (l !== undefined && r !== undefined && idx >= l && idx <= r) {
        return 'bg-amber-500/70'; // Window range
      }
      return 'bg-zinc-600';
    }

    // For sorting algorithms
    if (highlightType === 'sorted') return 'bg-emerald-500';
    if (highlightType === 'swapping' || highlightType === 'swapped') return 'bg-rose-500';
    if (highlightType === 'comparing') return 'bg-amber-400';
    if (highlightType === 'active') return 'bg-blue-500';
    if (highlightType === 'writing' || highlightType === 'placed') return 'bg-amber-400';
    if (highlightType === 'pivot') return 'bg-purple-500';

    if (rangeType === 'left') return 'bg-blue-500';
    if (rangeType === 'right') return 'bg-rose-500';
    if (rangeType === 'merging') return 'bg-amber-500/70';
    if (rangeType === 'sorted') return 'bg-emerald-500';
    if (rangeType === 'active') return 'bg-zinc-400';

    return 'bg-zinc-600';
  };

  const getBorderStyle = (idx) => {
    const highlightType = getHighlightType(idx);
    if (highlightType === 'writing') return 'ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-950';
    if (highlightType === 'placed') return 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-zinc-950';
    return '';
  };

  const { cell: barWidth, gap: barGap } = getCellMetrics(mainWidth, array.length, {
    minCell: 8,
    maxCell: Infinity,
    baseGap: 4,
    minGap: 2,
  });

  const leftMetrics = getCellMetrics(leftWidth, leftCopy?.length || 0, {
    minCell: 16,
    maxCell: 40,
    baseGap: 4,
    minGap: 2,
  });

  const rightMetrics = getCellMetrics(rightWidth, rightCopy?.length || 0, {
    minCell: 16,
    maxCell: 40,
    baseGap: 4,
    minGap: 2,
  });

  const maxBarHeight = mainSize.height ? Math.max(140, Math.floor(mainSize.height - 40)) : 200;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex justify-center pb-1 flex-1">
        {isPointerBased ? (
          // Flat array visualization for pointer-based algorithms
          <div className="flex items-center justify-center h-full w-full" style={{ gap: `${barGap}px` }} ref={mainRef}>
            {array.map((value, idx) => {
              const barColor = getBarColor(idx);
              const isPointer = idx === l || idx === r || idx === m;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex items-center justify-center rounded transition-colors duration-200 font-mono text-sm ${barColor} ${
                      isPointer ? 'text-white font-semibold' : 'text-zinc-300'
                    }`}
                    style={{
                      width: `${barWidth}px`,
                      height: `${barWidth}px`,
                      minWidth: '32px',
                      minHeight: '32px'
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-xs font-mono text-zinc-600 leading-none">[{idx}]</div>
                </div>
              );
            })}
          </div>
        ) : (
          // Bar graph visualization for sorting algorithms
          <div
            className="flex items-end h-full min-h-[240px] px-4 pt-3 w-full"
            style={{ gap: `${barGap}px` }}
            ref={mainRef}
          >
            {array.map((value, idx) => {
              const minHeight = 12;
              const maxHeight = maxBarHeight;
              const height = minHeight + (value / maxVal) * (maxHeight - minHeight);
              const barColor = getBarColor(idx);
              const borderStyle = getBorderStyle(idx);

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`rounded-t-sm transition-[background-color,box-shadow] duration-200 ${barColor} ${borderStyle}`}
                    style={{ width: `${barWidth}px`, height: `${height}px` }}
                  />
                  <div className="mt-0.5 text-xs font-mono text-zinc-400 leading-none">{value}</div>
                  <div className="text-xs font-mono text-zinc-600 leading-none">[{idx}]</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {leftCopy && rightCopy && (
        <div className="flex justify-center gap-8 pt-4 border-t border-zinc-800">
          <div className="space-y-2 w-full max-w-[420px]" ref={leftRef}>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Left Copy</div>
            <div className="flex" style={{ gap: `${leftMetrics.gap}px` }}>
              {leftCopy.map((val, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center rounded font-mono text-sm
                    ${idx === leftPointer ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-zinc-800 text-zinc-400'}
                    ${idx < leftPointer ? 'opacity-40' : ''}
                  `}
                  style={{ width: `${leftMetrics.cell}px`, height: `${leftMetrics.cell}px` }}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 w-full max-w-[420px]" ref={rightRef}>
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Right Copy</div>
            <div className="flex" style={{ gap: `${rightMetrics.gap}px` }}>
              {rightCopy.map((val, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center rounded font-mono text-sm
                    ${idx === rightPointer ? 'bg-rose-500 text-white ring-2 ring-rose-300' : 'bg-zinc-800 text-zinc-400'}
                    ${idx < rightPointer ? 'opacity-40' : ''}
                  `}
                  style={{ width: `${rightMetrics.cell}px`, height: `${rightMetrics.cell}px` }}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 text-xs mt-1">
        {isPointerBased ? (
          // Legend for pointer-based algorithms (binary search, sliding window)
          <>
            {l !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-zinc-400">Left pointer</span>
              </div>
            )}
            {r !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-rose-500"></div>
                <span className="text-zinc-400">Right pointer</span>
              </div>
            )}
            {m !== undefined && m !== null && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span className="text-zinc-400">Mid pointer</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500/70"></div>
              <span className="text-zinc-400">Window/Range</span>
            </div>
          </>
        ) : (
          // Legend for sorting algorithms
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-zinc-400">Left half</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-500"></div>
              <span className="text-zinc-400">Right half</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-400"></div>
              <span className="text-zinc-400">Merging</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-zinc-400">Sorted</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
