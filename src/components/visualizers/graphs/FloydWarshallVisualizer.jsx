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
} from '../../../lib/algorithms/graphs/floydWarshall';

function DistanceMatrix({ dist, vertices, highlightCell }) {
  if (!dist || !vertices) return null;
  return (
    <div className="overflow-auto">
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            <th className="p-1 border border-zinc-700 bg-zinc-800"></th>
            {vertices.map(v => <th key={v} className="p-1 border border-zinc-700 bg-zinc-800 text-zinc-300">{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {vertices.map((v, i) => (
            <tr key={v}>
              <td className="p-1 border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium">{v}</td>
              {dist[i]?.map((d, j) => {
                const isHighlight = highlightCell?.row === i && highlightCell?.col === j;
                const isUpdated = isHighlight && highlightCell?.updated;
                return (
                  <td key={j} className={`p-1 border border-zinc-700 text-center min-w-[32px] ${isUpdated ? 'bg-emerald-500/30 text-emerald-300' : isHighlight ? 'bg-amber-500/30 text-amber-300' : 'text-zinc-400'}`}>
                    {d === Infinity ? '∞' : d}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FloydWarshallVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');
  const [currentGraph, setCurrentGraph] = useState(null);
  const [positions, setPositions] = useState({});

  const [customVertices, setCustomVertices] = useState(['A', 'B', 'C', 'D']);
  const [customEdges, setCustomEdges] = useState([['A', 'B', 3], ['A', 'D', 7], ['B', 'C', 2], ['C', 'D', 1]]);
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('floyd-warshall');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { mode, selectedPreset, customVertices, customEdges, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('floyd-warshall', progressPayload);

  useEffect(() => {
    stop();
    let graph, pos;
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
  }, [mode, selectedPreset, customVertices, customEdges]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);
  const handleSaveInput = (name) => saveInput(name, { mode, selectedPreset, customVertices, customEdges });
  const handleLoadInput = (item) => {
    const p = item.input_json || {};
    setMode(p.mode ?? 'preset');
    setSelectedPreset(p.selectedPreset ?? 'simple');
    if (p.customVertices) setCustomVertices(p.customVertices);
    if (p.customEdges) setCustomEdges(p.customEdges);
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'k', value: state.k ?? '—', desc: 'intermediate vertex' },
    { name: 'i', value: state.i ?? '—', desc: 'source' },
    { name: 'j', value: state.j ?? '—', desc: 'destination' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Graph">
            <Select label="Mode" value={mode} onChange={(e) => setMode(e.target.value)} options={[{ value: 'preset', label: 'Preset Graph' }, { value: 'custom', label: 'Custom Graph' }]} />
            {mode === 'preset' && <Select label="Preset" value={selectedPreset} onChange={(e) => setSelectedPreset(e.target.value)} options={Object.entries(WEIGHTED_GRAPHS).map(([key, g]) => ({ value: key, label: g.name }))} />}
            {mode === 'custom' && <GraphEditor vertices={customVertices} edges={customEdges} onVerticesChange={setCustomVertices} onEdgesChange={setCustomEdges} weighted directed />}
          </ConfigSection>
          <ConfigSection title="History" open={false}>
            <SavedInputsPanel items={savedInputs} isLoading={savedLoading} onSave={handleSaveInput} onLoad={handleLoadInput} onDelete={(item) => deleteInput(item.id)} />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel progress={progress} isLoading={progressLoading} onResume={handleResume} onClear={clearProgress} checkpoints={checkpoints} onSaveCheckpoint={saveCheckpoint} onLoadCheckpoint={handleResume} onDeleteCheckpoint={deleteCheckpoint} />
          </ConfigSection>
        </div>
      }
      controlProps={{ onStep: step, onBack: handleBack, onRun: toggle, onReset: () => { stop(); reset({ graph: currentGraph, positions }); }, isRunning, canStep, canBack, speed, onSpeedChange: setSpeed }}
      visualizationContent={
        <div className="flex flex-col items-center gap-4 h-full">
          {state && <GraphDisplay vertices={state.vertices} edges={state.edges} positions={state.positions} highlightedNodes={state.highlightedNodes} highlightedEdges={state.highlightedEdges} showWeights directed />}
          {state && <DistanceMatrix dist={state.dist} vertices={state.vertices} highlightCell={state.highlightCell} />}
        </div>
      }
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? (state.hasNegativeCycle ? 'failure' : 'success') : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Floyd-Warshall:</span> All-pairs shortest paths in O(V³)</p><p><span className="font-medium text-zinc-900 dark:text-white">Key idea:</span> For each pair (i,j), check if going through k is shorter</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
