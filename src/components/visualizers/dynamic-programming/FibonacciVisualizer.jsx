import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import {
  TEMPLATES,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/dp/fibonacci';
import { DPTable1D } from './DPTableVisualization';

export default function FibonacciVisualizer() {
  const [n, setN] = useState('7');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleReset = useCallback(() => {
    stop();
    const num = Math.max(0, Math.min(20, parseInt(n, 10) || 5));
    reset({ n: num });
  }, [n, reset, stop]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const variables = state
    ? [
        { name: 'i', value: state.i ?? '—', desc: 'current index' },
        { name: 'n', value: state.n, desc: 'target' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1}` },
        { label: 'Approach', value: 'Bottom-up' },
      ]
    : [];

  const result = state ? getResult(state) : null;

  const infoTabs = [
    {
      id: 'explanation',
      label: 'Explanation',
      content: state ? (
        <ExplanationPanel
          explanation={getExplanation(state)}
          status={state.done ? 'success' : 'running'}
        />
      ) : (
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">
          Click Step or Run to begin
        </div>
      ),
    },
    {
      id: 'complexity',
      label: 'Complexity',
      content: <ComplexityPanel complexity={complexity} />,
    },
    {
      id: 'guide',
      label: 'Guide',
      content: (
        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-700 dark:text-zinc-200">
            Bottom-Up (Tabulation)
          </div>
          <ul className="space-y-1.5 text-xs">
            <li>• Start from base cases: fib(0)=0, fib(1)=1</li>
            <li>• Build the table iteratively from bottom to top</li>
            <li>• Each entry uses the previous two values</li>
            <li>• No recursion, just a loop</li>
          </ul>
        </div>
      ),
    },
  ];

  if (result) {
    infoTabs.push({
      id: 'result',
      label: 'Result',
      content: (
        <ResultBanner
          success={result.success}
          title={result.title}
          message={result.message}
          details={result.details}
        />
      ),
    });
  }

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2">
            {TEMPLATES.tabulation.description}
          </div>

          <Input
            label="Compute fib(n)"
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            min="0"
            max="20"
          />

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Range: 0-20 (larger values increase table size)
          </div>
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
        <div className="w-full space-y-4">
          <div className="min-h-[300px] flex items-center justify-center">
            {state && (
              <DPTable1D
                dp={state.dp}
                highlightIndex={state.done ? state.n : state.i - 1}
                label="fib"
                comparing={[]}
              />
            )}
          </div>
        </div>
      }
      codeProps={
        state
          ? {
              code: state.template.code,
              currentLine: state.currentLine,
              done: state.done,
              title: state.template.name,
              description: state.template.description,
            }
          : null
      }
      stateProps={state ? { variables, additionalInfo } : null}
      infoTabs={infoTabs}
    />
  );
}
