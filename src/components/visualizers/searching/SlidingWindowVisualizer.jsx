import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Input, Select, Button } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
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
    <div className="max-w-7xl mx-auto px-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-4">
          <Card title="Configuration">
            <div className="space-y-4">
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
            </div>
          </Card>

          <ControlPanel
            onStep={step}
            onBack={handleBack}
            onRun={toggle}
            onReset={handleReset}
            isRunning={isRunning}
            canStep={canStep}
            canBack={canBack}
            speed={speed}
            onSpeedChange={setSpeed}
          />

          {state && (
            <StatePanel variables={variables} additionalInfo={additionalInfo} />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Sliding Window Visualization">
            <div className="min-h-[220px]">
              {state && <SlidingWindowVisualization state={state} />}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state && (
              <CodePanel
                code={template.code}
                currentLine={state.currentLine}
                done={state.done}
                title={template.name}
                description={template.description}
              />
            )}

            <div className="space-y-4">
              {result && (
                <ResultBanner
                  success={result.success}
                  title={result.title}
                  message={result.message}
                  details={result.details}
                />
              )}
              {state && (
                <ExplanationPanel
                  explanation={getExplanation(state)}
                  status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
                />
              )}
              <ComplexityPanel complexity={complexity[mode]} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
