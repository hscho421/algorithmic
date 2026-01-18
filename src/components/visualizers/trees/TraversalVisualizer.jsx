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
  TRAVERSAL_INFO,
} from '../../../lib/algorithms/trees/traversals';

export default function TraversalVisualizer() {
  const [treeInput, setTreeInput] = useState('50, 30, 70, 20, 40, 60, 80');
  const [traversalType, setTraversalType] = useState('inorder');
  const [currentTree, setCurrentTree] = useState(null);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('tree-traversal');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { treeInput, traversalType, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress(
    'tree-traversal',
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
    reset({ tree: currentTree, traversalType });
  }, [currentTree, traversalType, reset, stop]);

  useEffect(() => {
    const values = parseArray(treeInput);
    const tree = buildTreeFromArray(values);
    setCurrentTree(tree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentTree !== null) {
      handleReset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTree, traversalType]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleSaveInput = (name) => {
    return saveInput(name, { treeInput, traversalType });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setTreeInput(payload.treeInput ?? '');
    setTraversalType(payload.traversalType ?? 'inorder');
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setTreeInput(payload.treeInput ?? '');
    setTraversalType(payload.traversalType ?? 'inorder');
  };

  const traversalOptions = Object.entries(TRAVERSAL_INFO).map(([key, info]) => ({
    value: key,
    label: `${info.name} (${info.order})`,
  }));

  const currentInfo = TRAVERSAL_INFO[traversalType];

  const shortNames = {
    inorder: 'In',
    preorder: 'Pre',
    postorder: 'Post',
    levelorder: 'Level',
  };

  const variables = state
    ? [
        { name: 'type', value: shortNames[traversalType], desc: currentInfo.order },
        { name: 'visited', value: state.visited?.length || 0, desc: 'nodes visited' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
        { label: 'Result so far', value: state.result?.join(', ') || '—' },
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
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">In-order</span>
            <span className="text-zinc-300 font-mono">L → Root → R</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Pre-order</span>
            <span className="text-zinc-300 font-mono">Root → L → R</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Post-order</span>
            <span className="text-zinc-300 font-mono">L → R → Root</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Level-order</span>
            <span className="text-zinc-300 font-mono">BFS (queue)</span>
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

          <ConfigSection title="Traversal Type">
            <Select
              label="Select traversal"
              value={traversalType}
              onChange={(e) => setTraversalType(e.target.value)}
              options={traversalOptions}
            />
            <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-3 border border-zinc-200/80 dark:border-zinc-700/50">
              <div className="text-sm text-zinc-900 dark:text-white font-medium">{currentInfo.name}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{currentInfo.description}</div>
            </div>
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
              queue={state.queue}
            />
          )}
        </div>
      }
      codeProps={
        state
          ? {
              code: template.code[traversalType],
              currentLine: state.currentLine,
              done: state.done,
              title: currentInfo.name,
              description: currentInfo.order,
            }
          : null
      }
      stateProps={state ? { variables, additionalInfo } : null}
      infoTabs={infoTabs}
    />
  );
}


// ... (the rest of the component code)
