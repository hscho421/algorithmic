import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select, Button } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import TrieDisplay from '../../shared/visualization/TrieDisplay';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import {
  template,
  complexity,
  initialState,
  executeStep,
  getExplanation,
  getResult,
  buildTrieFromWords,
} from '../../../lib/algorithms/strings/trie';

export default function TrieVisualizer() {
  const [wordsInput, setWordsInput] = useState('cat, car, cart, dog, dot');
  const [wordInput, setWordInput] = useState('car');
  const [operation, setOperation] = useState('insert');
  const [currentTrie, setCurrentTrie] = useState(() => buildTrieFromWords(['cat', 'car', 'cart', 'dog', 'dot']));
  const skipNextResetRef = useRef(false);

  const parseWords = useCallback((input) => {
    return input
      .split(/[,\s]+/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);

  const handleBuildTrie = useCallback(() => {
    stop();
    const words = parseWords(wordsInput);
    const trie = buildTrieFromWords(words);
    setCurrentTrie(trie);
  }, [wordsInput, parseWords, stop]);

  const handleReset = useCallback(() => {
    stop();
    reset({ trie: currentTrie, operation, word: wordInput });
  }, [currentTrie, operation, wordInput, reset, stop]);

  useEffect(() => {
    handleBuildTrie();
  }, []);

  useEffect(() => {
    if (!currentTrie) return;
    if (skipNextResetRef.current) {
      skipNextResetRef.current = false;
      return;
    }
    handleReset();
  }, [currentTrie, operation, wordInput, handleReset]);

  useEffect(() => {
    if (state?.done && state?.operation === 'insert' && state?.trie) {
      skipNextResetRef.current = true;
      setCurrentTrie(state.trie);
    }
  }, [state?.done, state?.operation, state?.trie]);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const operationOptions = [
    { value: 'insert', label: 'Insert' },
    { value: 'search', label: 'Search Word' },
    { value: 'prefix', label: 'Starts With' },
  ];

  const variables = state
    ? [
        { name: 'word', value: state.word || '—', desc: 'current query' },
        { name: 'operation', value: state.operation, desc: 'mode' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
      ]
    : [];

  const result = state ? getResult(state) : null;
  const codeMap = {
    insert: template.code.insert,
    search: template.code.search,
    prefix: template.code.prefix,
  };

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
          <p><span className="text-zinc-900 dark:text-white font-medium">1. Prefix tree:</span> each edge is a character</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">2. Shared paths:</span> words share prefixes</p>
          <p><span className="text-zinc-900 dark:text-white font-medium">3. Fast lookup:</span> O(L) per word</p>
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
              Build Trie
            </div>
            <Input
              label="Initial words"
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              placeholder="cat, car, cart"
            />
            <Button onClick={handleBuildTrie} variant="primary" className="w-full">
              Build Trie
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Operation
            </div>
            <Select
              label="Mode"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              options={operationOptions}
            />
            <Input
              label={operation === 'prefix' ? 'Prefix' : 'Word'}
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
            />
          </div>
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
        <div className="min-h-[180px] w-full">
          {state && (
            <TrieDisplay
              nodes={state.nodes}
              edges={state.edges}
              highlightedNodes={state.highlightedNodes}
              activeNode={state.activeNode}
            />
          )}
        </div>
      }
      codeProps={
        state
          ? {
              code: codeMap[operation],
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
