import { Link } from 'react-router-dom';

const TIERS = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'Free forever',
    description: 'For casual practice and exploration.',
    features: [
      'Core visualizers',
      'Unlimited runs',
      'Save up to 3 inputs per algorithm',
      'Default theme',
    ],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    cadence: 'per month',
    description: 'For interview prep and deeper mastery.',
    features: [
      'All visualizers + new releases',
      'Unlimited saved inputs',
      'Checkpoint history',
      'Pro visualizers (graphs, DP, strings)',
      'Layout presets + theme controls',
    ],
    cta: 'Join waitlist',
    highlighted: true,
  },
  {
    name: 'Teams',
    price: '$12',
    cadence: 'per seat / month',
    description: 'For cohorts, bootcamps, and classrooms.',
    features: [
      'Admin dashboard',
      'Assignments + progress',
      'Team analytics',
      'Priority support',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-10 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 px-6 py-10 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Pricing</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">
            Simple pricing for focused learning
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            Start free, then upgrade when you want deeper interview prep and advanced visualizers.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50/80 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Payments coming soon
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl border p-6 shadow-sm bg-white/70 dark:bg-zinc-900/60 ${
              tier.highlighted
                ? 'border-emerald-300/70 dark:border-emerald-500/40 ring-2 ring-emerald-300/40'
                : 'border-zinc-200/70 dark:border-zinc-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display text-zinc-900 dark:text-white">{tier.name}</h2>
              {tier.highlighted && (
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-500">Popular</span>
              )}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{tier.description}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-3xl font-display text-zinc-900 dark:text-white">{tier.price}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">{tier.cadence}</span>
            </div>
            <button
              type="button"
              className={`mt-6 w-full rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tier.highlighted
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'border border-zinc-200/70 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {tier.cta}
            </button>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/60 p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          Have a custom need? We can tailor a plan for your team.
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
