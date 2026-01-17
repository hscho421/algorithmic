import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select, Button } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
import TrieDisplay from '../../shared/visualization/TrieDisplay';
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
  buildTrieFromWords,
} from '../../../lib/algorithms/strings/trie';

const SAMPLE_WORDS = [
  'cat',
  'car',
  'cart',
  'dog',
  'dot',
  'dove',
  'door',
  'apple',
  'ape',
  'apex',
  'bat',
  'bath',
  'batch',
  'ball',
  'bell',
  'bear',
  'bead',
  'book',
  'code',
  'coder',
  'cope',
  'cope',
  'dear',
  'deal',
  'deer',
  'doll',
];

export default function TrieVisualizer() {
  const [wordsInput, setWordsInput] = useState('cat, car, cart, dog, dot');
  const [wordInput, setWordInput] = useState('car');
  const [operation, setOperation] = useState('insert');
  const [currentTrie, setCurrentTrie] = useState(() => buildTrieFromWords(['cat', 'car', 'cart', 'dog', 'dot']));
  const skipNextResetRef = useRef(false);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('trie');

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
  const progressPayload = { wordsInput, wordInput, operation, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress } = useProgress(
    'trie',
    progressPayload,
  );

  const handleBuildTrie = useCallback(() => {
    stop();
    const words = parseWords(wordsInput);
    const trie = buildTrieFromWords(words);
    setCurrentTrie(trie);
  }, [wordsInput, parseWords, stop]);

  const handleRandomWords = useCallback(() => {
    stop();
    const pool = [...SAMPLE_WORDS];
    const count = Math.max(4, Math.min(8, Math.floor(Math.random() * 5) + 4));
    const words = [];
    while (words.length < count && pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      words.push(pool.splice(index, 1)[0]);
    }
    const nextInput = words.join(', ');
    setWordsInput(nextInput);
    setWordInput(words[0] || '');
    setCurrentTrie(buildTrieFromWords(words));
  }, [stop]);

  const handleRandomWord = useCallback(() => {
    const pool = parseWords(wordsInput);
    if (pool.length === 0) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const length = Math.floor(Math.random() * 4) + 3;
      let randomWord = '';
      for (let i = 0; i < length; i += 1) {
        randomWord += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      setWordInput(randomWord);
      return;
    }
    const word = pool[Math.floor(Math.random() * pool.length)];
    setWordInput(word);
  }, [parseWords, wordsInput]);

  const handleSaveInput = (name) => {
    return saveInput(name, { wordsInput, wordInput, operation });
  };

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setWordsInput(payload.wordsInput ?? '');
    setWordInput(payload.wordInput ?? '');
    setOperation(payload.operation ?? 'insert');
  };

  const handleResume = () => {
    const payload = progress?.last_state_json || {};
    setWordsInput(payload.wordsInput ?? '');
    setWordInput(payload.wordInput ?? '');
    setOperation(payload.operation ?? 'insert');
  };

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
            <div className="flex gap-2">
              <Button onClick={handleBuildTrie} variant="primary" className="flex-1">
                Build Trie
              </Button>
              <Button onClick={handleRandomWords} variant="default" className="flex-1">
                Random Words
              </Button>
            </div>
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
            <Button onClick={handleRandomWord} variant="default" size="sm" className="w-full">
              Random Word
            </Button>
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
        <div className="w-full h-full min-h-[240px]">
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
