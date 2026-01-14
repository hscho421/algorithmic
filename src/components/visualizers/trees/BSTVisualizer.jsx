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
} from '../../../lib/algorithms/trees/bst';

export default function BSTVisualizer() {
  const [treeInput, setTreeInput] = useState('50, 30, 70, 20, 40, 60, 80');
  const [valueInput, setValueInput] = useState('25');
  const [operation, setOperation] = useState('insert');
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

          <Card title="Operation">
            <div className="space-y-4">
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
                  status={state.done ? (result?.success ? 'success' : 'failure') : 'running'}
                />
              )}

              <ComplexityPanel complexity={complexity} />

              <Card title="BST Property">
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>For every node:</p>
                  <p><span className="text-blue-400 font-medium">Left subtree</span> contains only values <span className="text-white">less than</span> the node</p>
                  <p><span className="text-rose-400 font-medium">Right subtree</span> contains only values <span className="text-white">greater than</span> the node</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
