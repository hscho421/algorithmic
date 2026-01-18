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
} from '../../../lib/algorithms/data-structures/linkedListReversal';
import LinkedListVisualization from './LinkedListVisualization';

export default function LinkedListReversalVisualizer() {
  const [valuesInput, setValuesInput] = useState('1, 2, 3, 4, 5');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('linked-list-reversal');

  const parseValues = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { valuesInput, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('linked-list-reversal', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const values = parseValues(valuesInput);
    reset({ values });
  }, [valuesInput, parseValues, reset, stop]);

  useEffect(() => {
    handleReset();
  }, []);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    const size = Math.floor(Math.random() * 4) + 4;
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    setValuesInput(values.join(', '));
    reset({ values });
  }, [stop, reset]);

  const handleSaveInput = (name) => saveInput(name, { valuesInput });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setValuesInput(payload.valuesInput ?? '');
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setValuesInput(payload.valuesInput ?? '');
  };

  const variables = state
    ? [
        { name: 'n', value: state.nodes?.length || 0, desc: 'list length' },
        { name: 'prev', value: state.prevIdx !== null ? state.nodes?.[state.prevIdx]?.value : 'null', desc: 'previous node' },
        { name: 'curr', value: state.currIdx !== null ? state.nodes?.[state.currIdx]?.value : 'null', desc: 'current node' },
        { name: 'next', value: state.nextIdx !== null ? state.nodes?.[state.nextIdx]?.value : 'null', desc: 'next node' },
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
                label="Node Values"
                value={valuesInput}
                onChange={(e) => setValuesInput(e.target.value)}
                placeholder="1, 2, 3, 4, 5"
                className="flex-1"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                title="Generate random list"
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
      visualizationContent={state && <LinkedListVisualization state={state} />}
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
              <p><span className="text-zinc-900 dark:text-white font-medium">1. Save:</span> Store next node before changing links</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">2. Reverse:</span> Point curr.next to prev</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">3. Advance:</span> Move prev and curr forward</p>
              <p className="text-xs text-zinc-500 mt-4">Classic interview question! O(1) space, O(n) time.</p>
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
