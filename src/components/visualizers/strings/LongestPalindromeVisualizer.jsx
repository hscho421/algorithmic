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
} from '../../../lib/algorithms/strings/longestPalindrome';

function PalindromeVisualization({ s, left, right, bestStart, bestEnd, center, phase, isOdd, match }) {
  if (!s) return null;
  const bestLength = bestEnd != null && bestStart != null ? bestEnd - bestStart + 1 : 0;

  return (
    <div className="space-y-6">
      {/* Phase indicator */}
      <div className="flex justify-center gap-4 text-xs">
        <div className={`px-3 py-1 rounded-full ${phase === 'center' ? 'bg-purple-500/30 text-purple-300' : 'bg-zinc-800 text-zinc-500'}`}>
          Select Center
        </div>
        <div className={`px-3 py-1 rounded-full ${phase === 'expand' ? 'bg-amber-500/30 text-amber-300' : 'bg-zinc-800 text-zinc-500'}`}>
          Expand
        </div>
        <div className={`px-3 py-1 rounded-full ${phase === 'update' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-zinc-800 text-zinc-500'}`}>
          Update Best
        </div>
      </div>

      {/* String visualization */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 text-center">
          {isOdd !== undefined && (phase === 'center' || phase === 'expand' || phase === 'update') && (
            <span className="ml-2 text-zinc-400">
              ({isOdd ? 'Odd-length' : 'Even-length'} palindrome)
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {s.split('').map((char, idx) => {
            const isCenter = idx === center;
            const isExpanding = idx === left || idx === right;
            const isCurrentPalindrome = left != null && right != null && idx >= left && idx <= right && (phase === 'expand' || phase === 'update');
            const isBestPalindrome = bestStart != null && bestEnd != null && idx >= bestStart && idx <= bestEnd;

            return (
              <div
                key={idx}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-lg border-2 transition-all duration-200
                  ${isCenter && phase === 'center' ? 'bg-purple-500/30 border-purple-500 text-purple-300 scale-110' :
                    isExpanding && (phase === 'expand' || phase === 'update') ? (match === false ? 'bg-rose-500/30 border-rose-500 text-rose-300' : 'bg-amber-500/30 border-amber-500 text-amber-300 scale-105') :
                    isCurrentPalindrome ? 'bg-blue-500/20 border-blue-500 text-blue-300' :
                    isBestPalindrome ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                    'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
              >
                {char}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {s.split('').map((_, idx) => (
            <div key={idx} className="w-10 text-center text-xs text-zinc-500">
              {idx}
            </div>
          ))}
        </div>
      </div>

      {/* Expansion pointers */}
      {(phase === 'expand' || phase === 'update') && left != null && right != null && (
        <div className="flex justify-center items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-2">
            <span className={match === false ? 'text-rose-400' : 'text-amber-400'}>←</span>
            <span className="text-xs font-mono">left = {left}</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${match === false ? 'bg-rose-500/20 text-rose-300' : match === true ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700 text-zinc-400'}`}>
            {match === false ? 'mismatch!' : match === true ? 'match!' : 'comparing'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono">right = {right}</span>
            <span className={match === false ? 'text-rose-400' : 'text-amber-400'}>→</span>
          </div>
        </div>
      )}

      {/* Current best palindrome */}
      <div className={`p-4 rounded-lg border text-center transition-all ${phase === 'update' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-zinc-800/50 border-zinc-700'}`}>
        <div className="text-xs font-medium text-zinc-500 mb-2">Best Palindrome Found</div>
        <div className={`text-2xl font-mono ${phase === 'update' ? 'text-emerald-300 scale-105' : 'text-emerald-400'} transition-all`}>
          "{s.slice(bestStart, bestEnd + 1)}"
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          Length: {bestLength} | Position: [{bestStart}, {bestEnd}]
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500"></div>
          <span className="text-zinc-400">Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-500"></div>
          <span className="text-zinc-400">Expanding</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500"></div>
          <span className="text-zinc-400">Current Palindrome</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
          <span className="text-zinc-400">Best Palindrome</span>
        </div>
      </div>
    </div>
  );
}

export default function LongestPalindromeVisualizer() {
  const [stringInput, setStringInput] = useState('babad');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('longest-palindrome');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { stringInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('longest-palindrome', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    reset({ s: stringInput });
  }, [stringInput, reset, stop]);

  useEffect(() => { handleReset(); }, [stringInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const examples = ['babad', 'cbbd', 'racecar', 'aabbaa', 'abcba', 'forgeeksskeegfor', 'abacdfgdcaba'];
    setStringInput(examples[Math.floor(Math.random() * examples.length)]);
  }, []);

  const handleSaveInput = (name) => saveInput(name, { stringInput });
  const handleLoadInput = (item) => { setStringInput(item.input_json?.stringInput ?? 'babad'); };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'center', value: state.center ?? '—', desc: 'expansion center' },
    { name: 'left', value: state.left ?? '—', desc: 'left pointer' },
    { name: 'right', value: state.right ?? '—', desc: 'right pointer' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="String" value={stringInput} onChange={(e) => setStringInput(e.target.value.toLowerCase())} placeholder="babad" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
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
      visualizationContent={state && <PalindromeVisualization s={state.s} left={state.left} right={state.right} bestStart={state.bestStart} bestEnd={state.bestEnd} center={state.center} phase={state.phase} isOdd={state.isOdd} match={state.match} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, { label: 'Best Length', value: (state.bestEnd - state.bestStart + 1) || 0 }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Expand Around Center:</span> Try each position as center</p><p><span className="font-medium text-zinc-900 dark:text-white">Two Cases:</span> Odd length (single center) and even length (between two chars)</p><p><span className="font-medium text-zinc-900 dark:text-white">Time:</span> O(n²) - expand from each of 2n-1 centers</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
