import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Select } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { GraphDisplay } from '../../shared/visualization';
import { createGraph, PRESET_GRAPHS } from '../../../lib/dataStructures/Graph';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/bfs';

export default function BFSVisualizer() {
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [startNode, setStartNode] = useState('A');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleBuildGraph = useCallback(() => {
    stop();
    const preset = PRESET_GRAPHS[selectedPreset];
    const graph = createGraph(preset.vertices, preset.edges);
    setCurrentGraph(graph);
    setPositions(preset.positions);
    if (!preset.vertices.includes(startNode)) {
      setStartNode(preset.vertices[0]);
    }
  }, [selectedPreset, startNode, stop]);

  const handleReset = useCallback(() => {
    stop();
    if (currentGraph) {
      reset({ graph: currentGraph, startNode, positions });
    }
  }, [currentGraph, startNode, positions, reset, stop]);

  useEffect(() => {
    handleBuildGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentGraph !== null) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGraph, startNode]);

  useEffect(() => {
    handleBuildGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset]);

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
        { name: 'queue', value: state.queue?.length || 0, desc: 'nodes in queue' },
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
              <Select
                label="Select Graph"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                options={presetOptions}
              />

              <Select
                label="Start Node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                options={nodeOptions}
              />
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
                  queue={state.queue}
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

              <Card title="BFS Key Points">
                <div className="space-y-2 text-sm text-zinc-400">
                  <p><span className="text-white font-medium">Queue:</span> FIFO — first in, first out</p>
                  <p><span className="text-white font-medium">Level-order:</span> Visits all nodes at depth d before d+1</p>
                  <p><span className="text-white font-medium">Shortest path:</span> Finds shortest path in unweighted graphs</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
