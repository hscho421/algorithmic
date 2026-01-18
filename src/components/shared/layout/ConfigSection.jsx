import { useState } from 'react';

export default function ConfigSection({ title, children, open = true }) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 last:border-b-0">
      <button
        className="w-full flex justify-between items-center py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isOpen && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}
