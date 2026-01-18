import { Link } from 'react-router-dom';
import { Map, Calendar, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

const PHASES = [
  {
    title: 'Foundations',
    timeline: 'Weeks 1–2',
    items: [
      'Visualizing memory: Arrays & Strings',
      'Basic sorting: Bubble, Insertion, Selection',
      'Understanding Big O through animation',
    ],
  },
  {
    title: 'Essential Patterns',
    timeline: 'Weeks 3–5',
    items: [
      'Two Pointers & Sliding Window visualization',
      'Linked Lists: Reversal & Cycle detection',
      'Stacks & Queues in practice',
    ],
  },
  {
    title: 'Advanced Structures',
    timeline: 'Weeks 6–8',
    isPro: true,
    items: [
      'Trees & Recursion: Seeing the stack',
      'Graph traversals: BFS & DFS step-by-step',
      'Heaps & Priority Queues',
    ],
  },
  {
    title: 'Optimization Mastery',
    timeline: 'Weeks 9–12',
    isPro: true,
    items: [
      'Dynamic Programming: Memoization vs Tabulation',
      'Greedy algorithms & Backtracking',
      'Advanced Graph algorithms (Dijkstra, Prim)',
    ],
  },
  {
    title: 'Interview Ready',
    timeline: 'Ongoing',
    items: [
      'Pattern recognition drills',
      'Space/Time complexity optimization',
      'System Design fundamentals',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="space-y-16 font-body pb-20">
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent rounded-[100%] blur-3xl" />
        </div>
        
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Map className="h-3 w-3" />
            Interactive Curriculum
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-zinc-900 dark:text-white tracking-tight mb-8">
            The Algorithm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Roadmap</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Don't get lost in random problems. Follow our proven path from foundations to interview mastery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/category/sorting"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Level 1
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="hidden sm:flex items-center gap-6 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Structured
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Visual
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative max-w-3xl mx-auto px-4">
        {/* Continuous Line */}
        <div className="absolute left-8 md:left-12 top-8 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-zinc-200 to-zinc-100 dark:from-emerald-500 dark:via-zinc-800 dark:to-zinc-900" />

        <div className="space-y-16">
          {PHASES.map((phase, idx) => (
            <div key={phase.title} className="relative pl-24 md:pl-32">
              {/* Node Marker */}
              <div className="absolute left-4 md:left-8 top-0 flex h-8 w-8 md:h-9 md:w-9 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white dark:border-zinc-950 bg-emerald-500 shadow-sm z-10">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
              
              {/* Level Indicator */}
              <div className="absolute left-0 top-12 md:left-4 flex w-8 md:w-9 -translate-x-1/2 justify-center">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 rotate-90 origin-center whitespace-nowrap">
                  LEVEL {idx + 1}
                </span>
              </div>

              {/* Content Card */}
              <div className={`group relative rounded-3xl border bg-white dark:bg-zinc-900 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${phase.isPro ? 'border-amber-200 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
                
                {/* Connector Arrow (Desktop) */}
                <div className="hidden md:block absolute top-4 -left-4 w-4 h-4 border-t border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 -rotate-45 transform" />

                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
                      {phase.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      {phase.timeline}
                    </div>
                  </div>
                  {phase.isPro && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                      <Lock className="h-3 w-3" /> PRO
                    </div>
                  )}
                </div>

                <ul className="space-y-4">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${phase.isPro ? 'text-amber-500' : 'text-emerald-500'}`} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* End Node */}
        <div className="relative pl-24 md:pl-32 mt-16">
          <div className="absolute left-4 md:left-8 top-0 flex h-8 w-8 md:h-9 md:w-9 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 shadow-sm z-10">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          </div>
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Interview Ready</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">You've mastered the core patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
