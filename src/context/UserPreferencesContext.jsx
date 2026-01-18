import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAuthContext from './useAuthContext';

const UserPreferencesContext = createContext(null);

const STORAGE_KEY = 'user-preferences';
const DEFAULT_PREFERENCES = {
  playbackSpeed: 500,
  isPro: false,
  layout: {
    visualizerColumns: [25, 50, 25],
    panelPrefs: {},
  },
};

const loadPreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        layout: {
          ...DEFAULT_PREFERENCES.layout,
          ...(parsed?.layout || {}),
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export function UserPreferencesProvider({ children }) {
  const { user } = useAuthContext();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const suppressRemoteSyncRef = useRef(false);
  const debounceRef = useRef(null);

  const refreshPreferences = useCallback(async () => {
    if (!user || !supabase) return;
    const { data, error } = await supabase
      .from('user_preferences')
      .select('playback_speed, layout_prefs, is_pro')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data) return;

    suppressRemoteSyncRef.current = true;
    setPreferences((prev) => {
      const merged = {
        ...prev,
        playbackSpeed: data.playback_speed ?? prev.playbackSpeed,
        isPro: data.is_pro ?? prev.isPro,
        layout: {
          ...prev.layout,
          ...(data.layout_prefs || {}),
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore storage failures
      }
      return merged;
    });
  }, [user]);

  useEffect(() => {
    setPreferences(loadPreferences());
  }, []);

  useEffect(() => {
    if (user) return;
    setPreferences((prev) => {
      const next = { ...prev, isPro: false };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  }, [user]);

  useEffect(() => {
    refreshPreferences();
  }, [refreshPreferences]);

  const persist = useCallback((next) => {
    setPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  }, []);

  const updatePreferences = useCallback(
    (patch) => {
      const next = {
        ...preferences,
        ...patch,
        layout: {
          ...preferences.layout,
          ...(patch.layout || {}),
        },
      };
      persist(next);
    },
    [persist, preferences],
  );

  const setPlaybackSpeed = useCallback(
    (speed) => {
      updatePreferences({ playbackSpeed: speed });
    },
    [updatePreferences],
  );

  const setVisualizerColumns = useCallback(
    (columns) => {
      updatePreferences({ layout: { visualizerColumns: columns } });
    },
    [updatePreferences],
  );

  const getPanelPreference = useCallback(
    (panelId, key, defaultValue) => {
      return preferences.layout.panelPrefs?.[panelId]?.[key] ?? defaultValue;
    },
    [preferences.layout.panelPrefs],
  );

  const setPanelPreference = useCallback(
    (panelId, key, value) => {
      updatePreferences({
        layout: {
          panelPrefs: {
            ...(preferences.layout.panelPrefs || {}),
            [panelId]: {
              ...(preferences.layout.panelPrefs?.[panelId] || {}),
              [key]: value,
            },
          },
        },
      });
    },
    [preferences.layout.panelPrefs, updatePreferences],
  );

  const value = useMemo(
    () => ({
      preferences,
      playbackSpeed: preferences.playbackSpeed,
      isPro: Boolean(user) && preferences.isPro,
      visualizerColumns: preferences.layout.visualizerColumns,
      refreshPreferences,
      setPlaybackSpeed,
      setVisualizerColumns,
      getPanelPreference,
      setPanelPreference,
    }),
    [
      preferences,
      user,
      refreshPreferences,
      setPlaybackSpeed,
      setVisualizerColumns,
      getPanelPreference,
      setPanelPreference,
    ],
  );

  useEffect(() => {
    if (!user || !supabase) return;
    if (suppressRemoteSyncRef.current) {
      suppressRemoteSyncRef.current = false;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: user.id,
            playback_speed: preferences.playbackSpeed,
            layout_prefs: preferences.layout,
          },
          { onConflict: 'user_id' },
        )
        .then(() => {
          // ignore errors for now
        });
    }, 600);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [preferences, user]);

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesContext;
