export default function LinkedListVisualization({ state }) {
  const { nodes = [], prevIdx, currIdx, nextIdx, slowIdx, fastIdx, cycleIndex, reversed = [], visited = [], meetingPoint } = state;

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty list — add nodes to visualize
      </div>
    );
  }

  const hasCycleMode = slowIdx !== undefined || fastIdx !== undefined;
  const hasReverseMode = prevIdx !== undefined || currIdx !== undefined;

  const getNodeColor = (idx) => {
    // Cycle detection mode
    if (hasCycleMode) {
      if (slowIdx === idx && fastIdx === idx) return 'bg-purple-500 ring-4 ring-purple-300';
      if (meetingPoint === idx) return 'bg-purple-500';
      if (slowIdx === idx) return 'bg-blue-500';
      if (fastIdx === idx) return 'bg-rose-500';
      if (visited.includes(idx)) return 'bg-zinc-600';
      return 'bg-zinc-700';
    }

    // Reversal mode
    if (hasReverseMode) {
      if (currIdx === idx) return 'bg-amber-500';
      if (prevIdx === idx) return 'bg-emerald-500';
      if (nextIdx === idx) return 'bg-blue-500';
      if (reversed.includes(idx)) return 'bg-emerald-600';
      return 'bg-zinc-700';
    }

    return 'bg-zinc-700';
  };

  const getArrowColor = (fromIdx) => {
    if (hasReverseMode && reversed.includes(fromIdx)) {
      return 'text-emerald-500';
    }
    return 'text-zinc-500';
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Main list visualization */}
      <div className="flex-1 flex items-center justify-center overflow-x-auto">
        <div className="flex items-center gap-2 p-4">
          {nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center">
              {/* Node */}
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-lg font-mono text-lg font-bold transition-all duration-300 ${getNodeColor(idx)} text-white`}
              >
                {node.value}
                {/* Node index */}
                <span className="absolute -bottom-5 text-xs text-zinc-500">{idx}</span>

                {/* Pointer labels */}
                <div className="absolute -top-6 flex gap-1 text-xs">
                  {hasCycleMode && slowIdx === idx && (
                    <span className="bg-blue-500 text-white px-1 rounded">slow</span>
                  )}
                  {hasCycleMode && fastIdx === idx && (
                    <span className="bg-rose-500 text-white px-1 rounded">fast</span>
                  )}
                  {hasReverseMode && prevIdx === idx && (
                    <span className="bg-emerald-500 text-white px-1 rounded">prev</span>
                  )}
                  {hasReverseMode && currIdx === idx && (
                    <span className="bg-amber-500 text-white px-1 rounded">curr</span>
                  )}
                  {hasReverseMode && nextIdx === idx && (
                    <span className="bg-blue-500 text-white px-1 rounded">next</span>
                  )}
                </div>
              </div>

              {/* Arrow to next node */}
              {idx < nodes.length - 1 && (
                <div className={`mx-1 ${getArrowColor(idx)}`}>
                  <svg className="w-8 h-4" viewBox="0 0 32 16">
                    <line x1="0" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="2" />
                    <polygon points="24,4 32,8 24,12" fill="currentColor" />
                  </svg>
                </div>
              )}

              {/* Null terminator or cycle arrow */}
              {idx === nodes.length - 1 && (
                <>
                  {cycleIndex !== null && cycleIndex !== undefined ? (
                    <div className="relative ml-2">
                      <svg className="w-16 h-24" viewBox="0 0 64 96">
                        {/* Arrow going right then down then left back to cycle point */}
                        <path
                          d="M 0 8 L 20 8 L 20 88 L -100 88"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="4"
                        />
                        <polygon points="-100,84 -108,88 -100,92" fill="#ef4444" />
                      </svg>
                      <span className="absolute top-0 right-0 text-xs text-rose-400">
                        cycle to [{cycleIndex}]
                      </span>
                    </div>
                  ) : (
                    <div className="ml-2 text-zinc-500 font-mono text-sm">
                      → null
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
        {hasCycleMode ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-zinc-400">Slow pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-500"></div>
              <span className="text-zinc-400">Fast pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-zinc-400">Meeting point</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-zinc-400">prev</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-zinc-400">curr</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-zinc-400">next</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-600"></div>
              <span className="text-zinc-400">Reversed</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
