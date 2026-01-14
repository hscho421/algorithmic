export default function Badge({ children, color = '#3b82f6' }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}
