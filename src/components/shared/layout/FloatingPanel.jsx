import { useState, useRef, useEffect } from 'react';
import useFloatingPanel from '../../../hooks/useFloatingPanel';

export default function FloatingPanel({
  panelId,
  position = 'left',
  defaultWidth = 340,
  minWidth = 280,
  maxWidth = 600,
  isCollapsible = true,
  defaultCollapsed = false,
  title,
  icon,
  children,
  className = '',
}) {
  const { isCollapsed, isMinimized, width, toggleCollapse, toggleMinimize, updateWidth } =
    useFloatingPanel(panelId, defaultCollapsed);

  const panelRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const actualWidth = width || defaultWidth;

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (!panelRef.current) return;

      let newWidth;
      if (position === 'left') {
        newWidth = e.clientX;
      } else if (position === 'right') {
        newWidth = window.innerWidth - e.clientX;
      }

      if (newWidth && newWidth >= minWidth && newWidth <= maxWidth) {
        updateWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, position, minWidth, maxWidth, updateWidth]);

  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapse}
        className={`
          fixed ${position === 'left' ? 'left-4' : 'right-4'} top-24
          z-[var(--z-floating-panel)]
          w-12 h-12 rounded-full
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-200
          ${className}
        `}
        aria-label={`Show ${title || 'panel'}`}
        title={`Show ${title || 'panel'}`}
      >
        {icon || (
          <svg className="w-5 h-5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={position === 'left' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`
        fixed ${position === 'left' ? 'left-0' : 'right-0'} top-0
        h-screen
        z-[var(--z-floating-panel)]
        bg-white/95 dark:bg-zinc-900/95
        backdrop-blur-md
        border-${position === 'left' ? 'r' : 'l'} border-zinc-200 dark:border-zinc-800
        shadow-2xl
        flex flex-col
        transition-transform duration-300 ease-out
        ${isMinimized ? 'w-16' : ''}
        ${className}
      `}
      style={{
        width: isMinimized ? '64px' : `${actualWidth}px`,
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        {!isMinimized && (
          <div className="flex items-center gap-2">
            {icon && <span className="text-zinc-600 dark:text-zinc-400">{icon}</span>}
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
              {title}
            </h2>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMinimize}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
            aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? 'M4 8h16M4 16h16' : 'M20 12H4'} />
            </svg>
          </button>

          {isCollapsible && (
            <button
              onClick={toggleCollapse}
              className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
              aria-label="Close panel"
              title="Close"
            >
              <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          {children}
        </div>
      )}

      {/* Resize Handle */}
      {!isMinimized && (
        <div
          className={`
            absolute ${position === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0
            w-1 cursor-col-resize
            hover:bg-blue-500/50
            active:bg-blue-500
            transition-colors
          `}
          onMouseDown={() => setIsResizing(true)}
          role="separator"
          aria-label="Resize panel"
        />
      )}
    </div>
  );
}
