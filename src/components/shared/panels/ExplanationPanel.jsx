import Card from '../ui/Card';

export default function ExplanationPanel({ explanation, status }) {
  const statusStyles = {
    running: 'border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/5',
    success: 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5',
    failure: 'border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5',
    default: 'border-zinc-200 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/50',
  };

  const statusTextStyles = {
    running: 'text-blue-700 dark:text-blue-300',
    success: 'text-emerald-700 dark:text-emerald-300',
    failure: 'text-rose-700 dark:text-rose-300',
    default: 'text-zinc-700 dark:text-zinc-300',
  };

  const currentStatus = status || 'default';

  return (
    <Card title="Explanation">
      <div className={`rounded-lg p-4 border ${statusStyles[currentStatus]}`}>
        <p className={`text-sm ${statusTextStyles[currentStatus]}`}>
          {explanation || 'Click Step or Run to begin'}
        </p>
      </div>
    </Card>
  );
}
