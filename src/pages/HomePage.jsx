import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CATEGORIES } from '../constants';

const MotionLink = motion(Link);

const QUICK_STARTS = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'See the mid pointer shrink the range in real time.',
    color: 'bg-sky-500',
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
    color: 'bg-emerald-500',
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
    color: 'bg-amber-500',
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
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    title: 'Builder Path',
    description: 'Data structures that power complex systems.',
    steps: ['Trie', 'Union Find', 'Dijkstra'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Explorer Path',
    description: 'Advanced techniques for optimization.',
    steps: ['LCS', 'Knapsack', 'Topological Sort'],
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const CATEGORY_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-slate-500',
  'bg-fuchsia-500',
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const stagger = {
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };
  const rise = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  const cardRise = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { type: 'spring', stiffness: 240, damping: 26 },
    },
  };
  const hoverLift = shouldReduceMotion ? undefined : { y: -6 };

  return (
    <motion.div
      className="space-y-32 font-body pb-20"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.section className="relative pt-10 lg:pt-20" variants={rise}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div className="space-y-8" variants={rise}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-sm font-medium text-zinc-600 dark:text-zinc-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Interactive Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Master algorithms <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
                visually.
              </span>
            </h1>
            
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              Don't just memorize code. Watch algorithms execute step-by-step, inspect their state, and build true intuition.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <MotionLink
                to="/category/searching"
                className="px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg shadow-xl shadow-zinc-900/20 hover:scale-105 transition-transform"
              >
                Start Visualizing
              </MotionLink>
              <MotionLink
                to="/roadmap"
                className="px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 font-semibold backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              >
                View Roadmap
              </MotionLink>
            </div>
          </motion.div>

          {/* Hero Visualization Card */}
          <motion.div className="relative hidden lg:block" variants={rise}>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-[32px] blur-3xl opacity-20 animate-smooth-pulse" />
            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl p-6">
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
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex gap-2">
                     {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                         {i}
                      </div>
                     ))}
                   </div>
                   <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                     Running
                   </div>
                </div>
                
                <div className="h-64 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 relative overflow-hidden flex items-center justify-center">
                   {/* Abstract Graph Animation */}
                   <svg viewBox="0 0 320 160" className="w-full h-full">
                      <path
                        d="M40 80 L120 40 L200 80 L280 80"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="2"
                      />
                      <circle cx="40" cy="80" r="8" fill="#3b82f6" />
                      <circle cx="120" cy="40" r="8" fill="#10b981" />
                      <circle cx="200" cy="80" r="8" fill="#f59e0b" />
                      <circle cx="280" cy="80" r="8" fill="#6366f1" />
                   </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Starts */}
      <motion.section variants={rise}>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white">Quick Starts</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Jump straight into the most popular algorithms.</p>
          </div>
          <Link to="/category/sorting" className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            View all algorithms →
          </Link>
        </div>
        
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {QUICK_STARTS.map((item) => (
            <motion.div key={item.id} variants={cardRise}>
              <MotionLink
                to={`/visualize/${item.id}`}
                className="group block h-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-shadow duration-300 hover:shadow-xl transform-gpu will-change-transform"
                whileHover={hoverLift}
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6 shadow-lg shadow-zinc-200/50 dark:shadow-none`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  Launch Visualizer <span className="ml-2">→</span>
                </div>
              </MotionLink>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Learning Paths */}
      <motion.section className="grid lg:grid-cols-[1.5fr_1fr] gap-8" variants={rise}>
        <motion.div className="rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 md:p-12" variants={rise}>
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white">Learning Paths</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Structured sequences to build your knowledge base.</p>
          </div>
          
          <motion.div
            className="space-y-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {PATHS.map((path, idx) => (
              <motion.div
                key={path.title}
                className="group relative p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-shadow duration-300 hover:shadow-md transform-gpu will-change-transform"
                whileHover={hoverLift}
                variants={cardRise}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${path.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{path.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{path.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-16 md:pl-0">
                    {path.steps.map((step, i) => (
                      <div key={step} className="flex items-center">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          {step}
                        </span>
                        {i < path.steps.length - 1 && (
                          <div className="w-4 h-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="rounded-[32px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-10 flex flex-col justify-between relative overflow-hidden group" variants={rise}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-6">Pro Tip</div>
            <h3 className="text-3xl font-display font-bold mb-4">The Feynman Technique</h3>
            <p className="opacity-80 leading-relaxed text-lg">
              The best way to learn an algorithm is to explain it. Use the "Step" controls to pause execution and predict the next state before it happens.
            </p>
          </div>
          
          <Link
            to="/roadmap"
            className="relative z-10 inline-flex items-center gap-2 mt-8 font-bold hover:gap-3 transition-all"
          >
            Explore the full roadmap <span>→</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* Categories Grid */}
      <motion.section id="categories" variants={rise}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white">Explore by Category</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg">
            Dive deep into specific domains of computer science.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CATEGORIES.map((category, idx) => (
            <motion.div key={category.id} variants={cardRise}>
              <MotionLink
                to={category.path}
                className="group relative h-64 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between overflow-hidden hover:shadow-xl transition-shadow duration-300 transform-gpu will-change-transform"
                whileHover={hoverLift}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} flex items-center justify-center text-2xl mb-4 shadow-sm text-white`}>
                    {/* Simple icon mapping based on first letter or index */}
                    {idx % 3 === 0 ? '🔍' : idx % 3 === 1 ? '🌳' : '🕸️'}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    View Collection
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    →
                  </span>
                </div>
              </MotionLink>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
