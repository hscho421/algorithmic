import Card from '../ui/Card';

export default function StatePanel({ variables, additionalInfo }) {
  return (
    <Card title="State">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {variables.map((v) => (
            <div key={v.name} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-zinc-400 text-sm">{v.name}</span>
                <span className="font-mono text-lg text-white font-semibold">{v.value}</span>
              </div>
              {v.desc && <span className="text-xs text-zinc-600">{v.desc}</span>}
            </div>
          ))}
        </div>

        {additionalInfo && (
          <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50 space-y-2">
            {additionalInfo.map((info, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">{info.label}</span>
                <span className="font-mono text-white">{info.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
