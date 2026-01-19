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
import { DPTable1D } from './DPTableVisualization';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/dp/lis';

function LISArrayVisualization({ nums, dp, highlightI, highlightJ, lisIndices = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Original array */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-zinc-500">Array</div>
        <div className="flex gap-1 justify-center flex-wrap">
          {nums.map((val, idx) => {
            const isI = idx === highlightI;
            const isJ = idx === highlightJ;
            const inLIS = lisIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm font-semibold border-2 transition-all ${
                  isI ? 'bg-emerald-500 border-emerald-400 text-white scale-110' :
                  isJ ? 'bg-amber-400 border-amber-300 text-white' :
                  inLIS ? 'bg-blue-500 border-blue-400 text-white' :
                  'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200'
                }`}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>
      {/* DP array */}
      <DPTable1D dp={dp} highlightIndex={highlightI} label="dp" comparing={highlightJ !== null ? [highlightJ] : []} />
    </div>
  );
}

export default function LISVisualizer() {
  const [arrayInput, setArrayInput] = useState('10, 9, 2, 5, 3, 7, 101, 18');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('lis');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('lis', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const nums = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    reset({ nums: nums.length > 0 ? nums : [10, 9, 2, 5, 3, 7, 101, 18] });
  }, [arrayInput, reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);
  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 6) + 5;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 100));
    setArrayInput(arr.join(', '));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { arrayInput });
  const handleLoadInput = (item) => setArrayInput(item.input_json?.arrayInput ?? '10, 9, 2, 5, 3, 7, 101, 18');
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'i', value: state.i ?? '—', desc: 'current index' },
    { name: 'j', value: state.j ?? '—', desc: 'comparing index' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Array (comma-separated)" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="10, 9, 2, 5, 3, 7" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random array">🎲</button>
            </div>
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
      visualizationContent={state && <LISArrayVisualization nums={state.nums} dp={state.dp} highlightI={state.highlightI} highlightJ={state.highlightJ} lisIndices={state.lisIndices} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Step', value: `${state.stepIndex + 1}` }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">LIS:</span> Find longest strictly increasing subsequence</p><p><span className="font-medium text-zinc-900 dark:text-white">dp[i]:</span> Length of LIS ending at index i</p><p><span className="font-medium text-zinc-900 dark:text-white">Recurrence:</span> dp[i] = max(dp[j] + 1) for j &lt; i where nums[j] &lt; nums[i]</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
