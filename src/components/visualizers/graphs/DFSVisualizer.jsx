import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Select, GraphEditor } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { GraphDisplay } from '../../shared/visualization';
import { createGraph, PRESET_GRAPHS } from '../../../lib/dataStructures/Graph';
import { calculatePositions } from '../../../lib/utils/graphLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/dfs';

export default function DFSVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [startNode, setStartNode] = useState('A');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']]);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  // Build graph when configuration changes
  useEffect(() => {
    stop();
    let graph, pos, newStartNode = startNode;

    if (mode === 'preset') {
      const preset = PRESET_GRAPHS[selectedPreset];
      graph = createGraph(preset.vertices, preset.edges);
      pos = preset.positions;
      if (!preset.vertices.includes(startNode)) {
        newStartNode = preset.vertices[0];
      }
    } else {
      graph = createGraph(customVertices, customEdges);
      pos = calculatePositions(customVertices);
      if (!customVertices.includes(startNode) && customVertices.length > 0) {
        newStartNode = customVertices[0];
      }
    }

    setCurrentGraph(graph);
    setPositions(pos);
    if (newStartNode !== startNode) {
      setStartNode(newStartNode);
    }

    reset({ graph, startNode: newStartNode, positions: pos });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedPreset, customVertices, customEdges]);

  // Reset when start node changes
  useEffect(() => {
    if (currentGraph) {
      stop();
      reset({ graph: currentGraph, startNode, positions });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startNode]);

  const handleReset = useCallback(() => {
    stop();
    if (currentGraph) {
      reset({ graph: currentGraph, startNode, positions });
    }
  }, [currentGraph, startNode, positions, reset, stop]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const presetOptions = Object.entries(PRESET_GRAPHS).map(([key, preset]) => ({
    value: key,
    label: preset.name,
  }));

  const nodeOptions = currentGraph?.vertices.map((v) => ({ value: v, label: v })) || [];

  const variables = state
    ? [
        { name: 'visited', value: state.visited?.length || 0, desc: 'nodes visited' },
        { name: 'stack', value: state.stack?.length || 0, desc: 'nodes in stack' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
        { label: 'Current', value: state.current || '—' },
      ]
    : [];

  const result = state ? getResult(state) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card title="Graph Configuration">
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('preset')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'preset'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Preset
                </button>
                <button
                  onClick={() => setMode('custom')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'custom'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Custom
                </button>
              </div>

              {mode === 'preset' ? (
                <Select
                  label="Select Graph"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  options={presetOptions}
                />
              ) : (
                <GraphEditor
                  vertices={customVertices}
                  edges={customEdges}
                  onVerticesChange={setCustomVertices}
                  onEdgesChange={setCustomEdges}
                  directed={false}
                  weighted={false}
                />
              )}

              {nodeOptions.length > 0 && (
                <Select
                  label="Start Node"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  options={nodeOptions}
                />
              )}
            </div>
          </Card>

          <ControlPanel
            onStep={step}
            onBack={handleBack}
            onRun={toggle}
            onReset={handleReset}
            isRunning={isRunning}
            canStep={canStep}
            canBack={canBack}
            speed={speed}
            onSpeedChange={setSpeed}
          />

          {state && (
            <StatePanel variables={variables} additionalInfo={additionalInfo} />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Graph Visualization">
            <div className="min-h-[400px]">
              {state && (
                <GraphDisplay
                  vertices={state.vertices}
                  edges={state.edges}
                  positions={state.positions}
                  highlightedNodes={state.highlightedNodes}
                  highlightedEdges={state.highlightedEdges}
                  current={state.current}
                  stack={state.stack}
                />
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state && (
              <CodePanel
                code={template.code}
                currentLine={state.currentLine}
                done={state.done}
                title={template.name}
                description={template.description}
              />
            )}

            <div className="space-y-4">
              {result && (
                <ResultBanner
                  success={result.success}
                  title={result.title}
                  message={result.message}
                  details={result.details}
                />
              )}

              {state && (
                <ExplanationPanel
                  explanation={getExplanation(state)}
                  status={state.done ? 'success' : 'running'}
                />
              )}

              <ComplexityPanel complexity={complexity} />

              <Card title="DFS Key Points">
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p><span className="text-zinc-900 dark:text-white font-medium">Stack:</span> LIFO — last in, first out</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">Deep-first:</span> Explores one branch fully before backtracking</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">Use cases:</span> Cycle detection, topological sort, pathfinding</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
