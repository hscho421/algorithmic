export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-zinc-400 mb-1.5">{label}</label>
      )}
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
