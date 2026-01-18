import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Select, Input, Button, OperationBuilder } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { UnionFindDisplay } from '../../shared/visualization';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
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
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('union-find');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = {
    mode,
    selectedPreset,
    customElements,
    customOperations,
    stepIndex: state?.stepIndex ?? 0,
  };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress(
    'union-find',
    progressPayload,
  );

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

  const handleSaveInput = (name) => {
    return saveInput(name, {
      mode,
      selectedPreset,
      customElements,
      customOperations,
    });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setCustomElements(payload.customElements ?? ['A', 'B', 'C', 'D', 'E']);
    setCustomOperations(
      payload.customOperations ?? [
        { type: OPERATION_TYPES.UNION, x: 'A', y: 'B' },
        { type: OPERATION_TYPES.UNION, x: 'C', y: 'D' },
        { type: OPERATION_TYPES.CONNECTED, x: 'A', y: 'C' },
      ],
    );
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setMode(payload.mode ?? 'preset');
    setSelectedPreset(payload.selectedPreset ?? 'simple');
    setCustomElements(payload.customElements ?? ['A', 'B', 'C', 'D', 'E']);
    setCustomOperations(
      payload.customOperations ?? [
        { type: OPERATION_TYPES.UNION, x: 'A', y: 'B' },
        { type: OPERATION_TYPES.UNION, x: 'C', y: 'D' },
        { type: OPERATION_TYPES.CONNECTED, x: 'A', y: 'C' },
      ],
    );
  };

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
        <div className="space-y-4">
          {state?.rank && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Rank
              </div>
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
            </div>
          )}

          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p><span className="text-zinc-900 dark:text-white font-medium">Path Compression:</span> Flatten tree during Find</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">Union by Rank:</span> Attach smaller tree under larger</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">α(n):</span> Inverse Ackermann — nearly O(1)</p>
            <p><span className="text-zinc-900 dark:text-white font-medium">Use cases:</span> Connected components, Kruskal's MST, cycle detection</p>
          </div>
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
          <ConfigSection title="Scenario">
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

                {customElements.length >= 2 && (
                  <OperationBuilder
                    elements={customElements}
                    operations={customOperations}
                    onOperationsChange={setCustomOperations}
                  />
                )}
              </div>
            )}
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
              checkpoints={checkpoints}
              onSaveCheckpoint={saveCheckpoint}
              onLoadCheckpoint={handleResume}
              onDeleteCheckpoint={deleteCheckpoint}
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
        <div className="min-h-[400px] w-full">
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
      }
      codeProps={
        state
          ? {
              code: template.code,
              currentLine: state.currentLine,
              done: state.done,
              title: template.name,
              description: template.description,
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
