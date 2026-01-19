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
} from '../../../lib/algorithms/dp/subsetSum';

function SubsetSumTable({ dp, nums, target, highlightCell, lookingAt = [] }) {
  if (!dp || dp.length === 0) return null;

  return (
    <div className="overflow-auto flex justify-center">
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">nums</th>
            {Array.from({ length: target + 1 }, (_, s) => (
              <th key={s} className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium">∅</td>
            {dp[0].map((val, s) => {
              const isHighlight = highlightCell?.row === 0 && highlightCell?.col === s;
              const isLooking = lookingAt.some(c => c.row === 0 && c.col === s);
              return (
                <td key={s} className={`p-2 border border-zinc-700 text-center min-w-[32px] ${isHighlight ? 'bg-emerald-500/30 text-emerald-300 font-bold' : isLooking ? 'bg-amber-500/20 text-amber-300' : val ? 'bg-blue-500/20 text-blue-300' : 'text-zinc-500'}`}>
                  {val ? 'T' : 'F'}
                </td>
              );
            })}
          </tr>
          {nums.map((num, i) => (
            <tr key={i}>
              <td className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium">{num}</td>
              {dp[i + 1].map((val, s) => {
                const isHighlight = highlightCell?.row === i + 1 && highlightCell?.col === s;
                const isLooking = lookingAt.some(c => c.row === i + 1 && c.col === s);
                return (
                  <td key={s} className={`p-2 border border-zinc-700 text-center min-w-[32px] ${isHighlight ? 'bg-emerald-500/30 text-emerald-300 font-bold' : isLooking ? 'bg-amber-500/20 text-amber-300' : val ? 'bg-blue-500/20 text-blue-300' : 'text-zinc-500'}`}>
                    {val ? 'T' : 'F'}
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

export default function SubsetSumVisualizer() {
  const [arrayInput, setArrayInput] = useState('3, 34, 4, 12, 5, 2');
  const [targetInput, setTargetInput] = useState('9');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('subset-sum');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, targetInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('subset-sum', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const nums = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    const target = Math.max(1, parseInt(targetInput, 10) || 9);
    reset({ nums: nums.length > 0 ? nums : [3, 34, 4, 12, 5, 2], target });
  }, [arrayInput, targetInput, reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput, targetInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);
  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 4) + 4;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 15) + 1);
    const sum = arr.reduce((a, b) => a + b, 0);
    setArrayInput(arr.join(', '));
    setTargetInput(String(Math.floor(sum * (0.3 + Math.random() * 0.4))));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { arrayInput, targetInput });
  const handleLoadInput = (item) => { setArrayInput(item.input_json?.arrayInput ?? '3, 34, 4, 12, 5, 2'); setTargetInput(item.input_json?.targetInput ?? '9'); };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'i', value: state.i ?? '—', desc: 'item index' },
    { name: 's', value: state.s ?? '—', desc: 'target sum' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Array (comma-separated)" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="3, 34, 4, 12, 5, 2" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <Input label="Target Sum" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} placeholder="9" type="number" min="1" />
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
      visualizationContent={state && <SubsetSumTable dp={state.dp} nums={state.nums} target={state.target} highlightCell={state.highlightCell} lookingAt={state.lookingAt} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? (state.result ? 'success' : 'failure') : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Subset Sum:</span> Can any subset sum to target?</p><p><span className="font-medium text-zinc-900 dark:text-white">dp[i][s]:</span> Can first i items make sum s?</p><p><span className="font-medium text-zinc-900 dark:text-white">Choice:</span> Include or exclude each item</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
