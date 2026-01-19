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
} from '../../../lib/algorithms/strings/kmp';

function StringVisualization({ text, pattern, i, j, matches = [], matchStart, phase }) {
  const isMatched = (idx) => matches.some(m => idx >= m && idx < m + pattern.length);
  const isCurrentMatch = matchStart != null && phase === 'found';

  return (
    <div className="space-y-6">
      {/* Text visualization */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Text</div>
        <div className="flex flex-wrap gap-1">
          {text.split('').map((char, idx) => {
            const isCurrentI = idx === i - 1 && phase !== 'done';
            const isMatchedChar = isMatched(idx);
            const isInCurrentMatch = isCurrentMatch && idx >= matchStart && idx < matchStart + pattern.length;

            return (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm border transition-colors
                  ${isInCurrentMatch ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300' :
                    isCurrentI ? 'bg-amber-500/30 border-amber-500 text-amber-300' :
                    isMatchedChar ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' :
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

      {/* Pattern visualization with alignment */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pattern (aligned at text[{Math.max(0, (i || 0) - (j || 0))}])</div>
        <div className="flex flex-wrap gap-1" style={{ marginLeft: `${Math.max(0, ((i || 0) - (j || 0))) * 36}px` }}>
          {pattern.split('').map((char, idx) => {
            const isCurrentJ = idx === j;
            const isMatched = idx < j;

            return (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm border transition-colors
                  ${isCurrentJ ? 'bg-amber-500/30 border-amber-500 text-amber-300' :
                    isMatched ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                    'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      {/* LPS Array */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">LPS (Longest Proper Prefix which is also Suffix)</div>
        <div className="overflow-auto">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">Index</th>
                {pattern.split('').map((_, idx) => (
                  <th key={idx} className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 min-w-[32px]">{idx}</th>
                ))}
              </tr>
              <tr>
                <th className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">Char</th>
                {pattern.split('').map((char, idx) => (
                  <td key={idx} className="p-2 border border-zinc-700 text-center text-zinc-300 font-mono">{char}</td>
                ))}
              </tr>
            </thead>
          </table>
        </div>
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

export default function KMPVisualizer() {
  const [textInput, setTextInput] = useState('ABABDABACDABABCABAB');
  const [patternInput, setPatternInput] = useState('ABABCABAB');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('kmp');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { textInput, patternInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('kmp', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    reset({ text: textInput, pattern: patternInput });
  }, [textInput, patternInput, reset, stop]);

  useEffect(() => { handleReset(); }, [textInput, patternInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const texts = [
      'AABAACAADAABAAABAA',
      'ABABABCABABABCABAB',
      'AAAAABAAABA',
      'ABABDABACDABABCABAB',
      'GEEKSFORGEEKS',
    ];
    const patterns = [
      ['AABA', 'AAB', 'AA'],
      ['ABABC', 'ABAB', 'AB'],
      ['AAAB', 'AAA', 'AB'],
      ['ABABCABAB', 'ABAB', 'DAB'],
      ['GEEK', 'EEK', 'FOR'],
    ];
    const idx = Math.floor(Math.random() * texts.length);
    const patternIdx = Math.floor(Math.random() * patterns[idx].length);
    setTextInput(texts[idx]);
    setPatternInput(patterns[idx][patternIdx]);
  }, []);

  const handleSaveInput = (name) => saveInput(name, { textInput, patternInput });
  const handleLoadInput = (item) => {
    setTextInput(item.input_json?.textInput ?? 'ABABDABACDABABCABAB');
    setPatternInput(item.input_json?.patternInput ?? 'ABABCABAB');
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'i', value: state.i ?? '—', desc: 'text index' },
    { name: 'j', value: state.j ?? '—', desc: 'pattern index' },
    { name: 'matches', value: state.matches?.length ?? 0, desc: 'found' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Text" value={textInput} onChange={(e) => setTextInput(e.target.value.toUpperCase())} placeholder="ABABDABACDABABCABAB" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <Input label="Pattern" value={patternInput} onChange={(e) => setPatternInput(e.target.value.toUpperCase())} placeholder="ABABCABAB" />
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
      visualizationContent={state && <StringVisualization text={state.text} pattern={state.pattern} i={state.i} j={state.j} matches={state.matches} matchStart={state.matchStart} phase={state.phase} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? (state.matches?.length > 0 ? 'success' : 'failure') : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">KMP Algorithm:</span> Pattern matching in O(n+m)</p><p><span className="font-medium text-zinc-900 dark:text-white">LPS Array:</span> Longest proper prefix which is also suffix</p><p><span className="font-medium text-zinc-900 dark:text-white">Key Insight:</span> On mismatch, use LPS to skip comparisons</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
