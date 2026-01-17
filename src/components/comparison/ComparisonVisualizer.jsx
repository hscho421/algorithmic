import { useState, useCallback, useEffect, useRef } from 'react';
import { getAlgorithmById } from '../../data/algorithms';
import ComparisonControls from './ComparisonControls';
import ComparisonMetrics from './ComparisonMetrics';
import ComparisonAlgorithmPanel from './ComparisonAlgorithmPanel';
import useUserPreferences from '../../context/useUserPreferences';

export default function ComparisonVisualizer({ categoryId, algorithmIds }) {
  const { playbackSpeed, setPlaybackSpeed } = useUserPreferences();
  const [speed, setSpeed] = useState(playbackSpeed ?? 500);
  const [isRunning, setIsRunning] = useState(false);
  const [visualizerStates, setVisualizerStates] = useState({});
  const runningRef = useRef(false);
  const visualizerRefs = useRef({});

  const algorithms = algorithmIds
    .map((id) => getAlgorithmById(id))
    .filter(Boolean);

  // Initialize visualizer states
  useEffect(() => {
    const states = {};
    algorithmIds.forEach((id) => {
      states[id] = {
        canStep: false,
        canBack: false,
        isDone: false,
        stepCount: 0,
        comparisons: 0,
        state: null,
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
      };
    });
    setVisualizerStates(states);
  }, [algorithmIds]);

  // Register visualizer methods from child components
  const registerVisualizer = useCallback((algorithmId, methods) => {
    visualizerRefs.current[algorithmId] = methods;
  }, []);

  const updateVisualizerState = useCallback((algorithmId, updates) => {
    setVisualizerStates((prev) => ({
      ...prev,
      [algorithmId]: {
        ...prev[algorithmId],
        ...updates,
      },
    }));
  }, []);

  const handleStep = useCallback(() => {
    let anyCanStep = false;
    algorithmIds.forEach((id) => {
      const ref = visualizerRefs.current[id];
      if (ref && ref.canStep()) {
        ref.step();
        anyCanStep = true;
      }
    });
    return anyCanStep;
  }, [algorithmIds]);

  const handleBack = useCallback(() => {
    algorithmIds.forEach((id) => {
      const ref = visualizerRefs.current[id];
      if (ref && ref.canBack()) {
        ref.back();
      }
    });
  }, [algorithmIds]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    runningRef.current = false;
    algorithmIds.forEach((id) => {
      const ref = visualizerRefs.current[id];
      if (ref) {
        ref.reset();
      }
    });
  }, [algorithmIds]);

  const handleTogglePlay = useCallback(() => {
    if (isRunning) {
      runningRef.current = false;
      setIsRunning(false);
    } else {
      const anyCanStep = algorithmIds.some((id) => {
        const state = visualizerStates[id];
        return state && state.canStep;
      });
      if (anyCanStep) {
        runningRef.current = true;
        setIsRunning(true);
      }
    }
  }, [isRunning, algorithmIds, visualizerStates]);

  const handleSpeedChange = useCallback(
    (newSpeed) => {
      setSpeed(newSpeed);
      setPlaybackSpeed(newSpeed);
    },
    [setPlaybackSpeed]
  );

  // Auto-play effect
  useEffect(() => {
    if (!isRunning) return;

    const anyCanStep = algorithmIds.some((id) => {
      const state = visualizerStates[id];
      return state && state.canStep;
    });

    if (!anyCanStep) {
      runningRef.current = false;
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      if (runningRef.current) {
        const hasMore = handleStep();
        if (!hasMore) {
          runningRef.current = false;
          setIsRunning(false);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, speed, handleStep, algorithmIds, visualizerStates]);

  const canStep = Object.values(visualizerStates).some((state) => state.canStep);
  const canBack = Object.values(visualizerStates).some((state) => state.canBack);

  return (
    <div className="space-y-4">
      {/* Global controls */}
      <div className="max-w-7xl mx-auto px-6">
        <ComparisonControls
          isRunning={isRunning}
          canStep={canStep}
          canBack={canBack}
          speed={speed}
          onStep={handleStep}
          onBack={handleBack}
          onReset={handleReset}
          onTogglePlay={handleTogglePlay}
          onSpeedChange={handleSpeedChange}
        />
      </div>

      {/* Metrics comparison */}
      <div className="max-w-7xl mx-auto px-6">
        <ComparisonMetrics
          algorithms={algorithms}
          visualizerStates={visualizerStates}
        />
      </div>

      {/* Side-by-side visualizers */}
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`grid gap-4 ${
            algorithmIds.length === 2
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 xl:grid-cols-3'
          }`}
        >
          {algorithms.map((algorithm) => (
            <ComparisonAlgorithmPanel
              key={algorithm.id}
              algorithm={algorithm}
              categoryId={categoryId}
              registerVisualizer={(methods) => registerVisualizer(algorithm.id, methods)}
              updateState={(updates) => updateVisualizerState(algorithm.id, updates)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
