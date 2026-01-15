import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Card, Input, Select, Button } from '../../shared/ui';
import { ControlPanel } from '../../shared/controls';
import { CodePanel, StatePanel, ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import TrieDisplay from '../../shared/visualization/TrieDisplay';
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card title="Build Trie">
            <div className="space-y-4">
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
          </Card>

          <Card title="Operation">
            <div className="space-y-4">
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
          <Card title="Trie Visualization">
            <div className="min-h-[180px]">
              {state && (
                <TrieDisplay
                  nodes={state.nodes}
                  edges={state.edges}
                  highlightedNodes={state.highlightedNodes}
                  activeNode={state.activeNode}
                />
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state && (
              <CodePanel
                code={codeMap[operation]}
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

              <Card title="Trie Tips">
                <div className="space-y-2 text-sm text-zinc-400">
                  <p><span className="text-zinc-900 dark:text-white font-medium">1. Prefix tree:</span> each edge is a character</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">2. Shared paths:</span> words share prefixes</p>
                  <p><span className="text-zinc-900 dark:text-white font-medium">3. Fast lookup:</span> O(L) per word</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
