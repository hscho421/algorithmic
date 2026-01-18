import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input, Select } from '../../shared/ui';
import { ExplanationPanel, ResultBanner, ComplexityPanel } from '../../shared/panels';
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
} from '../../../lib/algorithms/backtracking/sudoku';

const SUDOKU_PRESETS = {
  easy: {
    name: 'Easy',
    puzzle: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  },
  medium: {
    name: 'Medium',
    puzzle: '600120384008459072000006005000264030070080006940003000310000050089700000502000190',
  },
  hard: {
    name: 'Hard',
    puzzle: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
  },
};

const useContainerSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};

function SudokuBoard({ state }) {
  const {
    board = Array.from({ length: 9 }, () => Array(9).fill(0)),
    givens = [],
    currentRow,
    currentCol,
    candidate,
    conflictCells = [],
  } = state;
  const containerRef = useRef(null);
  const containerSize = useContainerSize(containerRef);

  const givensSet = new Set(givens);
  const conflictSet = new Set(conflictCells.map((cell) => `${cell.row}-${cell.col}`));

  const availableSize = Math.min(containerSize.width || 420, 540);
  const cellSize = Math.max(32, Math.min(56, Math.floor(availableSize / 9)));
  const boardSize = cellSize * 9;

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full" ref={containerRef}>
      <div className="rounded-[28px] p-3 bg-gradient-to-br from-zinc-100 via-white to-emerald-50/70 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/40 shadow-xl border border-zinc-200/70 dark:border-zinc-800">
        <div
          className="grid rounded-2xl overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(9, ${cellSize}px)`,
            gridTemplateRows: `repeat(9, ${cellSize}px)`,
            width: boardSize,
            height: boardSize,
          }}
        >
          {board.map((rowData, row) =>
            rowData.map((value, col) => {
              const key = `${row}-${col}`;
              const isGiven = givensSet.has(key);
              const isCurrent = row === currentRow && col === currentCol;
              const isConflict = conflictSet.has(key);

              let cellClass = 'bg-white dark:bg-zinc-900/70';
              if ((row + col) % 2 === 1) {
                cellClass = 'bg-zinc-50 dark:bg-zinc-800/50';
              }
              if (isConflict) {
                cellClass = 'bg-rose-200/80 dark:bg-rose-500/25';
              } else if (isCurrent) {
                cellClass = 'bg-amber-200/80 dark:bg-amber-500/25';
              }

              return (
                <div
                  key={key}
                  className={`flex items-center justify-center text-lg ${cellClass} border border-zinc-300/80 dark:border-zinc-700/80`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderTopWidth: row % 3 === 0 ? 2 : 1,
                    borderLeftWidth: col % 3 === 0 ? 2 : 1,
                    borderRightWidth: col === 8 ? 2 : 1,
                    borderBottomWidth: row === 8 ? 2 : 1,
                  }}
                >
                  {value !== 0 && (
                    <span
                      className={isGiven ? 'font-bold text-zinc-900 dark:text-zinc-100' : 'text-emerald-700 dark:text-emerald-200'}
                      style={{ fontSize: cellSize * 0.45 }}
                    >
                      {value}
                    </span>
                  )}
                  {value === 0 && isCurrent && candidate && (
                    <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: cellSize * 0.35 }}>
                      {candidate}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="text-xs text-zinc-500 text-center">
        {candidate ? `Trying ${candidate}` : 'Backtracking search'} • {givens.length} givens
      </div>

      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-300/80 dark:bg-amber-500/30"></div>
          <span className="text-zinc-400">Current cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-200/80 dark:bg-rose-500/25"></div>
          <span className="text-zinc-400">Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-200/70 dark:bg-emerald-500/20"></div>
          <span className="text-zinc-400">Placed value</span>
        </div>
      </div>
    </div>
  );
}

export default function SudokuVisualizer() {
  const [preset, setPreset] = useState('easy');
  const [puzzleInput, setPuzzleInput] = useState(SUDOKU_PRESETS.easy.puzzle);
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('sudoku');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { preset, puzzleInput, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('sudoku', progressPayload);

  useEffect(() => {
    if (SUDOKU_PRESETS[preset]) {
      setPuzzleInput(SUDOKU_PRESETS[preset].puzzle);
    }
  }, [preset]);

  const handleReset = useCallback(() => {
    stop();
    reset({ puzzleInput });
  }, [puzzleInput, reset, stop]);

  useEffect(() => {
    handleReset();
  }, [puzzleInput]);

  const handlePuzzleChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '').slice(0, 81);
    setPuzzleInput(value);
    setPreset('custom');
  }, []);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    const presetKeys = Object.keys(SUDOKU_PRESETS);
    const randomKey = presetKeys[Math.floor(Math.random() * presetKeys.length)];
    setPreset(randomKey);
  }, [stop]);

  const handleSaveInput = (name) => saveInput(name, { preset, puzzleInput });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setPreset(payload.preset ?? 'custom');
    setPuzzleInput(payload.puzzleInput ?? SUDOKU_PRESETS.easy.puzzle);
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setPreset(payload.preset ?? 'custom');
    setPuzzleInput(payload.puzzleInput ?? SUDOKU_PRESETS.easy.puzzle);
  };

  const filledCount = state?.board
    ? state.board.flat().filter((value) => value !== 0).length
    : 0;

  const variables = state
    ? [
        { name: 'filled', value: filledCount, desc: 'cells filled' },
        { name: 'backtracks', value: state.backtracks || 0, desc: 'backtracks' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Step', value: `${state.stepIndex + 1} / ${state.steps?.length || 0}` },
        { label: 'Phase', value: state.phase || '—' },
      ]
    : [];

  const result = state ? getResult(state) : null;

  const presetOptions = [
    ...Object.entries(SUDOKU_PRESETS).map(([key, item]) => ({
      value: key,
      label: item.name,
    })),
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Puzzle">
            <div className="flex gap-2 items-end">
              <Select
                label="Preset"
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                options={presetOptions}
                className="flex-1"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                title="Random preset"
              >
                🎲
              </button>
            </div>
            <Input
              label="Puzzle (81 chars, use 0 or . for empty)"
              value={puzzleInput}
              onChange={handlePuzzleChange}
              placeholder="Enter puzzle string"
            />
            <p className="text-xs text-zinc-500 mt-2">
              Example: 530070000600195000098000060800060003400803001700020006060000280000419005000080079
            </p>
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
      visualizationContent={state && <SudokuBoard state={state} />}
      visualizationMinHeight="420px"
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
      infoTabs={[
        ...(state
          ? [
              {
                id: 'explanation',
                label: 'Explanation',
                content: (
                  <ExplanationPanel
                    explanation={getExplanation(state)}
                    status={state.done ? (state.solved ? 'success' : 'failure') : 'running'}
                  />
                ),
              },
            ]
          : []),
        {
          id: 'complexity',
          label: 'Complexity',
          content: <ComplexityPanel complexity={complexity} />,
        },
        {
          id: 'guide',
          label: 'Guide',
          content: (
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p><span className="text-zinc-900 dark:text-white font-medium">Rule:</span> Each row, column, and 3×3 box must contain 1–9</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">Search:</span> Try numbers 1–9 in each empty cell</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">Backtrack:</span> Undo when a choice leads to a dead end</p>
            </div>
          ),
        },
        ...(result
          ? [
              {
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
              },
            ]
          : []),
      ]}
    />
  );
}
