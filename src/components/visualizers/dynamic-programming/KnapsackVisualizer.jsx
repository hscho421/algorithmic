import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Input, Button } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import {
  TEMPLATES,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/dp/knapsack';
import { DPTable2D } from './DPTableVisualization';

export default function KnapsackVisualizer() {
  const [weightsInput, setWeightsInput] = useState('2, 3, 4, 5');
  const [valuesInput, setValuesInput] = useState('3, 4, 5, 6');
  const [capacity, setCapacity] = useState('8');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const parseArray = useCallback((input) => {
    return input
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);
  }, []);

  const handleReset = useCallback(() => {
    stop();
    const weights = parseArray(weightsInput);
    const values = parseArray(valuesInput);
    const cap = Math.max(1, Math.min(30, parseInt(capacity, 10) || 8));

    // Ensure weights and values have same length
    const minLen = Math.min(weights.length, values.length);
    reset({
      weights: weights.slice(0, minLen),
      values: values.slice(0, minLen),
      capacity: cap,
    });
  }, [weightsInput, valuesInput, capacity, reset, stop, parseArray]);

  useEffect(() => {
    handleReset();
  }, [weightsInput, valuesInput, capacity]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = () => {
    const numItems = 3 + Math.floor(Math.random() * 3);
    const weights = Array.from({ length: numItems }, () => Math.floor(Math.random() * 5) + 1);
    const values = Array.from({ length: numItems }, () => Math.floor(Math.random() * 8) + 2);
    const cap = Math.floor(Math.random() * 10) + 8;

    setWeightsInput(weights.join(', '));
    setValuesInput(values.join(', '));
    setCapacity(String(cap));
  };

  const variables = state
    ? [
        { name: 'i', value: state.i, desc: 'item index' },
        { name: 'w', value: state.w, desc: 'capacity' },
        { name: 'decision', value: state.decision === 'take' ? 'TAKE' : 'SKIP', desc: 'choice' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1}` },
        { label: 'Max capacity', value: state.capacity },
        { label: 'Items', value: state.n },
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
                <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2">
                  Maximize value within weight capacity (each item used once)
                </div>

                <Input
                  label="Weights (comma-separated)"
                  value={weightsInput}
                  onChange={(e) => setWeightsInput(e.target.value)}
                  placeholder="2, 3, 4, 5"
                />

                <Input
                  label="Values (comma-separated)"
                  value={valuesInput}
                  onChange={(e) => setValuesInput(e.target.value)}
                  placeholder="3, 4, 5, 6"
                />

                <Input
                  label="Knapsack capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  max="30"
                />

                <Button onClick={handleRandomize} className="w-full">
                  🎲 Generate Random Problem
                </Button>

                {/* Items display */}
                {state && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Items:</div>
                    {state.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-zinc-800/50 text-xs"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          w:{item.weight} v:{item.value}
                        </span>
                      </div>
                    ))}
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

            {state && <StatePanel variables={variables} additionalInfo={additionalInfo} />}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card title="Knapsack DP Table">
              <div className="min-h-[300px] flex items-center justify-center">
                {state && (
                  <DPTable2D
                    dp={state.dp}
                    rowLabels={['0', ...state.items.map((item) => item.name)]}
                    colLabels={Array.from({ length: state.capacity + 1 }, (_, i) => i)}
                    highlightCell={state.highlightCell}
                    comparing={state.comparing || []}
                    rowHeader="item"
                    colHeader="capacity"
                  />
                )}
              </div>
            </Card>

            {/* Selected items display */}
            {state && state.done && state.selectedItems && state.selectedItems.length > 0 && (
              <Card title="Selected Items">
                <div className="space-y-2">
                  {state.selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                    >
                      <span className="font-medium text-emerald-900 dark:text-emerald-200">
                        Item {item.index + 1}
                      </span>
                      <span className="text-sm text-emerald-700 dark:text-emerald-400">
                        Weight: {item.weight}, Value: {item.value}
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
                  code={TEMPLATES.knapsack.code}
                  currentLine={state.currentLine}
                  done={state.done}
                  title="0/1 Knapsack"
                  description="Maximize value within weight capacity"
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
                  <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                    <div className="font-bold mb-2 text-emerald-700 dark:text-emerald-400">
                      0/1 Knapsack Decision
                    </div>
                    <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
                      <li>• dp[i][w] = max value with first i items, capacity w</li>
                      <li>• For each item: take it or skip it</li>
                      <li>• Take: dp[i-1][w-weight] + value</li>
                      <li>• Skip: dp[i-1][w]</li>
                      <li>• Choose maximum of both options</li>
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
