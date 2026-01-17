import { useState, useEffect, useRef, useCallback } from 'react';
import useUserPreferences from '../context/useUserPreferences';

export default function usePlayback(stepFn, canStep, defaultSpeed) {
  const { playbackSpeed, setPlaybackSpeed } = useUserPreferences();
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(() => defaultSpeed ?? playbackSpeed ?? 500);
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
    if (!isRunning && playbackSpeed && playbackSpeed !== speed) {
      setSpeed(playbackSpeed);
    }
  }, [isRunning, playbackSpeed, speed]);

  const setSpeedAndPersist = useCallback(
    (nextSpeed) => {
      setSpeed(nextSpeed);
      setPlaybackSpeed(nextSpeed);
    },
    [setPlaybackSpeed],
  );

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
    setSpeed: setSpeedAndPersist,
    start,
    stop,
    toggle,
  };
}
