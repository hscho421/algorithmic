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
} from '../../../lib/algorithms/searching/kadane';

function KadaneVisualization({ arr, currentIndex, maxSum, currentSum, bestRange, subarrayRange, phase, action, isNewMax, comparing }) {
  if (!arr || arr.length === 0) return null;

  const maxVal = Math.max(...arr.map(Math.abs));
  const chartHeight = 160;
  const halfHeight = chartHeight / 2;
  const barWidth = Math.max(40, 400 / arr.length);
  const getBarHeight = (val) => Math.max(12, Math.abs(val) / maxVal * (halfHeight - 12));

  return (
    <div className="space-y-6">
      {/* Current sums display */}
      <div className="flex justify-center gap-8 pt-2 pb-2 overflow-visible">
        <div className={`px-6 py-3 rounded-lg border-2 transition-all ${isNewMax ? 'bg-emerald-500/20 border-emerald-500 scale-105' : 'bg-zinc-800/50 border-zinc-700'}`}>
          <div className="text-xs text-zinc-500 mb-1">Max Sum</div>
          <div className={`text-2xl font-mono font-bold ${isNewMax ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {maxSum}
          </div>
        </div>
        <div className={`px-6 py-3 rounded-lg border-2 transition-all ${action === 'fresh' ? 'bg-amber-500/20 border-amber-500' : action === 'extend' ? 'bg-blue-500/20 border-blue-500' : 'bg-zinc-800/50 border-zinc-700'}`}>
          <div className="text-xs text-zinc-500 mb-1">Current Sum</div>
          <div className="text-2xl font-mono font-bold text-zinc-300">
            {currentSum}
          </div>
        </div>
      </div>

      {/* Comparison indicator */}
      <div className="min-h-[32px] flex justify-center items-center gap-4 text-sm">
        {comparing && phase === 'compare' ? (
          <>
            <div className={`px-3 py-1 rounded ${comparing.fresh > comparing.extend ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-700 text-zinc-400'}`}>
              Start Fresh: {comparing.fresh}
            </div>
            <span className="text-zinc-500">vs</span>
            <div className={`px-3 py-1 rounded ${comparing.extend >= comparing.fresh ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-700 text-zinc-400'}`}>
              Extend: {comparing.extend}
            </div>
          </>
        ) : (
          <span className="text-zinc-600">Comparing choices…</span>
        )}
      </div>

      {/* Array visualization */}
      <div className="space-y-2">
        <div
          className="relative flex items-center justify-center gap-1"
          style={{ height: `${chartHeight}px` }}
        >
          <div
            className="absolute left-0 right-0 border-t border-dashed border-zinc-700"
            style={{ top: `${halfHeight}px` }}
          />
          {arr.map((val, idx) => {
            const isCurrent = idx === currentIndex;
            const isInBestRange = bestRange && idx >= bestRange.start && idx <= bestRange.end;
            const isInCurrentSubarray = subarrayRange && idx >= subarrayRange.start && idx <= subarrayRange.end;
            const isPositive = val >= 0;
            const height = getBarHeight(val);

            return (
              <div
                key={idx}
                className="relative flex items-center justify-center"
                style={{ width: `${barWidth}px`, height: `${chartHeight}px` }}
              >
                <div
                  className={`w-full transition-all duration-200
                    ${isCurrent ? 'bg-purple-500 scale-110' :
                      isInBestRange && phase === 'done' ? 'bg-emerald-500' :
                      isInCurrentSubarray ? 'bg-blue-500/70' :
                      isPositive ? 'bg-zinc-600' : 'bg-rose-500/50'}
                    ${isPositive ? 'rounded-t-lg' : 'rounded-b-lg'}`}
                  style={{
                    height: `${height}px`,
                    position: 'absolute',
                    bottom: isPositive ? `${halfHeight}px` : 'auto',
                    top: !isPositive ? `${halfHeight}px` : 'auto',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Values */}
        <div className="flex justify-center gap-1">
          {arr.map((val, idx) => {
            const isCurrent = idx === currentIndex;
            const isInBestRange = bestRange && idx >= bestRange.start && idx <= bestRange.end;

            return (
              <div
                key={idx}
                className={`text-center font-mono text-sm transition-all
                  ${isCurrent ? 'text-purple-400 font-bold' :
                    isInBestRange && phase === 'done' ? 'text-emerald-400 font-bold' :
                    'text-zinc-400'}`}
                style={{ width: `${barWidth}px` }}
              >
                {val}
              </div>
            );
          })}
        </div>

        {/* Indices */}
        <div className="flex justify-center gap-1">
          {arr.map((_, idx) => (
            <div
              key={idx}
              className="text-center text-xs text-zinc-600"
              style={{ width: `${barWidth}px` }}
            >
              {idx}
            </div>
          ))}
        </div>
      </div>

      {/* Subarray range indicators */}
      {bestRange && bestRange.end >= bestRange.start && (
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-zinc-400">Best Subarray [{bestRange.start}...{bestRange.end}]</span>
          </div>
          {subarrayRange && subarrayRange.start !== bestRange.start && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/70"></div>
              <span className="text-zinc-400">Current Window [{subarrayRange.start}...{subarrayRange.end}]</span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500"></div>
          <span className="text-zinc-400">Current Index</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zinc-600"></div>
          <span className="text-zinc-400">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/50"></div>
          <span className="text-zinc-400">Negative</span>
        </div>
      </div>
    </div>
  );
}

export default function KadaneVisualizer() {
  const [arrayInput, setArrayInput] = useState('-2, 1, -3, 4, -1, 2, 1, -5, 4');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('kadane');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('kadane', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const arr = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    reset({ arr: arr.length > 0 ? arr : [-2, 1, -3, 4, -1, 2, 1, -5, 4] });
  }, [arrayInput, reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 6) + 6;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 21) - 10);
    setArrayInput(arr.join(', '));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { arrayInput });
  const handleLoadInput = (item) => { setArrayInput(item.input_json?.arrayInput ?? '-2, 1, -3, 4, -1, 2, 1, -5, 4'); };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'i', value: state.currentIndex ?? '—', desc: 'current index' },
    { name: 'max_sum', value: state.maxSum ?? 0, desc: 'maximum sum found' },
    { name: 'current_sum', value: state.currentSum ?? 0, desc: 'current window sum' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Array (comma-separated integers)" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="-2, 1, -3, 4, -1, 2, 1, -5, 4" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <p className="text-xs text-zinc-500">Include negative numbers to see the algorithm in action</p>
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
      visualizationContent={state && <KadaneVisualization arr={state.arr} currentIndex={state.currentIndex} maxSum={state.maxSum} currentSum={state.currentSum} bestRange={state.bestRange} subarrayRange={state.subarrayRange} phase={state.phase} action={state.action} isNewMax={state.isNewMax} comparing={state.comparing} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, { label: 'Best Range', value: state.bestRange ? `[${state.bestRange.start}, ${state.bestRange.end}]` : '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Key Insight:</span> At each position, decide: extend current subarray or start fresh?</p><p><span className="font-medium text-zinc-900 dark:text-white">Decision:</span> If current_sum + arr[i] &lt; arr[i], start fresh</p><p><span className="font-medium text-zinc-900 dark:text-white">Track Best:</span> Update max_sum whenever current_sum exceeds it</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
