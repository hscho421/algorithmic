import { TEMPLATES } from '../../../lib/algorithms/searching/binarySearch';

export default function ArrayVisualization({ state }) {
  const { array, l, r, m, templateKey, done, target, comparison } = state;
  const template = TEMPLATES[templateKey];
  const n = array.length;

  if (n === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

  const isInRange = (idx) => {
    if (done) return false;
    return template.halfOpen ? idx >= l && idx < r : idx >= l && idx <= r;
  };

  const getPointers = (idx) => {
    const pointers = [];
    if (idx === l) pointers.push({ label: 'L', color: '#3b82f6' });
    if (idx === m) pointers.push({ label: 'M', color: '#10b981' });
    if (!template.halfOpen && idx === r) pointers.push({ label: 'R', color: '#ef4444' });
    return pointers;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="flex items-end gap-1 min-h-[180px] px-4">
          {array.map((value, idx) => {
            const inRange = isInRange(idx);
            const pointers = getPointers(idx);
            const isMiddle = idx === m;
            const isTarget = value === target && isMiddle;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex gap-1 mb-2 h-8">
                  {pointers.map((p) => (
                    <span
                      key={p.label}
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: p.color, color: 'white' }}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>

                <div
                  className={`
                    relative w-14 h-14 flex items-center justify-center rounded-lg
                    font-mono text-lg font-semibold transition-all duration-300
                    ${inRange
                      ? 'bg-zinc-800 border-2 border-zinc-600 text-white shadow-lg shadow-zinc-900/50'
                      : 'bg-zinc-900/50 border border-zinc-800 text-zinc-600'
                    }
                    ${isMiddle && !done ? 'ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-zinc-950' : ''}
                    ${isTarget && comparison === 'equal' ? 'bg-emerald-900/50 border-emerald-500' : ''}
                  `}
                >
                  {value}
                  {isMiddle && comparison && !done && (
                    <div className="absolute -bottom-6 text-xs whitespace-nowrap">
                      <span
                        className={`
                          ${comparison === 'less' ? 'text-amber-400' : ''}
                          ${comparison === 'greater' || comparison === 'greater_or_equal' ? 'text-rose-400' : ''}
                          ${comparison === 'equal' ? 'text-emerald-400' : ''}
                        `}
                      >
                        {comparison === 'less' && `${value} < ${target}`}
                        {comparison === 'greater' && `${value} > ${target}`}
                        {comparison === 'greater_or_equal' && `${value} ≥ ${target}`}
                        {comparison === 'equal' && `${value} = ${target} ✓`}
                      </span>
                    </div>
                  )}
                </div>

                <span className={`mt-2 text-xs font-mono ${inRange ? 'text-zinc-400' : 'text-zinc-700'}`}>
                  [{idx}]
                </span>
              </div>
            );
          })}

          {template.halfOpen && (
            <div className="flex flex-col items-center ml-2">
              <div className="flex gap-1 mb-2 h-8">
                {r === n && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white">
                    R
                  </span>
                )}
              </div>
              <div className="w-14 h-14 flex items-center justify-center rounded-lg border border-dashed border-zinc-700 text-zinc-600 text-sm">
                end
              </div>
              <span className="mt-2 text-xs font-mono text-zinc-700">[{n}]</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-zinc-400">L = {l}</span>
        </div>
        {m !== null && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-zinc-400">M = {m}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-zinc-400">R = {r}</span>
        </div>
      </div>
    </div>
  );
}