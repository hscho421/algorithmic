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
import { createGraph, WEIGHTED_GRAPHS } from '../../../lib/dataStructures/Graph';
import { calculatePositions } from '../../../lib/utils/graphLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/graphs/dijkstra';

export default function DijkstraVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [startNode, setStartNode] = useState('A');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 3], ['C', 'D', 1]]);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('dijkstra');

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
  } = useProgress(
    'dijkstra',
    progressPayload,
  );

  // Build graph when configuration changes
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
    setCustomEdges(payload.customEdges ?? [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 3], ['C', 'D', 1]]);
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setStartNode(payload.startNode ?? 'A');
    setCustomVertices(payload.customVertices ?? ['A', 'B', 'C', 'D']);
    setCustomEdges(payload.customEdges ?? [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 3], ['C', 'D', 1]]);
  };

  const presetOptions = Object.entries(WEIGHTED_GRAPHS).map(([key, preset]) => ({
    value: key,
    label: preset.name,
  }));

  const nodeOptions = currentGraph?.vertices.map((v) => ({ value: v, label: v })) || [];

  const variables = state
    ? [
        { name: 'visited', value: state.visited?.length || 0, desc: 'finalized nodes' },
        { name: 'pq size', value: state.priorityQueue?.length || 0, desc: 'priority queue' },
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
        <div className="space-y-4">
          {state?.distances && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Distances
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(state.distances).map(([node, dist]) => (
                  <div
                    key={node}
                    className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700/50 flex justify-between items-center"
                  >
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{node}</span>
                    <span className={`font-mono text-sm ${dist === Infinity ? 'text-zinc-500' : 'text-emerald-500'}`}>
                      {dist === Infinity ? '∞' : dist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p><span className="text-zinc-900 dark:text-white font-medium">Greedy:</span> Always processes nearest unvisited node</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">Priority Queue:</span> Efficiently finds minimum distance</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">Relaxation:</span> Updates distance if shorter path found</p>
            <p><span className="text-rose-600 dark:text-rose-400 font-medium">Limitation:</span> No negative edge weights</p>
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
                weighted={true}
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
        <div className="min-h-[400px] w-full">
          {state && (
            <GraphDisplay
              vertices={state.vertices}
              edges={state.edges}
              positions={state.positions}
              highlightedNodes={state.highlightedNodes}
              highlightedEdges={state.highlightedEdges}
              current={state.current}
              distances={state.distances}
              showWeights={true}
              pathEdges={state.pathEdges || []}
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

function ConfigSection({ title, children, open = true }) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 last:border-b-0">
      <button
        className="w-full flex justify-between items-center py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isOpen && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}
