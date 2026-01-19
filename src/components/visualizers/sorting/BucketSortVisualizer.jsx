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
} from '../../../lib/algorithms/sorting/bucketSort';

function BucketVisualization({ arr, buckets, currentBucket, highlightIndex, phase, sortedArray }) {
  const maxVal = Math.max(...(arr || [1]));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Original/Current Array */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 text-center">
          {phase === 'done' ? 'Sorted Array' : 'Input Array'}
        </div>
        <div className="flex gap-1 justify-center">
          {(phase === 'done' ? sortedArray : arr)?.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono transition-all
                ${idx === highlightIndex ? 'bg-amber-500/30 border-amber-500 text-amber-300 scale-105' :
                  phase === 'done' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                  'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
            >
              {typeof val === 'number' ? val.toFixed(2) : val}
            </div>
          ))}
        </div>
      </div>

      {/* Buckets */}
      {buckets && buckets.length > 0 && phase !== 'done' && (
        <div className="space-y-2 w-full max-w-2xl">
          <div className="text-xs font-medium text-zinc-500 text-center">Buckets</div>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(buckets.length, 5)}, 1fr)` }}>
            {buckets.map((bucket, bucketIdx) => {
              const isCurrentBucket = bucketIdx === currentBucket;
              const range = bucket.length > 0
                ? `${(bucketIdx / buckets.length).toFixed(2)}-${((bucketIdx + 1) / buckets.length).toFixed(2)}`
                : '';

              return (
                <div
                  key={bucketIdx}
                  className={`p-3 rounded-lg border-2 min-h-[80px] transition-all
                    ${isCurrentBucket ? 'bg-blue-500/20 border-blue-500' :
                      bucket.length > 0 ? 'bg-zinc-800/50 border-zinc-600' :
                      'bg-zinc-900/50 border-zinc-700 border-dashed'}`}
                >
                  <div className="text-xs text-zinc-500 mb-2 text-center">
                    Bucket {bucketIdx}
                    {range && <div className="text-[10px]">[{range})</div>}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {bucket.map((val, idx) => (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded text-xs font-mono
                          ${isCurrentBucket ? 'bg-blue-500/30 text-blue-300' :
                            'bg-zinc-700 text-zinc-300'}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))}
                    {bucket.length === 0 && (
                      <span className="text-xs text-zinc-600">empty</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {phase && phase !== 'done' && (
        <div className="text-sm text-zinc-400">
          Phase: <span className="text-blue-400 capitalize">{phase.replace('-', ' ')}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-500"></div>
          <span className="text-zinc-400">Distributing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500"></div>
          <span className="text-zinc-400">Current Bucket</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
          <span className="text-zinc-400">Sorted</span>
        </div>
      </div>
    </div>
  );
}

export default function BucketSortVisualizer() {
  const [arrayInput, setArrayInput] = useState('0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51');
  const [numBucketsInput, setNumBucketsInput] = useState('5');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('bucket-sort');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, numBucketsInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('bucket-sort', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const arr = arrayInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < 1);
    const numBuckets = Math.max(1, parseInt(numBucketsInput, 10) || 5);
    reset({
      arr: arr.length > 0 ? arr : [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51],
      numBuckets
    });
  }, [arrayInput, numBucketsInput, reset, stop]);

  useEffect(() => { handleReset(); }, [arrayInput, numBucketsInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const len = Math.floor(Math.random() * 5) + 5;
    const arr = Array.from({ length: len }, () => Math.random());
    setArrayInput(arr.map(n => n.toFixed(2)).join(', '));
    setNumBucketsInput(String(Math.floor(Math.random() * 3) + 4));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { arrayInput, numBucketsInput });
  const handleLoadInput = (item) => {
    setArrayInput(item.input_json?.arrayInput ?? '0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51');
    setNumBucketsInput(item.input_json?.numBucketsInput ?? '5');
  };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'n', value: state.arr?.length ?? 0, desc: 'array size' },
    { name: 'buckets', value: state.numBuckets ?? 0, desc: 'num buckets' },
    { name: 'current', value: state.currentBucket ?? '—', desc: 'current bucket' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Array (values in [0,1), comma-separated)" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="0.42, 0.32, 0.33" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <Input label="Number of Buckets" value={numBucketsInput} onChange={(e) => setNumBucketsInput(e.target.value)} type="number" min="1" max="10" />
            <p className="text-xs text-zinc-500">Values must be in range [0, 1) for standard bucket sort</p>
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
      visualizationContent={state && <BucketVisualization arr={state.arr} buckets={state.buckets} currentBucket={state.currentBucket} highlightIndex={state.highlightIndex} phase={state.phase} sortedArray={state.sortedArray} />}
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Bucket Sort:</span> Distribute elements into buckets</p><p><span className="font-medium text-zinc-900 dark:text-white">Steps:</span> 1) Scatter into buckets 2) Sort each bucket 3) Gather</p><p><span className="font-medium text-zinc-900 dark:text-white">Best for:</span> Uniformly distributed data in [0,1)</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
