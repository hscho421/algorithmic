const STORAGE_KEY = 'visualizer-layout-preferences';

export function getLayoutPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load layout preferences:', error);
    return {};
  }
}

export function saveLayoutPreferences(preferences) {
  try {
    const existing = getLayoutPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save layout preferences:', error);
  }
}

export function getPanelPreference(panelId, key, defaultValue) {
  const prefs = getLayoutPreferences();
  return prefs[panelId]?.[key] ?? defaultValue;
}

export function savePanelPreference(panelId, key, value) {
  const prefs = getLayoutPreferences();
  saveLayoutPreferences({
    [panelId]: {
      ...prefs[panelId],
      [key]: value,
    },
  });
}

export function resetLayoutPreferences() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset layout preferences:', error);
  }
}
