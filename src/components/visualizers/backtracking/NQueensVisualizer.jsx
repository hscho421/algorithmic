import { useState, useCallback, useEffect, useRef } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input } from '../../shared/ui';
import { ExplanationPanel, ComplexityPanel } from '../../shared/panels';
import VisualizerLayout from '../../shared/layout/VisualizerLayout';
import useSavedInputs from '../../../hooks/useSavedInputs';
import SavedInputsPanel from '../../shared/controls/SavedInputsPanel';
import useProgress from '../../../hooks/useProgress';
import ProgressPanel from '../../shared/controls/ProgressPanel';
import ConfigSection from '../../shared/layout/ConfigSection';
import {
  template,
  initialState,
  executeStep,
  getExplanation,
  getResult,
  complexity,
} from '../../../lib/algorithms/backtracking/nQueens';

const MAX_N = 10;

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

function ChessBoard({ state }) {
  const { n = 4, currentRow, currentCol, checking = [], queens = [], conflict } = state;
  const containerRef = useRef(null);
  const containerSize = useContainerSize(containerRef);

  const isChecking = (row, col) => checking.some(c => c.row === row && c.col === col);
  const isQueen = (row, col) => queens.some(q => q.row === row && q.col === col);
  const isCurrent = (row, col) => row === currentRow && col === currentCol;
  const getConflictPathSet = useCallback(() => {
    if (!conflict || currentRow == null || currentCol == null) {
      return new Set();
    }

    const path = new Set();

    queens.forEach((queen) => {
      const sameCol = queen.col === currentCol;
      const sameDiag = Math.abs(queen.row - currentRow) === Math.abs(queen.col - currentCol);
      if (!sameCol && !sameDiag) return;

      const stepRow = Math.sign(queen.row - currentRow);
      const stepCol = Math.sign(queen.col - currentCol);
      let r = currentRow + stepRow;
      let c = currentCol + stepCol;

      while (r !== queen.row || c !== queen.col) {
        path.add(`${r}-${c}`);
        r += stepRow;
        c += stepCol;
      }
      path.add(`${queen.row}-${queen.col}`);
    });

    return path;
  }, [conflict, currentRow, currentCol, queens]);

  const conflictPathSet = getConflictPathSet();
  const isConflictPath = (row, col) => conflictPathSet.has(`${row}-${col}`);

  // Dynamic cell size based on container, with min/max bounds
  const availableSize = Math.min(containerSize.width || 400, 500);
  const cellSize = Math.max(32, Math.min(64, Math.floor(availableSize / n)));
  const boardSize = cellSize * n;

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full" ref={containerRef}>
      {/* Board */}
      <div className="rounded-[28px] p-3 bg-gradient-to-br from-zinc-100 via-white to-emerald-50/70 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/40 shadow-xl border border-zinc-200/70 dark:border-zinc-800">
        <div
          className="grid rounded-2xl overflow-hidden ring-1 ring-zinc-300/70 dark:ring-zinc-700"
          style={{
            gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${n}, ${cellSize}px)`,
            width: boardSize,
            height: boardSize,
          }}
        >
          {Array.from({ length: n }, (_, row) =>
            Array.from({ length: n }, (_, col) => {
              const isLight = (row + col) % 2 === 0;
              const isCellCurrent = isCurrent(row, col);
              const isCellChecking = isChecking(row, col);
              const isCellQueen = isQueen(row, col);
              const isCellConflict = isCellCurrent && conflict;

              let cellClass = isLight
                ? 'bg-zinc-50 dark:bg-zinc-900/60'
                : 'bg-emerald-50/70 dark:bg-emerald-900/25';

              if (isCellConflict) {
                cellClass = 'bg-rose-300/80 dark:bg-rose-500/35';
              } else if (conflict && isConflictPath(row, col)) {
                cellClass = 'bg-rose-200/70 dark:bg-rose-500/20';
              } else if (isCellCurrent) {
                cellClass = 'bg-amber-200/80 dark:bg-amber-500/30';
              } else if (isCellChecking) {
                cellClass = 'bg-emerald-200/70 dark:bg-emerald-500/25';
              }

              return (
                <div
                  key={`${row}-${col}`}
                  className={`relative flex items-center justify-center transition-colors duration-200 ${cellClass}`}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {isCellQueen && (
                    <span
                      className="text-zinc-900 dark:text-zinc-100"
                      style={{
                        fontSize: cellSize * 0.7,
                        filter: 'drop-shadow(2px 3px 3px rgba(0,0,0,0.25))',
                      }}
                    >
                      ♛
                    </span>
                  )}
                  {isCellCurrent && !isCellQueen && (
                    <span className="opacity-60 font-semibold text-zinc-900 dark:text-zinc-100" style={{ fontSize: cellSize * 0.5 }}>
                      ?
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Row/Column labels */}
      <div className="text-xs text-zinc-500 text-center">
        {n}×{n} board • {queens.length} queen{queens.length !== 1 ? 's' : ''} placed
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-xs font-bold">♛</div>
          <span className="text-zinc-400">Queen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-300/80 dark:bg-amber-500/30"></div>
          <span className="text-zinc-400">Trying</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-300/70 dark:bg-emerald-500/25"></div>
          <span className="text-zinc-400">Under attack</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-300/80 dark:bg-rose-500/35"></div>
          <span className="text-zinc-400">Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-200/70 dark:bg-rose-500/20"></div>
          <span className="text-zinc-400">Conflict path</span>
        </div>
      </div>
    </div>
  );
}

export default function NQueensVisualizer() {
  const [nInput, setNInput] = useState('4');
  const {
    items: savedInputs,
    isLoading: savedLoading,
    saveInput,
    deleteInput,
  } = useSavedInputs('n-queens');

  const { state, step, back, reset, canStep, canBack } = useVisualizerState(
    initialState,
    executeStep
  );

  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { nInput, stepIndex: state?.stepIndex ?? 0 };
  const {
    progress,
    isLoading: progressLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  } = useProgress('n-queens', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const n = Math.max(1, Math.min(MAX_N, parseInt(nInput, 10) || 4));
    reset({ n });
  }, [nInput, reset, stop]);

  // Reset when nInput changes
  useEffect(() => {
    handleReset();
  }, [nInput]);

  // Handle input change with validation
  const handleNInputChange = useCallback((e) => {
    const value = e.target.value;
    // Allow empty or valid numbers 1-MAX_N
    if (value === '' || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= MAX_N)) {
      setNInput(value);
    } else if (parseInt(value, 10) > MAX_N) {
      setNInput(String(MAX_N));
    }
  }, []);

  const handleBack = useCallback(() => {
    stop();
    back();
  }, [back, stop]);

  const handleRandomize = useCallback(() => {
    stop();
    // Random N between 4 and 8 (good range for visualization)
    const randomN = Math.floor(Math.random() * 5) + 4;
    setNInput(String(randomN));
  }, [stop]);

  const handleSaveInput = (name) => saveInput(name, { nInput });

  const handleLoadInput = (item) => {
    const payload = item.input_json || {};
    setNInput(payload.nInput ?? '4');
  };

  const handleResume = (payloadOverride) => {
    const payload = payloadOverride ?? progress?.last_state_json ?? {};
    setNInput(payload.nInput ?? '4');
  };

  const variables = state
    ? [
        { name: 'n', value: state.n, desc: 'board size' },
        { name: 'row', value: state.currentRow ?? '—', desc: 'current row' },
        { name: 'col', value: state.currentCol ?? '—', desc: 'current column' },
        { name: 'queens', value: state.queens?.length || 0, desc: 'queens placed' },
      ]
    : [];

  const additionalInfo = state
    ? [
        { label: 'Phase', value: state.phase || '—' },
        { label: 'Backtracks', value: state.backtracks || 0 },
      ]
    : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input
                label={`Board Size (1-${MAX_N})`}
                value={nInput}
                onChange={handleNInputChange}
                placeholder="4"
                type="number"
                min="1"
                max={MAX_N}
                className="flex-1"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                title="Random board size (4-8)"
              >
                🎲
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Try 4, 5, 6, 7, or 8. Larger boards take more steps. No solution for N=2,3.</p>
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
      visualizationContent={state && <ChessBoard state={state} />}
      visualizationMinHeight="400px"
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
              <p><span className="text-zinc-900 dark:text-white font-medium">Goal:</span> Place N queens so none attack each other</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">Constraint:</span> No two queens share row, column, or diagonal</p>
              <p><span className="text-zinc-900 dark:text-white font-medium">Strategy:</span> Try each column, backtrack on dead ends</p>
              <p className="text-xs text-zinc-500 mt-4">Classic backtracking problem! No solution for N=2,3.</p>
            </div>
          ),
        },
        ...(result
          ? [
              {
                id: 'result',
                label: 'Result',
                content: (
                  <div className={`rounded-lg p-4 ${result.success ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{result.success ? '✓' : '✗'}</span>
                      <div className="flex-1">
                        <div className={`font-semibold ${result.success ? 'text-emerald-900 dark:text-emerald-100' : 'text-rose-900 dark:text-rose-100'}`}>
                          {result.title}
                        </div>
                        <div className={`text-sm mt-1 ${result.success ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                          {result.message}
                        </div>
                        {Array.isArray(result.details) && result.details.length > 0 && (
                          <div className="text-xs mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                            {result.details.map((detail, idx) => (
                              <div key={idx}>• {detail}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              },
            ]
          : []),
      ]}
    />
  );
}
