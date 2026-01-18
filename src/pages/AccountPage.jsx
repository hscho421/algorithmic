import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../context/useAuthContext';
import useUserPreferences from '../context/useUserPreferences';
import { supabase } from '../lib/supabaseClient';

export default function AccountPage() {
  const { user, signOut } = useAuthContext();
  const { isPro, refreshPreferences } = useUserPreferences();
  const location = useLocation();
  const [targetUserId, setTargetUserId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [usageStats, setUsageStats] = useState({
    savedInputs: 0,
    progressEntries: 0,
    checkpoints: 0,
    lastActive: null,
    isLoading: false,
  });
  const checkoutStatus = new URLSearchParams(location.search).get('checkout');

  useEffect(() => {
    setTargetUserId(user?.id ?? '');
  }, [user?.id]);

  useEffect(() => {
    if (!supabase || !user) {
      setUsageStats({
        savedInputs: 0,
        progressEntries: 0,
        checkpoints: 0,
        lastActive: null,
        isLoading: false,
      });
      return;
    }

    let isMounted = true;
    const loadStats = async () => {
      setUsageStats((prev) => ({ ...prev, isLoading: true }));

      const savedInputsRequest = supabase
        .from('saved_inputs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const progressRequest = supabase
        .from('progress')
        .select('last_seen_at', { count: 'exact' })
        .eq('user_id', user.id);

      const [{ count: savedInputsCount, error: savedInputsError }, progressResponse] =
        await Promise.all([savedInputsRequest, progressRequest]);

      const progressCount = progressResponse?.count || 0;
      const progressData = progressResponse?.data || [];
      const lastSeen = progressData.reduce((latest, entry) => {
        if (!entry?.last_seen_at) return latest;
        return !latest || entry.last_seen_at > latest ? entry.last_seen_at : latest;
      }, null);

      let checkpointsCount = 0;
      if (typeof window !== 'undefined') {
        const prefix = `progress-checkpoints:${user.id}:`;
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (!key || !key.startsWith(prefix)) continue;
          try {
            const raw = localStorage.getItem(key);
            const parsed = raw ? JSON.parse(raw) : [];
            if (Array.isArray(parsed)) {
              checkpointsCount += parsed.length;
            }
          } catch {
            // ignore invalid entries
          }
        }
      }

      if (!isMounted) return;
      setUsageStats({
        savedInputs: savedInputsError ? 0 : savedInputsCount || 0,
        progressEntries: progressCount,
        checkpoints: checkpointsCount,
        lastActive: lastSeen,
        isLoading: false,
      });
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const adminEmails = useMemo(() => {
    const raw = import.meta.env.VITE_ADMIN_EMAILS || '';
    return raw
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);
  const isAdmin = Boolean(user?.email) && adminEmails.includes(user.email.toLowerCase());
  const memberSince = user?.created_at ? new Date(user.created_at) : null;
  const memberSinceLabel = memberSince
    ? memberSince.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  const userEmail = user?.email || '—';
  const userInitial = user?.email?.[0]?.toUpperCase() || 'U';
  const lastActiveLabel = usageStats.lastActive
    ? new Date(usageStats.lastActive).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

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
    <div className="space-y-10 font-body">
      <section className="relative overflow-hidden rounded-[32px] border border-zinc-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/60 px-6 py-12 shadow-sm">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute -bottom-24 left-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
        </div>
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Account</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">
            Profile & settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            Manage your plan, security, and workspace preferences in one place.
          </p>
          {checkoutStatus === 'success' && (
            <div className="mt-5 rounded-2xl border border-emerald-200/70 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              Payment received. Your Pro access will unlock shortly.
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-2xl font-semibold shadow-md">
              {userInitial}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">Account overview</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {user?.email ? `Signed in as ${user.email}.` : 'Signed in.'}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 bg-white/90 dark:bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <span className={`inline-flex h-2 w-2 rounded-full ${isPro ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
              Plan: {isPro ? 'Pro' : 'Free'}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/80 dark:bg-zinc-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Email</div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-2">{userEmail}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/80 dark:bg-zinc-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Member since</div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-2">{memberSinceLabel}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/80 dark:bg-zinc-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Usage</div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-2">
                {usageStats.isLoading ? 'Loading…' : `${usageStats.savedInputs} saved inputs`}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {usageStats.isLoading ? 'Syncing activity' : `${usageStats.checkpoints} checkpoints`}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/80 dark:bg-zinc-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Status</div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-2">
                {isPro ? 'Pro active' : 'Free plan'}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {isPro ? 'Unlimited visualizers & checkpoints' : 'Upgrade to unlock advanced visualizers'}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-950/60 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Checkpoints</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
                {usageStats.isLoading ? '—' : usageStats.checkpoints}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-950/60 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Saved inputs</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
                {usageStats.isLoading ? '—' : usageStats.savedInputs}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-950/60 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Active sessions</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
                {usageStats.isLoading ? '—' : usageStats.progressEntries}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-950/60 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Last active</div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-1">
                {usageStats.isLoading ? '—' : lastActiveLabel}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-white shadow-sm">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">Plan</div>
          <div className="mt-3 text-2xl font-display">
            {isPro ? 'Pro membership' : 'Upgrade to Pro'}
          </div>
          <p className="text-sm text-zinc-200 mt-2">
            {isPro
              ? 'You have full access to all visualizers, checkpoints, and advanced topics.'
              : 'Unlock advanced algorithms, unlimited saved inputs, and premium progress tracking.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-emerald-300 transition-colors"
            >
              {isPro ? 'Manage plan' : 'See Pro plans'}
            </Link>
            <button
              onClick={refreshPreferences}
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              Refresh plan
            </button>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[24px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">Security</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Keep your account safe with secure sign-in and strong passwords.
          </p>
          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <div>• Use a unique password</div>
            <div>• Sign out on shared devices</div>
            <div>• Reset if you suspect compromise</div>
          </div>
        </section>
        <section className="rounded-[24px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">Preferences</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Your visualizer speed, theme, and saved inputs sync across sessions.
          </p>
          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <div>• Theme: Auto</div>
            <div>• Playback: Adjusted per visualizer</div>
            <div>• History: Stored in your browser</div>
          </div>
        </section>
        <section className="rounded-[24px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">Support</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Need help or have feedback? We respond quickly.
          </p>
          <div className="mt-4">
            <a
              href="mailto:support@algorithmicai.dev"
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              support@algorithmicai.dev
            </a>
          </div>
        </section>
      </div>

      <div className="rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="text-sm font-semibold text-zinc-900 dark:text-white">Quick actions</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              signOut();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Sign out
          </button>
          <button
            onClick={refreshPreferences}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Refresh plan
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="rounded-[28px] border border-amber-200/70 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 p-6 shadow-sm space-y-4">
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
