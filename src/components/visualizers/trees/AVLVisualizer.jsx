import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Button } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { TreeDisplay } from '../../shared/visualization';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
import ConfigSection from '../../shared/layout/ConfigSection';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
  buildAVLFromArray,
} from '../../../lib/algorithms/trees/avl';

export default function AVLVisualizer() {
  const [treeInput, setTreeInput] = useState('30, 20, 40, 10, 25');
  const [valueInput, setValueInput] = useState('22');
  const [currentTree, setCurrentTree] = useState(null);
  const suppressResetRef = useRef(false);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('avl-tree');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { treeInput, valueInput, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('avl-tree', progressPayload);

  const handleBuildTree = useCallback(() => {
    stop();
    const values = parseArray(treeInput);
    const tree = buildAVLFromArray(values);
    setCurrentTree(tree);
    const value = parseInt(valueInput, 10) || 0;
    reset({ tree, value });
  }, [treeInput, valueInput, parseArray, stop, reset]);

  const handleRandomize = useCallback(() => {
    stop();
    const length = Math.floor(Math.random() * 4) + 5;
    const values = Array.from({ length }, () => Math.floor(Math.random() * 50) + 1);
    const insertValue = Math.floor(Math.random() * 50) + 1;
    const tree = buildAVLFromArray(values);
    setTreeInput(values.join(', '));
    setValueInput(String(insertValue));
    setCurrentTree(tree);
    reset({ tree, value: insertValue });
  }, [reset, stop]);

  const handleReset = useCallback(() => {
    stop();
    if (!currentTree) return;
    const value = parseInt(valueInput, 10) || 0;
    reset({ tree: currentTree, value });
  }, [currentTree, valueInput, reset, stop]);

  useEffect(() => {
    handleBuildTree();
  }, []);

  useEffect(() => {
    if (suppressResetRef.current) {
      suppressResetRef.current = false;
      return;
    }
    if (currentTree !== null && !isRunning) {
      handleReset();
    }
  }, [valueInput, currentTree, handleReset]);

  useEffect(() => {
    if (state?.done && state?.finalTree) {
      suppressResetRef.current = true;
      setCurrentTree(state.finalTree);
    }
  }, [state?.done, state?.finalTree]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleSaveInput = (name) => saveInput(name, { treeInput, valueInput });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setTreeInput(payload.treeInput ?? '');
    setValueInput(payload.valueInput ?? '');
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setTreeInput(payload.treeInput ?? '');
    setValueInput(payload.valueInput ?? '');
  };

  const variables = state
    ? [
        { name: 'value', value: state.value, desc: 'insert value' },
        { name: 'phase', value: state.phase || '—', desc: 'current phase' },
      ]
    : [];

  const additionalInfo = state
    ? [{ label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` }]
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
        <div className="space-y-2 text-sm text-zinc-400">
          <p>AVL keeps balance by rotations after insert.</p>
          <p>Balance factor = height(left) - height(right).</p>
          <p>Cases: LL, RR, LR, RL.</p>
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
          <ConfigSection title="Build Tree">
            <div className="flex gap-2 items-end">
              <Input
                label="Initial values (insertion order)"
                value={treeInput}
                onChange={(e) => setTreeInput(e.target.value)}
                placeholder="30, 20, 40"
                className="flex-1"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                title="Random"
              >
                🎲
              </button>
            </div>
            <Button onClick={handleBuildTree} variant="primary" className="w-full">
              Build AVL
            </Button>
          </ConfigSection>

          <ConfigSection title="Insert">
            <Input
              label="Value"
              type="number"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
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
        <div className="min-h-[300px] w-full">
          {state && (
            <TreeDisplay
              tree={state.tree}
              highlightedNodes={state.highlightedNodes}
              activeNode={state.activeNode}
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
