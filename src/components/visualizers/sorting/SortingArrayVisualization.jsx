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

  return (
    <div className="space-y-6">
      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="flex items-end gap-1 h-48 px-4">
          {array.map((value, idx) => {
            const minHeight = 16;
            const maxHeight = 160;
            const height = minHeight + (value / maxVal) * (maxHeight - minHeight);
            const barColor = getBarColor(idx);
            const borderStyle = getBorderStyle(idx);

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-10 rounded-t-sm transition-all duration-300 ${barColor} ${borderStyle}`}
                  style={{ height: `${height}px` }}
                />
                <div className="mt-1 text-xs font-mono text-zinc-400">{value}</div>
                <div className="text-xs font-mono text-zinc-600">[{idx}]</div>
              </div>
            );
          })}
        </div>
      </div>

      {leftCopy && rightCopy && (
        <div className="flex justify-center gap-8 pt-4 border-t border-zinc-800">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Left Copy</div>
            <div className="flex gap-1">
              {leftCopy.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded font-mono text-sm
                    ${idx === leftPointer ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-zinc-800 text-zinc-400'}
                    ${idx < leftPointer ? 'opacity-40' : ''}
                  `}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Right Copy</div>
            <div className="flex gap-1">
              {rightCopy.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded font-mono text-sm
                    ${idx === rightPointer ? 'bg-rose-500 text-white ring-2 ring-rose-300' : 'bg-zinc-800 text-zinc-400'}
                    ${idx < rightPointer ? 'opacity-40' : ''}
                  `}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 text-xs">
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