import { useState, useEffect } from 'react';
import { getPanelPreference, savePanelPreference } from '../../../utils/layoutPersistence';

export default function TabbedPanel({
  panelId = 'bottom-panel',
  tabs = [],
  defaultTab,
  position = 'bottom',
  isCollapsible = true,
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(() =>
    getPanelPreference(panelId, 'activeTab', defaultTab || tabs[0]?.id)
  );

  const [isCollapsed, setIsCollapsed] = useState(() =>
    getPanelPreference(panelId, 'collapsed', false)
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    savePanelPreference(panelId, 'activeTab', tabId);
    if (isCollapsed) {
      setIsCollapsed(false);
      savePanelPreference(panelId, 'collapsed', false);
    }
  };

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    savePanelPreference(panelId, 'collapsed', newValue);
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
        if (currentIndex === -1) return;

        let nextIndex;
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }

        if (e.altKey) {
          e.preventDefault();
          handleTabChange(tabs[nextIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs]);

  if (tabs.length === 0) return null;

  return (
    <div
      className={`
        fixed ${position === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0
        z-[var(--z-bottom-panel)]
        bg-white/95 dark:bg-zinc-900/95
        backdrop-blur-md
        border-${position === 'bottom' ? 't' : 'b'} border-zinc-200 dark:border-zinc-800
        shadow-2xl
        transition-all duration-300 ease-out
        ${isCollapsed ? 'translate-y-full' : 'translate-y-0'}
        ${className}
      `}
      style={{
        height: isCollapsed ? '48px' : '200px',
      }}
    >
      {/* Tab Bar */}
      <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-4 py-2 rounded-t-lg text-sm font-medium
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-b-2 border-blue-500'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {isCollapsible && (
          <button
            onClick={toggleCollapse}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
            aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              className="w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-200"
              style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Tab Content */}
      {!isCollapsed && activeTabData && (
        <div
          id={`panel-${activeTabData.id}`}
          role="tabpanel"
          className="h-[calc(100%-48px)] overflow-y-auto overflow-x-hidden p-4"
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
}
