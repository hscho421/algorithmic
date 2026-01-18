import { useState, useCallback, useEffect } from 'react';
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
} from '../../../lib/algorithms/sorting/mergeSort';
import SortingArrayVisualization from './SortingArrayVisualization';

export default function MergeSortVisualizer() {
  const [arrayInput, setArrayInput] = useState('38, 27, 43, 3, 9, 82, 10');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('merge-sort');

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
    'merge-sort',
    progressPayload,
  );

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
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    setArrayInput(arr.join(', '));
    reset({ array: arr });
  }, [stop, reset]);

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
        { name: 'writes', value: state.writes || 0, desc: 'array writes' },
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
        state && <SortingArrayVisualization state={state} />
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
              <p><span className="text-zinc-900 dark:text-white font-medium">1. Divide:</span> Split array into two halves</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">2. Conquer:</span> Recursively sort each half</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">3. Merge:</span> Combine sorted halves into one sorted array</p>
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
