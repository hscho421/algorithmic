import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select, Button } from '../../shared/ui';
import { ExplanationPanel, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
import {
  TEMPLATES,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/searching/slidingWindow';
import SlidingWindowVisualization from './SlidingWindowVisualization';

export default function SlidingWindowVisualizer() {
  const [mode, setMode] = useState('fixed_max_sum');
  const [arrayInput, setArrayInput] = useState('4, 2, 1, 7, 8, 1, 2, 8, 1, 0');
  const [windowSize, setWindowSize] = useState('3');
  const [target, setTarget] = useState('8');
  const [textInput, setTextInput] = useState('abcaabcd');

  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('sliding-window');

  const template = TEMPLATES[mode];

  const parseArray = useCallback((input) => {
    return input
      .replace(/,/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = {
    mode,
    arrayInput,
    windowSize,
    target,
    textInput,
    stepIndex: state?.stepIndex ?? 0,
  };
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'sliding-window',
    progressPayload,
  );

  const handleReset = useCallback(() => {
    stop();
    const array = template.inputType === 'array' ? parseArray(arrayInput) : [];
    const k = parseInt(windowSize, 10) || 1;
    const targetValue = parseInt(target, 10) || 0;
    const text = template.inputType === 'string' ? textInput : '';
    reset({ mode, array, k, target: targetValue, text });
  }, [mode, arrayInput, windowSize, target, textInput, reset, stop, parseArray, template]);

  useEffect(() => {
    handleReset();
  }, [mode, arrayInput, windowSize, target, textInput]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = () => {
    if (template.inputType === 'string') {
      const letters = 'abcdeffghijklmno';
      const length = 8 + Math.floor(Math.random() * 4);
      const text = Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
      setTextInput(text);
      return;
    }
    const size = 8 + Math.floor(Math.random() * 5);
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1);
    setArrayInput(arr.join(', '));
  };

  const handleSaveInput = (name) => {
    return saveInput(name, {
      mode,
      arrayInput,
      windowSize,
      target,
      textInput,
    });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setMode(payload.mode ?? 'fixed_max_sum');
    setArrayInput(payload.arrayInput ?? '');
    setWindowSize(payload.windowSize ?? '3');
    setTarget(payload.target ?? '8');
    setTextInput(payload.textInput ?? '');
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setMode(payload.mode ?? 'fixed_max_sum');
    setArrayInput(payload.arrayInput ?? '');
    setWindowSize(payload.windowSize ?? '3');
    setTarget(payload.target ?? '8');
    setTextInput(payload.textInput ?? '');
  };

  const modeOptions = Object.values(TEMPLATES).map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const variables = state
    ? [
        ...(template.inputType === 'array'
          ? [
              { name: 'l', value: state.l ?? '—', desc: 'left pointer' },
              { name: 'r', value: state.r ?? '—', desc: 'right pointer' },
              { name: 'sum', value: state.sum ?? state.windowSum ?? '—', desc: 'current sum' },
              ...(mode === 'fixed_max_sum' ? [{ name: 'max', value: state.maxSum ?? '—', desc: 'best sum' }] : []),
              ...(mode === 'min_len_subarray'
                ? [{ name: 'minLen', value: state.minLen === Infinity ? '∞' : state.minLen ?? '∞', desc: 'best length' }]
                : []),
            ]
          : [
              { name: 'l', value: state.l ?? '—', desc: 'left pointer' },
              { name: 'r', value: state.r ?? '—', desc: 'right pointer' },
              { name: 'best', value: state.bestLen ?? '—', desc: 'best length' },
            ]
        ),
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
        ...(mode === 'fixed_max_sum' ? [{ label: 'Window size', value: windowSize }] : []),
        ...(mode === 'min_len_subarray' ? [{ label: 'Target', value: target }] : []),
      ]
    : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <>
          <Select
            label="Problem"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            options={modeOptions}
          />
          <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2">
            {template.description}
          </div>

          {template.inputType === 'array' && (
            <>
              <div className="flex gap-2">
                <Input
                  label="Array"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder="4, 2, 1, 7"
                  className="flex-1"
                />
                <Button
                  onClick={handleRandomize}
                  className="self-end"
                  title="Generate random array"
                >
                  🎲
                </Button>
              </div>
              {mode === 'fixed_max_sum' && (
                <Input
                  label="Window size (k)"
                  type="number"
                  value={windowSize}
                  onChange={(e) => setWindowSize(e.target.value)}
                  min="1"
                />
              )}
              {mode === 'min_len_subarray' && (
                <Input
                  label="Target sum"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min="1"
                />
              )}
            </>
          )}

          {template.inputType === 'string' && (
            <div className="flex gap-2">
              <Input
                label="Text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="abcaabcd"
                className="flex-1"
              />
              <Button
                onClick={handleRandomize}
                className="self-end"
                title="Generate random string"
              >
                🎲
              </Button>
            </div>
          )}

          <SavedInputsPanel
            items={savedInputs}
            isLoading={savedLoading}
            onSave={handleSaveInput}
            onLoad={handleLoadInput}
            onDelete={(item) => deleteInput(item.id)}
          />
          <ProgressPanel
            progress={progress}
            isLoading={progressLoading}
            onResume={handleResume}
            onClear={clearProgress}
          />
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
        state && <SlidingWindowVisualization state={state} />
      }
      visualizationMinHeight="220px"
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
                    status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
                  />
                ),
              },
            ]
          : []),
        {
          id: 'complexity',
          label: 'Complexity',
          content: <ComplexityPanel complexity={complexity[mode]} />,
        },
        ...(result
          ? [
              {
                id: 'result',
                label: 'Result',
                content: (
                  <div>
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
                  </div>
                ),
              },
            ]
          : []),
      ]}
    />
  );
}
