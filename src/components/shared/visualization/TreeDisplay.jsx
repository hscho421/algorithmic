export default function TreeDisplay({ tree, highlightedNodes = [], activeNode, queue, animationKey }) {
  if (!tree || tree.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty tree — insert values to visualize
      </div>
    );
  }

  const nodeMap = {};
  tree.forEach((node) => {
    nodeMap[node.id] = node;
  });

  const rootNode = tree[0];

  const getNodeHighlight = (nodeId) => {
    const highlight = highlightedNodes.find((h) => h.id === nodeId);
    return highlight?.type || 'default';
  };

  const calculatePositions = (nodeId, depth = 0, left = 0, right = 100) => {
    if (!nodeId || !nodeMap[nodeId]) return [];

    const node = nodeMap[nodeId];
    const x = (left + right) / 2;
    const y = depth * 60 + 30;

    const positions = [{ ...node, x, y, depth }];

    if (node.left) {
      positions.push(...calculatePositions(node.left, depth + 1, left, x));
    }
    if (node.right) {
      positions.push(...calculatePositions(node.right, depth + 1, x, right));
    }

    return positions;
  };

  const positions = calculatePositions(rootNode.id);
  const swapNodes = positions.filter((node) => getNodeHighlight(node.id) === 'swapping');
  const swapDeltas = {};
  if (swapNodes.length === 2) {
    const [first, second] = swapNodes;
    swapDeltas[first.id] = { dx: second.x - first.x, dy: second.y - first.y };
    swapDeltas[second.id] = { dx: first.x - second.x, dy: first.y - second.y };
  }
  const swapActive = swapNodes.length === 2;
  const [firstSwap, secondSwap] = swapActive ? swapNodes : [];
  const maxDepth = Math.max(...positions.map((p) => p.depth));
  const svgHeight = (maxDepth + 1) * 60 + 30;

  const getNodeColors = (type) => {
    switch (type) {
      case 'comparing':
      case 'current':
        return 'fill-amber-500 stroke-amber-300';
      case 'found':
      case 'visited':
        return 'fill-emerald-500 stroke-emerald-300';
      case 'inserting':
      case 'inserted':
        return 'fill-blue-500 stroke-blue-300';
      case 'swapping':
        return 'fill-rose-500 stroke-rose-300';
      case 'queued':
        return 'fill-purple-500 stroke-purple-300';
      default:
        return 'fill-zinc-700 stroke-zinc-500';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'comparing':
      case 'current':
      case 'found':
      case 'visited':
      case 'inserting':
      case 'inserted':
      case 'swapping':
      case 'queued':
        return 'fill-white';
      default:
        return 'fill-zinc-200';
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 100 ${svgHeight}`}
          className="w-full min-w-[400px]"
          style={{ height: `${Math.min(Math.max(svgHeight * 3, 200), 400)}px` }}
          preserveAspectRatio="xMidYMin meet"
        >
          {positions.map((node) => {
            const leftChild = positions.find((p) => p.id === node.left);
            const rightChild = positions.find((p) => p.id === node.right);

            return (
              <g key={`edges-${node.id}`}>
                {leftChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={leftChild.x}
                    y2={leftChild.y}
                    className="stroke-zinc-600"
                    strokeWidth="0.5"
                  />
                )}
                {rightChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={rightChild.x}
                    y2={rightChild.y}
                    className="stroke-zinc-600"
                    strokeWidth="0.5"
                  />
                )}
              </g>
            );
          })}

          {positions.map((node) => {
            const highlightType = getNodeHighlight(node.id);
            const isActive = node.id === activeNode;
            const nodeColors = getNodeColors(highlightType);
            const textColor = getTextColor(highlightType);
            const swapDelta = swapDeltas[node.id];
            const isSwapNode = swapActive && swapDelta;

            return (
              <g key={`node-${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 9 : 8}
                  className={`${nodeColors} transition-all duration-300 ${isSwapNode ? 'opacity-30' : ''}`}
                  strokeWidth={isActive ? 1.5 : 1}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`${textColor} text-[6px] font-mono font-bold ${isSwapNode ? 'opacity-0' : ''}`}
                >
                  {node.value}
                </text>
              </g>
            );
          })}

          {swapActive && (
            <g key={`swap-anim-${animationKey ?? 'static'}`} pointerEvents="none">
              {[firstSwap, secondSwap].map((node, idx) => {
                const target = idx === 0 ? secondSwap : firstSwap;
                const dx = target.x - node.x;
                const dy = target.y - node.y;
                return (
                  <g key={`swap-float-${node.id}`}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      dur="0.45s"
                      begin="0s"
                      from="0 0"
                      to={`${dx} ${dy}`}
                      fill="freeze"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={8}
                      className="fill-rose-500 stroke-rose-300"
                      strokeWidth="1.2"
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-white text-[6px] font-mono font-bold"
                    >
                      {node.value}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs mt-3">
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
          <span className="text-zinc-400">In Queue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
          <span className="text-zinc-400">Unvisited</span>
        </div>
      </div>

      {queue !== undefined && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Queue</div>
          <div className="flex gap-1">
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
            <div className="text-xs text-zinc-500 mt-1">← Front</div>
          )}
        </div>
      )}
    </div>
  );
}
