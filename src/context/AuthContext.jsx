import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) {
      return { error: new Error('Supabase client not configured') };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (!supabase) {
      return { error: new Error('Supabase client not configured') };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    const needsEmailConfirmation = !data?.session;
    return { error, needsEmailConfirmation };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: new Error('Supabase client not configured') };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
