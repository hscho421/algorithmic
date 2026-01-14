export default function Select({
  label,
  value,
  onChange,
  options,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
