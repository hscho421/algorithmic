export const template = {
  name: 'Counting Sort',
  description: 'Non-comparison sort using element frequency — O(n + k)',
  timeComplexity: 'O(n + k)',
  spaceComplexity: 'O(k)',
  code: [
    { line: 'def counting_sort(arr):', indent: 0 },
    { line: 'max_val = max(arr)', indent: 1 },
    { line: 'count = [0] * (max_val + 1)', indent: 1 },
    { line: 'for num in arr:', indent: 1 },
    { line: 'count[num] += 1', indent: 2 },
    { line: 'idx = 0', indent: 1 },
    { line: 'for i in range(len(count)):', indent: 1 },
    { line: 'while count[i] > 0:', indent: 2 },
    { line: 'arr[idx] = i', indent: 3 },
    { line: 'idx += 1', indent: 3 },
    { line: 'count[i] -= 1', indent: 3 },
  ],
};

export const complexity = {
  time: 'O(n + k)',
  space: 'O(k)',
  bestCase: 'O(n + k)',
  averageCase: 'O(n + k)',
  worstCase: 'O(n + k)',
};

const generateSteps = (inputArray) => {
  const steps = [];
  const array = [...inputArray];
  const n = array.length;
  const maxVal = Math.max(...array);
  const count = new Array(maxVal + 1).fill(0);

  const addStep = (state) => {
    steps.push({
      array: [...array],
      countArray: [...count],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Starting counting sort. Max value is ${maxVal}, so we need a count array of size ${maxVal + 1}.`,
    highlights: [],
    countHighlights: [],
  });

  addStep({
    phase: 'init-count',
    currentLine: 2,
    explanation: `Initialize count array of size ${maxVal + 1} with all zeros.`,
    highlights: [],
    countHighlights: count.map((_, idx) => ({ index: idx, type: 'active' })),
  });

  // Count phase
  for (let i = 0; i < n; i++) {
    const num = array[i];

    addStep({
      phase: 'counting',
      currentLine: 3,
      explanation: `Processing arr[${i}] = ${num}. Increment count[${num}].`,
      highlights: [{ index: i, type: 'comparing' }],
      countHighlights: [{ index: num, type: 'writing' }],
    });

    count[num]++;

    addStep({
      phase: 'counted',
      currentLine: 4,
      explanation: `count[${num}] is now ${count[num]}.`,
      highlights: [{ index: i, type: 'active' }],
      countHighlights: [{ index: num, type: 'placed' }],
    });
  }

  addStep({
    phase: 'count-complete',
    currentLine: 5,
    explanation: `Counting complete! Count array: [${count.join(', ')}]`,
    highlights: [],
    countHighlights: count.map((c, idx) => c > 0 ? { index: idx, type: 'active' } : null).filter(Boolean),
  });

  // Reconstruction phase
  let idx = 0;
  for (let i = 0; i <= maxVal; i++) {
    if (count[i] === 0) continue;

    addStep({
      phase: 'reconstruct-start',
      currentLine: 6,
      explanation: `Value ${i} appears ${count[i]} time(s). Place ${count[i]} copies starting at index ${idx}.`,
      highlights: [],
      countHighlights: [{ index: i, type: 'comparing' }],
    });

    while (count[i] > 0) {
      addStep({
        phase: 'placing',
        currentLine: 8,
        explanation: `Place ${i} at arr[${idx}].`,
        highlights: [{ index: idx, type: 'writing' }],
        countHighlights: [{ index: i, type: 'active' }],
      });

      array[idx] = i;

      addStep({
        phase: 'placed',
        currentLine: 9,
        explanation: `arr[${idx}] = ${i}. Decrement count[${i}].`,
        highlights: [
          { index: idx, type: 'placed' },
          ...Array.from({ length: idx }, (_, j) => ({ index: j, type: 'sorted' })),
        ],
        countHighlights: [{ index: i, type: 'writing' }],
      });

      idx++;
      count[i]--;
    }
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Sorting complete! Counting sort achieved O(n + k) time where k = ${maxVal + 1}.`,
    highlights: array.map((_, i) => ({ index: i, type: 'sorted' })),
    countHighlights: [],
    done: true,
  });

  return steps;
};

export const initialState = ({ array }) => {
  const steps = generateSteps(array);
  return {
    array,
    steps,
    stepIndex: 0,
    done: false,
    ...steps[0],
  };
};

export const executeStep = (state) => {
  const { steps, stepIndex } = state;
  const nextIndex = stepIndex + 1;

  if (nextIndex >= steps.length) {
    return { ...state, done: true };
  }

  return {
    ...state,
    stepIndex: nextIndex,
    ...steps[nextIndex],
  };
};

export const getExplanation = (state) => {
  return state.explanation || 'Initializing...';
};

export const getResult = (state) => {
  if (!state.done) return null;

  const maxVal = Math.max(...state.array);
  return {
    success: true,
    title: 'Sorted',
    message: `Array sorted using counting sort`,
    details: [`Range: 0 to ${maxVal}`, `Time: O(n + ${maxVal + 1})`],
  };
};
