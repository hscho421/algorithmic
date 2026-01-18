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
} from '../../../lib/algorithms/sorting/countingSort';

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

export default function CountingSortVisualizer() {
  const [arrayInput, setArrayInput] = useState('4, 2, 2, 8, 3, 3, 1');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('counting-sort');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n) && n >= 0 && n <= 99);
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
  } = useProgress('counting-sort', progressPayload);

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
    const size = Math.floor(Math.random() * 6) + 5;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 10));
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
        { name: 'k', value: state.countArray?.length || 0, desc: 'count array size' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Phase', value: state.phase || '—' },
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
      ]
    : [];

  const result = state ? getResult(state) : null;

  // Custom visualization for counting sort showing both arrays
  const CountingSortVisualization = ({ state }) => {
    const { array = [], countArray = [], highlights = [], countHighlights = [], highlightBucket } = state;
    const maxVal = Math.max(...array, 1);

    const arrayRef = useRef(null);
    const countRef = useRef(null);
    const arraySize = useContainerSize(arrayRef);
    const countSize = useContainerSize(countRef);

    const { cell: barWidth, gap: barGap } = getCellMetrics(arraySize.width, array.length, {
      minCell: 16,
      maxCell: 48,
      baseGap: 4,
      minGap: 2,
    });

    const { cell: countCellSize, gap: countGap } = getCellMetrics(countSize.width, countArray?.length || 0, {
      minCell: 28,
      maxCell: 40,
      baseGap: 4,
      minGap: 2,
    });

    const maxBarHeight = 120; // Fixed height to prevent infinite loop

    const getHighlightType = (idx, highlightList) => {
      const h = highlightList?.find((h) => h?.index === idx);
      return h?.type || null;
    };

    const getBarColor = (type) => {
      if (type === 'sorted') return 'bg-emerald-500';
      if (type === 'comparing') return 'bg-amber-400';
      if (type === 'writing') return 'bg-rose-500';
      if (type === 'placed') return 'bg-emerald-500';
      if (type === 'active') return 'bg-blue-500';
      return 'bg-zinc-600';
    };

    return (
      <div className="flex flex-col h-full gap-6">
        {/* Main array */}
        <div>
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Input Array</div>
          <div
            className="flex items-end justify-center h-[160px]"
            style={{ gap: `${barGap}px` }}
            ref={arrayRef}
          >
            {array.map((value, idx) => {
              const type = getHighlightType(idx, highlights);
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

        {/* Count array */}
        {countArray && countArray.length > 0 && (
          <div className="border-t border-zinc-800 pt-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Count Array</div>
            <div
              className="flex justify-center pb-2"
              style={{ gap: `${countGap}px` }}
              ref={countRef}
            >
              {countArray.map((count, idx) => {
                const type = getHighlightType(idx, countHighlights);
                const isHighlighted = highlightBucket === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`rounded flex items-center justify-center text-sm font-mono transition-all duration-200 ${
                        isHighlighted
                          ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                          : type === 'writing'
                          ? 'bg-rose-500 text-white'
                          : type === 'placed'
                          ? 'bg-emerald-500 text-white'
                          : type === 'active'
                          ? 'bg-blue-500 text-white'
                          : count > 0
                          ? 'bg-zinc-700 text-zinc-200'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                      style={{ width: `${countCellSize}px`, height: `${countCellSize}px` }}
                    >
                      {count}
                    </div>
                    <div className="mt-1 text-xs font-mono text-zinc-500">{idx}</div>
                  </div>
                );
              })}
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
            <div className="w-3 h-3 rounded bg-rose-500"></div>
            <span className="text-zinc-400">Writing</span>
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
                label="Array (0-99)"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="4, 2, 2, 8, 3, 3, 1"
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
      visualizationContent={state && <CountingSortVisualization state={state} />}
      visualizationMinHeight="300px"
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
              <p><span className="text-zinc-900 dark:text-white font-medium">1. Count:</span> Count frequency of each value</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">2. Reconstruct:</span> Build sorted array from counts</p>
              <p className="text-xs text-zinc-500 mt-4">Not comparison-based! O(n + k) where k is the range.</p>
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
