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
} from '../../../lib/algorithms/graphs/mstKruskal';

export default function MSTVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D', 'E']);
  const [customEdges, setCustomEdges] = useState([['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['D', 'E', 2]]);

  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('kruskal-mst');

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
  } = useProgress('kruskal-mst', progressPayload);

  useEffect(() => {
    stop();
    let graph;
    let pos;

    if (mode === 'preset') {
      const preset = WEIGHTED_GRAPHS[selectedPreset];
      graph = createGraph(preset.vertices, preset.edges);
      pos = preset.positions;
    } else {
      graph = createGraph(customVertices, customEdges);
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

  const handleSaveInput = (name) => {
    return saveInput(name, {
      mode,
      selectedPreset,
      customVertices,
      customEdges,
    });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D', 'E']);
    setCustomEdges(payload.customEdges ?? [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['D', 'E', 2]]);
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D', 'E']);
    setCustomEdges(payload.customEdges ?? [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['D', 'E', 2]]);
  };

  const presetOptions = Object.entries(WEIGHTED_GRAPHS).map(([key, preset]) => ({
    value: key,
    label: preset.name,
  }));

  const variables = state
    ? [
        { name: 'edges', value: state.mstEdges?.length || 0, desc: 'in MST' },
        { name: 'weight', value: state.totalWeight ?? 0, desc: 'total weight' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
        { label: 'Status', value: state.phase || '—' },
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
          status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
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
          <p><span className="text-zinc-900 dark:text-white font-medium">Sort:</span> Process edges from smallest to largest weight</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">Cycle check:</span> Use union-find to avoid cycles</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">Stop early:</span> MST has V-1 edges</p>
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
                label="Preset Graph"
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
                  weighted
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
            pathEdges={state.pathEdges}
            showWeights
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
