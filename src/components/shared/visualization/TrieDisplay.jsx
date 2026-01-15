const layoutTrie = (nodes, edges) => {
  const childrenMap = new Map();
  edges.forEach((edge) => {
    if (!childrenMap.has(edge.from)) {
      childrenMap.set(edge.from, []);
    }
    childrenMap.get(edge.from).push(edge.to);
  });

  const orderedChildren = (id) => {
    const kids = childrenMap.get(id) || [];
    return kids.sort();
  };

  const positions = new Map();
  let xCounter = 0;

  const dfs = (id, depth) => {
    const kids = orderedChildren(id);
    if (kids.length === 0) {
      const x = xCounter;
      xCounter += 1;
      positions.set(id, { x, depth });
      return x;
    }

    const childXs = kids.map((child) => dfs(child, depth + 1));
    const x = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    positions.set(id, { x, depth });
    return x;
  };

  dfs('root', 0);

  const maxX = Math.max(...Array.from(positions.values()).map((p) => p.x), 0);
  const maxDepth = Math.max(...Array.from(positions.values()).map((p) => p.depth), 0);
  const viewBoxWidth = 120;
  const paddingX = 8;
  const usableWidth = viewBoxWidth - paddingX * 2;
  const scaleX = maxX === 0 ? usableWidth / 2 : usableWidth / maxX;

  return {
    positions,
    maxDepth,
    scaleX,
    viewBoxWidth,
    paddingX,
  };
};

const getNodeStyle = (type) => {
  switch (type) {
    case 'current':
      return 'fill-amber-500 stroke-amber-300';
    case 'found':
      return 'fill-emerald-500 stroke-emerald-300';
    case 'visited':
      return 'fill-zinc-500 stroke-zinc-300';
    default:
      return 'fill-zinc-700 stroke-zinc-500';
  }
};

export default function TrieDisplay({ nodes, edges, highlightedNodes = [], activeNode }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty trie — insert words to visualize
      </div>
    );
  }

  const highlightMap = new Map(highlightedNodes.map((h) => [h.id, h.type]));
  const { positions, maxDepth, scaleX, viewBoxWidth, paddingX } = layoutTrie(nodes, edges);
  const rowGap = Math.max(24, Math.min(38, Math.floor(180 / Math.max(maxDepth + 1, 1))));
  const height = (maxDepth + 1) * rowGap + 18;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${height}`}
          className="w-full min-w-[320px] max-h-[260px]"
          preserveAspectRatio="xMidYMin meet"
        >
          {edges.map((edge) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            const x1 = paddingX + from.x * scaleX;
            const y1 = 8 + from.depth * rowGap;
            const x2 = paddingX + to.x * scaleX;
            const y2 = 8 + to.depth * rowGap;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-zinc-600"
                strokeWidth="0.5"
              />
            );
          })}

          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const x = paddingX + pos.x * scaleX;
            const y = 8 + pos.depth * rowGap;
            const highlightType = highlightMap.get(node.id) || 'default';
            const isActive = node.id === activeNode;
            const nodeStyle = getNodeStyle(highlightType);
            const wordLabel = node.id === 'root' ? '' : node.id.split('.').slice(1).join('');
            return (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 6.5 : 5.5}
                  className={`${nodeStyle} transition-all duration-300`}
                  strokeWidth={isActive ? 1.2 : 0.9}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white text-[4px] font-mono font-bold"
                >
                  {node.id === 'root' ? '•' : node.char}
                </text>
                {node.isEnd && wordLabel && (
                  <text
                    x={x}
                    y={y + 9}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    className="fill-zinc-300 text-[3px] font-semibold"
                  >
                    {wordLabel}
                  </text>
                )}
                {node.isEnd && node.id !== 'root' && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 8 : 7.5}
                    className="fill-none stroke-emerald-300"
                    strokeWidth="0.9"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
