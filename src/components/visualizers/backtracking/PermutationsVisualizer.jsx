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
} from '../../../lib/algorithms/backtracking/permutations';

function PermutationsVisualization({ nums, path, remaining, result, phase, chosenValue, unchosenValue, foundPermutation, depth }) {
  if (!nums) return null;

  return (
    <div className="space-y-6">
      {/* Phase indicator */}
      <div className="flex justify-center gap-3 text-xs">
        <div className={`px-3 py-1 rounded-full transition-all ${phase === 'choose' ? 'bg-emerald-500/30 text-emerald-300 scale-105' : 'bg-zinc-800 text-zinc-500'}`}>
          Choose
        </div>
        <div className={`px-3 py-1 rounded-full transition-all ${phase === 'explore' ? 'bg-blue-500/30 text-blue-300 scale-105' : 'bg-zinc-800 text-zinc-500'}`}>
          Explore
        </div>
        <div className={`px-3 py-1 rounded-full transition-all ${phase === 'unchoose' ? 'bg-amber-500/30 text-amber-300 scale-105' : 'bg-zinc-800 text-zinc-500'}`}>
          Backtrack
        </div>
        <div className={`px-3 py-1 rounded-full transition-all ${phase === 'found' ? 'bg-purple-500/30 text-purple-300 scale-105' : 'bg-zinc-800 text-zinc-500'}`}>
          Found
        </div>
      </div>

      {/* Current state visualization */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current Path */}
        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-2">Current Path (depth: {depth})</div>
          <div className="flex gap-2 min-h-[40px] items-center justify-center">
            {path.length === 0 ? (
              <span className="text-zinc-600 text-sm">[ empty ]</span>
            ) : (
              path.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-lg border-2 transition-all
                    ${idx === path.length - 1 && phase === 'choose' ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 scale-110' :
                      'bg-blue-500/20 border-blue-500/50 text-blue-300'}`}
                >
                  {val}
                </div>
              ))
            )}
            {phase === 'choose' && chosenValue !== undefined && (
              <div className="w-10 h-10 flex items-center justify-center rounded-lg font-mono text-lg border-2 border-dashed border-emerald-500 text-emerald-400 animate-pulse">
                +{chosenValue}
              </div>
            )}
          </div>
        </div>

        {/* Remaining Elements */}
        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-2">Remaining</div>
          <div className="flex gap-2 min-h-[40px] items-center justify-center">
            {remaining.length === 0 ? (
              <span className="text-emerald-400 text-sm">[ all used! ]</span>
            ) : (
              remaining.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-lg border-2 transition-all
                    ${val === chosenValue && phase === 'choose' ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300' :
                      val === unchosenValue && phase === 'unchoose' ? 'bg-amber-500/30 border-amber-500 text-amber-300' :
                      'bg-zinc-700 border-zinc-600 text-zinc-300'}`}
                >
                  {val}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action indicator */}
      {phase === 'choose' && chosenValue !== undefined && (
        <div className="text-center text-sm">
          <span className="text-emerald-400">→ Choosing </span>
          <span className="font-mono font-bold text-emerald-300">{chosenValue}</span>
        </div>
      )}
      {phase === 'unchoose' && unchosenValue !== undefined && (
        <div className="text-center text-sm">
          <span className="text-amber-400">← Backtracking, removing </span>
          <span className="font-mono font-bold text-amber-300">{unchosenValue}</span>
        </div>
      )}
      {phase === 'found' && foundPermutation && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500">
            <span className="text-purple-300">Found permutation:</span>
            <span className="font-mono font-bold text-purple-200">[{foundPermutation.join(', ')}]</span>
          </div>
        </div>
      )}

      {/* Results so far */}
      <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
        <div className="text-xs text-zinc-500 mb-3">Permutations Found ({result.length})</div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {result.length === 0 ? (
            <span className="text-zinc-600 text-sm">None yet...</span>
          ) : (
            result.map((perm, idx) => (
              <div
                key={idx}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all
                  ${idx === result.length - 1 && phase === 'found' ? 'bg-purple-500/30 border border-purple-500 text-purple-300 scale-105' :
                    'bg-zinc-700 border border-zinc-600 text-zinc-300'}`}
              >
                [{perm.join(', ')}]
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500"></div>
          <span className="text-zinc-400">Choosing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50"></div>
          <span className="text-zinc-400">In Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-500"></div>
          <span className="text-zinc-400">Backtracking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500"></div>
          <span className="text-zinc-400">Found</span>
        </div>
      </div>
    </div>
  );
}

export default function PermutationsVisualizer() {
  const [arrayInput, setArrayInput] = useState('1, 2, 3');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('permutations');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('permutations', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const nums = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    // Limit to 4 elements to avoid too many permutations
    const limited = nums.slice(0, 4);
    reset({ nums: limited.length > 0 ? limited : [1, 2, 3] });
  }, [arrayInput, reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 2) + 3; // 3-4 elements
    const nums = Array.from({ length: len }, (_, i) => i + 1);
    // Shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setArrayInput(nums.join(', '));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { arrayInput });
  const handleLoadInput = (item) => { setArrayInput(item.input_json?.arrayInput ?? '1, 2, 3'); };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'path', value: `[${state.path?.join(', ') || ''}]`, desc: 'current permutation' },
    { name: 'remaining', value: state.remaining?.length ?? 0, desc: 'elements left' },
    { name: 'found', value: state.result?.length ?? 0, desc: 'permutations found' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Array (max 4 elements)" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="1, 2, 3" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <p className="text-xs text-zinc-500">Limited to 4 elements (4! = 24 permutations)</p>
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
      visualizationContent={state && <PermutationsVisualization nums={state.nums} path={state.path} remaining={state.remaining} result={state.result} phase={state.phase} chosenValue={state.chosenValue} unchosenValue={state.unchosenValue} foundPermutation={state.foundPermutation} depth={state.depth} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, { label: 'Depth', value: state.depth ?? 0 }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Backtracking Pattern:</span> Choose → Explore → Unchoose</p><p><span className="font-medium text-zinc-900 dark:text-white">Choose:</span> Pick an element from remaining</p><p><span className="font-medium text-zinc-900 dark:text-white">Explore:</span> Recursively build rest of permutation</p><p><span className="font-medium text-zinc-900 dark:text-white">Unchoose:</span> Remove element and try next option</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
