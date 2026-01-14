import Card from '../ui/Card';

export default function ComplexityPanel({ complexity }) {
  const { time, space, bestCase, worstCase, averageCase } = complexity;

  return (
    <Card title="Complexity Analysis">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700/50">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Time</div>
            <div className="font-mono text-emerald-600 dark:text-emerald-400">{time}</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700/50">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Space</div>
            <div className="font-mono text-blue-600 dark:text-blue-400">{space}</div>
          </div>
        </div>

        {(bestCase || worstCase || averageCase) && (
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            {bestCase && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Best Case</span>
                <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">{bestCase}</span>
              </div>
            )}
            {averageCase && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Average Case</span>
                <span className="font-mono text-sm text-amber-600 dark:text-amber-400">{averageCase}</span>
              </div>
            )}
            {worstCase && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Worst Case</span>
                <span className="font-mono text-sm text-rose-600 dark:text-rose-400">{worstCase}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
