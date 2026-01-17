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
import { createGraph, DAG_GRAPHS } from '../../../lib/dataStructures/Graph';
import { calculatePositions } from '../../../lib/utils/graphLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/topologicalSort';

export default function TopologicalSortVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simpleDAG');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D', 'E']);
  const [customEdges, setCustomEdges] = useState([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']]);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('topological-sort');

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
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'topological-sort',
    progressPayload,
  );

  // Build graph when configuration changes
  useEffect(() => {
    stop();
    let graph, pos;

    if (mode === 'preset') {
      const preset = DAG_GRAPHS[selectedPreset];
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
    setSelectedPreset(payload.selectedPreset ?? 'simpleDAG');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D', 'E']);
    setCustomEdges(payload.customEdges ?? [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']]);
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simpleDAG');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D', 'E']);
    setCustomEdges(payload.customEdges ?? [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']]);
  };

  const presetOptions = Object.entries(DAG_GRAPHS).map(([key, preset]) => ({
    value: key,
    label: preset.name,
  }));

  const variables = state
    ? [
        { name: 'processed', value: state.result?.length || 0, desc: 'nodes ordered' },
        { name: 'queue', value: state.queue?.length || 0, desc: 'ready to process' },
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
        <div className="space-y-4">
          {state?.inDegree && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                In-Degrees
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(state.inDegree).map(([node, deg]) => (
                  <div
                    key={node}
                    className={`bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700/50 flex justify-between items-center
                      ${deg === 0 ? 'ring-1 ring-emerald-500' : ''}
                    `}
                  >
                    <span className="font-mono text-zinc-700 dark:text-zinc-300 text-sm">{node}</span>
                    <span className={`font-mono text-sm ${deg === 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                      {deg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p><span className="text-zinc-900 dark:text-white font-medium">In-degree:</span> Number of incoming edges</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">Sources:</span> Nodes with in-degree 0 (no dependencies)</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">Use cases:</span> Build systems, task scheduling, course prerequisites</p>
            <p><span className="text-rose-600 dark:text-rose-400 font-medium">Cycle:</span> If cycle exists, no valid ordering possible</p>
          </div>
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
            <>
              <Select
                label="Select DAG"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                options={presetOptions}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Directed Acyclic Graph (DAG) — edges have direction, no cycles allowed.
              </p>
            </>
          ) : (
            <>
              <GraphEditor
                vertices={customVertices}
                edges={customEdges}
                onVerticesChange={setCustomVertices}
                onEdgesChange={setCustomEdges}
                directed={true}
                weighted={false}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Note: If you create a cycle, the algorithm will detect it!
              </p>
            </>
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
              directed={true}
              inDegree={state.inDegree}
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
