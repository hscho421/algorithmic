import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAuthContext from '../context/useAuthContext';
import useUserPreferences from '../context/useUserPreferences';
import { PRO_CHECKPOINT_LIMIT } from '../constants';

export default function useProgress(algorithmId, payload) {
  const { user } = useAuthContext();
  const { isPro } = useUserPreferences();
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState([]);
  const lastSavedRef = useRef('');
  const debounceRef = useRef(null);

  const checkpointsKey = user && algorithmId
    ? `progress-checkpoints:${user.id}:${algorithmId}`
    : '';

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
    if (typeof window === 'undefined') return;
    if (!isPro || !checkpointsKey) {
      setCheckpoints([]);
      return;
    }
    try {
      const raw = localStorage.getItem(checkpointsKey);
      if (!raw) {
        setCheckpoints([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCheckpoints(parsed);
      } else {
        setCheckpoints([]);
      }
    } catch {
      setCheckpoints([]);
    }
  }, [checkpointsKey, isPro]);

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

  const persistCheckpoints = useCallback(
    (next) => {
      setCheckpoints(next);
      if (!checkpointsKey) return;
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(checkpointsKey, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
    },
    [checkpointsKey],
  );

  const saveCheckpoint = useCallback(() => {
    if (!isPro || !payload) return;
    const now = new Date();
    const next = [
      {
        id: `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
        label: `Step ${payload?.stepIndex ?? 0}`,
        payload,
        savedAt: now.toLocaleString(),
      },
      ...checkpoints,
    ].slice(0, PRO_CHECKPOINT_LIMIT);
    persistCheckpoints(next);
  }, [checkpoints, isPro, payload, persistCheckpoints]);

  const deleteCheckpoint = useCallback(
    (id) => {
      if (!isPro) return;
      const next = checkpoints.filter((checkpoint) => checkpoint.id !== id);
      persistCheckpoints(next);
    },
    [checkpoints, isPro, persistCheckpoints],
  );

  return {
    progress,
    isLoading,
    clearProgress,
    checkpoints,
    saveCheckpoint,
    deleteCheckpoint,
  };
}
