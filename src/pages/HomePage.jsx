import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

export default function HomePage() {
  return (
    <div className="space-y-12 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 shadow-sm hero-surface">
        <div className="hero-orb teal float-slow" style={{ width: '220px', height: '220px', top: '-80px', left: '-40px' }} />
        <div className="hero-orb amber float-slow" style={{ width: '180px', height: '180px', top: '40px', right: '-60px', animationDelay: '1.2s' }} />
        <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 rise-in">Data Structures + Algorithms</p>
            <h1 className="text-4xl md:text-5xl font-display text-[var(--brand-ink)] dark:text-white mt-4 rise-in">
              Learn by watching the structure breathe.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 mt-4 text-lg rise-in">
              Visual, step-by-step explorations of core algorithms. Tweak the input, step through logic,
              and internalize how data moves.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 rise-in">
              <Link
                to="/category/heaps"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/30"
              >
                Try Heaps
              </Link>
              <a
                href="#categories"
                className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 text-zinc-700 dark:text-zinc-200 font-semibold hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                Browse Categories
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-display text-zinc-900 dark:text-white">Explore by topic</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Choose a category to dive into a set of visualizers.</p>
          </div>
          <div className="text-sm text-zinc-400 dark:text-zinc-500">9 categories and growing</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CATEGORIES.map((category, idx) => (
            <Link
              key={category.id}
              to={category.path}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 opacity-80" />
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Category</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-3 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                {category.name}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
                Explore {category.name.toLowerCase()} algorithms
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Ready to visualize
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
