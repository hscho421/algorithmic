import { useState, useCallback } from 'react';
import useUserPreferences from '../context/useUserPreferences';

export default function useFloatingPanel(panelId, defaultCollapsed = false) {
  const { getPanelPreference, setPanelPreference } = useUserPreferences();
  const [isCollapsed, setIsCollapsed] = useState(() =>
    getPanelPreference(panelId, 'collapsed', defaultCollapsed)
  );

  const [isMinimized, setIsMinimized] = useState(() =>
    getPanelPreference(panelId, 'minimized', false)
  );

  const [width, setWidth] = useState(() =>
    getPanelPreference(panelId, 'width', null)
  );

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      setPanelPreference(panelId, 'collapsed', newValue);
      if (newValue) {
        setIsMinimized(false);
        setPanelPreference(panelId, 'minimized', false);
      }
      return newValue;
    });
  }, [panelId, setPanelPreference]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => {
      const newValue = !prev;
      setPanelPreference(panelId, 'minimized', newValue);
      return newValue;
    });
  }, [panelId, setPanelPreference]);

  const updateWidth = useCallback((newWidth) => {
    setWidth(newWidth);
    setPanelPreference(panelId, 'width', newWidth);
  }, [panelId, setPanelPreference]);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    setIsMinimized(false);
    setPanelPreference(panelId, 'collapsed', false);
    setPanelPreference(panelId, 'minimized', false);
  }, [panelId, setPanelPreference]);

  return {
    isCollapsed,
    isMinimized,
    width,
    toggleCollapse,
    toggleMinimize,
    updateWidth,
    expand,
  };
}
