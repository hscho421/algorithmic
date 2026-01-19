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
} from '../../../lib/algorithms/data-structures/lruCache';

function LRUVisualization({ order, cache, capacity, highlightKey, operation, evictedKey }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        LRU Cache (Capacity: {capacity})
      </div>

      {/* Doubly Linked List representation */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-500 text-center">Doubly Linked List (Most Recent → Least Recent)</div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {order.length === 0 ? (
            <div className="px-6 py-3 border-2 border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
              Empty Cache
            </div>
          ) : (
            order.map((key, idx) => {
              const value = cache[key];
              const isHighlight = key === highlightKey;
              const isEvicted = key === evictedKey;
              const isMostRecent = idx === 0;
              const isLeastRecent = idx === order.length - 1;

              return (
                <div key={key} className="flex items-center">
                  {idx > 0 && <span className="text-zinc-600 mx-1">⟷</span>}
                  <div
                    className={`px-4 py-3 rounded-lg border-2 transition-all
                      ${isEvicted ? 'bg-rose-500/30 border-rose-500 text-rose-300 opacity-50' :
                        isHighlight && operation === 'put' ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 scale-105' :
                        isHighlight && operation === 'get' ? 'bg-blue-500/30 border-blue-500 text-blue-300 scale-105' :
                        isMostRecent ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                        isLeastRecent ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' :
                        'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                  >
                    <div className="text-center">
                      <div className="text-xs text-zinc-500">key</div>
                      <div className="font-mono font-bold">{key}</div>
                    </div>
                    <div className="border-t border-zinc-700 mt-1 pt-1 text-center">
                      <div className="text-xs text-zinc-500">val</div>
                      <div className="font-mono">{value}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {order.length > 0 && (
          <div className="flex justify-between text-xs text-zinc-500 px-4">
            <span className="text-emerald-400">Most Recent</span>
            <span className="text-amber-400">Least Recent (evict next)</span>
          </div>
        )}
      </div>

      {/* Hash Map representation */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-500 text-center">Hash Map (O(1) Lookup)</div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(cache).map(([key, value]) => (
            <div
              key={key}
              className={`px-3 py-2 rounded border text-center text-sm
                ${key === highlightKey ? 'bg-blue-500/20 border-blue-500 text-blue-300' :
                  'bg-zinc-800/50 border-zinc-700 text-zinc-400'}`}
            >
              <span className="font-mono">{key}</span>: <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evicted indicator */}
      {evictedKey != null && (
        <div className="text-sm text-rose-400">
          Evicted key: {evictedKey}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
          <span className="text-zinc-400">Most Recent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50"></div>
          <span className="text-zinc-400">Least Recent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/30 border border-rose-500"></div>
          <span className="text-zinc-400">Evicted</span>
        </div>
      </div>
    </div>
  );
}

export default function LRUCacheVisualizer() {
  const [operation, setOperation] = useState('put');
  const [keyInput, setKeyInput] = useState('5');
  const [valueInput, setValueInput] = useState('50');
  const [capacityInput, setCapacityInput] = useState('3');
  const [initialCache, setInitialCache] = useState([['1', 10], ['2', 20], ['3', 30]]);
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('lru-cache');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { operation, keyInput, valueInput, capacityInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('lru-cache', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const capacity = Math.max(1, parseInt(capacityInput, 10) || 3);
    const op = operation === 'put'
      ? `put(${keyInput},${parseInt(valueInput, 10) || 0})`
      : `get(${keyInput})`;
    reset({
      capacity,
      initialCache: initialCache.slice(0, capacity),
      operations: [op],
    });
  }, [capacityInput, initialCache, operation, keyInput, valueInput, reset, stop]);

  useEffect(() => { handleReset(); }, [operation, keyInput, valueInput, capacityInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const cap = Math.floor(Math.random() * 3) + 2;
    const cache = [];
    for (let i = 1; i <= cap; i++) {
      cache.push([String(i), i * 10]);
    }
    setCapacityInput(String(cap));
    setInitialCache(cache);
    setKeyInput(String(Math.floor(Math.random() * (cap + 2)) + 1));
    setValueInput(String(Math.floor(Math.random() * 100)));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { operation, keyInput, valueInput, capacityInput, initialCache });
  const handleLoadInput = (item) => {
    setOperation(item.input_json?.operation ?? 'put');
    setKeyInput(item.input_json?.keyInput ?? '5');
    setValueInput(item.input_json?.valueInput ?? '50');
    setCapacityInput(item.input_json?.capacityInput ?? '3');
    if (item.input_json?.initialCache) setInitialCache(item.input_json.initialCache);
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'size', value: state.order?.length ?? 0, desc: 'current size' },
    { name: 'capacity', value: state.capacity ?? 0, desc: 'max capacity' },
    { name: 'operation', value: state.operation, desc: 'current op' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Operation">
            <div className="flex gap-2 items-end">
              <Select label="Operation" value={operation} onChange={(e) => setOperation(e.target.value)} options={[{ value: 'put', label: 'Put (key, value)' }, { value: 'get', label: 'Get (key)' }]} className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <Input label="Key" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="5" />
            {operation === 'put' && (
              <Input label="Value" value={valueInput} onChange={(e) => setValueInput(e.target.value)} type="number" placeholder="50" />
            )}
          </ConfigSection>
          <ConfigSection title="Cache Settings">
            <Input label="Capacity" value={capacityInput} onChange={(e) => setCapacityInput(e.target.value)} type="number" min="1" max="6" placeholder="3" />
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
      visualizationContent={state && <LRUVisualization order={state.order} cache={state.cacheMap} capacity={state.capacity} highlightKey={state.highlightKey} operation={state.operation} evictedKey={state.evictedKey} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">LRU Cache:</span> Evict least recently used when full</p><p><span className="font-medium text-zinc-900 dark:text-white">Data Structures:</span> Hash Map + Doubly Linked List</p><p><span className="font-medium text-zinc-900 dark:text-white">Get/Put:</span> O(1) time complexity</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
