import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input } from '../../shared/ui';
import { ExplanationPanel, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/sorting/quickSort';

export default function QuickSortVisualizer() {
  const [arrayInput, setArrayInput] = useState('38, 27, 43, 3, 9, 82, 10');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleReset = useCallback(() => {
    stop();
    const array = parseArray(arrayInput);
    reset({ array });
  }, [arrayInput, parseArray, reset, stop]);

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    stop();
    const array = parseArray(arrayInput);
    reset({ array });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayInput]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    const size = Math.floor(Math.random() * 6) + 5;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    setArrayInput(arr.join(', '));
  }, [stop]);

  const variables = state
    ? [
        { name: 'n', value: state.array?.length || 0, desc: 'array length' },
        { name: 'comparisons', value: state.comparisons || 0, desc: 'total comparisons' },
        { name: 'swaps', value: state.swaps || 0, desc: 'total swaps' },
        { name: 'depth', value: state.depth ?? '—', desc: 'recursion depth' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Phase', value: state.phase || '—' },
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
      ]
    : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <>
          <Input
            label="Array (comma or space separated)"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="38, 27, 43, 3, 9, 82, 10"
          />

          <button
            onClick={handleRandomize}
            className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
          >
            Randomize Array
          </button>
        </>
      }
      controlProps={{
        onStep: step,
        onBack: handleBack,
        onRun: toggle,
        onReset: handleReset,
        isRunning,
        canStep,
        canBack,
        speed,
        onSpeedChange: setSpeed,
      }}
      visualizationContent={
        state && <QuickSortVisualization state={state} />
      }
      visualizationMinHeight="240px"
      codeProps={
        state
          ? {
              code: template.code,
              currentLine: state.currentLine,
              done: state.done,
              title: template.name,
              description: template.description,
            }
          : null
      }
      stateProps={
        state
          ? {
              variables,
              additionalInfo,
            }
          : null
      }
      infoTabs={[
        ...(state
          ? [
              {
                id: 'explanation',
                label: 'Explanation',
                content: (
                  <ExplanationPanel
                    explanation={getExplanation(state)}
                    status={state.done ? 'success' : 'running'}
                  />
                ),
              },
            ]
          : []),
        {
          id: 'complexity',
          label: 'Complexity',
          content: <ComplexityPanel complexity={complexity} />,
        },
        {
          id: 'guide',
          label: 'Guide',
          content: (
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p><span className="text-zinc-900 dark:text-white font-medium">1. Pick pivot:</span> Choose last element as pivot</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">2. Partition:</span> Move smaller elements left, larger right</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">3. Recurse:</span> Sort left and right partitions</p>
            </div>
          ),
        },
        ...(result
          ? [
              {
                id: 'result',
                label: 'Result',
                content: (
                  <div className={`rounded-lg p-4 ${result.success ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{result.success ? '✓' : '✗'}</span>
                      <div className="flex-1">
                        <div className={`font-semibold ${result.success ? 'text-emerald-900 dark:text-emerald-100' : 'text-rose-900 dark:text-rose-100'}`}>
                          {result.title}
                        </div>
                        <div className={`text-sm mt-1 ${result.success ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                          {result.message}
                        </div>
                        {result.details && (
                          <div className="text-xs mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                            {result.details.map((detail, idx) => (
                              <div key={idx}>• {detail}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              },
            ]
          : []),
      ]}
    />
  );
}

function QuickSortVisualization({ state }) {
  const { array, highlights = [], pivotIndex, pointers = {} } = state;

  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

  const maxVal = Math.max(...array, 1);

  const getHighlightType = (idx) => {
    const highlight = highlights.find((h) => h.index === idx);
    return highlight?.type || null;
  };

  const getBarColor = (idx) => {
    const highlightType = getHighlightType(idx);

    if (highlightType === 'sorted') return 'bg-emerald-500';
    if (highlightType === 'pivot') return 'bg-purple-500';
    if (highlightType === 'comparing') return 'bg-amber-400';
    if (highlightType === 'swapping' || highlightType === 'swapped') return 'bg-rose-500';
    if (highlightType === 'i-pointer') return 'bg-blue-500';
    if (highlightType === 'active') return 'bg-zinc-400';

    return 'bg-zinc-600';
  };

  const getBorderStyle = (idx) => {
    const highlightType = getHighlightType(idx);
    if (highlightType === 'swapping') return 'ring-2 ring-rose-400 ring-offset-1 ring-offset-zinc-950';
    if (highlightType === 'pivot') return 'ring-2 ring-purple-400 ring-offset-1 ring-offset-zinc-950';
    return '';
  };

  const getPointerLabels = (idx) => {
    const labels = [];
    if (pointers.i === idx) labels.push({ label: 'i', color: '#3b82f6' });
    if (pointers.j === idx) labels.push({ label: 'j', color: '#f59e0b' });
    if (pointers.pivotFinal === idx) labels.push({ label: 'P', color: '#a855f7' });
    return labels;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="flex items-end gap-1 h-60 px-4 pt-3">
          {array.map((value, idx) => {
            const minHeight = 16;
            const maxHeight = 140;
            const height = minHeight + (value / maxVal) * (maxHeight - minHeight);
            const barColor = getBarColor(idx);
            const borderStyle = getBorderStyle(idx);
            const pointerLabels = getPointerLabels(idx);
            const isPivot = idx === pivotIndex;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex gap-1 mb-1 h-6">
                  {pointerLabels.map((p) => (
                    <span
                      key={p.label}
                      className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: p.color, color: 'white' }}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
                <div
                  className={`w-10 rounded-t-sm transition-all duration-300 ${barColor} ${borderStyle}`}
                  style={{ height: `${height}px` }}
                />
                <div className={`mt-1 text-xs font-mono ${isPivot ? 'text-purple-400 font-bold' : 'text-zinc-400'}`}>
                  {value}
                </div>
                <div className="text-xs font-mono text-zinc-600">[{idx}]</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500"></div>
          <span className="text-zinc-400">Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-zinc-400">i pointer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-400"></div>
          <span className="text-zinc-400">j (comparing)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-rose-500"></div>
          <span className="text-zinc-400">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-zinc-400">Sorted</span>
        </div>
      </div>
    </div>
  );
}
