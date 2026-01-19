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
} from '../../../lib/algorithms/trees/fenwick';

function FenwickTable({ arr, bit, highlightedIndices = [] }) {
  if (!arr || !bit) return null;
  const bitIndices = bit.slice(1);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500">Array</div>
        <div className="flex gap-1 justify-center flex-wrap">
          {arr.map((val, idx) => (
            <div
              key={idx}
              className="w-10 h-10 flex items-center justify-center rounded border font-mono text-sm
                bg-zinc-800 border-zinc-700 text-zinc-300"
            >
              {val}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500">Fenwick Tree (1-indexed)</div>
        <div className="flex gap-1 justify-center flex-wrap">
          {bitIndices.map((val, idx) => {
            const realIdx = idx + 1;
            const isHighlight = highlightedIndices.includes(realIdx);
            return (
              <div
                key={realIdx}
                className={`w-12 h-12 flex flex-col items-center justify-center rounded border font-mono text-xs transition-colors
                  ${isHighlight ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
              >
                <div className="text-[10px] text-zinc-500">i={realIdx}</div>
                <div className="text-sm">{val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FenwickVisualizer() {
  const [arrayInput, setArrayInput] = useState('3, 2, 1, 4, 5');
  const [operation, setOperation] = useState('query');
  const [leftInput, setLeftInput] = useState('1');
  const [rightInput, setRightInput] = useState('3');
  const [indexInput, setIndexInput] = useState('2');
  const [deltaInput, setDeltaInput] = useState('3');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('fenwick-tree');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, operation, leftInput, rightInput, indexInput, deltaInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('fenwick-tree', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const arr = arrayInput.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    const op = operation === 'update'
      ? { type: 'update', index: parseInt(indexInput, 10) || 0, delta: parseInt(deltaInput, 10) || 0 }
      : { type: 'query', left: parseInt(leftInput, 10) || 0, right: parseInt(rightInput, 10) || 0 };
    reset({ arr: arr.length ? arr : [3, 2, 1, 4, 5], operation: op });
  }, [arrayInput, operation, leftInput, rightInput, indexInput, deltaInput, reset, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    const length = Math.floor(Math.random() * 4) + 5;
    const arr = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
    const useUpdate = Math.random() > 0.5;
    const left = Math.floor(Math.random() * length);
    const right = left + Math.floor(Math.random() * (length - left));
    const index = Math.floor(Math.random() * length);
    const delta = Math.floor(Math.random() * 7) + 1;
    const op = useUpdate
      ? { type: 'update', index, delta }
      : { type: 'query', left, right };

    setArrayInput(arr.join(', '));
    setOperation(useUpdate ? 'update' : 'query');
    setLeftInput(String(left));
    setRightInput(String(right));
    setIndexInput(String(index));
    setDeltaInput(String(delta));
    reset({ arr, operation: op });
  }, [reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput, operation, leftInput, rightInput, indexInput, deltaInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleSaveInput = (name) => saveInput(name, { arrayInput, operation, leftInput, rightInput, indexInput, deltaInput });
  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setArrayInput(payload.arrayInput ?? '3, 2, 1, 4, 5');
    setOperation(payload.operation ?? 'query');
    setLeftInput(payload.leftInput ?? '1');
    setRightInput(payload.rightInput ?? '3');
    setIndexInput(payload.indexInput ?? '2');
    setDeltaInput(payload.deltaInput ?? '3');
  };
  const handleResume = (payloadOverride) => handleLoadInput({ input_json: payloadOverride ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'operation', value: state.operation?.type || '—', desc: 'current op' },
    ...(state.operation?.type === 'query'
      ? [
          { name: 'left', value: state.operation.left, desc: 'range left' },
          { name: 'right', value: state.operation.right, desc: 'range right' },
        ]
      : [
          { name: 'index', value: state.operation?.index ?? '—', desc: 'update index' },
          { name: 'delta', value: state.operation?.delta ?? '—', desc: 'delta' },
        ]),
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Array">
            <div className="flex gap-2 items-end">
              <Input
                label="Values (comma-separated)"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="3, 2, 1, 4, 5"
                className="flex-1"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                title="Random"
              >
                🎲
              </button>
            </div>
          </ConfigSection>
          <ConfigSection title="Operation">
            <Select
              label="Operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              options={[
                { value: 'query', label: 'Range Sum' },
                { value: 'update', label: 'Point Update' },
              ]}
            />
            {operation === 'query' ? (
              <div className="grid grid-cols-2 gap-2">
                <Input label="Left" value={leftInput} onChange={(e) => setLeftInput(e.target.value)} type="number" min="0" />
                <Input label="Right" value={rightInput} onChange={(e) => setRightInput(e.target.value)} type="number" min="0" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Input label="Index" value={indexInput} onChange={(e) => setIndexInput(e.target.value)} type="number" min="0" />
                <Input label="Delta" value={deltaInput} onChange={(e) => setDeltaInput(e.target.value)} type="number" />
              </div>
            )}
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
      visualizationContent={state && <FenwickTable arr={state.arr} bit={state.bit} highlightedIndices={state.highlightedIndices} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, ...(state.result != null ? [{ label: 'Result', value: state.result }] : [])] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Fenwick Tree:</span> Efficient prefix sums</p><p><span className="font-medium text-zinc-900 dark:text-white">Update:</span> Add delta while i += i & -i</p><p><span className="font-medium text-zinc-900 dark:text-white">Query:</span> Sum while i -= i & -i</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
