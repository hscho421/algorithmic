import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Select, Input, Button, OperationBuilder } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { UnionFindDisplay } from '../../shared/visualization';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
  PRESET_OPERATIONS,
  OPERATION_TYPES,
} from '../../../lib/algorithms/graphs/unionFind';

export default function UnionFindVisualizer() {
  const [mode, setMode] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('simple');

  const [customElements, setCustomElements] = useState(['A', 'B', 'C', 'D', 'E']);
  const [customOperations, setCustomOperations] = useState([
    { type: OPERATION_TYPES.UNION, x: 'A', y: 'B' },
    { type: OPERATION_TYPES.UNION, x: 'C', y: 'D' },
    { type: OPERATION_TYPES.CONNECTED, x: 'A', y: 'C' },
  ]);
  const [newElement, setNewElement] = useState('');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  // Build when configuration changes
  useEffect(() => {
    stop();
    let elements, operations;

    if (mode === 'preset') {
      const preset = PRESET_OPERATIONS[selectedPreset];
      elements = preset.elements;
      operations = preset.operations;
    } else {
      elements = customElements;
      operations = customOperations;
    }

    reset({ elements, operations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedPreset, customElements, customOperations]);

  const handleReset = useCallback(() => {
    stop();
    let elements, operations;

    if (mode === 'preset') {
      const preset = PRESET_OPERATIONS[selectedPreset];
      elements = preset.elements;
      operations = preset.operations;
    } else {
      elements = customElements;
      operations = customOperations;
    }

    reset({ elements, operations });
  }, [mode, selectedPreset, customElements, customOperations, reset, stop]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleAddElement = () => {
    const trimmed = newElement.trim();
    if (trimmed && !customElements.includes(trimmed)) {
      setCustomElements([...customElements, trimmed]);
      setNewElement('');
    }
  };

  const handleRemoveElement = (el) => {
    setCustomElements(customElements.filter((e) => e !== el));
    // Remove operations involving this element
    setCustomOperations(
      customOperations.filter((op) => op.x !== el && op.y !== el)
    );
  };

  const presetOptions = Object.entries(PRESET_OPERATIONS).map(([key, preset]) => ({
    value: key,
    label: preset.name,
  }));

  const variables = state
    ? [
        { name: 'elements', value: state.elements?.length || 0, desc: 'total elements' },
        { name: 'step', value: `${state.stepIndex + 1}/${state.steps?.length || 0}`, desc: 'progress' },
      ]
    : [];

  const additionalInfo = state?.operationResult
    ? [
        { label: 'Operation', value: state.operationResult.type },
        { label: 'Result', value: state.operationResult.message },
      ]
    : [];

  const result = state ? getResult(state) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card title="Configuration">
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('preset')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'preset'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Preset
                </button>
                <button
                  onClick={() => setMode('custom')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'custom'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Custom
                </button>
              </div>

              {mode === 'preset' ? (
                <Select
                  label="Select Scenario"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  options={presetOptions}
                />
              ) : (
                <div className="space-y-4">
                  {/* Add Element */}
                  <div>
                    <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Add Element
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={newElement}
                        onChange={(e) => setNewElement(e.target.value)}
                        placeholder="e.g. A, B, 1, 2"
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddElement()}
                      />
                      <Button onClick={handleAddElement} disabled={!newElement.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Elements List */}
                  {customElements.length > 0 && (
                    <div>
                      <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
                        Elements ({customElements.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {customElements.map((el) => (
                          <div
                            key={el}
                            className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 py-1 border border-zinc-200 dark:border-zinc-700"
                          >
                            <span className="font-mono text-sm text-zinc-900 dark:text-white">{el}</span>
                            <button
                              onClick={() => handleRemoveElement(el)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors ml-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Operations Builder */}
                  {customElements.length >= 2 && (
                    <OperationBuilder
                      elements={customElements}
                      operations={customOperations}
                      onOperationsChange={setCustomOperations}
                    />
                  )}
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

          {state?.rank && (
            <Card title="Rank">
              <div className="flex flex-wrap gap-2">
                {Object.entries(state.rank)
                  .filter(([node]) => state.parent[node] === node)
                  .map(([node, r]) => (
                    <div
                      key={node}
                      className="px-2 py-1 rounded text-xs font-mono bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    >
                      {node}: {r}
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Union Find Visualization">
            <div className="min-h-[400px]">
              {state && (
                <UnionFindDisplay
                  elements={state.elements}
                  parent={state.parent}
                  rank={state.rank}
                  highlightedNodes={state.highlightedNodes}
                  highlightedEdges={state.highlightedEdges}
                  findPath={state.findPath}
                />
              )}
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

              <Card title="Union Find Key Points">
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p><span className="text-zinc-900 dark:text-white font-medium">Path Compression:</span> Flatten tree during Find</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">Union by Rank:</span> Attach smaller tree under larger</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">α(n):</span> Inverse Ackermann — nearly O(1)</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">Use cases:</span> Connected components, Kruskal's MST, cycle detection</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
