import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Input } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ComplexityPanel } from '../../shared/panels';
import { ResultBanner } from '../../shared/panels';
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card title="Configuration">
            <div className="space-y-4">
              <Input
                label="Array (comma or space separated)"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="38, 27, 43, 3, 9, 82, 10"
              />

              <button
                onClick={handleRandomize}
                className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
              >
                Randomize Array
              </button>
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
          <Card title="Array Visualization">
            <div className="min-h-[300px]">
              {state && <SortingArrayVisualization state={state} />}
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
                  status={state.done ? 'success' : 'running'}
                />
              )}

              <ComplexityPanel complexity={complexity} />

              <Card title="How Merge Sort Works">
                <div className="space-y-2 text-sm text-zinc-400">
                  <p><span className="text-white font-medium">1. Divide:</span> Split array into two halves</p>
                  <p><span className="text-white font-medium">2. Conquer:</span> Recursively sort each half</p>
                  <p><span className="text-white font-medium">3. Merge:</span> Combine sorted halves into one sorted array</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
