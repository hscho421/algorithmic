import { useEffect, useRef, useState, useCallback } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input } from '../../shared/ui';
import { ExplanationPanel, ComplexityPanel } from '../../shared/panels';
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
} from '../../../lib/algorithms/sorting/quickSort';

const useContainerSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};

const getCellMetrics = (containerWidth, count, { minCell, maxCell, baseGap, minGap }) => {
  if (!containerWidth || count <= 0) {
    return { cell: maxCell, gap: baseGap };
  }

  let gap = baseGap;
  let available = containerWidth - gap * (count - 1);
  let cell = Math.floor(available / count);

  if (cell < minCell) {
    gap = minGap;
    available = containerWidth - gap * (count - 1);
    cell = Math.floor(available / count);
  }

  cell = Math.max(8, Math.min(maxCell, cell));
  return { cell, gap };
};

export default function QuickSortVisualizer() {
  const [arrayInput, setArrayInput] = useState('38, 27, 43, 3, 9, 82, 10');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('quick-sort');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'quick-sort',
    progressPayload,
  );

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

  const handleSaveInput = (name) => {
    return saveInput(name, { arrayInput });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setArrayInput(payload.arrayInput ?? '');
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setArrayInput(payload.arrayInput ?? '');
  };

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
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input
                label="Array"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="38, 27, 43, 3, 9, 82, 10"
                className="flex-1"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                title="Generate random array"
              >
                🎲
              </button>
            </div>
          </ConfigSection>

          <ConfigSection title="History" open={false}>
            <SavedInputsPanel
              items={savedInputs}
              isLoading={savedLoading}
              onSave={handleSaveInput}
              onLoad={handleLoadInput}
              onDelete={(item) => deleteInput(item.id)}
            />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel
              progress={progress}
              isLoading={progressLoading}
              onResume={handleResume}
              onClear={clearProgress}
            />
          </ConfigSection>
        </div>
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
                        {Array.isArray(result.details) && (
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

  const containerRef = useRef(null);
  const containerSize = useContainerSize(containerRef);
  const containerWidth = containerSize.width;

  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 italic">
        Empty array — add elements to visualize
      </div>
    );
  }

  const maxVal = Math.max(...array, 1);
  const { cell: barWidth, gap: barGap } = getCellMetrics(containerWidth, array.length, {
    minCell: 8,
    maxCell: Infinity,
    baseGap: 4,
    minGap: 2,
  });

  const maxBarHeight = containerSize.height
    ? Math.max(160, Math.floor(containerSize.height - 64))
    : 220;

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
    <div className="flex h-full flex-col gap-6">
      <div className="flex justify-center pb-2 flex-1">
        <div
          className="flex items-end justify-center h-full min-h-[280px] px-4 pt-3 w-full"
          style={{ gap: `${barGap}px` }}
          ref={containerRef}
        >
          {array.map((value, idx) => {
            const minHeight = 16;
            const maxHeight = maxBarHeight;
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
                  className={`rounded-t-sm transition-[background-color,box-shadow] duration-200 ${barColor} ${borderStyle}`}
                  style={{ width: `${barWidth}px`, height: `${height}px` }}
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
