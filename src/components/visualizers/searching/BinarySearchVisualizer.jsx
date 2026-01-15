import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card } from '../../shared/ui';
import { Input, Select, Checkbox, Button } from '../../shared/ui';
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
  generateRotatedArray,
  generatePeakArray,
} from '../../../lib/algorithms/searching/binarySearch';
import ArrayVisualization from './ArrayVisualization';

export default function BinarySearchVisualizer() {
  const [arrayInput, setArrayInput] = useState('1, 3, 5, 7, 9, 11, 13, 15');
  const [targetInput, setTargetInput] = useState('7');
  const [templateKey, setTemplateKey] = useState('lower_bound');
  const [autoSort, setAutoSort] = useState(true);
  const [dedupe, setDedupe] = useState(false);

  const currentTemplate = TEMPLATES[templateKey];

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    let arr = parts.map(Number).filter((n) => !isNaN(n));
    if (dedupe) {
      arr = [...new Set(arr)];
    }
    // Don't auto-sort for rotated/peak arrays
    if (autoSort && !currentTemplate.useRotatedArray && !currentTemplate.usePeakArray) {
      arr.sort((a, b) => a - b);
    }
    return arr;
  }, [autoSort, dedupe, currentTemplate]);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleReset = useCallback(() => {
    stop();
    const array = currentTemplate.useSqrtMode ? [] : parseArray(arrayInput);
    const target = parseInt(targetInput, 10) || 0;
    reset({ array, target, templateKey });
  }, [arrayInput, targetInput, templateKey, parseArray, reset, stop, currentTemplate]);

  useEffect(() => {
    handleReset();
  }, [arrayInput, targetInput, templateKey, autoSort, dedupe]);

  // Generate special arrays when switching to rotated/peak modes
  useEffect(() => {
    if (currentTemplate.useRotatedArray) {
      const rotated = generateRotatedArray(8);
      setArrayInput(rotated.join(', '));
      // Set a valid target from the array
      setTargetInput(String(rotated[Math.floor(Math.random() * rotated.length)]));
    } else if (currentTemplate.usePeakArray) {
      const peak = generatePeakArray(8);
      setArrayInput(peak.join(', '));
      setTargetInput('0'); // Target not used for peak
    } else if (currentTemplate.useSqrtMode) {
      setTargetInput('17'); // Default sqrt target
    }
  }, [templateKey]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleGenerateArray = () => {
    if (currentTemplate.useRotatedArray) {
      const rotated = generateRotatedArray(8);
      setArrayInput(rotated.join(', '));
      setTargetInput(String(rotated[Math.floor(Math.random() * rotated.length)]));
    } else if (currentTemplate.usePeakArray) {
      setArrayInput(generatePeakArray(8).join(', '));
    } else {
      const size = 8 + Math.floor(Math.random() * 5);
      const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
      setArrayInput(arr.join(', '));
    }
  };

  const flatTemplateOptions = Object.entries(TEMPLATES).map(([key, t]) => ({
    value: key,
    label: `${t.name}`,
  }));

  const variables = state
    ? [
        ...(state.sqrtMode 
          ? [{ name: 'n', value: state.target, desc: 'find sqrt of' }]
          : [{ name: 'n', value: state.n, desc: 'array length' }]
        ),
        ...(!state.sqrtMode ? [{ name: 'target', value: state.target, desc: 'search value' }] : []),
        { name: 'l', value: state.l, desc: 'left boundary' },
        { name: 'r', value: state.r, desc: 'right boundary' },
        { name: 'm', value: state.m ?? '—', desc: 'middle index' },
        ...(state.m !== null && state.m >= 0 && state.m < state.array.length && !state.sqrtMode
          ? [{ name: 'a[m]', value: state.array[state.m], desc: 'middle value' }]
          : []),
        ...(state.m !== null && state.sqrtMode
          ? [{ name: 'm²', value: state.m * state.m, desc: 'square of m' }]
          : []),
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Interval', value: TEMPLATES[state.templateKey].halfOpen ? '[l, r)' : '[l, r]' },
        { label: 'Iteration', value: state.iteration },
      ]
    : [];

  const result = state ? getResult(state) : null;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          <Card title="Configuration">
            <div className="space-y-4">
              <Select
                label="Algorithm"
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                options={flatTemplateOptions}
              />

              <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2.5">
                {currentTemplate.description}
              </div>

              {!currentTemplate.useSqrtMode && (
                <>
                  <div className="flex gap-2">
                    <Input
                      label="Array"
                      value={arrayInput}
                      onChange={(e) => setArrayInput(e.target.value)}
                      placeholder="1, 2, 3, 4, 5"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleGenerateArray}
                      className="self-end"
                      title="Generate random array"
                    >
                      🎲
                    </Button>
                  </div>

                  {!currentTemplate.usePeakArray && (
                    <Input
                      label="Target"
                      type="number"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                    />
                  )}

                  {!currentTemplate.useRotatedArray && !currentTemplate.usePeakArray && (
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
                  )}
                </>
              )}

              {currentTemplate.useSqrtMode && (
                <Input
                  label="Find sqrt of"
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  min="0"
                />
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

        {/* Right Column - Visualization & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visualization */}
          <Card title={state?.sqrtMode ? "Integer Square Root" : "Array Search"}>
            <div className="min-h-[280px] flex items-center justify-center">
              {state && !state.sqrtMode && <ArrayVisualization state={state} />}
              {state && state.sqrtMode && <SqrtVisualization state={state} />}
            </div>
          </Card>

          {/* Result Banner - Full Width */}
          {result && (
            <ResultBanner
              success={result.success}
              title={result.title}
              message={result.message}
              details={result.details}
            />
          )}

          {/* Bottom Grid - Code and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Panel */}
            {state && (
              <CodePanel
                code={TEMPLATES[state.templateKey].code}
                currentLine={state.currentLine}
                done={state.done}
                title={TEMPLATES[state.templateKey].name}
                description={TEMPLATES[state.templateKey].description}
              />
            )}

            {/* Info Column */}
            <div className="space-y-4">
              {state && (
                <ExplanationPanel
                  explanation={getExplanation(state)}
                  status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
                />
              )}

              <ComplexityPanel complexity={complexity} />

              <AlgorithmGuide template={currentTemplate} templateKey={templateKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

// Algorithm Guide Component
function AlgorithmGuide({ template, templateKey }) {
  if (template.category === 'classic') {
    return (
      <Card title="Interval Type">
        <div className={`p-3 rounded-lg border ${
          template.halfOpen
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="font-mono font-bold mb-2 text-zinc-900 dark:text-white">
            {template.halfOpen ? '[L, R) Half-Open' : '[L, R] Closed'}
          </div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
            {template.halfOpen ? (
              <>
                <li>• R is <span className="text-rose-600 dark:text-rose-400 font-medium">excluded</span></li>
                <li>• Loop: <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">while L &lt; R</code></li>
                <li>• Narrow right: <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">R = M</code></li>
              </>
            ) : (
              <>
                <li>• Both L and R <span className="text-emerald-600 dark:text-emerald-400 font-medium">included</span></li>
                <li>• Loop: <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">while L &lt;= R</code></li>
                <li>• Narrow right: <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">R = M - 1</code></li>
              </>
            )}
          </ul>
        </div>
      </Card>
    );
  }

  if (template.category === 'rotated') {
    return (
      <Card title="Key Concept">
        <div className="p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="font-bold mb-2 text-amber-700 dark:text-amber-400">Rotated Array</div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
            <li>• Originally sorted, then rotated at unknown pivot</li>
            <li>• One half is always sorted</li>
            <li>• Compare with endpoints to determine which half</li>
          </ul>
        </div>
      </Card>
    );
  }

  if (template.category === 'special' && templateKey === 'peak_element') {
    return (
      <Card title="Key Concept">
        <div className="p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <div className="font-bold mb-2 text-purple-700 dark:text-purple-400">Peak Finding</div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
            <li>• Peak: element greater than neighbors</li>
            <li>• If slope up → peak is to the right</li>
            <li>• If slope down → peak is here or left</li>
          </ul>
        </div>
      </Card>
    );
  }

  if (template.category === 'special' && templateKey === 'sqrt') {
    return (
      <Card title="Key Concept">
        <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <div className="font-bold mb-2 text-emerald-700 dark:text-emerald-400">Integer Square Root</div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-xs">
            <li>• Find largest x where x² ≤ n</li>
            <li>• Binary search on answer space [0, n]</li>
            <li>• If m² ≤ n, answer is m or higher</li>
          </ul>
        </div>
      </Card>
    );
  }

  return null;
}

// Special visualization for sqrt mode
function SqrtVisualization({ state }) {
  const { l, r, m, target, done, result, comparison } = state;

  const maxDisplay = Math.min(target + 2, 25);
  const numbers = Array.from({ length: maxDisplay }, (_, i) => i);

  return (
    <div className="space-y-8 w-full">
      {/* Title */}
      <div className="text-center">
        <span className="text-2xl font-mono font-semibold text-zinc-800 dark:text-zinc-200">
          sqrt({target}) = ?
        </span>
      </div>

      {/* Number line */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <div className="relative">
          {/* Pointer track */}
          <div className="relative h-12 mb-2" style={{ width: `${maxDisplay * 48}px` }}>
            {!done && (
              <>
                <SqrtPointer label="L" position={l} color="bg-blue-500" />
                {m !== null && <SqrtPointer label="M" position={m} color="bg-emerald-500" />}
                <SqrtPointer label="R" position={Math.min(r, maxDisplay - 1)} color="bg-red-500" />
              </>
            )}
          </div>

          {/* Numbers */}
          <div className="flex gap-1">
            {numbers.map((n) => {
              const inRange = !done && n >= l && n < r;
              const isMiddle = n === m && !done;
              const isResult = done && n === result;
              const square = n * n;

              return (
                <div key={n} className="flex flex-col items-center" style={{ width: 44 }}>
                  <div
                    className={`
                      w-11 h-11 flex flex-col items-center justify-center rounded-lg
                      font-mono text-sm font-semibold transition-all duration-300
                      ${isResult
                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30'
                        : inRange
                          ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white'
                          : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                      }
                      ${isMiddle ? 'ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950' : ''}
                    `}
                  >
                    <span>{n}</span>
                    <span className="text-[10px] opacity-60">{square}</span>
                  </div>
                  {isMiddle && comparison && (
                    <div className="text-xs mt-1.5 font-medium whitespace-nowrap">
                      <span className={comparison === 'less_or_equal' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {square} {comparison === 'less_or_equal' ? '≤' : '>'} {target}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <span>Top: number</span>
        <span>•</span>
        <span>Bottom: square</span>
      </div>

      {/* Result */}
      {done && (
        <div className="text-center space-y-2">
          <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            floor(sqrt({target})) = {result}
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {result}² = {result * result} ≤ {target} &lt; {(result + 1) * (result + 1)} = {result + 1}²
          </div>
        </div>
      )}
    </div>
  );
}

// Helper for sqrt pointers
function SqrtPointer({ label, position, color }) {
  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-400 ease-out"
      style={{ left: `${position * 48 + 24}px`, transform: 'translateX(-50%)' }}
    >
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${color} text-white shadow-sm`}>{label}</span>
      <svg width="12" height="16" viewBox="0 0 12 16" className="mt-0.5">
        <path
          d="M6 0 L6 12 L2 8 M6 12 L10 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={color.replace('bg-', 'text-')}
        />
      </svg>
    </div>
  );
}