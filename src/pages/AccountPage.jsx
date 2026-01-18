import { useEffect, useMemo, useState } from 'react';
import useAuthContext from '../context/useAuthContext';
import useUserPreferences from '../context/useUserPreferences';
import { supabase } from '../lib/supabaseClient';

export default function AccountPage() {
  const { user, signOut } = useAuthContext();
  const { isPro, refreshPreferences } = useUserPreferences();
  const [targetUserId, setTargetUserId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setTargetUserId(user?.id ?? '');
  }, [user?.id]);

  const adminEmails = useMemo(() => {
    const raw = import.meta.env.VITE_ADMIN_EMAILS || '';
    return raw
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);
  const isAdmin = Boolean(user?.email) && adminEmails.includes(user.email.toLowerCase());

  const handleSetPro = async (nextValue) => {
    if (!supabase || !user) return;
    setIsSaving(true);
    setStatusMessage('');
    const { error } = await supabase.rpc('set_user_pro', {
      target_user_id: targetUserId,
      new_is_pro: nextValue,
    });
    if (error) {
      setStatusMessage(error.message);
      setIsSaving(false);
      return;
    }
    await refreshPreferences();
    setStatusMessage(`Updated ${targetUserId} to ${nextValue ? 'Pro' : 'Free'}.`);
    setIsSaving(false);
  };

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
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
            <span className={`inline-flex h-2 w-2 rounded-full ${isPro ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
            Plan: {isPro ? 'Pro' : 'Free'}
          </div>
        </div>
      </section>

      <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="text-sm font-semibold text-zinc-900 dark:text-white">Account actions</div>
        <button
          onClick={() => {
            signOut();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Sign out
        </button>
        <button
          onClick={refreshPreferences}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Refresh plan
        </button>
      </div>

      {isAdmin && (
        <div className="rounded-3xl border border-amber-200/70 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 p-6 shadow-sm space-y-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-amber-500">Admin tools</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
              Set Pro status for a user ID.
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">Target user ID</label>
            <input
              value={targetUserId}
              onChange={(event) => setTargetUserId(event.target.value)}
              className="w-full rounded-xl border border-zinc-200/70 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-900/60 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200"
              placeholder="UUID from auth.users"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleSetPro(true)}
              disabled={!targetUserId || isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              Set Pro
            </button>
            <button
              type="button"
              onClick={() => handleSetPro(false)}
              disabled={!targetUserId || isSaving}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white disabled:opacity-60"
            >
              Set Free
            </button>
          </div>
          {statusMessage && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{statusMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}
