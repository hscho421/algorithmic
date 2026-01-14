import Slider from '../ui/Slider';

export default function SpeedSlider({ speed, onChange }) {
  return (
    <Slider
      label={`Speed: ${speed}ms`}
      value={speed}
      onChange={(e) => onChange(Number(e.target.value))}
      min={100}
      max={2000}
      step={100}
    />
  );
}
