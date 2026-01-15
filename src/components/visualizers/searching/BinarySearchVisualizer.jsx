import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card } from '../../shared/ui';
import { Input, Select, Checkbox, Button } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ComplexityPanel } from '../../shared/panels';
import { ResultBanner } from '../../shared/panels';
import {
  TEMPLATES,
  CATEGORIES,
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card title="Configuration">
            <div className="space-y-4">
              <Select
                label="Algorithm"
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                options={flatTemplateOptions}
              />

              {/* Show description */}
              <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2">
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

              {currentTemplate.useRotatedArray && (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                  💡 Array is rotated sorted: originally sorted, then rotated at some pivot.
                </div>
              )}

              {currentTemplate.usePeakArray && (
                <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                  💡 Array increases then decreases. Finding any local maximum.
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
          <Card title="Visualization">
            <div className="min-h-[280px]">
              {state && !state.sqrtMode && <ArrayVisualization state={state} />}
              {state && state.sqrtMode && <SqrtVisualization state={state} />}
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

              <Card title="Algorithm Guide">
                <div className="space-y-3 text-sm">
                  {currentTemplate.category === 'classic' && (
                    <div className={`p-3 rounded-lg border ${
                      currentTemplate.halfOpen 
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}>
                      <div className="font-mono font-bold mb-1">
                        {currentTemplate.halfOpen ? '[L, R) Half-Open' : '[L, R] Closed'}
                      </div>
                      <ul className="text-zinc-600 dark:text-zinc-400 space-y-1 text-xs">
                        {currentTemplate.halfOpen ? (
                          <>
                            <li>• R is <span className="text-rose-600 dark:text-rose-400 font-medium">excluded</span></li>
                            <li>• Loop: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">while L &lt; R</code></li>
                            <li>• Narrow right: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">R = M</code></li>
                          </>
                        ) : (
                          <>
                            <li>• Both L and R <span className="text-emerald-600 dark:text-emerald-400 font-medium">included</span></li>
                            <li>• Loop: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">while L &lt;= R</code></li>
                            <li>• Narrow right: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">R = M - 1</code></li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}

                  {currentTemplate.category === 'rotated' && (
                    <div className="p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                      <div className="font-bold mb-1 text-amber-700 dark:text-amber-400">Rotated Array</div>
                      <ul className="text-zinc-600 dark:text-zinc-400 space-y-1 text-xs">
                        <li>• Originally sorted, then rotated at unknown pivot</li>
                        <li>• One half is always sorted</li>
                        <li>• Compare with endpoints to determine which half</li>
                      </ul>
                    </div>
                  )}

                  {currentTemplate.category === 'special' && templateKey === 'peak_element' && (
                    <div className="p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                      <div className="font-bold mb-1 text-purple-700 dark:text-purple-400">Peak Finding</div>
                      <ul className="text-zinc-600 dark:text-zinc-400 space-y-1 text-xs">
                        <li>• Peak: element greater than neighbors</li>
                        <li>• If slope up → peak is to the right</li>
                        <li>• If slope down → peak is here or left</li>
                      </ul>
                    </div>
                  )}

                  {currentTemplate.category === 'special' && templateKey === 'sqrt' && (
                    <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                      <div className="font-bold mb-1 text-emerald-700 dark:text-emerald-400">Integer Square Root</div>
                      <ul className="text-zinc-600 dark:text-zinc-400 space-y-1 text-xs">
                        <li>• Find largest x where x² ≤ n</li>
                        <li>• Binary search on answer space [0, n]</li>
                        <li>• If m² ≤ n, answer is m or higher</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Special visualization for sqrt mode
function SqrtVisualization({ state }) {
  const { l, r, m, target, done, result, comparison } = state;
  
  // Show a number line visualization
  const maxDisplay = Math.min(target + 2, 25);
  const numbers = Array.from({ length: maxDisplay }, (_, i) => i);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-2xl font-mono text-zinc-700 dark:text-zinc-300">
          sqrt({target}) = ?
        </span>
      </div>
      
      <div className="flex justify-center overflow-x-auto pb-4">
        <div className="relative">
          {/* Pointer track */}
          <div className="relative h-10 mb-2" style={{ width: `${maxDisplay * 48}px` }}>
            {!done && (
              <>
                <div
                  className="absolute flex flex-col items-center transition-all duration-400 ease-out"
                  style={{ left: `${l * 48 + 24}px`, transform: 'translateX(-50%)' }}
                >
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500 text-white">L</span>
                  <div className="w-0.5 h-3 mt-0.5 bg-blue-500" />
                </div>
                {m !== null && (
                  <div
                    className="absolute flex flex-col items-center transition-all duration-400 ease-out"
                    style={{ left: `${m * 48 + 24}px`, transform: 'translateX(-50%)' }}
                  >
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white">M</span>
                    <div className="w-0.5 h-3 mt-0.5 bg-emerald-500" />
                  </div>
                )}
                <div
                  className="absolute flex flex-col items-center transition-all duration-400 ease-out"
                  style={{ left: `${Math.min(r, maxDisplay - 1) * 48 + 24}px`, transform: 'translateX(-50%)' }}
                >
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white">R</span>
                  <div className="w-0.5 h-3 mt-0.5 bg-red-500" />
                </div>
              </>
            )}
          </div>
          
          {/* Number line */}
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
                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white scale-110'
                        : inRange
                          ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white'
                          : 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                      }
                      ${isMiddle ? 'ring-2 ring-emerald-500/50' : ''}
                    `}
                  >
                    <span>{n}</span>
                    <span className="text-[10px] opacity-60">{square}</span>
                  </div>
                  {isMiddle && comparison && (
                    <div className="text-xs mt-1 whitespace-nowrap">
                      <span className={comparison === 'less_or_equal' ? 'text-emerald-500' : 'text-rose-500'}>
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
      <div className="flex justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <span>Top: number</span>
        <span>Bottom: square</span>
      </div>
      
      {done && (
        <div className="text-center text-lg">
          <span className="text-emerald-500 font-mono font-bold">
            floor(sqrt({target})) = {result}
          </span>
          <span className="text-zinc-500 ml-2">
            ({result}² = {result * result} ≤ {target} &lt; {(result + 1) * (result + 1)} = {result + 1}²)
          </span>
        </div>
      )}
    </div>
  );
}