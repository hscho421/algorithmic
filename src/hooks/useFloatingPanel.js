import { useState, useEffect, useCallback } from 'react';
import { getPanelPreference, savePanelPreference } from '../utils/layoutPersistence';

export default function useFloatingPanel(panelId, defaultCollapsed = false) {
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
      savePanelPreference(panelId, 'collapsed', newValue);
      if (newValue) {
        setIsMinimized(false);
        savePanelPreference(panelId, 'minimized', false);
      }
      return newValue;
    });
  }, [panelId]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => {
      const newValue = !prev;
      savePanelPreference(panelId, 'minimized', newValue);
      return newValue;
    });
  }, [panelId]);

  const updateWidth = useCallback((newWidth) => {
    setWidth(newWidth);
    savePanelPreference(panelId, 'width', newWidth);
  }, [panelId]);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    setIsMinimized(false);
    savePanelPreference(panelId, 'collapsed', false);
    savePanelPreference(panelId, 'minimized', false);
  }, [panelId]);

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
