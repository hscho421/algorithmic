import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select, Button } from '../../shared/ui';
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
  buildTreeFromArray,
} from '../../../lib/algorithms/trees/bst';

export default function BSTVisualizer() {
  const [treeInput, setTreeInput] = useState('50, 30, 70, 20, 40, 60, 80');
  const [valueInput, setValueInput] = useState('25');
  const [operation, setOperation] = useState('insert');
  const [currentTree, setCurrentTree] = useState(null);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('bst');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { treeInput, valueInput, operation, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'bst',
    progressPayload,
  );

  const handleBuildTree = useCallback(() => {
    stop();
    const values = parseArray(treeInput);
    const tree = buildTreeFromArray(values);
    setCurrentTree(tree);
  }, [treeInput, parseArray, stop]);

  const handleReset = useCallback(() => {
    stop();
    const value = parseInt(valueInput, 10) || 0;
    reset({ tree: currentTree, operation, value });
  }, [currentTree, operation, valueInput, reset, stop]);

  useEffect(() => {
    handleBuildTree();
  }, []);

  useEffect(() => {
    if (currentTree !== null) {
      handleReset();
    }
  }, [currentTree, operation, valueInput]);

  useEffect(() => {
    if (state?.done && state?.operation === 'insert' && state?.finalTree) {
      setCurrentTree(state.finalTree);
    }
  }, [state?.done, state?.operation, state?.finalTree]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleSaveInput = (name) => {
    return saveInput(name, { treeInput, valueInput, operation });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setTreeInput(payload.treeInput ?? '');
    setValueInput(payload.valueInput ?? '');
    setOperation(payload.operation ?? 'insert');
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setTreeInput(payload.treeInput ?? '');
    setValueInput(payload.valueInput ?? '');
    setOperation(payload.operation ?? 'insert');
  };

  const operationOptions = [
    { value: 'insert', label: 'Insert' },
    { value: 'search', label: 'Search' },
  ];

  const variables = state
    ? [
        { name: 'operation', value: state.operation, desc: 'current operation' },
        { name: 'value', value: state.value, desc: 'target value' },
        { name: 'phase', value: state.phase || '—', desc: 'current phase' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
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
        <div className="space-y-2 text-sm text-zinc-400">
          <p>For every node:</p>
          <p><span className="text-blue-400 font-medium">Left subtree</span> contains only values <span className="text-white">less than</span> the node</p>
          <p><span className="text-rose-400 font-medium">Right subtree</span> contains only values <span className="text-white">greater than</span> the node</p>
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
            <Input
              label="Initial values (insertion order)"
              value={treeInput}
              onChange={(e) => setTreeInput(e.target.value)}
              placeholder="50, 30, 70, 20, 40"
            />
            <Button onClick={handleBuildTree} variant="primary" className="w-full">
              Build Tree
            </Button>
          </ConfigSection>

          <ConfigSection title="Operation">
            <Select
              label="Operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              options={operationOptions}
            />
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


// ... (the rest of the component code)
