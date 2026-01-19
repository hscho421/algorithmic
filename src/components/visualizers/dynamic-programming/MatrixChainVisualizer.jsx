import { useState, useCallback, useEffect } from 'react';
import { useVisualizerState, usePlayback } from '../../../hooks';
import { Input } from '../../shared/ui';
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
} from '../../../lib/algorithms/dp/matrixChain';

function MatrixChainTable({ dp, n, highlightCell, lookingAt = [] }) {
  if (!dp || dp.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* DP Table */}
      <div className="overflow-auto">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300">i \ j</th>
              {Array.from({ length: n }, (_, j) => (
                <th key={j} className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 min-w-[48px]">{j}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium">{i}</td>
                {row.map((val, j) => {
                  const isHighlight = highlightCell?.row === i && highlightCell?.col === j;
                  const isLooking = lookingAt.some(c => c.row === i && c.col === j);
                  const isDiagonal = i === j;
                  const isAboveDiagonal = j > i;

                  return (
                    <td
                      key={j}
                      className={`p-2 border border-zinc-700 text-center min-w-[48px] transition-colors
                        ${isHighlight ? 'bg-emerald-500/30 text-emerald-300 font-bold' :
                          isLooking ? 'bg-amber-500/20 text-amber-300' :
                          isDiagonal ? 'bg-blue-500/10 text-blue-300' :
                          isAboveDiagonal ? (val === 0 ? 'text-zinc-600' : 'text-zinc-300') :
                          'bg-zinc-900/50 text-zinc-600'}`}
                    >
                      {isAboveDiagonal || isDiagonal ? (val === Infinity ? '∞' : val) : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500"></div>
          <span className="text-zinc-400">Computing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500"></div>
          <span className="text-zinc-400">Checking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/10 border border-blue-500"></div>
          <span className="text-zinc-400">Diagonal (cost=0)</span>
        </div>
      </div>
    </div>
  );
}

function MatrixDimensionsDisplay({ dimensions }) {
  if (!dimensions || dimensions.length < 2) return null;

  const matrices = [];
  for (let i = 0; i < dimensions.length - 1; i++) {
    matrices.push({
      name: `M${i}`,
      rows: dimensions[i],
      cols: dimensions[i + 1],
    });
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-zinc-500 text-center">Matrix Dimensions</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {matrices.map((m, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs">
              <span className="text-blue-400">{m.name}</span>
              <span className="text-zinc-500">: </span>
              <span className="text-zinc-300">{m.rows}×{m.cols}</span>
            </div>
            {idx < matrices.length - 1 && <span className="text-zinc-600">×</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatrixChainVisualizer() {
  const [dimensionsInput, setDimensionsInput] = useState('30, 35, 15, 5, 10, 20, 25');
  const { items: savedInputs, isLoading: savedLoading, saveInput, deleteInput } = useSavedInputs('matrix-chain');
  const { state, step, back, reset, canStep, canBack } = useVisualizerState(initialState, executeStep);
  const { isRunning, speed, setSpeed, toggle, stop } = usePlayback(step, canStep);
  const progressPayload = { dimensionsInput, stepIndex: state?.stepIndex ?? 0 };
  const { progress, isLoading: progressLoading, clearProgress, checkpoints, saveCheckpoint, deleteCheckpoint } = useProgress('matrix-chain', progressPayload);

  const handleReset = useCallback(() => {
    stop();
    const dims = dimensionsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    reset({ dimensions: dims.length >= 2 ? dims : [30, 35, 15, 5, 10, 20, 25] });
  }, [dimensionsInput, reset, stop]);

  useEffect(() => { handleReset(); }, [dimensionsInput]);

  const handleBack = useCallback(() => { stop(); back(); }, [back, stop]);

  const handleRandomize = useCallback(() => {
    const numMatrices = Math.floor(Math.random() * 4) + 3;
    const dims = [Math.floor(Math.random() * 40) + 5];
    for (let i = 0; i < numMatrices; i++) {
      dims.push(Math.floor(Math.random() * 40) + 5);
    }
    setDimensionsInput(dims.join(', '));
  }, []);

  const handleSaveInput = (name) => saveInput(name, { dimensionsInput });
  const handleLoadInput = (item) => { setDimensionsInput(item.input_json?.dimensionsInput ?? '30, 35, 15, 5, 10, 20, 25'); };
  const handleResume = (po) => handleLoadInput({ input_json: po ?? progress?.last_state_json ?? {} });

  const variables = state ? [
    { name: 'i', value: state.i ?? '—', desc: 'start index' },
    { name: 'j', value: state.j ?? '—', desc: 'end index' },
    { name: 'k', value: state.k ?? '—', desc: 'split point' },
    { name: 'len', value: state.length ?? '—', desc: 'chain length' },
  ] : [];

  const result = state ? getResult(state) : null;

  return (
    <VisualizerLayout
      configurationContent={
        <div className="space-y-4">
          <ConfigSection title="Input">
            <div className="flex gap-2 items-end">
              <Input label="Dimensions (comma-separated)" value={dimensionsInput} onChange={(e) => setDimensionsInput(e.target.value)} placeholder="30, 35, 15, 5, 10, 20, 25" className="flex-1" />
              <button onClick={handleRandomize} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Random">🎲</button>
            </div>
            <p className="text-xs text-zinc-500">n+1 dimensions for n matrices. E.g., [30,35,15] means M0(30×35) × M1(35×15)</p>
          </ConfigSection>
          <ConfigSection title="History" open={false}>
            <SavedInputsPanel items={savedInputs} isLoading={savedLoading} onSave={handleSaveInput} onLoad={handleLoadInput} onDelete={(item) => deleteInput(item.id)} />
          </ConfigSection>
          <ConfigSection title="Session" open={false}>
            <ProgressPanel progress={progress} isLoading={progressLoading} onResume={handleResume} onClear={clearProgress} checkpoints={checkpoints} onSaveCheckpoint={saveCheckpoint} onLoadCheckpoint={handleResume} onDeleteCheckpoint={deleteCheckpoint} />
          </ConfigSection>
        </div>
      }
      controlProps={{ onStep: step, onBack: handleBack, onRun: toggle, onReset: handleReset, isRunning, canStep, canBack, speed, onSpeedChange: setSpeed }}
      visualizationContent={
        <div className="space-y-6">
          {state && <MatrixDimensionsDisplay dimensions={state.dims} />}
          {state && <MatrixChainTable dp={state.dp} n={state.n} highlightCell={state.highlightCell} lookingAt={state.lookingAt} />}
        </div>
      }
      codeProps={state ? { code: template.code, currentLine: state.currentLine, done: state.done, title: template.name, description: template.description } : null}
      stateProps={state ? { variables, additionalInfo: [{ label: 'Phase', value: state.phase || '—' }, { label: 'Min Cost', value: state.dp?.[0]?.[state.n - 1] ?? '—' }] } : null}
      infoTabs={[
        ...(state ? [{ id: 'explanation', label: 'Explanation', content: <ExplanationPanel explanation={getExplanation(state)} status={state.done ? 'success' : 'running'} /> }] : []),
        { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={complexity} /> },
        { id: 'guide', label: 'Guide', content: <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400"><p><span className="font-medium text-zinc-900 dark:text-white">Matrix Chain:</span> Find optimal parenthesization</p><p><span className="font-medium text-zinc-900 dark:text-white">dp[i][j]:</span> Min cost to multiply matrices i to j</p><p><span className="font-medium text-zinc-900 dark:text-white">Recurrence:</span> Try all split points k, pick minimum</p></div> },
        ...(result ? [{ id: 'result', label: 'Result', content: <ResultBanner success={result.success} title={result.title} message={result.message} details={result.details} /> }] : []),
      ]}
    />
  );
}
