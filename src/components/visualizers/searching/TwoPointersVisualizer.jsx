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
} from '../../../lib/algorithms/searching/twoPointers';
import SortingArrayVisualization from '../sorting/SortingArrayVisualization';

export default function TwoPointersVisualizer() {
  const [arrayInput, setArrayInput] = useState('2, 7, 11, 15, 19, 21');
  const [targetInput, setTargetInput] = useState('26');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('two-pointers');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { arrayInput, targetInput, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('two-pointers', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const array = parseArray(arrayInput);
    const target = parseInt(targetInput, 10) || 0;
    reset({ array, target });
  }, [arrayInput, targetInput, parseArray, reset, stop]);

  useEffect(() => {
    handleReset();
  }, []);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    const size = Math.floor(Math.random() * 4) + 5;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1).sort((a, b) => a - b);
    const idx1 = Math.floor(Math.random() * (size - 1));
    const idx2 = idx1 + 1 + Math.floor(Math.random() * (size - idx1 - 1));
    const target = arr[idx1] + arr[idx2];
    setArrayInput(arr.join(', '));
    setTargetInput(target.toString());
    reset({ array: arr, target });
  }, [stop, reset]);

  const handleSaveInput = (name) => saveInput(name, { arrayInput, targetInput });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setArrayInput(payload.arrayInput ?? '');
    setTargetInput(payload.targetInput ?? '');
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setArrayInput(payload.arrayInput ?? '');
    setTargetInput(payload.targetInput ?? '');
  };

  const variables = state
    ? [
        { name: 'target', value: state.target ?? '—', desc: 'target sum' },
        { name: 'left', value: state.l ?? '—', desc: 'left pointer index' },
        { name: 'right', value: state.r ?? '—', desc: 'right pointer index' },
        { name: 'sum', value: state.currentSum ?? '—', desc: 'current sum' },
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
            <div className="space-y-3">
              <div className="flex gap-2 items-end">
                <Input
                  label="Sorted Array"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder="2, 7, 11, 15, 19, 21"
                  className="flex-1"
                />
                <button
                  onClick={handleRandomize}
                  className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  title="Generate random example"
                >
                  🎲
                </button>
              </div>
              <Input
                label="Target Sum"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="26"
                type="number"
              />
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
      visualizationContent={state && <SortingArrayVisualization state={state} />}
      visualizationMinHeight="200px"
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
                    status={state.done ? (state.foundIndices ? 'success' : 'failure') : 'running'}
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
              <p><span className="text-zinc-900 dark:text-white font-medium">1. Initialize:</span> Left pointer at start, right at end</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">2. Calculate:</span> Sum values at both pointers</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">3. Adjust:</span> If sum too small, move left right. If too large, move right left.</p>
              <p className="text-xs text-zinc-500 mt-4">Only works on sorted arrays! O(n) vs O(n²) brute force.</p>
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
                        {Array.isArray(result.details) && result.details.length > 0 && (
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
