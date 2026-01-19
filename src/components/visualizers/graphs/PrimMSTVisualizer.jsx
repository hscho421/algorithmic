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
} from '../../../lib/algorithms/graphs/primMST';

export default function PrimMSTVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [startNode, setStartNode] = useState('A');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 3], ['C', 'D', 1]]);
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('prim-mst');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { mode, selectedPreset, startNode, customVertices, customEdges, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('prim-mst', progressPayload);

  useEffect(() => {
    stop();
    let graph, pos, newStartNode = startNode;

    if (mode === 'preset') {
      const preset = WEIGHTED_GRAPHS[selectedPreset];
      graph = createGraph(preset.vertices, preset.edges);
      pos = preset.positions;
      if (!preset.vertices.includes(startNode)) newStartNode = preset.vertices[0];
    } else {
      graph = createGraph(customVertices, customEdges);
      pos = calculatePositions(customVertices);
      if (!customVertices.includes(startNode) && customVertices.length > 0) newStartNode = customVertices[0];
    }

    setCurrentGraph(graph);
    setPositions(pos);
    if (newStartNode !== startNode) setStartNode(newStartNode);
    reset({ graph, startNode: newStartNode, positions: pos });
  }, [mode, selectedPreset, customVertices, customEdges]);

  useEffect(() => {
    if (currentGraph) {
      stop();
      reset({ graph: currentGraph, startNode, positions });
    }
  }, [startNode]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleSaveInput = (name) => saveInput(name, { mode, selectedPreset, startNode, customVertices, customEdges });
  const handleLoadInput = (item) => {
    const p = item.input_json || {};
    setMode(p.mode ?? 'preset');
    setSelectedPreset(p.selectedPreset ?? 'simple');
    setStartNode(p.startNode ?? 'A');
    if (p.customVertices) setCustomVertices(p.customVertices);
    if (p.customEdges) setCustomEdges(p.customEdges);
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'visited', value: state.visited?.length || 0, desc: 'vertices in MST' },
    { name: 'totalWeight', value: state.totalWeight ?? 0, desc: 'MST weight' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Graph">
            <Select label="Mode" value={mode} onChange={(e) => setMode(e.target.value)} options={[{ value: 'preset', label: 'Preset Graph' }, { value: 'custom', label: 'Custom Graph' }]} />
            {mode === 'preset' && <Select label="Preset" value={selectedPreset} onChange={(e) => setSelectedPreset(e.target.value)} options={Object.entries(WEIGHTED_GRAPHS).map(([key, g]) => ({ value: key, label: g.name }))} />}
            {mode === 'custom' && <GraphEditor vertices={customVertices} edges={customEdges} onVerticesChange={setCustomVertices} onEdgesChange={setCustomEdges} weighted />}
            <Select label="Start Node" value={startNode} onChange={(e) => setStartNode(e.target.value)} options={(currentGraph?.vertices || []).map((v) => ({ value: v, label: v }))} />
          </ConfigSection>
          <ConfigSection title="History" open={false}>
            <SavedInputsPanel items={savedInputs} isLoading={savedLoading} onSave={handleSaveInput} onLoad={handleLoadInput} onDelete={(item) => deleteInput(item.id)} />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel progress={progress} isLoading={progressLoading} onResume={handleResume} onClear={clearProgress} checkpoints={checkpoints} onSaveCheckpoint={saveCheckpoint} onLoadCheckpoint={handleResume} onDeleteCheckpoint={deleteCheckpoint} />
          </ConfigSection>
        </div>
      }
      controlProps={{ onStep: step, onBack: handleBack, onRun: toggle, onReset: () => { stop(); reset({ graph: currentGraph, startNode, positions }); }, isRunning, canStep, canBack, speed, onSpeedChange: setSpeed }}
      visualizationContent={state && <GraphDisplay vertices={state.vertices} edges={state.edges} positions={state.positions} highlightedNodes={state.highlightedNodes} highlightedEdges={state.highlightedEdges} showWeights />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Prim's Algorithm:</span> Grows MST from a starting vertex</p><p><span className="font-medium text-zinc-900 dark:text-white">Strategy:</span> Always pick minimum weight edge to unvisited vertex</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
