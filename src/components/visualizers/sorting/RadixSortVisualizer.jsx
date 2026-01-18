import { useState, useCallback, useEffect, useRef } from 'react';
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
  initialState,
  executeStep,
  getExplanation,
  getResult,
  complexity,
} from '../../../lib/algorithms/sorting/radixSort';

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

export default function RadixSortVisualizer() {
  const [arrayInput, setArrayInput] = useState('170, 45, 75, 90, 802, 24, 2, 66');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('radix-sort');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n) && n >= 0);
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('radix-sort', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const array = parseArray(arrayInput);
    reset({ array });
  }, [arrayInput, parseArray, reset, stop]);

  useEffect(() => {
    handleReset();
  }, []);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    const size = Math.floor(Math.random() * 5) + 5;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 999) + 1);
    setArrayInput(arr.join(', '));
    reset({ array: arr });
  }, [stop, reset]);

  const handleSaveInput = (name) => saveInput(name, { arrayInput });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setArrayInput(payload.arrayInput ?? '');
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setArrayInput(payload.arrayInput ?? '');
  };

  const variables = state
    ? [
        { name: 'n', value: state.array?.length || 0, desc: 'array length' },
        { name: 'digit', value: state.currentDigit ?? '—', desc: 'current digit position' },
        { name: 'exp', value: state.exp ?? '—', desc: 'exponent (10^x)' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Phase', value: state.phase || '—' },
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
      ]
    : [];

  const result = state ? getResult(state) : null;

  // Custom visualization for radix sort showing buckets
  const RadixSortVisualization = ({ state }) => {
    const { array = [], buckets, highlights = [], highlightBucket, currentDigit, exp } = state;
    const maxVal = Math.max(...array, 1);

    const arrayRef = useRef(null);
    const arraySize = useContainerSize(arrayRef);

    const { cell: barWidth, gap: barGap } = getCellMetrics(arraySize.width, array.length, {
      minCell: 20,
      maxCell: 56,
      baseGap: 4,
      minGap: 2,
    });

    const maxBarHeight = 100; // Fixed height to prevent infinite loop

    const getHighlightType = (idx) => {
      const h = highlights?.find((h) => h?.index === idx);
      return h?.type || null;
    };

    const getBarColor = (type) => {
      if (type === 'sorted') return 'bg-emerald-500';
      if (type === 'comparing') return 'bg-amber-400';
      if (type === 'placed') return 'bg-emerald-500';
      if (type === 'active') return 'bg-blue-500';
      return 'bg-zinc-600';
    };

    return (
      <div className="flex flex-col h-full gap-4">
        {/* Current digit indicator */}
        {currentDigit && (
          <div className="text-center text-sm">
            <span className="text-zinc-400">Sorting by </span>
            <span className="font-bold text-amber-400">{currentDigit}</span>
            <span className="text-zinc-400"> digit</span>
            {exp && <span className="text-zinc-500 ml-2">(÷{exp} mod 10)</span>}
          </div>
        )}

        {/* Main array */}
        <div>
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Array</div>
          <div
            className="flex items-end justify-center h-[140px]"
            style={{ gap: `${barGap}px` }}
            ref={arrayRef}
          >
            {array.map((value, idx) => {
              const type = getHighlightType(idx);
              const minHeight = 12;
              const height = minHeight + (value / maxVal) * (maxBarHeight - minHeight);
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`rounded-t-sm transition-colors duration-200 ${getBarColor(type)}`}
                    style={{ width: `${barWidth}px`, height: `${height}px` }}
                  />
                  <div className="mt-1 text-xs font-mono text-zinc-400">{value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buckets 0-9 */}
        {buckets && (
          <div className="border-t border-zinc-800 pt-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Buckets (0-9)</div>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {buckets.map((bucket, digit) => (
                <div
                  key={digit}
                  className={`rounded-lg p-2 transition-all duration-200 ${
                    highlightBucket === digit
                      ? 'bg-amber-500/20 ring-2 ring-amber-400'
                      : 'bg-zinc-800'
                  }`}
                >
                  <div className={`text-center text-xs font-bold mb-1 ${
                    highlightBucket === digit ? 'text-amber-400' : 'text-zinc-500'
                  }`}>
                    {digit}
                  </div>
                  <div className="flex flex-col gap-1 min-h-[40px]">
                    {bucket.map((val, i) => (
                      <div
                        key={i}
                        className="text-xs font-mono text-center py-0.5 px-1 rounded bg-zinc-700 text-zinc-200"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-400"></div>
            <span className="text-zinc-400">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-zinc-400">Sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-zinc-400">Active</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input
                label="Array (non-negative)"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="170, 45, 75, 90, 802, 24, 2, 66"
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
              checkpoints={checkpoints}
              onSaveCheckpoint={saveCheckpoint}
              onLoadCheckpoint={handleResume}
              onDeleteCheckpoint={deleteCheckpoint}
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
      visualizationContent={state && <RadixSortVisualization state={state} />}
      visualizationMinHeight="400px"
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
      stateProps={state ? { variables, additionalInfo } : null}
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
              <p><span className="text-zinc-900 dark:text-white font-medium">1. Process:</span> Sort by each digit position (ones, tens, hundreds...)</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">2. Bucket:</span> Place numbers into buckets 0-9 based on current digit</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">3. Collect:</span> Gather numbers from buckets in order</p>
              <p className="text-xs text-zinc-500 mt-4">LSD (Least Significant Digit) variant shown here.</p>
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
