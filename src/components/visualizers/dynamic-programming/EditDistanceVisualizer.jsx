import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
import ConfigSection from '../../shared/layout/ConfigSection';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/dp/editDistance';

function EditDistanceTable({ dp, s1, s2, highlightCell, comparingCells = [], operation }) {
  if (!dp || dp.length === 0) return null;

  const getOpColor = (op) => {
    if (op === 'match') return 'bg-emerald-500/20 text-emerald-300';
    if (op === 'replace') return 'bg-purple-500/20 text-purple-300';
    if (op === 'insert') return 'bg-blue-500/20 text-blue-300';
    if (op === 'delete') return 'bg-rose-500/20 text-rose-300';
    return '';
  };

  return (
    <div className="overflow-auto flex justify-center">
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-zinc-700 bg-zinc-800"></th>
            <th className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">""</th>
            {s2.split('').map((c, i) => (
              <th key={i} className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium">""</td>
            {dp[0].map((val, j) => {
              const isHighlight = highlightCell?.row === 0 && highlightCell?.col === j;
              const isComparing = comparingCells.some(c => c.row === 0 && c.col === j);
              return (
                <td key={j} className={`p-2 border border-zinc-700 text-center min-w-[36px] ${isHighlight ? `${getOpColor(operation)} font-bold` : isComparing ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400'}`}>
                  {val}
                </td>
              );
            })}
          </tr>
          {s1.split('').map((c, i) => (
            <tr key={i}>
              <td className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium">{c}</td>
              {dp[i + 1].map((val, j) => {
                const isHighlight = highlightCell?.row === i + 1 && highlightCell?.col === j;
                const isComparing = comparingCells.some(cc => cc.row === i + 1 && cc.col === j);
                return (
                  <td key={j} className={`p-2 border border-zinc-700 text-center min-w-[36px] ${isHighlight ? `${getOpColor(operation)} font-bold` : isComparing ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400'}`}>
                    {val}
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

export default function EditDistanceVisualizer() {
  const [s1, setS1] = useState('kitten');
  const [s2, setS2] = useState('sitting');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('edit-distance');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { s1, s2, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('edit-distance', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    reset({ s1: s1 || 'kitten', s2: s2 || 'sitting' });
  }, [s1, s2, reset, stop]);

  useEffect(() => { handleReset(); }, [s1, s2]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);
  const handleSaveInput = (name) => saveInput(name, { s1, s2 });
  const handleLoadInput = (item) => { setS1(item.input_json?.s1 ?? 'kitten'); setS2(item.input_json?.s2 ?? 'sitting'); };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'i', value: state.i ?? '—', desc: 'row (s1)' },
    { name: 'j', value: state.j ?? '—', desc: 'col (s2)' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <Input label="String 1" value={s1} onChange={(e) => setS1(e.target.value)} placeholder="kitten" />
            <Input label="String 2" value={s2} onChange={(e) => setS2(e.target.value)} placeholder="sitting" />
          </ConfigSection>
          <ConfigSection title="History" open={false}>
            <SavedInputsPanel items={savedInputs} isLoading={savedLoading} onSave={handleSaveInput} onLoad={handleLoadInput} onDelete={(item) => deleteInput(item.id)} />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel progress={progress} isLoading={progressLoading} onResume={handleResume} onClear={clearProgress} checkpoints={checkpoints} onSaveCheckpoint={saveCheckpoint} onLoadCheckpoint={handleResume} onDeleteCheckpoint={deleteCheckpoint} />
          </ConfigSection>
        </div>
      }
      controlProps={{ onStep: step, onBack: handleBack, onRun: toggle, onReset: handleReset, isRunning, canStep, canBack, speed, onSpeedChange: setSpeed }}
      visualizationContent={state && <EditDistanceTable dp={state.dp} s1={state.s1} s2={state.s2} highlightCell={state.highlightCell} comparingCells={state.comparingCells} operation={state.operation} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Operation', value: state.operation || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Edit Distance:</span> Min operations to transform s1 → s2</p><p><span className="font-medium text-zinc-900 dark:text-white">Operations:</span> Insert, Delete, Replace</p><p><span className="font-medium text-zinc-900 dark:text-white">dp[i][j]:</span> Edit distance for s1[0..i-1] and s2[0..j-1]</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
