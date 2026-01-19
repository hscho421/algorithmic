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
} from '../../../lib/algorithms/strings/rabinKarp';

function HashVisualization({ text, pattern, windowStart, patternHash, windowHash, matches = [], isVerifying, phase }) {
  const windowEnd = windowStart + pattern.length;
  const isMatch = matches.includes(windowStart);

  return (
    <div className="space-y-6">
      {/* Text with sliding window */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Text (Sliding Window)</div>
        <div className="flex flex-wrap gap-1">
          {text.split('').map((char, idx) => {
            const inWindow = idx >= windowStart && idx < windowEnd;
            const isMatchedWindow = matches.some(m => idx >= m && idx < m + pattern.length);

            return (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm border transition-colors
                  ${inWindow && isVerifying ? 'bg-amber-500/30 border-amber-500 text-amber-300' :
                    inWindow && isMatch ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300' :
                    inWindow ? 'bg-blue-500/20 border-blue-500 text-blue-300' :
                    isMatchedWindow ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                    'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
              >
                {char}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1">
          {text.split('').map((_, idx) => (
            <div key={idx} className="w-8 text-center text-xs text-zinc-500">
              {idx}
            </div>
          ))}
        </div>
      </div>

      {/* Pattern */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pattern</div>
        <div className="flex gap-1">
          {pattern.split('').map((char, idx) => (
            <div
              key={idx}
              className="w-8 h-8 flex items-center justify-center rounded font-mono text-sm border bg-zinc-800 border-zinc-700 text-zinc-300"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Hash comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <div className="text-xs font-medium text-zinc-500 mb-2">Pattern Hash</div>
          <div className="text-2xl font-mono text-blue-400">{patternHash ?? '—'}</div>
        </div>
        <div className={`p-4 rounded-lg border ${
          windowHash === patternHash ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-zinc-800/50 border-zinc-700'
        }`}>
          <div className="text-xs font-medium text-zinc-500 mb-2">Window Hash</div>
          <div className={`text-2xl font-mono ${windowHash === patternHash ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {windowHash ?? '—'}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-sm">
        {phase === 'verify' && (
          <span className="text-amber-400">Hash match! Verifying characters...</span>
        )}
        {phase === 'found' && (
          <span className="text-emerald-400">Match confirmed at position {windowStart}!</span>
        )}
        {phase === 'slide' && (
          <span className="text-zinc-400">Sliding window...</span>
        )}
      </div>

      {/* Matches found */}
      {matches.length > 0 && (
        <div className="text-sm text-emerald-400">
          Matches found at: {matches.join(', ')}
        </div>
      )}
    </div>
  );
}

export default function RabinKarpVisualizer() {
  const [textInput, setTextInput] = useState('AABAACAADAABAAABAA');
  const [patternInput, setPatternInput] = useState('AABA');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('rabin-karp');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { textInput, patternInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('rabin-karp', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    reset({ text: textInput, pattern: patternInput });
  }, [textInput, patternInput, reset, stop]);

  useEffect(() => { handleReset(); }, [textInput, patternInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const examples = [
      { text: 'AABAACAADAABAAABAA', pattern: 'AABA' },
      { text: 'ABABABAB', pattern: 'ABAB' },
      { text: 'GEEKSFORGEEKS', pattern: 'GEEK' },
      { text: 'AAAAAA', pattern: 'AAA' },
      { text: 'ABCDEFG', pattern: 'CDE' },
    ];
    const { text, pattern } = examples[Math.floor(Math.random() * examples.length)];
    setTextInput(text);
    setPatternInput(pattern);
  }, []);

  const handleSaveInput = (name) => saveInput(name, { textInput, patternInput });
  const handleLoadInput = (item) => {
    setTextInput(item.input_json?.textInput ?? 'AABAACAADAABAAABAA');
    setPatternInput(item.input_json?.patternInput ?? 'AABA');
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'window', value: state.windowStart ?? '—', desc: 'start position' },
    { name: 'patternHash', value: state.patternHash ?? '—', desc: 'target hash' },
    { name: 'windowHash', value: state.windowHash ?? '—', desc: 'current hash' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Text" value={textInput} onChange={(e) => setTextInput(e.target.value.toUpperCase())} placeholder="AABAACAADAABAAABAA" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <Input label="Pattern" value={patternInput} onChange={(e) => setPatternInput(e.target.value.toUpperCase())} placeholder="AABA" />
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
      visualizationContent={state && <HashVisualization text={state.text} pattern={state.pattern} windowStart={state.windowStart} patternHash={state.patternHash} windowHash={state.windowHash} matches={state.matches} isVerifying={state.phase === 'verify'} phase={state.phase} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? (state.matches?.length > 0 ? 'success' : 'failure') : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Rabin-Karp:</span> Rolling hash for pattern matching</p><p><span className="font-medium text-zinc-900 dark:text-white">Rolling Hash:</span> Update hash in O(1) when sliding</p><p><span className="font-medium text-zinc-900 dark:text-white">Verification:</span> Compare chars only when hashes match</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
