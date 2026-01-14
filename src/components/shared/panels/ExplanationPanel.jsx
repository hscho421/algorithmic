import Card from '../ui/Card';

export default function ExplanationPanel({ explanation, status }) {
  const statusStyles = {
    running: 'border-blue-500/30 bg-blue-500/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
    failure: 'border-rose-500/30 bg-rose-500/5',
    default: 'border-zinc-700/50 bg-zinc-800/50',
  };

  const statusTextStyles = {
    running: 'text-blue-300',
    success: 'text-emerald-300',
    failure: 'text-rose-300',
    default: 'text-zinc-300',
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
