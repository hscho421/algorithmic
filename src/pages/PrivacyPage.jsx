import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'What we collect',
    items: [
      'Basic usage analytics to improve the experience.',
      'Optional account details if you sign up in the future.',
    ],
  },
  {
    title: 'How we use data',
    items: [
      'To personalize your learning and save progress.',
      'To measure what content is most helpful.',
      'To communicate product updates if you opt in.',
    ],
  },
  {
    title: 'What we do not sell',
    items: [
      'We do not sell your personal data.',
      'We do not share data with advertisers.',
    ],
  },
  {
    title: 'Security',
    items: [
      'We use industry-standard practices to protect data.',
      'No system is perfect, but we continuously improve safeguards.',
    ],
  },
  {
    title: 'Your choices',
    items: [
      'Request data removal by emailing support.',
      'Opt out of non-essential analytics where available.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-8 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 px-6 py-10 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Privacy</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">
            Privacy policy
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            We are building Algorithmic with privacy in mind. Here is how we handle your data.
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
          Want more details? Email hello@dsavisualizer.com.
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
