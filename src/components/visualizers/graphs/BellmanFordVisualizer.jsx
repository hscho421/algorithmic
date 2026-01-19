import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Select, GraphEditor } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { GraphDisplay } from '../../shared/visualization';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
import ConfigSection from '../../shared/layout/ConfigSection';
import { createGraph, WEIGHTED_GRAPHS } from '../../../lib/dataStructures/Graph';
import { calculatePositions } from '../../../lib/utils/graphLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/bellmanFord';

export default function BellmanFordVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [startNode, setStartNode] = useState('A');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B', -1], ['A', 'C', 4], ['B', 'C', 3], ['B', 'D', 2]]);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('bellman-ford');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = {
    mode,
    selectedPreset,
    startNode,
    customVertices,
    customEdges,
    stepIndex: state?.stepIndex ?? 0,
  };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('bellman-ford', progressPayload);

  useEffect(() => {
    stop();
    let graph, pos, newStartNode = startNode;

    if (mode === 'preset') {
      const preset = WEIGHTED_GRAPHS[selectedPreset];
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
  }, [mode, selectedPreset, customVertices, customEdges]);

  useEffect(() => {
    if (currentGraph) {
      stop();
      reset({ graph: currentGraph, startNode, positions });
    }
  }, [startNode]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleSaveInput = (name) => saveInput(name, { mode, selectedPreset, startNode, customVertices, customEdges });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setStartNode(payload.startNode ?? 'A');
    if (payload.customVertices) setCustomVertices(payload.customVertices);
    if (payload.customEdges) setCustomEdges(payload.customEdges);
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    handleLoadInput({ input_json: payload });
  };

  const variables = state ? [
    { name: 'iteration', value: state.iteration ?? '—', desc: 'current iteration' },
    { name: 'V', value: state.vertices?.length || 0, desc: 'vertices' },
  ] : [];

  const additionalInfo = state ? [
    { label: 'Phase', value: state.phase || '—' },
    { label: 'Step', value: `${state.stepIndex + 1}` },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Graph">
            <Select
              label="Mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              options={[
                { value: 'preset', label: 'Preset Graph' },
                { value: 'custom', label: 'Custom Graph' },
              ]}
            />
            {mode === 'preset' && (
              <Select
                label="Preset"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                options={Object.entries(WEIGHTED_GRAPHS).map(([key, g]) => ({
                  value: key,
                  label: g.name,
                }))}
              />
            )}
            {mode === 'custom' && (
              <GraphEditor
                vertices={customVertices}
                edges={customEdges}
                onVerticesChange={setCustomVertices}
                onEdgesChange={setCustomEdges}
                weighted
                directed
              />
            )}
            <Select
              label="Start Node"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              options={(currentGraph?.vertices || []).map((v) => ({ value: v, label: v }))}
            />
          </ConfigSection>
          <ConfigSection title="History" open={false}>
            <SavedInputsPanel
              items={savedInputs}
              isLoading={savedLoading}
              onSave={handleSaveInput}
              onLoad={handleLoadInput}
              onDelete={(item) => deleteInput(item.id)}
            />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel
              progress={progress}
              isLoading={progressLoading}
              onResume={handleResume}
              onClear={clearProgress}
              checkpoints={checkpoints}
              onSaveCheckpoint={saveCheckpoint}
              onLoadCheckpoint={handleResume}
              onDeleteCheckpoint={deleteCheckpoint}
            />
          </ConfigSection>
        </div>
      }
      controlProps={{
        onStep: step,
        onBack: handleBack,
        onRun: toggle,
        onReset: () => { stop(); reset({ graph: currentGraph, startNode, positions }); },
        isRunning,
        canStep,
        canBack,
        speed,
        onSpeedChange: setSpeed,
      }}
      visualizationContent={
        state && (
          <GraphDisplay
            vertices={state.vertices}
            edges={state.edges}
            positions={state.positions}
            highlightedNodes={state.highlightedNodes}
            highlightedEdges={state.highlightedEdges}
            distances={state.distances}
            showWeights
            directed
          />
        )
      }
      codeProps={state ? {
        code: template.code,
        currentLine: state.currentLine,
        done: state.done,
        title: template.name,
        description: template.description,
      } : null}
      stateProps={state ? { variables, additionalInfo } : null}
      infoTabs={[
        ...(state ? [{
          id: 'explanation',
          label: 'Explanation',
          content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? (state.hasNegativeCycle ? 'failure' : 'success') : 'running'} />,
        }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: (
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p><span className="font-medium text-zinc-900 dark:text-white">Algorithm:</span> Bellman-Ford finds shortest paths even with negative edges</p>
            <p><span className="font-medium text-zinc-900 dark:text-white">Key:</span> Relaxes all edges V-1 times</p>
            <p><span className="font-medium text-zinc-900 dark:text-white">Detects:</span> Negative weight cycles</p>
          </div>
        )},
        ...(result ? [{
          id: 'result',
          label: 'Result',
          content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} />,
        }] : []),
      ]}
    />
  );
}
