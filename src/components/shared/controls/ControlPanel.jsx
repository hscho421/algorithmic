import PlaybackControls from './PlaybackControls';
import SpeedSlider from './SpeedSlider';

export default function ControlPanel({
  onStep,
  onBack,
  onRun,
  onReset,
  isRunning,
  canStep,
  canBack,
  speed,
  onSpeedChange,
}) {
  return (
    <div className="space-y-4">
      <PlaybackControls
        onStep={onStep}
        onBack={onBack}
        onRun={onRun}
        onReset={onReset}
        isRunning={isRunning}
        canStep={canStep}
        canBack={canBack}
      />
      <SpeedSlider speed={speed} onChange={onSpeedChange} />
    </div>
  );
}
