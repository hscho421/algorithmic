import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAuthContext from '../context/useAuthContext';

export default function useProgress(algorithmId, payload) {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastSavedRef = useRef('');
  const debounceRef = useRef(null);

  const fetchProgress = useCallback(async () => {
    if (!supabase || !user || !algorithmId) {
      setProgress(null);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('progress')
      .select('last_state_json, last_step, last_seen_at')
      .eq('user_id', user.id)
      .eq('algorithm_id', algorithmId)
      .maybeSingle();
    setIsLoading(false);
    if (!error && data) {
      setProgress(data);
    }
  }, [algorithmId, user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!supabase || !user || !algorithmId || !payload) return;
    const serialized = JSON.stringify(payload);
    if (serialized === lastSavedRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      lastSavedRef.current = serialized;
      supabase
        .from('progress')
        .upsert(
          {
            user_id: user.id,
            algorithm_id: algorithmId,
            last_state_json: payload,
            last_step: payload?.stepIndex ?? 0,
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,algorithm_id' },
        )
        .then(({ error }) => {
          if (!error) {
            setProgress({
              last_state_json: payload,
              last_step: payload?.stepIndex ?? 0,
              last_seen_at: new Date().toISOString(),
            });
          }
        });
    }, 600);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [algorithmId, payload, user]);

  const clearProgress = useCallback(async () => {
    if (!supabase || !user || !algorithmId) return;
    await supabase.from('progress').delete().eq('user_id', user.id).eq('algorithm_id', algorithmId);
    setProgress(null);
    lastSavedRef.current = '';
  }, [algorithmId, user]);

  return {
    progress,
    isLoading,
    clearProgress,
  };
}
