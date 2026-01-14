import { useState, useEffect, useRef, useCallback } from 'react';

export default function usePlayback(stepFn, canStep, defaultSpeed = 500) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (!canStep) return;
    runningRef.current = true;
    setIsRunning(true);
  }, [canStep]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  useEffect(() => {
    if (!isRunning || !canStep) {
      if (!canStep) stop();
      return;
    }

    const timer = setTimeout(() => {
      if (runningRef.current) {
        const hasMore = stepFn();
        if (!hasMore) stop();
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, canStep, speed, stepFn, stop]);

  return {
    isRunning,
    speed,
    setSpeed,
    start,
    stop,
    toggle,
  };
}
