import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select, Button } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import { TreeDisplay } from '../../shared/visualization';
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
  buildHeapFromArray,
} from '../../../lib/algorithms/heaps/minHeap';

const HeapArrayDisplay = ({ heap, highlights = [], phase }) => {
  if (!heap || heap.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-zinc-500 italic">
        Empty heap — add values to visualize
      </div>
    );
  }

  const getHighlightType = (index) => {
    const highlight = highlights.find((item) => item.index === index);
    return highlight?.type || 'default';
  };

  const isSwapPhase = phase === 'swap';
  const swapHighlights = isSwapPhase ? highlights.filter((item) => item.type === 'swap') : [];
  const swapIndices = swapHighlights.map((item) => item.index);
  const cellSize = 48;
  const cellGap = 8;
  const swapDistance = cellSize + cellGap;

  const getCellStyle = (type) => {
    switch (type) {
      case 'new':
        return 'bg-emerald-500 text-white border-emerald-300';
      case 'compare':
        return 'bg-amber-500 text-white border-amber-300';
      case 'swap':
        return 'bg-rose-500 text-white border-rose-300';
      case 'root':
      case 'current':
        return 'bg-blue-500 text-white border-blue-300';
      case 'settled':
        return 'bg-zinc-700 text-zinc-200 border-zinc-500';
      default:
        return 'bg-zinc-900 text-zinc-200 border-zinc-700';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {heap.map((value, index) => {
        const type = getHighlightType(index);
        const shouldSlide = isSwapPhase && swapIndices.length === 2 && swapIndices.includes(index);
        const otherIndex = shouldSlide ? swapIndices.find((idx) => idx !== index) : null;
        const offset = shouldSlide && otherIndex !== null
          ? (otherIndex - index) * swapDistance
          : 0;
        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg border font-mono text-sm transition-colors duration-300 ${getCellStyle(type)} ${shouldSlide ? 'heap-swap-slide' : ''}`}
              style={shouldSlide ? { '--swap-offset': `${offset}px` } : undefined}
            >
              {value}
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-mono">[{index}]</div>
          </div>
        );
      })}
    </div>
  );
};

export default function MinHeapVisualizer() {
  const [heapInput, setHeapInput] = useState('41, 29, 18, 14, 7, 18, 12');
  const [valueInput, setValueInput] = useState('23');
  const [operation, setOperation] = useState('insert');
  const [heapType, setHeapType] = useState('min');
  const [indexInput, setIndexInput] = useState('0');
  const [currentHeap, setCurrentHeap] = useState([]);
  const skipResetRef = useRef(false);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('min-heap');

  const parseArray = useCallback((input) => {
    const parts = input.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    return parts.map(Number).filter((n) => !isNaN(n));
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = {
    heapInput,
    valueInput,
    operation,
    heapType,
    indexInput,
    stepIndex: state?.stepIndex ?? 0,
  };
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'min-heap',
    progressPayload,
  );

  const handleBuildHeap = useCallback(() => {
    stop();
    const values = parseArray(heapInput);
    const heap = buildHeapFromArray(values, heapType);
    setCurrentHeap(heap);
  }, [heapInput, parseArray, stop, heapType]);

  const handleGenerateHeap = useCallback(() => {
    const size = Math.floor(Math.random() * 6) + 6;
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    const nextInput = values.join(', ');
    setHeapInput(nextInput);
    if (operation === 'insert' || operation === 'change-key') {
      setValueInput(String(Math.floor(Math.random() * 90) + 10));
    }
    if (operation === 'delete-index' || operation === 'change-key') {
      setIndexInput(String(Math.floor(Math.random() * values.length)));
    }
    const heap = buildHeapFromArray(values, heapType);
    setCurrentHeap(heap);
  }, [operation, heapType]);

  const handleSaveInput = (name) => {
    return saveInput(name, {
      heapInput,
      valueInput,
      operation,
      heapType,
      indexInput,
    });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setHeapInput(payload.heapInput ?? '');
    setValueInput(payload.valueInput ?? '');
    setOperation(payload.operation ?? 'insert');
    setHeapType(payload.heapType ?? 'min');
    setIndexInput(payload.indexInput ?? '0');
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setHeapInput(payload.heapInput ?? '');
    setValueInput(payload.valueInput ?? '');
    setOperation(payload.operation ?? 'insert');
    setHeapType(payload.heapType ?? 'min');
    setIndexInput(payload.indexInput ?? '0');
  };

  const handleReset = useCallback(() => {
    stop();
    const value = parseInt(valueInput, 10);
    const index = parseInt(indexInput, 10);
    const inputValues = parseArray(heapInput);
    reset({
      heap: currentHeap,
      operation,
      heapType,
      value: Number.isNaN(value) ? 0 : value,
      index: Number.isNaN(index) ? -1 : index,
      newValue: Number.isNaN(value) ? 0 : value,
      inputValues,
    });
  }, [currentHeap, operation, valueInput, indexInput, reset, stop, heapType, heapInput, parseArray]);

  useEffect(() => {
    handleBuildHeap();
  }, []);

  useEffect(() => {
    handleBuildHeap();
  }, [heapType]);

  useEffect(() => {
    if (skipResetRef.current) {
      skipResetRef.current = false;
      return;
    }
    if (currentHeap !== null) {
      handleReset();
    }
  }, [currentHeap, operation, valueInput, indexInput, heapType, heapInput]);

  useEffect(() => {
    if (state?.done && state?.heap) {
      skipResetRef.current = true;
      setCurrentHeap(state.heap);
    }
  }, [state?.done, state?.heap]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const operationOptions = [
    { value: 'insert', label: 'Insert' },
    { value: 'extract-root', label: heapType === 'min' ? 'Extract Min' : 'Extract Max' },
    { value: 'change-key', label: heapType === 'min' ? 'Decrease Key' : 'Increase Key' },
    { value: 'delete-index', label: 'Delete Index' },
    { value: 'heapify', label: 'Heapify (Build Heap)' },
  ];

  const heapTypeOptions = [
    { value: 'min', label: 'Min Heap' },
    { value: 'max', label: 'Max Heap' },
  ];

  const requiresValue = operation === 'insert' || operation === 'change-key';
  const requiresIndex = operation === 'delete-index' || operation === 'change-key';

  const variables = state
    ? [
        { name: 'type', value: state.heapType === 'max' ? 'Max' : 'Min', desc: 'heap type' },
        { name: 'size', value: state.heap?.length ?? 0, desc: 'heap size' },
        { name: 'i', value: state.currentIndex ?? '—', desc: 'active index' },
        { name: 'parent', value: state.parentIndex ?? '—', desc: 'parent index' },
        ...(state.index !== undefined && state.index !== null
          ? [{ name: 'index', value: state.index, desc: 'target index' }]
          : []),
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
      ]
    : [];

  const result = state ? getResult(state) : null;
  const heapLabel = heapType === 'min' ? 'Min Heap' : 'Max Heap';
  const codeMap = {
    insert: template.code.insert,
    'extract-root': template.code.extract,
    'change-key': template.code.changeKey,
    'delete-index': template.code.deleteIndex,
    heapify: template.code.heapify,
  };
  const currentCode = codeMap[operation] || template.code.insert;

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
          <p>
            Every parent value is {heapType === 'min' ? 'less than or equal to' : 'greater than or equal to'} its children.
          </p>
          <p>Complete tree: nodes fill each level from left to right.</p>
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
        <div className="space-y-5">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Build Heap
            </div>
            <Select
              label="Heap Type"
              value={heapType}
              onChange={(e) => setHeapType(e.target.value)}
              options={heapTypeOptions}
            />
            <div className="flex gap-2">
              <Input
                label="Initial values"
                value={heapInput}
                onChange={(e) => setHeapInput(e.target.value)}
                placeholder="41, 29, 18, 14"
                className="flex-1"
              />
              <Button
                onClick={handleGenerateHeap}
                className="self-end"
                title="Generate random heap input"
              >
                🎲
              </Button>
            </div>
            <Button onClick={handleBuildHeap} variant="primary" className="w-full">
              Build Heap
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Operation
            </div>
            <Select
              label="Operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              options={operationOptions}
            />

            {requiresIndex && (
              <Input
                label="Index"
                type="number"
                value={indexInput}
                onChange={(e) => setIndexInput(e.target.value)}
                min="0"
              />
            )}

            <Input
              label={operation === 'change-key' ? 'New value' : 'Value'}
              type="number"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              disabled={!requiresValue}
            />
          </div>

        <SavedInputsPanel
          items={savedInputs}
          isLoading={savedLoading}
          onSave={handleSaveInput}
          onLoad={handleLoadInput}
          onDelete={(item) => deleteInput(item.id)}
        />
        <ProgressPanel
          progress={progress}
          isLoading={progressLoading}
          onResume={handleResume}
          onClear={clearProgress}
        />
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
        <div className="w-full space-y-4">
          <div className="min-h-[300px]">
            {state && (
              <TreeDisplay
                tree={state.tree}
                highlightedNodes={state.highlightedNodes}
                activeNode={state.activeNode}
                animationKey={state.stepIndex}
              />
            )}
          </div>
          <div>
            {state && (
              <HeapArrayDisplay heap={state.heap} highlights={state.highlights} phase={state.phase} />
            )}
          </div>
        </div>
      }
      codeProps={
        state
          ? {
              code: currentCode,
              currentLine: state.currentLine,
              done: state.done,
              title: heapLabel,
              description: template.description,
            }
          : null
      }
      stateProps={state ? { variables, additionalInfo } : null}
      infoTabs={infoTabs}
    />
  );
}
