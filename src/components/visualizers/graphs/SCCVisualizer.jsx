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
import { createGraph } from '../../../lib/dataStructures/Graph';
import { calculatePositions } from '../../../lib/utils/graphLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/scc';

const SCC_GRAPHS = {
  simple: {
    name: 'Simple SCC',
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'A'],
      ['B', 'D'],
      ['D', 'E'],
      ['E', 'F'],
      ['F', 'D'],
    ],
    positions: {
      A: { x: 20, y: 30 },
      B: { x: 40, y: 15 },
      C: { x: 35, y: 50 },
      D: { x: 65, y: 20 },
      E: { x: 80, y: 40 },
      F: { x: 60, y: 50 },
    },
  },
  twoCycles: {
    name: 'Two Cycles',
    vertices: ['1', '2', '3', '4', '5'],
    edges: [
      ['1', '2'],
      ['2', '3'],
      ['3', '1'],
      ['3', '4'],
      ['4', '5'],
      ['5', '4'],
    ],
    positions: {
      '1': { x: 15, y: 40 },
      '2': { x: 35, y: 20 },
      '3': { x: 40, y: 55 },
      '4': { x: 70, y: 30 },
      '5': { x: 85, y: 50 },
    },
  },
};

export default function SCCVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});
  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']]);

  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('scc');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = {
    mode,
    selectedPreset,
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
  } = useProgress('scc', progressPayload);

  useEffect(() => {
    stop();
    let graph;
    let pos;
    if (mode === 'preset') {
      const preset = SCC_GRAPHS[selectedPreset];
      graph = createGraph(preset.vertices, preset.edges, true);
      pos = preset.positions;
    } else {
      graph = createGraph(customVertices, customEdges, true);
      pos = calculatePositions(customVertices);
    }
    setCurrentGraph(graph);
    setPositions(pos);
    reset({ graph, positions: pos });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedPreset, customVertices, customEdges]);

  const handleReset = useCallback(() => {
    stop();
    if (currentGraph) {
      reset({ graph: currentGraph, positions });
    }
  }, [currentGraph, positions, reset, stop]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleSaveInput = (name) => saveInput(name, { mode, selectedPreset, customVertices, customEdges });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D']);
    setCustomEdges(payload.customEdges ?? [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']]);
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    handleLoadInput({ input_json: payload });
  };

  const presetOptions = Object.entries(SCC_GRAPHS).map(([key, preset]) => ({
    value: key,
    label: preset.name,
  }));

  const variables = state
    ? [
        { name: 'stack', value: state.stack?.length || 0, desc: 'finish stack' },
        { name: 'components', value: state.components?.length || 0, desc: 'found' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Phase', value: state.phase || '—' },
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
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
          <p><span className="text-zinc-900 dark:text-white font-medium">Pass 1:</span> DFS to fill finish stack</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">Transpose:</span> Reverse all edges</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">Pass 2:</span> DFS by stack order to form SCCs</p>
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
          <ConfigSection title="Graph">
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
                label="Preset"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                options={presetOptions}
                className="mt-3"
              />
            ) : (
              <div className="mt-4">
                <GraphEditor
                  vertices={customVertices}
                  edges={customEdges}
                  onVerticesChange={setCustomVertices}
                  onEdgesChange={setCustomEdges}
                  directed
                />
              </div>
            )}
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
        onReset: handleReset,
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
            directed
          />
        )
      }
      visualizationMinHeight="420px"
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
