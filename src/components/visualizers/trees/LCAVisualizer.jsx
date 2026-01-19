import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
import ConfigSection from '../../shared/layout/ConfigSection';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/trees/lca';

const TREE_PRESETS = {
  simple: {
    name: 'Simple Tree',
    edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]],
    n: 7,
  },
  deep: {
    name: 'Deep Tree',
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6]],
    n: 7,
  },
  wide: {
    name: 'Wide Tree',
    edges: [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8]],
    n: 9,
  },
};

function TreeVisualization({ nodes, edges, highlightedNodes = {}, lca, nodeU, nodeV, pathU = [], pathV = [] }) {
  if (!nodes || nodes.length === 0) return null;

  // Simple layout: BFS-based positioning
  const positions = {};
  const levels = {};
  const queue = [0];
  const visited = new Set([0]);
  levels[0] = 0;

  while (queue.length > 0) {
    const node = queue.shift();
    edges.forEach(([a, b]) => {
      const neighbor = a === node ? b : (b === node ? a : null);
      if (neighbor !== null && !visited.has(neighbor)) {
        visited.add(neighbor);
        levels[neighbor] = levels[node] + 1;
        queue.push(neighbor);
      }
    });
  }

  // Group nodes by level
  const levelNodes = {};
  Object.entries(levels).forEach(([node, level]) => {
    if (!levelNodes[level]) levelNodes[level] = [];
    levelNodes[level].push(parseInt(node));
  });

  // Calculate positions
  const maxLevel = Math.max(...Object.values(levels));
  Object.entries(levelNodes).forEach(([level, nodesAtLevel]) => {
    const y = parseInt(level) * 80 + 40;
    const width = 400;
    const spacing = width / (nodesAtLevel.length + 1);
    nodesAtLevel.forEach((node, i) => {
      positions[node] = { x: spacing * (i + 1), y };
    });
  });

  const isOnPathU = (node) => pathU.includes(node);
  const isOnPathV = (node) => pathV.includes(node);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="420" height={(maxLevel + 1) * 80 + 40} className="overflow-visible">
        {/* Edges */}
        {edges.map(([a, b], idx) => {
          const posA = positions[a];
          const posB = positions[b];
          if (!posA || !posB) return null;

          const isPathEdge = (isOnPathU(a) && isOnPathU(b)) || (isOnPathV(a) && isOnPathV(b));

          return (
            <line
              key={idx}
              x1={posA.x}
              y1={posA.y}
              x2={posB.x}
              y2={posB.y}
              stroke={isPathEdge ? '#10b981' : '#52525b'}
              strokeWidth={isPathEdge ? 3 : 2}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node];
          if (!pos) return null;

          const isLCA = node === lca;
          const isU = node === nodeU;
          const isV = node === nodeV;
          const isHighlighted = Array.isArray(highlightedNodes)
            ? highlightedNodes.includes(node)
            : highlightedNodes[node];
          const onPath = isOnPathU(node) || isOnPathV(node);

          let fillColor = '#27272a';
          let strokeColor = '#52525b';
          let textColor = '#a1a1aa';

          if (isLCA) {
            fillColor = '#7c3aed';
            strokeColor = '#8b5cf6';
            textColor = '#fff';
          } else if (isU) {
            fillColor = '#3b82f6';
            strokeColor = '#60a5fa';
            textColor = '#fff';
          } else if (isV) {
            fillColor = '#f59e0b';
            strokeColor = '#fbbf24';
            textColor = '#fff';
          } else if (isHighlighted) {
            fillColor = '#10b981';
            strokeColor = '#34d399';
            textColor = '#fff';
          } else if (onPath) {
            fillColor = '#064e3b';
            strokeColor = '#10b981';
            textColor = '#6ee7b7';
          }

          return (
            <g key={node}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={20}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill={textColor}
                fontSize="14"
                fontWeight="bold"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-zinc-400">Node U</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-zinc-400">Node V</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
          <span className="text-zinc-400">LCA</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-900 border border-emerald-500"></div>
          <span className="text-zinc-400">Path</span>
        </div>
      </div>
    </div>
  );
}

export default function LCAVisualizer() {
  const [preset, setPreset] = useState('simple');
  const [nodeUInput, setNodeUInput] = useState('3');
  const [nodeVInput, setNodeVInput] = useState('5');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('lca');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { preset, nodeUInput, nodeVInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('lca', progressPayload);

  const buildTree = useCallback((presetKey) => {
    const treeConfig = TREE_PRESETS[presetKey];
    const parent = Array(treeConfig.n).fill(-1);
    treeConfig.edges.forEach(([a, b]) => {
      parent[b] = a;
    });
    const nodes = Array.from({ length: treeConfig.n }, (_, idx) => idx);
    const children = {};
    nodes.forEach((node) => { children[node] = []; });
    treeConfig.edges.forEach(([a, b]) => {
      children[a].push(b);
    });
    return { nodes, parent, children };
  }, []);

  const handleReset = useCallback(() => {
    stop();
    const tree = buildTree(preset);
    reset({
      tree,
      queries: [[parseInt(nodeUInput, 10) || 3, parseInt(nodeVInput, 10) || 5]],
    });
  }, [preset, nodeUInput, nodeVInput, reset, stop, buildTree]);

  useEffect(() => { handleReset(); }, [preset, nodeUInput, nodeVInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const presets = Object.keys(TREE_PRESETS);
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    const n = TREE_PRESETS[randomPreset].n;
    const u = Math.floor(Math.random() * n);
    let v = Math.floor(Math.random() * n);
    while (v === u) v = Math.floor(Math.random() * n);
    setPreset(randomPreset);
    setNodeUInput(String(u));
    setNodeVInput(String(v));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { preset, nodeUInput, nodeVInput });
  const handleLoadInput = (item) => {
    setPreset(item.input_json?.preset ?? 'simple');
    setNodeUInput(item.input_json?.nodeUInput ?? '3');
    setNodeVInput(item.input_json?.nodeVInput ?? '5');
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'u', value: state.u ?? '—', desc: 'node U' },
    { name: 'v', value: state.v ?? '—', desc: 'node V' },
    { name: 'lca', value: state.lca ?? '—', desc: 'lowest common ancestor' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Tree">
            <div className="flex gap-2 items-end">
              <Select label="Tree Preset" value={preset} onChange={(e) => setPreset(e.target.value)} options={Object.entries(TREE_PRESETS).map(([key, t]) => ({ value: key, label: t.name }))} className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
          </ConfigSection>
          <ConfigSection title="Query">
            <div className="grid grid-cols-2 gap-2">
              <Input label="Node U" value={nodeUInput} onChange={(e) => setNodeUInput(e.target.value)} type="number" min="0" />
              <Input label="Node V" value={nodeVInput} onChange={(e) => setNodeVInput(e.target.value)} type="number" min="0" />
            </div>
          </ConfigSection>
          <ConfigSection title="History" open={false}>
            <SavedInputsPanel items={savedInputs} isLoading={savedLoading} onSave={handleSaveInput} onLoad={handleLoadInput} onDelete={(item) => deleteInput(item.id)} />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel progress={progress} isLoading={progressLoading} onResume={handleResume} onClear={clearProgress} checkpoints={checkpoints} onSaveCheckpoint={saveCheckpoint} onLoadCheckpoint={handleResume} onDeleteCheckpoint={deleteCheckpoint} />
          </ConfigSection>
        </div>
      }
      controlProps={{ onStep: step, onBack: handleBack, onRun: toggle, onReset: handleReset, isRunning, canStep, canBack, speed, onSpeedChange: setSpeed }}
      visualizationContent={state && <TreeVisualization nodes={state.nodes} edges={state.edges} highlightedNodes={state.highlightedNodes} lca={state.lca} nodeU={state.u} nodeV={state.v} pathU={state.pathU} pathV={state.pathV} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, { label: 'Depth U', value: state.depthU ?? '—' }, { label: 'Depth V', value: state.depthV ?? '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">LCA:</span> Lowest Common Ancestor of two nodes</p><p><span className="font-medium text-zinc-900 dark:text-white">Binary Lifting:</span> Precompute 2^k ancestors</p><p><span className="font-medium text-zinc-900 dark:text-white">Query:</span> O(log n) using binary search</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
