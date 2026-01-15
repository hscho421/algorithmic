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
} from '../../../lib/algorithms/dp/coinChange';
import { DPTable1D } from './DPTableVisualization';

export default function CoinChangeVisualizer() {
  const [coinsInput, setCoinsInput] = useState('1, 2, 5');
  const [amount, setAmount] = useState('11');
  const [mode, setMode] = useState('min_coins');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const parseCoins = useCallback((input) => {
    return input
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);
  }, []);

  const handleReset = useCallback(() => {
    stop();
    const coins = parseCoins(coinsInput);
    const targetAmount = Math.max(1, Math.min(100, parseInt(amount, 10) || 11));
    reset({ coins, amount: targetAmount, mode });
  }, [coinsInput, amount, mode, reset, stop, parseCoins]);

  useEffect(() => {
    handleReset();
  }, [coinsInput, amount, mode]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = () => {
    const numCoins = 3 + Math.floor(Math.random() * 2);
    const coins = Array.from({ length: numCoins }, () => Math.floor(Math.random() * 10) + 1)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b);
    setCoinsInput(coins.join(', '));
    setAmount(String(10 + Math.floor(Math.random() * 20)));
  };

  const modeOptions = Object.values(TEMPLATES).map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const variables = state
    ? [
        { name: 'i', value: state.i, desc: 'current amount' },
        { name: 'coin', value: state.coins[state.coinIndex] ?? '—', desc: 'trying coin' },
        { name: 'amount', value: state.amount, desc: 'target' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1}` },
        { label: 'Coins', value: `[${state.coins.join(', ')}]` },
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
                  {TEMPLATES[mode].description}
                </div>

                <div className="flex gap-2">
                  <Input
                    label="Coins (comma-separated)"
                    value={coinsInput}
                    onChange={(e) => setCoinsInput(e.target.value)}
                    placeholder="1, 2, 5"
                    className="flex-1"
                  />
                  <Button onClick={handleRandomize} className="self-end" title="Generate random coins">
                    🎲
                  </Button>
                </div>

                <Input
                  label="Target amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max="100"
                />
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
            <Card title="Coin Change DP Table">
              <div className="min-h-[200px] flex items-center justify-center">
                {state && (
                  <DPTable1D
                    dp={state.dp.map((v) => (v === Infinity ? '∞' : v))}
                    highlightIndex={state.highlightCell}
                    label="dp"
                    comparing={state.comparing || []}
                  />
                )}
              </div>
            </Card>

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
                    status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
                  />
                )}

                <ComplexityPanel complexity={complexity} />

                <Card title="Key Concept">
                  <div className="p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <div className="font-bold mb-2 text-amber-700 dark:text-amber-400">
                      {mode === 'min_coins' ? 'Minimum Coins' : 'Count Ways'}
                    </div>
                    <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
                      {mode === 'min_coins' ? (
                        <>
                          <li>• dp[i] = minimum coins to make amount i</li>
                          <li>• For each amount, try all coins</li>
                          <li>• dp[i] = min(dp[i], dp[i-coin] + 1)</li>
                          <li>• Infinity means impossible</li>
                        </>
                      ) : (
                        <>
                          <li>• dp[i] = number of ways to make amount i</li>
                          <li>• Process coins one at a time</li>
                          <li>• dp[i] += dp[i-coin] for each coin</li>
                          <li>• Counts all unique combinations</li>
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
