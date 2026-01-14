export default function Checkbox({
  label,
  checked,
  onChange,
  className = '',
}) {
  return (
    <label className={`flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600 text-blue-500 focus:ring-blue-500/50"
      />
      {label}
    </label>
  );
}
