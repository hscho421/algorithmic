import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ControlPanel from '../controls/ControlPanel';
import StatePanel from '../panels/StatePanel';
import CodePanel from '../panels/CodePanel';
import useKeyboardShortcuts from '../../../hooks/useKeyboardShortcuts';
import useUserPreferences from '../../../context/useUserPreferences';

const GAP_PX = 16;
const DEFAULT_COLS = [25, 50, 25];
const SNAP_PX = 24;
const MIN_COL_PX = { left: 240, center: 360, right: 240 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
  const gridRef = useRef(null);
  const dragRef = useRef(null);
  const { visualizerColumns, setVisualizerColumns, getPanelPreference, setPanelPreference } = useUserPreferences();

  const [containerWidth, setContainerWidth] = useState(0);
  const [colPercents, setColPercents] = useState(() => {
    if (Array.isArray(visualizerColumns) && visualizerColumns.length === 3) {
      return visualizerColumns;
    }
    return DEFAULT_COLS;
  });
  const colPercentsRef = useRef(colPercents);
  const [isLg, setIsLg] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = (event) => setIsLg(event.matches);
    query.addEventListener?.('change', onChange);
    query.addListener?.(onChange);
    return () => {
      query.removeEventListener?.('change', onChange);
      query.removeListener?.(onChange);
    };
  }, []);

  useEffect(() => {
    if (!gridRef.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    colPercentsRef.current = colPercents;
  }, [colPercents]);

  useEffect(() => {
    if (!dragRef.current && Array.isArray(visualizerColumns) && visualizerColumns.length === 3) {
      setColPercents(visualizerColumns);
    }
  }, [visualizerColumns]);

  const effectiveCols = isLg ? colPercents : DEFAULT_COLS;
  const availableWidth = Math.max(0, containerWidth - GAP_PX * 2);
  const leftPx = (availableWidth * effectiveCols[0]) / 100;
  const centerPx = (availableWidth * effectiveCols[1]) / 100;
  const rightPx = (availableWidth * effectiveCols[2]) / 100;
  const defaultLeftPx = (availableWidth * DEFAULT_COLS[0]) / 100;
  const defaultCenterPx = (availableWidth * DEFAULT_COLS[1]) / 100;
  const defaultRightPx = (availableWidth * DEFAULT_COLS[2]) / 100;

  const updateColumns = useCallback(
    (clientX) => {
      if (!gridRef.current || !availableWidth) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, containerWidth);
      const dragType = dragRef.current?.type;

      if (dragType === 'left') {
        const minLeft = MIN_COL_PX.left;
        const maxLeft = Math.max(minLeft, availableWidth - MIN_COL_PX.center - rightPx);
        const nextLeftPx = clamp(x - GAP_PX, minLeft, maxLeft);
        const nextLeft = (nextLeftPx / availableWidth) * 100;
        const nextRight = colPercents[2];
        let nextCenter = Math.max(0, 100 - nextLeft - nextRight);
        const leftDelta = Math.abs(nextLeftPx - defaultLeftPx);
        const centerDelta = Math.abs((availableWidth * nextCenter) / 100 - defaultCenterPx);
        const rightDelta = Math.abs((availableWidth * nextRight) / 100 - defaultRightPx);
        if (leftDelta <= SNAP_PX && centerDelta <= SNAP_PX && rightDelta <= SNAP_PX) {
          setColPercents(DEFAULT_COLS);
          return;
        }
        setColPercents([nextLeft, nextCenter, nextRight]);
      } else if (dragType === 'right') {
        const minCenter = MIN_COL_PX.center;
        const maxCenter = Math.max(minCenter, availableWidth - leftPx - MIN_COL_PX.right);
        const nextCenterPx = clamp(x - leftPx - GAP_PX, minCenter, maxCenter);
        const nextRightPx = Math.max(0, availableWidth - leftPx - nextCenterPx);
        const nextLeft = colPercents[0];
        let nextCenter = (nextCenterPx / availableWidth) * 100;
        const nextRight = Math.max(0, 100 - nextLeft - nextCenter);
        const leftDelta = Math.abs((availableWidth * nextLeft) / 100 - defaultLeftPx);
        const centerDelta = Math.abs(nextCenterPx - defaultCenterPx);
        const rightDelta = Math.abs(nextRightPx - defaultRightPx);
        if (leftDelta <= SNAP_PX && centerDelta <= SNAP_PX && rightDelta <= SNAP_PX) {
          setColPercents(DEFAULT_COLS);
          return;
        }
        setColPercents([nextLeft, nextCenter, nextRight]);
      }
    },
    [
      availableWidth,
      colPercents,
      containerWidth,
      defaultCenterPx,
      defaultLeftPx,
      defaultRightPx,
      leftPx,
      rightPx,
    ],
  );

  const handlePointerDown = useCallback((type, event) => {
    if (!isLg) return;
    event.preventDefault();
    dragRef.current = { type };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, [isLg]);

  const handlePointerMove = useCallback(
    (event) => {
      if (!dragRef.current) return;
      updateColumns(event.clientX);
    },
    [updateColumns],
  );

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    const [left, center, right] = colPercentsRef.current;
    const leftDelta = Math.abs((availableWidth * left) / 100 - defaultLeftPx);
    const centerDelta = Math.abs((availableWidth * center) / 100 - defaultCenterPx);
    const rightDelta = Math.abs((availableWidth * right) / 100 - defaultRightPx);
    if (leftDelta <= SNAP_PX && centerDelta <= SNAP_PX && rightDelta <= SNAP_PX) {
      setColPercents(DEFAULT_COLS);
      setVisualizerColumns(DEFAULT_COLS);
      return;
    }
    setVisualizerColumns([left, center, right]);
  }, [availableWidth, defaultCenterPx, defaultLeftPx, defaultRightPx, setVisualizerColumns]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const rightTabs = useMemo(() => {
    const explanationTab = infoTabs.find((tab) => tab.id === 'explanation');
    const complexityTab = infoTabs.find((tab) => tab.id === 'complexity');
    const guideTab = infoTabs.find((tab) => tab.id === 'guide');
    const resultTab = infoTabs.find((tab) => tab.id === 'result');

    const explanationContent = (
      <div className="space-y-4">
        {resultTab?.content}
        {explanationTab?.content}
      </div>
    );

    const tabs = [];
    if (explanationTab || resultTab) {
      tabs.push({ id: 'explanation', label: 'Explanation', content: explanationContent });
    }
    if (complexityTab) {
      tabs.push({ id: 'complexity', label: 'Complexity', content: complexityTab.content });
    }
    if (guideTab) {
      tabs.push({ id: 'guide', label: 'Guide', content: guideTab.content });
    }
    return tabs;
  }, [infoTabs]);

  const [activeRightTab, setActiveRightTab] = useState(() => {
    const savedTab = getPanelPreference('visualizer-right', 'activeTab', null);
    if (savedTab && rightTabs.some((tab) => tab.id === savedTab)) {
      return savedTab;
    }
    return rightTabs[0]?.id || 'explanation';
  });

  const setRightTab = useCallback((tabId) => {
    setActiveRightTab(tabId);
    setPanelPreference('visualizer-right', 'activeTab', tabId);
  }, [setPanelPreference]);

  const currentRightTab = rightTabs.some((tab) => tab.id === activeRightTab)
    ? activeRightTab
    : rightTabs[0]?.id;

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
      <div className="w-full px-4 py-6">
        {/* Three Column Grid Layout - Screen Height */}
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 lg:grid-cols-3 gap-4"
          style={{
            minHeight: 'calc(100vh - 60px)',
            ...(isLg
              ? {
                  gridTemplateColumns: `calc((100% - ${GAP_PX * 2}px) * ${
                    colPercents[0] / 100
                  }) calc((100% - ${GAP_PX * 2}px) * ${
                    colPercents[1] / 100
                  }) calc((100% - ${GAP_PX * 2}px) * ${colPercents[2] / 100})`,
                }
              : {}),
          }}
        >
          {isLg && (
            <>
              <div
                className="absolute top-0 bottom-0 cursor-col-resize hidden lg:flex items-center justify-center z-10 touch-none group"
                style={{ left: leftPx, width: GAP_PX }}
                onPointerDown={(event) => handlePointerDown('left', event)}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize left panel"
              >
                <div className="w-1 h-12 rounded-full bg-transparent group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors" />
              </div>
              <div
                className="absolute top-0 bottom-0 cursor-col-resize hidden lg:flex items-center justify-center z-10 touch-none group"
                style={{ left: leftPx + GAP_PX + centerPx, width: GAP_PX }}
                onPointerDown={(event) => handlePointerDown('right', event)}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize right panel"
              >
                <div className="w-1 h-12 rounded-full bg-transparent group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors" />
              </div>
            </>
          )}
          {/* Left Column - Configuration, Controls & Guide (3 cols) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col overflow-hidden">
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
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col overflow-hidden">
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
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col overflow-hidden">
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
                        currentRightTab === tab.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-y-auto pt-4 max-h-[30vh]">
                  {rightTabs.find((tab) => tab.id === currentRightTab)?.content}
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
