export default function StatePanel({ variables, additionalInfo, compact = false }) {
  return (
    <div className="space-y-3">
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-3 xl:grid-cols-4'} gap-2`}>
        {variables.map((v) => (
          <div key={v.name} className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-zinc-600 dark:text-zinc-400 text-xs">{v.name}</span>
              <span className="font-mono text-base text-zinc-900 dark:text-white font-semibold">{v.value}</span>
            </div>
            {v.desc && <span className="text-[10px] text-zinc-500 dark:text-zinc-600 leading-tight">{v.desc}</span>}
          </div>
        ))}
      </div>

      {additionalInfo && additionalInfo.length > 0 && (
        <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700/50 space-y-1">
          {additionalInfo.map((info, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400 text-xs">{info.label}</span>
              <span className="font-mono text-zinc-900 dark:text-white text-sm">{info.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
