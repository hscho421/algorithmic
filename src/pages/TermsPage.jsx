import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Overview',
    items: [
      'Algorithmic is an educational platform for learning data structures and algorithms.',
      'By using the site, you agree to follow these terms and any future updates.',
    ],
  },
  {
    title: 'Accounts + Access',
    items: [
      'You are responsible for keeping your account secure.',
      'Do not share or resell access to paid features.',
      'We may suspend access if usage violates these terms.',
    ],
  },
  {
    title: 'Content + Usage',
    items: [
      'All visualizations, lessons, and UI are owned by Algorithmic.',
      'You may use the content for personal learning and teaching.',
      'Bulk scraping or automated copying is not permitted.',
    ],
  },
  {
    title: 'Payments',
    items: [
      'Paid plans will be billed on a recurring basis when available.',
      'Refunds and cancellation policies will be listed on the pricing page.',
    ],
  },
  {
    title: 'Availability',
    items: [
      'We may update, pause, or discontinue features without notice.',
      'We aim for reliability but do not guarantee uninterrupted access.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-8 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 px-6 py-10 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Terms</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">
            Terms of service
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            These terms explain how you can use Algorithmic and what you can expect from us.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50/80 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
            Effective: today
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-6 shadow-sm"
          >
            <h2 className="text-lg font-display text-zinc-900 dark:text-white">{section.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {section.items.map((item) => (
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
          Questions about these terms? Email hello@dsavisualizer.com.
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
