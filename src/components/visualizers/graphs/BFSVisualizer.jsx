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
import { createGraph, PRESET_GRAPHS } from '../../../lib/dataStructures/Graph';
import { calculatePositions } from '../../../lib/utils/graphLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/bfs';

export default function BFSVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [startNode, setStartNode] = useState('A');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']]);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('bfs');

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
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'bfs',
    progressPayload,
  );

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

  const handleSaveInput = (name) => {
    return saveInput(name, {
      mode,
      selectedPreset,
      startNode,
      customVertices,
      customEdges,
    });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setStartNode(payload.startNode ?? 'A');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D']);
    setCustomEdges(payload.customEdges ?? [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']]);
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setStartNode(payload.startNode ?? 'A');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D']);
    setCustomEdges(payload.customEdges ?? [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']]);
  };

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

  const infoTabs = [
    {
      id: 'explanation',
      label: 'Explanation',
      content: state ? (
        <ExplanationPanel
          explanation={getExplanation(state)}
          status={state.done ? 'success' : 'running'}
        />
      ) : (
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">
          Click Step or Run to begin
        </div>
      ),
    },
    {
      id: 'complexity',
      label: 'Complexity',
      content: <ComplexityPanel complexity={complexity} />,
    },
    {
      id: 'guide',
      label: 'Guide',
      content: (
        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p><span className="text-zinc-900 dark:text-white font-medium">Queue:</span> FIFO — first in, first out</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">Level-order:</span> Visits all nodes at depth d before d+1</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">Shortest path:</span> Finds shortest path in unweighted graphs</p>
        </div>
      ),
    },
  ];

  if (result) {
    infoTabs.push({
      id: 'result',
      label: 'Result',
      content: (
        <ResultBanner
          success={result.success}
          title={result.title}
          message={result.message}
          details={result.details}
        />
      ),
    });
  }

  return (
    <VisualizerLayout
      configurationContent={
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

          <SavedInputsPanel
            items={savedInputs}
            isLoading={savedLoading}
            onSave={handleSaveInput}
            onLoad={handleLoadInput}
            onDelete={(item) => deleteInput(item.id)}
          />
          <ProgressPanel
            progress={progress}
            isLoading={progressLoading}
            onResume={handleResume}
            onClear={clearProgress}
          />
        </div>
      }
      controlProps={{
        onStep: step,
        onBack: handleBack,
        onRun: toggle,
        onReset: handleReset,
        isRunning,
        canStep,
        canBack,
        speed,
        onSpeedChange: setSpeed,
      }}
      visualizationContent={
        <div className="min-h-[400px] w-full">
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
      }
      codeProps={
        state
          ? {
              code: template.code,
              currentLine: state.currentLine,
              done: state.done,
              title: template.name,
              description: template.description,
            }
          : null
      }
      stateProps={state ? { variables, additionalInfo } : null}
      infoTabs={infoTabs}
    />
  );
}
