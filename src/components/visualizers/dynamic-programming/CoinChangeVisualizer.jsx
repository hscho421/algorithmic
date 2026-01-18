import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select, Button } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
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
} from '../../../lib/algorithms/dp/coinChange';
import { DPTable1D } from './DPTableVisualization';

export default function CoinChangeVisualizer() {
  const [coinsInput, setCoinsInput] = useState('1, 2, 5');
  const [amount, setAmount] = useState('11');
  const [mode, setMode] = useState('min_coins');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('coin-change');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { coinsInput, amount, mode, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'coin-change',
    progressPayload,
  );

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

  const handleSaveInput = (name) => {
    return saveInput(name, { coinsInput, amount, mode });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setCoinsInput(payload.coinsInput ?? '1, 2, 5');
    setAmount(payload.amount ?? '11');
    setMode(payload.mode ?? 'min_coins');
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setCoinsInput(payload.coinsInput ?? '1, 2, 5');
    setAmount(payload.amount ?? '11');
    setMode(payload.mode ?? 'min_coins');
  };

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

  const infoTabs = [
    {
      id: 'explanation',
      label: 'Explanation',
      content: state ? (
        <ExplanationPanel
          explanation={getExplanation(state)}
          status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
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
          <ConfigSection title="Problem">
            <Select
              label="Problem"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              options={modeOptions}
            />

            <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2">
              {TEMPLATES[mode].description}
            </div>
          </ConfigSection>

          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input
                label="Coins (comma-separated)"
                value={coinsInput}
                onChange={(e) => setCoinsInput(e.target.value)}
                placeholder="1, 2, 5"
                className="flex-1"
              />
              <Button onClick={handleRandomize} className="px-3" title="Generate random coins">
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
        <div className="min-h-[200px] flex items-center justify-center w-full">
          {state && (
            <DPTable1D
              dp={state.dp.map((v) => (v === Infinity ? '∞' : v))}
              highlightIndex={state.highlightCell}
              label="dp"
              comparing={state.comparing || []}
            />
          )}
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

function ConfigSection({ title, children, open = true }) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 last:border-b-0">
      <button
        className="w-full flex justify-between items-center py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isOpen && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}
