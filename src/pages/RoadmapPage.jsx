import { Link } from 'react-router-dom';

const PHASES = [
  {
    title: 'Phase 1 — Polish + Trust',
    timeline: '0–2 weeks',
    items: [
      'Visual consistency and dark/light parity',
      'Playback polish, keyboard controls, saved inputs',
      'SEO basics for visualizer pages',
    ],
  },
  {
    title: 'Phase 2 — Learning Product',
    timeline: '3–6 weeks',
    items: [
      'Guided lessons for core topics',
      'Predict-the-next-step checkpoints',
      'Local progress tracking and bookmarks',
    ],
  },
  {
    title: 'Phase 3 — Monetizable MVP',
    timeline: '6–10 weeks',
    items: [
      'Accounts + authentication',
      'Pro tier with advanced visualizers',
      'Payments + pricing page',
    ],
  },
  {
    title: 'Phase 4 — Interview Prep Expansion',
    timeline: '10–16 weeks',
    items: [
      'Interview question visualizers',
      'Curated prep paths and streaks',
      'Weekly challenges',
    ],
  },
  {
    title: 'Phase 5 — Institutional Sales',
    timeline: '16+ weeks',
    items: [
      'Classroom dashboards',
      'Team analytics and reports',
      'Licensing + edu discounts',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 px-6 py-10 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Roadmap</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">Algorithmic roadmap</h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            A transparent look at what we are building for learners and interview prep.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50/80 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Updated monthly
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PHASES.map((phase) => (
          <div
            key={phase.title}
            className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display text-zinc-900 dark:text-white">{phase.title}</h2>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{phase.timeline}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/60 p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          Have ideas? Send them our way.
        </p>
        <Link
          to="/"
          className="inline-flex mt-4 items-center justify-center rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Back to visualizers
        </Link>
      </div>
    </div>
  );
}
