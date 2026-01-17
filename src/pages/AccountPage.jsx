import useAuthContext from '../context/useAuthContext';

export default function AccountPage() {
  const { user, signOut } = useAuthContext();

  return (
    <div className="space-y-8 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 px-6 py-10 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Account</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">
            Your profile
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            {user?.email ? `Signed in as ${user.email}.` : 'Signed in.'}
          </p>
        </div>
      </section>

      <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="text-sm font-semibold text-zinc-900 dark:text-white">Account actions</div>
        <button
          onClick={signOut}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
