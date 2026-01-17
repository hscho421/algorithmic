export default function UnionFindDisplay({
  elements = [],
  parent = {},
  rank = {},
  highlightedNodes = {},
  highlightedEdges = [],
  findPath = [],
}) {
  if (!elements || elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        No elements to display
      </div>
    );
  }

  // Build tree structure for visualization
  const getChildren = (node) => {
    return elements.filter((el) => parent[el] === node && el !== node);
  };

  const getRoots = () => {
    return elements.filter((el) => parent[el] === el);
  };

  // Calculate positions using a tree layout
  const calculatePositions = () => {
    const positions = {};
    const roots = getRoots();
    const totalWidth = 100;
    const rootSpacing = totalWidth / (roots.length + 1);

    const layoutTree = (node, x, y, width) => {
      positions[node] = { x, y };
      const children = getChildren(node);

      if (children.length === 0) return;

      const childWidth = width / children.length;
      children.forEach((child, idx) => {
        const childX = x - width / 2 + childWidth / 2 + idx * childWidth;
        layoutTree(child, childX, y + 20, childWidth);
      });
    };

    roots.forEach((root, idx) => {
      const x = rootSpacing * (idx + 1);
      layoutTree(root, x, 15, rootSpacing * 0.9);
    });

    return positions;
  };

  const positions = calculatePositions();

  const getNodeColor = (node) => {
    const highlight = highlightedNodes[node];
    switch (highlight) {
      case 'current':
        return 'fill-amber-500 stroke-amber-300';
      case 'root':
        return 'fill-emerald-500 stroke-emerald-300';
      case 'root2':
        return 'fill-rose-500 stroke-rose-300';
      case 'path':
        return 'fill-blue-500 stroke-blue-300';
      case 'operand':
        return 'fill-purple-500 stroke-purple-300';
      case 'merging':
      case 'compressing':
        return 'fill-cyan-500 stroke-cyan-300';
      case 'merged':
      case 'found':
        return 'fill-emerald-500 stroke-emerald-300';
      default:
        return 'fill-zinc-300 dark:fill-zinc-700 stroke-zinc-400 dark:stroke-zinc-500';
    }
  };

  const getTextColor = (node) => {
    const highlight = highlightedNodes[node];
    if (highlight) return 'fill-white';
    return 'fill-zinc-700 dark:fill-zinc-200';
  };

  const isEdgeHighlighted = (from, to) => {
    return highlightedEdges.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from)
    );
  };

  const isInFindPath = (node) => {
    return findPath.includes(node);
  };

  // Draw edges (parent pointers)
  const edges = [];
  elements.forEach((el) => {
    if (parent[el] !== el) {
      edges.push([el, parent[el]]);
    }
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 100 80"
          className="w-full min-w-[400px]"
          style={{ height: '320px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Draw edges */}
          {edges.map(([from, to], idx) => {
            const fromPos = positions[from];
            const toPos = positions[to];
            if (!fromPos || !toPos) return null;

            const highlighted = isEdgeHighlighted(from, to);
            const inPath = isInFindPath(from) && isInFindPath(to);

            return (
              <line
                key={`edge-${idx}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={
                  highlighted
                    ? 'stroke-amber-400'
                    : inPath
                    ? 'stroke-blue-400'
                    : 'stroke-zinc-400 dark:stroke-zinc-600'
                }
                strokeWidth={highlighted || inPath ? 1 : 0.5}
              />
            );
          })}

          {/* Draw nodes */}
          {elements.map((node) => {
            const pos = positions[node];
            if (!pos) return null;

            const nodeColor = getNodeColor(node);
            const textColor = getTextColor(node);
            const isRoot = parent[node] === node;
            const nodeRank = rank[node];

            return (
              <g key={`node-${node}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isRoot ? 5 : 4}
                  className={`${nodeColor} transition-all duration-300`}
                  strokeWidth={isRoot ? 1.5 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`${textColor} text-[3.5px] font-mono font-bold`}
                >
                  {node.length > 3 ? node.slice(0, 3) : node}
                </text>
                {isRoot && (
                  <text
                    x={pos.x}
                    y={pos.y + 8}
                    textAnchor="middle"
                    className="text-[2.5px] font-mono fill-zinc-500 dark:fill-zinc-400"
                  >
                    r:{nodeRank}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs mt-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-zinc-600 dark:text-zinc-400">Root</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-zinc-600 dark:text-zinc-400">Operand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-zinc-600 dark:text-zinc-400">Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span className="text-zinc-600 dark:text-zinc-400">Merging</span>
        </div>
      </div>

      {/* Parent array visualization */}
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
          Parent Array
        </div>
        <div className="flex gap-1 flex-wrap">
          {elements.map((el) => (
            <div
              key={el}
              className={`px-2 py-1 rounded text-xs font-mono border
                ${parent[el] === el
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                }
              `}
            >
              {el}→{parent[el]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


