export default function ComparisonMetrics({ algorithms, visualizerStates }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Performance Metrics
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 dark:border-zinc-800">
            <tr className="bg-zinc-50 dark:bg-zinc-800/30">
              <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                Algorithm
              </th>
              <th className="px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                Steps
              </th>
              <th className="px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                Comparisons
              </th>
              <th className="px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                Time Complexity
              </th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                Space Complexity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {algorithms.map((algorithm) => {
              const state = visualizerStates[algorithm.id] || {};
              const status = state.isDone
                ? 'Completed'
                : state.stepCount > 0
                ? 'Running'
                : 'Ready';

              return (
                <tr key={algorithm.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                    {algorithm.name}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-700 dark:text-zinc-300">
                    {state.stepCount || 0}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-700 dark:text-zinc-300">
                    {state.comparisons || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${
                          status === 'Completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : status === 'Running'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }
                      `}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    {state.timeComplexity || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    {state.spaceComplexity || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
