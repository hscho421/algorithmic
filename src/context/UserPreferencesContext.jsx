import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAuthContext from './useAuthContext';

const UserPreferencesContext = createContext(null);

const STORAGE_KEY = 'user-preferences';
const DEFAULT_PREFERENCES = {
  playbackSpeed: 500,
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

  useEffect(() => {
    setPreferences(loadPreferences());
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;

    const loadRemote = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('playback_speed, layout_prefs')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled || error || !data) return;

      suppressRemoteSyncRef.current = true;
      setPreferences((prev) => {
        const merged = {
          ...prev,
          playbackSpeed: data.playback_speed ?? prev.playbackSpeed,
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
    };

    loadRemote();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
      visualizerColumns: preferences.layout.visualizerColumns,
      setPlaybackSpeed,
      setVisualizerColumns,
      getPanelPreference,
      setPanelPreference,
    }),
    [
      preferences,
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
