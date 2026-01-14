import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Input, Select, Button } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { TreeDisplay } from '../../shared/visualization';
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

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card title="Build Tree">
            <div className="space-y-4">
              <Input
                label="Initial values (insertion order)"
                value={treeInput}
                onChange={(e) => setTreeInput(e.target.value)}
                placeholder="50, 30, 70, 20, 40"
              />
              <Button onClick={handleBuildTree} variant="primary" className="w-full">
                Build Tree
              </Button>
            </div>
          </Card>

          <Card title="Traversal Type">
            <div className="space-y-4">
              <Select
                label="Select traversal"
                value={traversalType}
                onChange={(e) => setTraversalType(e.target.value)}
                options={traversalOptions}
              />
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                <div className="text-sm text-white font-medium">{currentInfo.name}</div>
                <div className="text-xs text-zinc-400 mt-1">{currentInfo.description}</div>
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
          <Card title="Tree Visualization">
            <div className="min-h-[300px]">
              {state && (
                <TreeDisplay
                  tree={state.tree}
                  highlightedNodes={state.highlightedNodes}
                  activeNode={state.activeNode}
                  queue={state.queue}
                />
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state && (
              <CodePanel
                code={template.code[traversalType]}
                currentLine={state.currentLine}
                done={state.done}
                title={currentInfo.name}
                description={currentInfo.order}
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

              <Card title="Traversal Comparison">
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
