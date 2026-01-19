import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select } from '../../shared/ui';
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
} from '../../../lib/algorithms/data-structures/stack';

function StackVisualization({ stack, top, highlightIndex, operation, poppedValue }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Stack (LIFO)</div>

      {/* Stack container */}
      <div className="relative">
        {/* Top pointer */}
        {stack.length > 0 && (
          <div className="absolute -left-16 flex items-center gap-2" style={{ top: '0px' }}>
            <span className="text-xs text-amber-400">top →</span>
          </div>
        )}

        {/* Stack elements */}
        <div className="flex flex-col-reverse">
          {stack.length === 0 ? (
            <div className="w-32 h-12 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
              Empty Stack
            </div>
          ) : (
            stack.map((value, idx) => {
              const isTop = idx === stack.length - 1;
              const isHighlight = idx === highlightIndex;

              return (
                <div
                  key={idx}
                  className={`w-32 h-12 flex items-center justify-center border-2 rounded-lg font-mono text-lg transition-all
                    ${isHighlight && operation === 'push' ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 scale-105' :
                      isHighlight && operation === 'pop' ? 'bg-rose-500/30 border-rose-500 text-rose-300 scale-105' :
                      isTop ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' :
                      'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                >
                  {value}
                </div>
              );
            })
          )}
        </div>

        {/* Base */}
        <div className="w-36 h-2 bg-zinc-700 rounded-full mt-1 -ml-2" />
      </div>

      {/* Popped value indicator */}
      {poppedValue != null && operation === 'pop' && (
        <div className="text-sm text-rose-400">
          Popped: {poppedValue}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50"></div>
          <span className="text-zinc-400">Top</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500"></div>
          <span className="text-zinc-400">Pushing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/30 border border-rose-500"></div>
          <span className="text-zinc-400">Popping</span>
        </div>
      </div>
    </div>
  );
}

export default function StackVisualizer() {
  const [operation, setOperation] = useState('push');
  const [valueInput, setValueInput] = useState('5');
  const [initialStack, setInitialStack] = useState([1, 2, 3, 4]);
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('stack');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { operation, valueInput, initialStack, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('stack', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const op = operation === 'push'
      ? `push(${parseInt(valueInput, 10) || 0})`
      : operation === 'pop'
      ? 'pop()'
      : 'peek()';
    reset({
      initialStack: [...initialStack],
      operations: [op],
    });
  }, [initialStack, operation, valueInput, reset, stop]);

  useEffect(() => { handleReset(); }, [operation, valueInput, initialStack]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 5) + 2;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1);
    setInitialStack(arr);
    setValueInput(String(Math.floor(Math.random() * 20) + 1));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { operation, valueInput, initialStack });
  const handleLoadInput = (item) => {
    setOperation(item.input_json?.operation ?? 'push');
    setValueInput(item.input_json?.valueInput ?? '5');
    setInitialStack(item.input_json?.initialStack ?? [1, 2, 3, 4]);
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'size', value: state.stack?.length ?? 0, desc: 'stack size' },
    { name: 'top', value: state.stack?.length > 0 ? state.stack[state.stack.length - 1] : '—', desc: 'top element' },
    { name: 'operation', value: state.operation, desc: 'current op' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Operation">
            <div className="flex gap-2 items-end">
              <Select label="Operation" value={operation} onChange={(e) => setOperation(e.target.value)} options={[{ value: 'push', label: 'Push' }, { value: 'pop', label: 'Pop' }, { value: 'peek', label: 'Peek' }]} className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            {operation === 'push' && (
              <Input label="Value to Push" value={valueInput} onChange={(e) => setValueInput(e.target.value)} type="number" placeholder="5" />
            )}
          </ConfigSection>
          <ConfigSection title="Initial Stack">
            <Input label="Initial Values (comma-separated)" value={initialStack.join(', ')} onChange={(e) => setInitialStack(e.target.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)))} placeholder="1, 2, 3, 4" />
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
      visualizationContent={state && <StackVisualization stack={state.stack} top={state.stack?.length - 1} highlightIndex={state.highlightIndex} operation={state.operation} poppedValue={state.poppedValue} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Stack:</span> Last In, First Out (LIFO)</p><p><span className="font-medium text-zinc-900 dark:text-white">Push:</span> Add to top - O(1)</p><p><span className="font-medium text-zinc-900 dark:text-white">Pop:</span> Remove from top - O(1)</p><p><span className="font-medium text-zinc-900 dark:text-white">Peek:</span> View top without removing - O(1)</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
