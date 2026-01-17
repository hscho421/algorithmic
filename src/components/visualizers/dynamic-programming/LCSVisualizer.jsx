import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Button } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import {
  TEMPLATES,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
} from '../../../lib/algorithms/dp/lcs';
import { DPTable2D } from './DPTableVisualization';

export default function LCSVisualizer() {
  const [text1Input, setText1Input] = useState('ABCDGH');
  const [text2Input, setText2Input] = useState('AEDFHR');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('lcs');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleReset = useCallback(() => {
    stop();
    const text1 = text1Input.trim() || 'ABCD';
    const text2 = text2Input.trim() || 'ACBD';
    reset({ text1, text2 });
  }, [text1Input, text2Input, reset, stop]);

  useEffect(() => {
    handleReset();
  }, [text1Input, text2Input]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleSaveInput = (name) => {
    return saveInput(name, { text1Input, text2Input });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setText1Input(payload.text1Input ?? '');
    setText2Input(payload.text2Input ?? '');
  };

  const handleRandomize = () => {
    const letters = 'ABCDEFGH';
    const len1 = 4 + Math.floor(Math.random() * 4);
    const len2 = 4 + Math.floor(Math.random() * 4);
    const text1 = Array.from({ length: len1 }, () => letters[Math.floor(Math.random() * letters.length)]).join(
      ''
    );
    const text2 = Array.from({ length: len2 }, () => letters[Math.floor(Math.random() * letters.length)]).join(
      ''
    );
    setText1Input(text1);
    setText2Input(text2);
  };

  const variables = state
    ? [
        { name: 'i', value: state.i, desc: 'row (text1)' },
        { name: 'j', value: state.j, desc: 'col (text2)' },
        { name: 'match', value: state.matchFound ? 'Yes' : 'No', desc: 'chars match' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1}` },
        { label: 'LCS Length', value: state.result ?? '—' },
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
        <div className="p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <div className="font-bold mb-2 text-purple-700 dark:text-purple-400">2D DP Table</div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
            <li>• dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]</li>
            <li>• If chars match: dp[i][j] = dp[i-1][j-1] + 1</li>
            <li>• If no match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</li>
            <li>• Backtrack to reconstruct actual LCS string</li>
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
            Find the longest subsequence common to both strings
          </div>

          <Input
            label="Text 1"
            value={text1Input}
            onChange={(e) => setText1Input(e.target.value.toUpperCase())}
            placeholder="ABCDGH"
            maxLength={15}
          />

          <Input
            label="Text 2"
            value={text2Input}
            onChange={(e) => setText2Input(e.target.value.toUpperCase())}
            placeholder="AEDFHR"
            maxLength={15}
          />

          <Button onClick={handleRandomize} className="w-full">
            🎲 Generate Random Strings
          </Button>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Use uppercase letters (max 15 characters each)
          </div>

          <SavedInputsPanel
            items={savedInputs}
            isLoading={savedLoading}
            onSave={handleSaveInput}
            onLoad={handleLoadInput}
            onDelete={(item) => deleteInput(item.id)}
          />
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
              <DPTable2D
                dp={state.dp}
                rowLabels={['', ...state.text1.split('')]}
                colLabels={['', ...state.text2.split('')]}
                highlightCell={state.highlightCell}
                comparing={state.comparing || []}
                rowHeader="text1"
                colHeader="text2"
              />
            )}
          </div>

          {state && !state.done && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Current Comparison
              </div>
              <div className="flex items-center justify-center gap-6 p-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">text1[{state.i - 1}]</span>
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold border-2 ${
                      state.matchFound
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {state.text1[state.i - 1]}
                  </div>
                </div>

                <div className="text-2xl font-bold text-zinc-400">
                  {state.matchFound ? '=' : '≠'}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">text2[{state.j - 1}]</span>
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold border-2 ${
                      state.matchFound
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {state.text2[state.j - 1]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      codeProps={
        state
          ? {
              code: TEMPLATES.lcs.code,
              currentLine: state.currentLine,
              done: state.done,
              title: 'Longest Common Subsequence',
              description: 'Find longest subsequence common to both strings',
            }
          : null
      }
      stateProps={state ? { variables, additionalInfo } : null}
      infoTabs={infoTabs}
    />
  );
}
