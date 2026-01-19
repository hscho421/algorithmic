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
} from '../../../lib/algorithms/data-structures/queue';

function QueueVisualization({ queue, highlightIndex, operation, dequeuedValue }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Queue (FIFO)</div>

      {/* Queue container */}
      <div className="relative">
        {/* Front/Rear pointers */}
        {queue.length > 0 && (
          <>
            <div className="absolute -top-6 left-0 text-xs text-blue-400">front</div>
            <div className="absolute -top-6 right-0 text-xs text-emerald-400">rear</div>
          </>
        )}

        {/* Queue elements */}
        <div className="flex gap-1">
          {queue.length === 0 ? (
            <div className="w-32 h-12 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
              Empty Queue
            </div>
          ) : (
            queue.map((value, idx) => {
              const isFront = idx === 0;
              const isRear = idx === queue.length - 1;
              const isHighlight = idx === highlightIndex;

              return (
                <div
                  key={idx}
                  className={`w-14 h-14 flex items-center justify-center border-2 rounded-lg font-mono text-lg transition-all
                    ${isHighlight && operation === 'enqueue' ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 scale-105' :
                      isHighlight && operation === 'dequeue' ? 'bg-rose-500/30 border-rose-500 text-rose-300 scale-105' :
                      isFront ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' :
                      isRear ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                      'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                >
                  {value}
                </div>
              );
            })
          )}
        </div>

        {/* Arrows */}
        {queue.length > 0 && (
          <div className="flex justify-between mt-2 text-zinc-500">
            <span className="text-xs">← dequeue</span>
            <span className="text-xs">enqueue →</span>
          </div>
        )}
      </div>

      {/* Dequeued value indicator */}
      {dequeuedValue != null && operation === 'dequeue' && (
        <div className="text-sm text-rose-400">
          Dequeued: {dequeuedValue}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50"></div>
          <span className="text-zinc-400">Front</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
          <span className="text-zinc-400">Rear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500"></div>
          <span className="text-zinc-400">Enqueuing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/30 border border-rose-500"></div>
          <span className="text-zinc-400">Dequeuing</span>
        </div>
      </div>
    </div>
  );
}

export default function QueueVisualizer() {
  const [operation, setOperation] = useState('enqueue');
  const [valueInput, setValueInput] = useState('5');
  const [initialQueue, setInitialQueue] = useState([1, 2, 3, 4]);
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('queue');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { operation, valueInput, initialQueue, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('queue', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const op = operation === 'enqueue'
      ? `enqueue(${parseInt(valueInput, 10) || 0})`
      : operation === 'dequeue'
      ? 'dequeue()'
      : 'front()';
    reset({
      initialQueue: [...initialQueue],
      operations: [op],
    });
  }, [initialQueue, operation, valueInput, reset, stop]);

  useEffect(() => { handleReset(); }, [operation, valueInput, initialQueue]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 5) + 2;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1);
    setInitialQueue(arr);
    setValueInput(String(Math.floor(Math.random() * 20) + 1));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { operation, valueInput, initialQueue });
  const handleLoadInput = (item) => {
    setOperation(item.input_json?.operation ?? 'enqueue');
    setValueInput(item.input_json?.valueInput ?? '5');
    setInitialQueue(item.input_json?.initialQueue ?? [1, 2, 3, 4]);
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'size', value: state.queue?.length ?? 0, desc: 'queue size' },
    { name: 'front', value: state.queue?.length > 0 ? state.queue[0] : '—', desc: 'front element' },
    { name: 'operation', value: state.operation, desc: 'current op' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Operation">
            <div className="flex gap-2 items-end">
              <Select label="Operation" value={operation} onChange={(e) => setOperation(e.target.value)} options={[{ value: 'enqueue', label: 'Enqueue' }, { value: 'dequeue', label: 'Dequeue' }, { value: 'front', label: 'Front (Peek)' }]} className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            {operation === 'enqueue' && (
              <Input label="Value to Enqueue" value={valueInput} onChange={(e) => setValueInput(e.target.value)} type="number" placeholder="5" />
            )}
          </ConfigSection>
          <ConfigSection title="Initial Queue">
            <Input label="Initial Values (comma-separated)" value={initialQueue.join(', ')} onChange={(e) => setInitialQueue(e.target.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)))} placeholder="1, 2, 3, 4" />
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
      visualizationContent={state && <QueueVisualization queue={state.queue} highlightIndex={state.highlightIndex} operation={state.operation} dequeuedValue={state.dequeuedValue} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Queue:</span> First In, First Out (FIFO)</p><p><span className="font-medium text-zinc-900 dark:text-white">Enqueue:</span> Add to rear - O(1)</p><p><span className="font-medium text-zinc-900 dark:text-white">Dequeue:</span> Remove from front - O(1)</p><p><span className="font-medium text-zinc-900 dark:text-white">Front:</span> View front without removing - O(1)</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
