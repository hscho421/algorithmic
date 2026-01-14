import Button from '../ui/Button';

export default function PlaybackControls({
  onStep,
  onBack,
  onRun,
  onReset,
  isRunning,
  canStep,
  canBack,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onBack}
          disabled={!canBack || isRunning}
          variant="default"
        >
          ← Back
        </Button>
        <Button
          onClick={onStep}
          disabled={!canStep || isRunning}
          variant="success"
        >
          Step
        </Button>
        <Button
          onClick={onRun}
          disabled={!canStep && !isRunning}
          variant={isRunning ? 'danger' : 'warning'}
        >
          {isRunning ? 'Stop' : 'Run'}
        </Button>
      </div>
      <Button onClick={onReset} variant="primary" className="w-full">
        Reset
      </Button>
    </div>
  );
}
