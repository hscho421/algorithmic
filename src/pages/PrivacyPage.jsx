import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Information we collect',
    items: [
      'Information you provide directly, such as name, email address, and account credentials if you create an account.',
      'Inputs you submit in visualizers (e.g., arrays, graphs, words) and saved configurations if you choose to store them.',
      'Usage data such as pages viewed, feature interactions, and performance metrics.',
      'Device and log data such as browser type, operating system, IP address, and approximate location derived from IP.',
    ],
  },
  {
    title: 'How we use information',
    items: [
      'Provide and maintain the service, including running visualizations and saving preferences.',
      'Improve performance, reliability, and educational outcomes through analytics and testing.',
      'Respond to inquiries, provide support, and send service-related communications.',
      'Send marketing communications only if you opt in, and you can opt out at any time.',
    ],
  },
  {
    title: 'Sharing and disclosure',
    items: [
      'We do not sell personal information.',
      'We may share information with service providers that process data on our behalf (e.g., hosting, analytics, support).',
      'We may disclose information to comply with legal obligations or to protect our rights and users.',
    ],
  },
  {
    title: 'Cookies and analytics',
    items: [
      'We may use cookies or similar technologies to remember preferences and measure usage.',
      'You can control cookies through your browser settings and opt out of non-essential analytics where available.',
    ],
  },
  {
    title: 'Data retention',
    items: [
      'We retain information as long as necessary to provide the service and for legitimate business purposes.',
      'You may request deletion of your account or stored data, subject to legal or operational requirements.',
    ],
  },
  {
    title: 'Your rights and choices',
    items: [
      'Access, correct, or delete your information by contacting us.',
      'Opt out of marketing communications at any time.',
      'Depending on your location, you may have additional rights under applicable privacy laws.',
    ],
  },
  {
    title: 'Security',
    items: [
      'We use administrative, technical, and physical safeguards designed to protect data.',
      'No method of transmission or storage is 100% secure; we continuously improve safeguards.',
    ],
  },
  {
    title: 'Children',
    items: [
      'The service is not directed to children under 13. We do not knowingly collect personal information from children.',
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
            Privacy Policy
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            This Privacy Policy explains how DSA Visualizer collects, uses, and shares information.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50/80 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
            Effective: upon posting
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
          Questions about privacy? Email hello@dsavisualizer.com.
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
