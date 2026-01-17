import { useCallback, useEffect, useState } from 'react';
import ControlPanel from '../controls/ControlPanel';
import StatePanel from '../panels/StatePanel';
import CodePanel from '../panels/CodePanel';
import useKeyboardShortcuts from '../../../hooks/useKeyboardShortcuts';
import { getPanelPreference, savePanelPreference } from '../../../utils/layoutPersistence';

export default function VisualizerLayout({
  configurationContent,
  controlProps,
  visualizationContent,
  visualizationMinHeight = '400px',
  codeProps,
  stateProps,
  infoTabs = [],
  className = '',
}) {
  const [showHelp, setShowHelp] = useState(false);

  // Separate info tabs into reference and status
  const explanationTab = infoTabs.find(tab => tab.id === 'explanation');
  const complexityTab = infoTabs.find(tab => tab.id === 'complexity');
  const guideTab = infoTabs.find(tab => tab.id === 'guide');
  const resultTab = infoTabs.find(tab => tab.id === 'result');

  const explanationContent = (
    <div className="space-y-4">
      {resultTab?.content}
      {explanationTab?.content}
    </div>
  );

  const rightTabs = [];
  if (explanationTab || resultTab) {
    rightTabs.push({ id: 'explanation', label: 'Explanation', content: explanationContent });
  }
  if (complexityTab) {
    rightTabs.push({ id: 'complexity', label: 'Complexity', content: complexityTab.content });
  }
  if (guideTab) {
    rightTabs.push({ id: 'guide', label: 'Guide', content: guideTab.content });
  }

  const [activeRightTab, setActiveRightTab] = useState(() => {
    const savedTab = getPanelPreference('visualizer-right', 'activeTab', null);
    if (savedTab && rightTabs.some((tab) => tab.id === savedTab)) {
      return savedTab;
    }
    return rightTabs[0]?.id || 'explanation';
  });

  const setRightTab = useCallback((tabId) => {
    setActiveRightTab(tabId);
    savePanelPreference('visualizer-right', 'activeTab', tabId);
  }, []);

  useEffect(() => {
    if (!rightTabs.length) {
      return;
    }

    if (!rightTabs.some((tab) => tab.id === activeRightTab)) {
      const nextTab = rightTabs[0].id;
      setRightTab(nextTab);
    }
  }, [activeRightTab, rightTabs, setRightTab]);

  const handleStep = useCallback(() => {
    if (rightTabs.some((tab) => tab.id === 'explanation')) {
      setRightTab('explanation');
    }
    controlProps?.onStep?.();
  }, [controlProps, rightTabs, setRightTab]);

  const handleRun = useCallback(() => {
    if (rightTabs.some((tab) => tab.id === 'explanation')) {
      setRightTab('explanation');
    }
    controlProps?.onRun?.();
  }, [controlProps, rightTabs, setRightTab]);

  const controlPanelProps = controlProps
    ? {
        ...controlProps,
        onStep: handleStep,
        onRun: handleRun,
      }
    : null;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onStep: handleStep,
    onBack: controlProps?.onBack,
    onRunToggle: handleRun,
    onReset: controlProps?.onReset,
    onSpeedDecrease: () => {
      if (controlProps?.onSpeedChange && controlProps?.speed) {
        const newSpeed = Math.max(0.25, controlProps.speed - 0.25);
        controlProps.onSpeedChange(newSpeed);
      }
    },
    onSpeedIncrease: () => {
      if (controlProps?.onSpeedChange && controlProps?.speed) {
        const newSpeed = Math.min(2, controlProps.speed + 0.25);
        controlProps.onSpeedChange(newSpeed);
      }
    },
    onStop: () => {
      if (controlProps?.isRunning && controlProps?.onRun) {
        controlProps.onRun();
      }
    },
    onShowHelp: () => setShowHelp(true),
    enabled: true,
  });

  return (
    <div className={`w-full font-body ${className}`}>
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Three Column Grid Layout - Screen Height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ minHeight: 'calc(100vh - 60px)' }}>
          {/* Left Column - Configuration, Controls & Guide (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col overflow-hidden">
            {/* Configuration Section */}
            {configurationContent && (
              <div className="flex-shrink-0">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
                  Configuration
                </h3>
                <div className="space-y-4">{configurationContent}</div>
              </div>
            )}

            {/* Divider */}
            {configurationContent && controlProps && (
              <div className="my-5 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0"></div>
            )}

            {/* Controls Section */}
            {controlPanelProps && (
              <div className="flex-shrink-0">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
                  Controls
                </h3>
                <ControlPanel {...controlPanelProps} />
              </div>
            )}

          </div>

          {/* Center Column - Visualization & State (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col overflow-hidden">
            {/* Visualization Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex-shrink-0">
                Visualization
              </h3>
              <div className="flex-1 flex items-center justify-center overflow-auto">
                <div
                  className="w-full h-full max-w-full max-h-full"
                  style={{ minHeight: visualizationMinHeight }}
                >
                  {visualizationContent}
                </div>
              </div>
            </div>

            {/* Divider */}
            {stateProps && stateProps.variables && stateProps.variables.length > 0 && (
              <div className="my-5 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0"></div>
            )}

            {/* State Section */}
            {stateProps && stateProps.variables && stateProps.variables.length > 0 && (
              <div className="flex-shrink-0">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
                  State
                </h3>
                <StatePanel {...stateProps} />
              </div>
            )}
          </div>

          {/* Right Column - Explanation/Result, Code & Complexity (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col overflow-hidden">
            {rightTabs.length > 0 && (
              <div className="flex flex-col flex-shrink-0">
                <div className="flex flex-wrap gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  {rightTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setRightTab(tab.id);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border transition-colors ${
                        activeRightTab === tab.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-y-auto pt-4 max-h-[30vh]">
                  {rightTabs.find((tab) => tab.id === activeRightTab)?.content}
                </div>
              </div>
            )}

            {codeProps && rightTabs.length > 0 && (
              <div className="my-4 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0"></div>
            )}

            {codeProps && (
              <div className="flex flex-col min-h-0 flex-1">
                <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
                  Code
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CodePanel {...codeProps} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:bg-blue-600 z-10"
        aria-label="Show keyboard shortcuts"
        title="Keyboard Shortcuts (?)"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <ShortcutRow keys={['Space']} description="Step forward" />
              <ShortcutRow keys={['Shift', 'Space']} description="Step backward" />
              <ShortcutRow keys={['Enter']} description="Run / Pause" />
              <ShortcutRow keys={['R']} description="Reset" />
              <ShortcutRow keys={['[']} description="Decrease speed" />
              <ShortcutRow keys={[']']} description="Increase speed" />
              <ShortcutRow keys={['Esc']} description="Stop" />
              <ShortcutRow keys={['?']} description="Show this help" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShortcutRow({ keys, description }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
      <div className="flex items-center gap-1">
        {keys.map((key, idx) => (
          <span key={idx}>
            <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-xs font-mono">
              {key}
            </kbd>
            {idx < keys.length - 1 && <span className="mx-1 text-zinc-400">+</span>}
          </span>
        ))}
      </div>
      <span className="text-zinc-600 dark:text-zinc-400">{description}</span>
    </div>
  );
}
