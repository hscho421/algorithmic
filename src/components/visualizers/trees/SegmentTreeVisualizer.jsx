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
} from '../../../lib/algorithms/trees/segmentTree';

function TreeVisualization({ tree, arr, n, highlightIndices = [], queryRange, operation }) {
  if (!tree || tree.length === 0) return null;

  // Calculate tree structure
  const levels = [];
  let levelStart = 1;
  let levelSize = 1;

  while (levelStart < tree.length) {
    levels.push({ start: levelStart, size: levelSize });
    levelStart += levelSize;
    levelSize *= 2;
  }

  return (
    <div className="flex flex-col items-center gap-4 overflow-auto">
      {/* Tree visualization */}
      <div className="space-y-4">
        {levels.map((level, levelIdx) => (
          <div key={levelIdx} className="flex justify-center gap-2" style={{ gap: `${Math.pow(2, levels.length - levelIdx - 1) * 8}px` }}>
            {Array.from({ length: level.size }, (_, i) => {
              const idx = level.start + i;
              if (idx >= tree.length || tree[idx] === undefined) return null;

              const isHighlight = highlightIndices.includes(idx);
              const isInQueryRange = queryRange && idx >= 1;

              return (
                <div
                  key={idx}
                  className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg border-2 transition-all
                    ${isHighlight && operation === 'query' ? 'bg-blue-500/30 border-blue-500 text-blue-300 scale-105' :
                      isHighlight && operation === 'update' ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 scale-105' :
                      'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                >
                  <div className="font-mono text-lg font-bold">{tree[idx]}</div>
                  <div className="text-xs text-zinc-500">{idx}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Original array */}
      <div className="mt-4 space-y-2">
        <div className="text-xs font-medium text-zinc-500 text-center">Original Array</div>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: n }, (_, i) => {
            const isInRange = queryRange && i >= queryRange[0] && i <= queryRange[1];
            return (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded border font-mono
                  ${isInRange ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
              >
                {arr?.[i] ?? '—'}
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className="w-10 text-center text-xs text-zinc-500">{i}</div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500"></div>
          <span className="text-zinc-400">Query Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500"></div>
          <span className="text-zinc-400">Update Path</span>
        </div>
      </div>
    </div>
  );
}

export default function SegmentTreeVisualizer() {
  const [arrayInput, setArrayInput] = useState('1, 3, 5, 7, 9, 11');
  const [operation, setOperation] = useState('query');
  const [leftInput, setLeftInput] = useState('1');
  const [rightInput, setRightInput] = useState('3');
  const [indexInput, setIndexInput] = useState('2');
  const [valueInput, setValueInput] = useState('6');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('segment-tree');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, operation, leftInput, rightInput, indexInput, valueInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('segment-tree', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const arr = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const query = operation === 'query'
      ? `sum(${parseInt(leftInput, 10) || 0},${parseInt(rightInput, 10) || 0})`
      : `update(${parseInt(indexInput, 10) || 0},${parseInt(valueInput, 10) || 0})`;
    reset({
      arr: arr.length > 0 ? arr : [1, 3, 5, 7, 9, 11],
      queries: [query],
    });
  }, [arrayInput, operation, leftInput, rightInput, indexInput, valueInput, reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput, operation, leftInput, rightInput, indexInput, valueInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 4) + 4;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 15) + 1);
    setArrayInput(arr.join(', '));
    const l = Math.floor(Math.random() * len);
    const r = l + Math.floor(Math.random() * (len - l));
    setLeftInput(String(l));
    setRightInput(String(r));
    setIndexInput(String(Math.floor(Math.random() * len)));
    setValueInput(String(Math.floor(Math.random() * 20) + 1));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { arrayInput, operation, leftInput, rightInput, indexInput, valueInput });
  const handleLoadInput = (item) => {
    setArrayInput(item.input_json?.arrayInput ?? '1, 3, 5, 7, 9, 11');
    setOperation(item.input_json?.operation ?? 'query');
    setLeftInput(item.input_json?.leftInput ?? '1');
    setRightInput(item.input_json?.rightInput ?? '3');
    setIndexInput(item.input_json?.indexInput ?? '2');
    setValueInput(item.input_json?.valueInput ?? '6');
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'operation', value: state.phase || '—', desc: 'current op' },
    ...(state.phase === 'sum' ? [
      { name: 'left', value: leftInput, desc: 'query left' },
      { name: 'right', value: rightInput, desc: 'query right' },
    ] : [
      { name: 'index', value: indexInput, desc: 'update index' },
      { name: 'value', value: valueInput, desc: 'new value' },
    ]),
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Array">
            <div className="flex gap-2 items-end">
              <Input label="Array (comma-separated)" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="1, 3, 5, 7, 9, 11" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
          </ConfigSection>
          <ConfigSection title="Operation">
            <Select label="Operation" value={operation} onChange={(e) => setOperation(e.target.value)} options={[{ value: 'query', label: 'Range Sum Query' }, { value: 'update', label: 'Point Update' }]} />
            {operation === 'query' ? (
              <div className="grid grid-cols-2 gap-2">
                <Input label="Left Index" value={leftInput} onChange={(e) => setLeftInput(e.target.value)} type="number" min="0" />
                <Input label="Right Index" value={rightInput} onChange={(e) => setRightInput(e.target.value)} type="number" min="0" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Input label="Index" value={indexInput} onChange={(e) => setIndexInput(e.target.value)} type="number" min="0" />
                <Input label="New Value" value={valueInput} onChange={(e) => setValueInput(e.target.value)} type="number" />
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
      visualizationContent={state && <TreeVisualization tree={state.tree} arr={state.arr} n={state.n} highlightIndices={state.highlightIndices} queryRange={operation === 'query' ? [parseInt(leftInput, 10) || 0, parseInt(rightInput, 10) || 0] : null} operation={state.phase} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, ...(state.queryResult != null ? [{ label: 'Result', value: state.queryResult }] : [])] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Segment Tree:</span> Range queries in O(log n)</p><p><span className="font-medium text-zinc-900 dark:text-white">Structure:</span> Binary tree with segment sums</p><p><span className="font-medium text-zinc-900 dark:text-white">Operations:</span> Range sum query, point update</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
