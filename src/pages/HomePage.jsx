import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const QUICK_STARTS = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'See the mid pointer shrink the range in real time.',
    tone: 'from-sky-500/20 to-cyan-500/20',
    icon: (
      <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    description: 'Watch arrays split and stitch themselves back.',
    tone: 'from-emerald-500/20 to-teal-500/20',
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's",
    description: 'Trace shortest paths across a weighted graph.',
    tone: 'from-amber-500/20 to-orange-500/20',
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const PATHS = [
  {
    title: 'Starter Path',
    description: 'Essential algorithms for every developer.',
    steps: ['Binary Search', 'Merge Sort', 'Binary Heap'],
    tone: 'bg-rose-500',
    border: 'border-rose-200 dark:border-rose-900',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
  {
    title: 'Builder Path',
    description: 'Data structures that power complex systems.',
    steps: ['Trie', 'Union Find', 'Dijkstra'],
    tone: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-900',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Explorer Path',
    description: 'Advanced techniques for optimization.',
    steps: ['LCS', 'Knapsack', 'Topological Sort'],
    tone: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-900',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
];

const CATEGORY_TONES = [
  'from-indigo-500/10 via-indigo-500/5 to-transparent',
  'from-emerald-500/10 via-emerald-500/5 to-transparent',
  'from-amber-500/10 via-amber-500/5 to-transparent',
  'from-rose-500/10 via-rose-500/5 to-transparent',
  'from-violet-500/10 via-violet-500/5 to-transparent',
  'from-cyan-500/10 via-cyan-500/5 to-transparent',
  'from-lime-500/10 via-lime-500/5 to-transparent',
  'from-slate-500/10 via-slate-500/5 to-transparent',
  'from-fuchsia-500/10 via-fuchsia-500/5 to-transparent',
];

export default function HomePage() {
  return (
    <div className="space-y-24 font-body pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 hero-surface opacity-50 dark:opacity-20" />
        
        {/* Decorative Orbs */}
        <div className="hero-orb teal float-slow" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', opacity: 0.4 }} />
        <div className="hero-orb amber float-slow" style={{ width: '300px', height: '300px', top: '20%', right: '-50px', animationDelay: '2s', opacity: 0.3 }} />
        
        <div className="relative z-10 grid lg:grid-cols-[1fr_1fr] gap-12 px-8 py-16 md:px-12 md:py-20 items-center">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Interactive Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Master algorithms <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">
                visually.
              </span>
            </h1>
            
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              Don't just memorize code. Watch algorithms execute step-by-step, inspect their state, and build true intuition.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/category/searching"
                className="px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg shadow-xl shadow-zinc-900/20 hover:scale-105 transition-transform"
              >
                Start Visualizing
              </Link>
              <Link
                to="/roadmap"
                className="px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 font-semibold backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              >
                View Roadmap
              </Link>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Step-by-step execution</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Real-time state</span>
              </div>
            </div>
          </div>

          {/* Hero Visualization Card */}
          <div className="relative hidden lg:block perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-[32px] blur-2xl opacity-20 animate-pulse" />
            <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[24px] border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl p-6 transform rotate-y-12 hover:rotate-0 transition-transform duration-700 ease-out">
              {/* Fake Browser Header */}
              <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-mono text-zinc-400">dijkstra_visualizer.js</div>
              </div>
              
              {/* Visualization Mockup */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex gap-2">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                         {i}
                       </div>
                     ))}
                   </div>
                   <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                     Running
                   </div>
                </div>
                
                <div className="h-48 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 relative overflow-hidden">
                   {/* Graph SVG */}
                   <svg viewBox="0 0 320 160" className="w-full h-full">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                        </marker>
                      </defs>
                      {/* Edges */}
                      <line x1="40" y1="80" x2="120" y2="40" stroke="#e2e8f0" strokeWidth="2" />
                      <line x1="40" y1="80" x2="120" y2="120" stroke="#e2e8f0" strokeWidth="2" />
                      <line x1="120" y1="40" x2="200" y2="80" stroke="#e2e8f0" strokeWidth="2" />
                      <line x1="120" y1="120" x2="200" y2="80" stroke="#e2e8f0" strokeWidth="2" />
                      <line x1="200" y1="80" x2="280" y2="80" stroke="#e2e8f0" strokeWidth="2" />
                      
                      {/* Active Path */}
                      <path d="M40 80 L120 40 L200 80" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 5" className="animate-[dash_20s_linear_infinite]" />

                      {/* Nodes */}
                      <circle cx="40" cy="80" r="16" fill="#3b82f6" className="drop-shadow-md" />
                      <text x="40" y="84" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">A</text>
                      
                      <circle cx="120" cy="40" r="16" fill="#10b981" className="drop-shadow-md" />
                      <text x="120" y="44" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">B</text>
                      
                      <circle cx="120" cy="120" r="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                      <text x="120" y="124" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">C</text>
                      
                      <circle cx="200" cy="80" r="16" fill="#f59e0b" className="drop-shadow-md" />
                      <text x="200" y="84" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">D</text>
                      
                      <circle cx="280" cy="80" r="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                      <text x="280" y="84" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">E</text>
                   </svg>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                  <div className="h-2 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Starts */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white">Quick Starts</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Jump straight into the most popular algorithms.</p>
          </div>
          <Link to="/category/sorting" className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            View all algorithms →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {QUICK_STARTS.map((item) => (
            <Link
              key={item.id}
              to={`/visualize/${item.id}`}
              className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.tone} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  Launch Visualizer <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white">Learning Paths</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Structured sequences to build your knowledge base.</p>
          </div>
          
          <div className="space-y-4">
            {PATHS.map((path) => (
              <div key={path.title} className={`group relative p-6 rounded-2xl border ${path.border} ${path.bg} hover:shadow-md transition-all`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${path.tone} flex items-center justify-center text-white font-bold shrink-0`}>
                      {path.title[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white">{path.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{path.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {path.steps.map((step, i) => (
                      <div key={step} className="flex items-center">
                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/60 dark:bg-black/20 border border-black/5 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                          {step}
                        </span>
                        {i < path.steps.length - 1 && (
                          <div className="w-4 h-px bg-zinc-300 dark:bg-zinc-600 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-6">Pro Tip</div>
            <h3 className="text-3xl font-display font-bold mb-4">The Feynman Technique</h3>
            <p className="opacity-80 leading-relaxed">
              The best way to learn an algorithm is to explain it. Use the "Step" controls to pause execution and predict the next state before it happens.
            </p>
          </div>
          
          <Link
            to="/roadmap"
            className="relative z-10 inline-flex items-center gap-2 mt-8 font-bold hover:gap-3 transition-all"
          >
            Explore the full roadmap <span>→</span>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white">Explore by Category</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg">
            Dive deep into specific domains of computer science.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, idx) => (
            <Link
              key={category.id}
              to={category.path}
              className="group relative h-64 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_TONES[idx % CATEGORY_TONES.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl mb-4 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors shadow-sm">
                  {/* Simple icon mapping based on first letter or index */}
                  {idx % 3 === 0 ? '🔍' : idx % 3 === 1 ? '🌳' : '🕸️'}
                </div>
                <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white">
                  {category.name}
                </h3>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-6 group-hover:border-zinc-200/50 dark:group-hover:border-zinc-700/50 transition-colors">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                  View Collection
                </span>
                <span className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
