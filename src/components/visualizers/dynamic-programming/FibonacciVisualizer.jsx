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
} from '../../../lib/algorithms/dp/fibonacci';
import { DPTable1D, RecursionTreeVisualization } from './DPTableVisualization';

export default function FibonacciVisualizer() {
  const [n, setN] = useState('7');
  const [approach, setApproach] = useState('tabulation');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleReset = useCallback(() => {
    stop();
    const num = Math.max(0, Math.min(20, parseInt(n, 10) || 5));
    reset({ n: num, approach });
  }, [n, approach, reset, stop]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const approachOptions = Object.values(TEMPLATES).map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const variables = state
    ? approach === 'tabulation'
      ? [
          { name: 'i', value: state.i ?? '—', desc: 'current index' },
          { name: 'n', value: state.n, desc: 'target' },
        ]
      : [
          { name: 'calls', value: state.callStack?.length ?? 0, desc: 'active calls' },
          { name: 'cached', value: Object.keys(state.memo || {}).length, desc: 'memoized values' },
        ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1}` },
        { label: 'Approach', value: approach === 'tabulation' ? 'Bottom-up' : 'Top-down' },
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
                  label="Approach"
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  options={approachOptions}
                />

                <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2">
                  {TEMPLATES[approach].description}
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
                  Range: 0-20 (larger values create complex recursion trees)
                </div>
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

            {state && <StatePanel variables={variables} additionalInfo={additionalInfo} />}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card title="Fibonacci Visualization">
              <div className="min-h-[300px] flex items-center justify-center">
                {state && approach === 'tabulation' && (
                  <DPTable1D
                    dp={state.dp}
                    highlightIndex={state.done ? state.n : state.i - 1}
                    label="fib"
                    comparing={[]}
                  />
                )}

                {state && approach === 'memoization' && (
                  <RecursionTreeVisualization
                    callStack={state.callStack}
                    memo={state.memo}
                    completedCalls={state.completedCalls}
                  />
                )}
              </div>
            </Card>

            {/* Memoization table for memoization approach */}
            {state && approach === 'memoization' && state.memo && Object.keys(state.memo).length > 0 && (
              <Card title="Memo Cache">
                <div className="space-y-2">
                  {Object.entries(state.memo)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                      >
                        <span className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
                          fib({key})
                        </span>
                        <span className="text-zinc-400">=</span>
                        <span className="font-mono text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                          {value}
                        </span>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {result && (
              <ResultBanner
                success={result.success}
                title={result.title}
                message={result.message}
                details={result.details}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {state && (
                <CodePanel
                  code={state.template.code}
                  currentLine={state.currentLine}
                  done={state.done}
                  title={state.template.name}
                  description={state.template.description}
                />
              )}

              <div className="space-y-4">
                {state && (
                  <ExplanationPanel
                    explanation={getExplanation(state)}
                    status={state.done ? 'success' : 'running'}
                  />
                )}

                <ComplexityPanel complexity={complexity} />

                <Card title="Key Concept">
                  <div className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="font-bold mb-2 text-blue-700 dark:text-blue-400">
                      {approach === 'tabulation' ? 'Bottom-Up (Tabulation)' : 'Top-Down (Memoization)'}
                    </div>
                    <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
                      {approach === 'tabulation' ? (
                        <>
                          <li>• Start from base cases: fib(0)=0, fib(1)=1</li>
                          <li>• Build table iteratively from bottom to top</li>
                          <li>• Each entry uses previous two values</li>
                          <li>• No recursion, just a loop</li>
                        </>
                      ) : (
                        <>
                          <li>• Recursive approach with caching</li>
                          <li>• Store computed values in memo object</li>
                          <li>• Check memo before computing</li>
                          <li>• Avoids redundant calculations</li>
                        </>
                      )}
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
