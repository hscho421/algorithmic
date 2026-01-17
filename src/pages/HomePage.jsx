import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const QUICK_STARTS = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'See the mid pointer shrink the range in real time.',
    tone: 'from-sky-500/15 to-cyan-500/10',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    description: 'Watch arrays split and stitch themselves back.',
    tone: 'from-emerald-500/15 to-teal-500/10',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's",
    description: 'Trace shortest paths across a weighted graph.',
    tone: 'from-amber-500/15 to-orange-500/10',
  },
];

const PATHS = [
  {
    title: 'Starter Path',
    steps: ['Binary Search', 'Merge Sort', 'Binary Heap'],
    tone: 'bg-rose-500',
  },
  {
    title: 'Builder Path',
    steps: ['Trie', 'Union Find', 'Dijkstra'],
    tone: 'bg-blue-500',
  },
  {
    title: 'Explorer Path',
    steps: ['LCS', 'Knapsack', 'Topological Sort'],
    tone: 'bg-emerald-500',
  },
];

const CATEGORY_TONES = [
  'from-indigo-500/15 to-sky-500/10',
  'from-emerald-500/15 to-teal-500/10',
  'from-amber-500/15 to-orange-500/10',
  'from-rose-500/15 to-pink-500/10',
  'from-violet-500/15 to-purple-500/10',
  'from-cyan-500/15 to-blue-500/10',
  'from-lime-500/15 to-emerald-500/10',
  'from-slate-500/15 to-zinc-500/10',
  'from-fuchsia-500/15 to-rose-500/10',
];

export default function HomePage() {
  return (
    <div className="space-y-16 font-body">
      <section className="relative overflow-hidden rounded-[32px] border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 shadow-sm">
        <div className="absolute inset-0 hero-surface opacity-80" />
        <div className="hero-orb teal float-slow" style={{ width: '260px', height: '260px', top: '-120px', left: '-70px' }} />
        <div className="hero-orb amber float-slow" style={{ width: '200px', height: '200px', top: '60px', right: '-70px', animationDelay: '1.2s' }} />
        <div className="relative z-10 grid gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-400">Data Structures + Algorithms</p>
            <h1 className="text-4xl md:text-5xl font-display text-[var(--brand-ink)] dark:text-white">
              Make the invisible feel tangible.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-lg">
              Visualize algorithms as living systems. Step through each action, adjust inputs, and
              build real intuition instead of memorizing steps.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/category/searching"
                className="px-5 py-2.5 rounded-full bg-zinc-900 text-white font-semibold shadow-lg shadow-zinc-900/30 hover:-translate-y-0.5 transition-transform"
              >
                Start Visualizing
              </Link>
              <Link
                to="/roadmap"
                className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 text-zinc-700 dark:text-zinc-200 font-semibold hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                Follow a Path
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <span className="px-3 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60">Interactive</span>
              <span className="px-3 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60">Step-by-step</span>
              <span className="px-3 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60">Hands-on</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-400/30 blur-2xl" />
            <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/90 dark:bg-zinc-950/60 p-6 shadow-xl shadow-zinc-200/60 dark:shadow-black/40">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-zinc-400">
                Live Trace
                <span className="rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-300">
                  Step
                </span>
              </div>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-4">
                  <svg viewBox="0 0 320 200" className="w-full h-40">
                    <defs>
                      <linearGradient id="edgeGlow" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <g stroke="url(#edgeGlow)" strokeWidth="2" fill="none">
                      <path d="M40 150 L120 110 L200 140 L280 90" />
                      <path d="M40 150 L90 60 L200 140" />
                      <path d="M90 60 L170 40 L280 90" />
                      <path d="M120 110 L170 40" />
                      <path d="M120 110 L240 30" />
                      <path d="M200 140 L260 170" />
                    </g>
                    <g stroke="#0f172a" strokeOpacity="0.2">
                      <circle cx="40" cy="150" r="14" fill="#0f172a" />
                      <circle cx="90" cy="60" r="14" fill="#0f172a" />
                      <circle cx="120" cy="110" r="14" fill="#0f172a" />
                      <circle cx="170" cy="40" r="14" fill="#0f172a" />
                      <circle cx="200" cy="140" r="14" fill="#0f172a" />
                      <circle cx="240" cy="30" r="14" fill="#0f172a" />
                      <circle cx="260" cy="170" r="14" fill="#0f172a" />
                      <circle cx="280" cy="90" r="14" fill="#0f172a" />
                    </g>
                    <g>
                      <circle cx="40" cy="150" r="12" className="fill-zinc-900 dark:fill-white" />
                      <circle cx="90" cy="60" r="12" className="fill-zinc-700 dark:fill-zinc-200" />
                      <circle cx="120" cy="110" r="12" className="fill-emerald-500" />
                      <circle cx="170" cy="40" r="12" className="fill-zinc-700 dark:fill-zinc-200" />
                      <circle cx="200" cy="140" r="12" className="fill-sky-500" />
                      <circle cx="240" cy="30" r="12" className="fill-zinc-700 dark:fill-zinc-200" />
                      <circle cx="260" cy="170" r="12" className="fill-zinc-700 dark:fill-zinc-200" />
                      <circle cx="280" cy="90" r="12" className="fill-amber-500" />
                    </g>
                    <g fill="#0f172a" fontSize="10" fontFamily="Space Grotesk, sans-serif">
                      <text x="35" y="154">A</text>
                      <text x="85" y="64">B</text>
                      <text x="115" y="114">C</text>
                      <text x="165" y="44">D</text>
                      <text x="195" y="144">E</text>
                      <text x="235" y="34">F</text>
                      <text x="255" y="174">G</text>
                      <text x="275" y="94">H</text>
                    </g>
                  </svg>
                </div>
                <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-900/70 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Explanation</div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    Relax edges and update distances on the frontier.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Frontier expands to node E
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-display text-zinc-900 dark:text-white">Quick starts</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Jump into a visualizer and start stepping immediately.
            </p>
          </div>
          <div className="text-sm text-zinc-400 dark:text-zinc-500">Hand-picked favorites</div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {QUICK_STARTS.map((item) => (
            <Link
              key={item.id}
              to={`/visualize/${item.id}`}
              className="group relative overflow-hidden rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.tone} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Visualizer</div>
                <h3 className="mt-4 text-2xl font-display text-zinc-900 dark:text-white">{item.name}</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  Launch
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Learning paths</div>
            <h2 className="mt-3 text-2xl font-display text-zinc-900 dark:text-white">Follow a progression</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Structured sequences that build momentum from fundamentals to fluency.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PATHS.map((path) => (
              <div key={path.title} className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/70 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${path.tone}`} />
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{path.title}</span>
                </div>
                <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                  {path.steps.map((step) => (
                    <li key={step}>• {step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Practice loop</div>
            <h3 className="mt-4 text-2xl font-display">Stack → Step → Explain</h3>
            <p className="mt-2 text-sm text-zinc-300">
              Learn by iterating: visualize, narrate the state, and repeat with different inputs.
            </p>
          </div>
          <Link
            to="/roadmap"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            View the roadmap
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>

      <section id="categories" className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display text-zinc-900 dark:text-white">Explore by topic</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Pick a domain and dive into the visualizers.</p>
          </div>
          <div className="text-sm text-zinc-400 dark:text-zinc-500">9 categories and growing</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CATEGORIES.map((category, idx) => (
            <Link
              key={category.id}
              to={category.path}
              className="group relative overflow-hidden rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_TONES[idx % CATEGORY_TONES.length]} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Category</div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    Explore
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-lg font-semibold flex items-center justify-center shadow-md">
                    {category.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-zinc-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Explore {category.name.toLowerCase()} visualizations
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-zinc-400 dark:text-zinc-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Curated walkthroughs
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500">Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
