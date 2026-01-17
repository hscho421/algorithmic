import { useEffect, useRef, useState } from 'react';

const useContainerSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !entry.contentRect) return;
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};

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

  return {
    positions,
    maxDepth,
    maxX,
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

  const containerRef = useRef(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);
  const fallbackWidth = 520;
  const fallbackHeight = 320;
  const viewBoxWidth = Math.max(280, containerWidth || fallbackWidth);
  const baseHeight = Math.max(240, containerHeight || fallbackHeight);
  const paddingX = Math.max(10, Math.round(viewBoxWidth * 0.06));
  const paddingY = Math.max(10, Math.round(baseHeight * 0.08));

  const highlightMap = new Map(highlightedNodes.map((h) => [h.id, h.type]));
  const { positions, maxDepth, maxX } = layoutTrie(nodes, edges);
  const usableWidth = Math.max(1, viewBoxWidth - paddingX * 2);
  const scaleX = maxX === 0 ? usableWidth / 2 : usableWidth / maxX;
  const rowGapRaw = (baseHeight - paddingY * 2) / Math.max(maxDepth + 1, 1);
  const rowGap = Math.max(20, Math.min(64, rowGapRaw));
  const height = paddingY * 2 + (maxDepth + 1) * rowGap;
  const nodeRadius = Math.max(5, Math.min(12, rowGap * 0.22));
  const activeRadius = nodeRadius + 1.5;
  const edgeWidth = Math.max(0.6, Math.min(1.6, nodeRadius * 0.12));

  return (
    <div ref={containerRef} className="w-full h-full min-h-[240px]">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {edges.map((edge) => {
          const from = positions.get(edge.from);
          const to = positions.get(edge.to);
          if (!from || !to) return null;
          const x1 = paddingX + from.x * scaleX;
          const y1 = paddingY + from.depth * rowGap;
          const x2 = paddingX + to.x * scaleX;
          const y2 = paddingY + to.depth * rowGap;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-zinc-600"
              strokeWidth={edgeWidth}
            />
          );
        })}

        {nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          const x = paddingX + pos.x * scaleX;
          const y = paddingY + pos.depth * rowGap;
          const highlightType = highlightMap.get(node.id) || 'default';
          const isActive = node.id === activeNode;
          const nodeStyle = getNodeStyle(highlightType);
          const wordLabel = node.id === 'root' ? '' : node.id.split('.').slice(1).join('');
          return (
            <g key={node.id}>
              <circle
                cx={x}
                cy={y}
                r={isActive ? activeRadius : nodeRadius}
                className={`${nodeStyle} transition-all duration-300`}
                strokeWidth={isActive ? 1.4 : 1}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white font-mono font-bold"
                style={{ fontSize: Math.max(6, Math.min(12, nodeRadius * 1.1)) }}
              >
                {node.id === 'root' ? '•' : node.char}
              </text>
              {node.isEnd && wordLabel && (
                <text
                  x={x}
                  y={y + nodeRadius + 6}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  className="fill-zinc-300 font-semibold"
                  style={{ fontSize: Math.max(5, Math.min(9, nodeRadius * 0.8)) }}
                >
                  {wordLabel}
                </text>
              )}
              {node.isEnd && node.id !== 'root' && (
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? activeRadius + 2 : nodeRadius + 2}
                  className="fill-none stroke-emerald-300"
                  strokeWidth={Math.max(0.8, Math.min(1.4, nodeRadius * 0.12))}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
