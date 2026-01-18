import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Agreement to terms',
    items: [
      'These Terms of Service govern your access to and use of DSA Visualizer.',
      'By accessing or using the service, you agree to be bound by these terms and any updates.',
    ],
  },
  {
    title: 'Eligibility and accounts',
    items: [
      'You must be at least 13 years old to use the service.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You may not share or resell access to paid features or content.',
    ],
  },
  {
    title: 'Acceptable use',
    items: [
      'You agree not to misuse the service, attempt unauthorized access, or interfere with its operation.',
      'Automated scraping, copying, or bulk extraction of content is prohibited.',
      'You may use the content for personal learning, teaching, or internal training purposes.',
    ],
  },
  {
    title: 'Intellectual property',
    items: [
      'The service, including all visualizations, code, and design, is owned by DSA Visualizer or its licensors.',
      'You receive a limited, non-exclusive, non-transferable license to use the service.',
      'You may not reproduce, distribute, or create derivative works without permission.',
    ],
  },
  {
    title: 'Payments and subscriptions',
    items: [
      'Paid plans, if offered, are billed in advance on a recurring basis.',
      'Pricing, taxes, and billing terms will be described at checkout or on the pricing page.',
      'Refund and cancellation policies will be stated at the time of purchase.',
    ],
  },
  {
    title: 'Third-party services',
    items: [
      'The service may link to third-party sites or tools; we are not responsible for their content or practices.',
    ],
  },
  {
    title: 'Availability and changes',
    items: [
      'We may update, modify, or discontinue features at any time.',
      'We strive for reliability but do not guarantee uninterrupted or error-free service.',
    ],
  },
  {
    title: 'Disclaimers',
    items: [
      'The service is provided “as is” and “as available.”',
      'We disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement to the extent permitted by law.',
    ],
  },
  {
    title: 'Limitation of liability',
    items: [
      'To the maximum extent permitted by law, DSA Visualizer is not liable for indirect, incidental, special, or consequential damages.',
      'Our total liability for any claim is limited to the amount paid to use the service in the 12 months preceding the claim.',
    ],
  },
  {
    title: 'Termination',
    items: [
      'We may suspend or terminate access if you violate these terms.',
      'You may stop using the service at any time.',
    ],
  },
  {
    title: 'Contact',
    items: [
      'Questions about these terms? Email support@algorithmicai.dev.',
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
            Terms of Service
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            These terms explain how you can use DSA Visualizer and what you can expect from us.
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
          Questions about these terms? Email support@algorithmicai.dev.
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
