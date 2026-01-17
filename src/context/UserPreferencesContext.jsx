import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

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
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    setPreferences(loadPreferences());
  }, []);

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

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesContext;
