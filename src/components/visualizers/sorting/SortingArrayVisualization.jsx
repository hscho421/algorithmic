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

  cell = Math.max(8, Math.min(maxCell, cell));
  return { cell, gap };
};

export default function SortingArrayVisualization({ state }) {
  const { array, highlights = [], ranges = [], leftCopy, rightCopy, leftPointer, rightPointer } = state;

  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

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

  const mainRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const mainWidth = useContainerWidth(mainRef);
  const leftWidth = useContainerWidth(leftRef);
  const rightWidth = useContainerWidth(rightRef);

  const { cell: barWidth, gap: barGap } = getCellMetrics(mainWidth, array.length, {
    minCell: 8,
    maxCell: 40,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-center pb-1">
        <div className="flex items-end h-40 px-4 pt-3 w-full" style={{ gap: `${barGap}px` }} ref={mainRef}>
          {array.map((value, idx) => {
            const minHeight = 12;
            const maxHeight = 130;
            const height = minHeight + (value / maxVal) * (maxHeight - minHeight);
            const barColor = getBarColor(idx);
            const borderStyle = getBorderStyle(idx);

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`rounded-t-sm transition-all duration-300 ${barColor} ${borderStyle}`}
                  style={{ width: `${barWidth}px`, height: `${height}px` }}
                />
                <div className="mt-0.5 text-xs font-mono text-zinc-400 leading-none">{value}</div>
                <div className="text-xs font-mono text-zinc-600 leading-none">[{idx}]</div>
              </div>
            );
          })}
        </div>
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
      </div>
    </div>
  );
}
