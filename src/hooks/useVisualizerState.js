import { useState, useCallback } from 'react';

export default function useVisualizerState(initialStateFn, executeStepFn) {
  const [state, setState] = useState(null);
  const [history, setHistory] = useState([]);

  const reset = useCallback((input) => {
    const newState = initialStateFn(input);
    setState(newState);
    setHistory([newState]);
  }, [initialStateFn]);

  const step = useCallback(() => {
    if (!state || state.done) return false;
    const newState = executeStepFn(state);
    setState(newState);
    setHistory((prev) => [...prev, newState]);
    return !newState.done;
  }, [state, executeStepFn]);

  const back = useCallback(() => {
    if (history.length <= 1) return false;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setState(newHistory[newHistory.length - 1]);
    return true;
  }, [history]);

  const canStep = state && !state.done;
  const canBack = history.length > 1;

  return {
    state,
    history,
    step,
    back,
    reset,
    canStep,
    canBack,
  };
}
