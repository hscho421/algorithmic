import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card } from '../../shared/ui';
import { Input, Select, Checkbox } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ComplexityPanel } from '../../shared/panels';
import { ResultBanner } from '../../shared/panels';
import {
  TEMPLATES,
  initialState,
  executeStep,
  getExplanation,
  getResult,
  complexity,
} from '../../../lib/algorithms/searching/binarySearch';
import ArrayVisualization from './ArrayVisualization';

export default function BinarySearchVisualizer() {
  const [arrayInput, setArrayInput] = useState('1, 3, 5, 7, 9, 11, 13, 15');
  const [targetInput, setTargetInput] = useState('7');
  const [templateKey, setTemplateKey] = useState('lower_bound');
  const [autoSort, setAutoSort] = useState(true);
  const [dedupe, setDedupe] = useState(false);

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    let arr = parts.map(Number).filter((n) => !isNaN(n));
    if (dedupe) {
      arr = [...new Set(arr)];
    }
    if (autoSort) {
      arr.sort((a, b) => a - b);
    }
    return arr;
  }, [autoSort, dedupe]);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleReset = useCallback(() => {
    stop();
    const array = parseArray(arrayInput);
    const target = parseInt(targetInput, 10) || 0;
    reset({ array, target, templateKey });
  }, [arrayInput, targetInput, templateKey, parseArray, reset, stop]);

  useEffect(() => {
    handleReset();
  }, [arrayInput, targetInput, templateKey, autoSort, dedupe]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const templateOptions = Object.entries(TEMPLATES).map(([key, t]) => ({
    value: key,
    label: t.name,
  }));

  const variables = state
    ? [
        { name: 'n', value: state.n, desc: 'array length' },
        { name: 'target', value: state.target, desc: 'search value' },
        { name: 'l', value: state.l, desc: 'left boundary' },
        { name: 'r', value: state.r, desc: 'right boundary' },
        { name: 'm', value: state.m ?? '—', desc: 'middle index' },
        ...(state.m !== null && state.m >= 0 && state.m < state.array.length
          ? [{ name: 'a[m]', value: state.array[state.m], desc: 'middle value' }]
          : []),
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Interval Type', value: TEMPLATES[state.templateKey].halfOpen ? '[l, r)' : '[l, r]' },
        { label: 'Iteration', value: state.iteration },
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
                placeholder="1, 2, 3, 4, 5"
              />

              <Input
                label="Target"
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
              />

              <Select
                label="Algorithm"
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                options={templateOptions}
              />

              <div className="flex gap-4">
                <Checkbox
                  label="Auto-sort"
                  checked={autoSort}
                  onChange={(e) => setAutoSort(e.target.checked)}
                />
                <Checkbox
                  label="Deduplicate"
                  checked={dedupe}
                  onChange={(e) => setDedupe(e.target.checked)}
                />
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

          {state && (
            <StatePanel variables={variables} additionalInfo={additionalInfo} />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Array Visualization">
            <div className="min-h-[220px]">
              {state && <ArrayVisualization state={state} />}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state && (
              <CodePanel
                code={TEMPLATES[state.templateKey].code}
                currentLine={state.currentLine}
                done={state.done}
                title={TEMPLATES[state.templateKey].name}
                description={TEMPLATES[state.templateKey].description}
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

              <ComplexityPanel complexity={complexity} />

              <Card title="Quick Reference">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded font-bold">L</span>
                    <span className="text-zinc-400">Left pointer — start of search range</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-bold">R</span>
                    <span className="text-zinc-400">Right pointer — end of search range</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded font-bold">M</span>
                    <span className="text-zinc-400">Middle pointer — current comparison</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
