export default function GraphDisplay({
  vertices = [],
  edges = [],
  positions = {},
  highlightedNodes = {},
  highlightedEdges = [],
  current,
  queue,
  stack,
  distances,
  showWeights = false,
  pathEdges = [],
}) {
  if (!vertices || vertices.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        No graph to display
      </div>
    );
  }

  const getNodeColor = (node) => {
    const highlight = highlightedNodes[node];
    switch (highlight) {
      case 'current':
        return 'fill-amber-500 stroke-amber-300';
      case 'visited':
        return 'fill-emerald-500 stroke-emerald-300';
      case 'queued':
      case 'stacked':
        return 'fill-purple-500 stroke-purple-300';
      case 'checking':
        return 'fill-blue-500 stroke-blue-300';
      case 'updated':
        return 'fill-cyan-500 stroke-cyan-300';
      default:
        return 'fill-zinc-700 stroke-zinc-500';
    }
  };

  const getTextColor = (node) => {
    const highlight = highlightedNodes[node];
    if (highlight) return 'fill-white';
    return 'fill-zinc-200';
  };

  const isEdgeHighlighted = (from, to) => {
    return highlightedEdges.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from)
    );
  };

  const isPathEdge = (from, to) => {
    return pathEdges.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from)
    );
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 100 100"
          className="w-full min-w-[300px]"
          style={{ height: '300px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {edges.map(([from, to, weight], idx) => {
            const fromPos = positions[from];
            const toPos = positions[to];
            if (!fromPos || !toPos) return null;

            const highlighted = isEdgeHighlighted(from, to);
            const isPath = isPathEdge(from, to);
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  className={
                    isPath
                      ? 'stroke-emerald-400'
                      : highlighted
                      ? 'stroke-amber-400'
                      : 'stroke-zinc-600'
                  }
                  strokeWidth={isPath ? 1.5 : highlighted ? 1 : 0.5}
                />
                {showWeights && weight !== undefined && (
                  <>
                    <circle
                      cx={midX}
                      cy={midY}
                      r={4}
                      className="fill-zinc-900"
                    />
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-[4px] font-mono font-bold ${
                        highlighted ? 'fill-amber-400' : isPath ? 'fill-emerald-400' : 'fill-zinc-400'
                      }`}
                    >
                      {weight}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {vertices.map((node) => {
            const pos = positions[node];
            if (!pos) return null;

            const nodeColor = getNodeColor(node);
            const textColor = getTextColor(node);
            const isCurrent = node === current;
            const dist = distances?.[node];

            return (
              <g key={`node-${node}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isCurrent ? 7 : 6}
                  className={`${nodeColor} transition-all duration-300`}
                  strokeWidth={isCurrent ? 1.5 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`${textColor} text-[5px] font-mono font-bold`}
                >
                  {node}
                </text>
                {distances && dist !== undefined && (
                  <text
                    x={pos.x}
                    y={pos.y + 10}
                    textAnchor="middle"
                    className="text-[3.5px] font-mono fill-zinc-400"
                  >
                    {dist === Infinity ? '∞' : dist}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs mt-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-zinc-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-zinc-400">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-zinc-400">{queue ? 'In Queue' : stack ? 'In Stack' : 'In PQ'}</span>
        </div>
        {distances && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-zinc-400">Updated</span>
          </div>
        )}
      </div>

      {queue !== undefined && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Queue (FIFO)</div>
          <div className="flex gap-1 flex-wrap">
            {queue.length === 0 ? (
              <span className="text-zinc-600 text-sm italic">Empty</span>
            ) : (
              queue.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded font-mono text-sm
                    ${idx === 0 ? 'bg-purple-500 text-white ring-2 ring-purple-300' : 'bg-zinc-800 text-zinc-400'}
                  `}
                >
                  {val}
                </div>
              ))
            )}
          </div>
          {queue.length > 0 && (
            <div className="text-xs text-zinc-500 mt-1">← Front (next to process)</div>
          )}
        </div>
      )}

      {stack !== undefined && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Stack (LIFO)</div>
          <div className="flex gap-1 flex-wrap">
            {stack.length === 0 ? (
              <span className="text-zinc-600 text-sm italic">Empty</span>
            ) : (
              [...stack].reverse().map((val, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded font-mono text-sm
                    ${idx === 0 ? 'bg-purple-500 text-white ring-2 ring-purple-300' : 'bg-zinc-800 text-zinc-400'}
                  `}
                >
                  {val}
                </div>
              ))
            )}
          </div>
          {stack.length > 0 && (
            <div className="text-xs text-zinc-500 mt-1">← Top (next to process)</div>
          )}
        </div>
      )}
    </div>
  );
}