export const template = {
  name: 'Selection Sort',
  description: 'Find minimum element and place at beginning — O(n²)',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: [
    { line: 'def selection_sort(arr):', indent: 0 },
    { line: 'n = len(arr)', indent: 1 },
    { line: 'for i in range(n):', indent: 1 },
    { line: 'min_idx = i', indent: 2 },
    { line: 'for j in range(i + 1, n):', indent: 2 },
    { line: 'if arr[j] < arr[min_idx]:', indent: 3 },
    { line: 'min_idx = j', indent: 4 },
    { line: 'arr[i], arr[min_idx] = arr[min_idx], arr[i]', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(n²)',
  space: 'O(1)',
  bestCase: 'O(n²)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
};

const generateSteps = (inputArray) => {
  const steps = [];
  const array = [...inputArray];
  const n = array.length;

  const addStep = (state) => {
    steps.push({
      array: [...array],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Starting selection sort on array of ${n} elements.`,
    highlights: [],
    comparisons: 0,
    swaps: 0,
  });

  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    addStep({
      phase: 'start-pass',
      currentLine: 3,
      explanation: `Pass ${i + 1}: Find minimum in unsorted portion [${i}..${n - 1}]. Assume min is at index ${i} (value ${array[i]})`,
      highlights: [
        { index: i, type: 'pivot' },
        ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
      ],
      comparisons,
      swaps,
      minIdx,
      pass: i + 1,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;

      addStep({
        phase: 'compare',
        currentLine: 5,
        explanation: `Comparing arr[${j}]=${array[j]} with current min arr[${minIdx}]=${array[minIdx]}`,
        highlights: [
          { index: j, type: 'comparing' },
          { index: minIdx, type: 'pivot' },
          ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
        ],
        comparisons,
        swaps,
        minIdx,
        pass: i + 1,
      });

      if (array[j] < array[minIdx]) {
        const oldMin = minIdx;
        minIdx = j;

        addStep({
          phase: 'new-min',
          currentLine: 6,
          explanation: `Found new minimum! ${array[j]} < ${array[oldMin]}. Update min_idx to ${j}`,
          highlights: [
            { index: j, type: 'pivot' },
            { index: oldMin, type: 'active' },
            ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
          ],
          comparisons,
          swaps,
          minIdx,
          pass: i + 1,
        });
      }
    }

    if (minIdx !== i) {
      addStep({
        phase: 'before-swap',
        currentLine: 7,
        explanation: `Swap arr[${i}]=${array[i]} with arr[${minIdx}]=${array[minIdx]} (the minimum)`,
        highlights: [
          { index: i, type: 'swapping' },
          { index: minIdx, type: 'swapping' },
          ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
        ],
        comparisons,
        swaps,
        minIdx,
        pass: i + 1,
      });

      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      swaps++;

      addStep({
        phase: 'after-swap',
        currentLine: 7,
        explanation: `Swapped! ${array[i]} is now in correct position at index ${i}`,
        highlights: [
          { index: i, type: 'placed' },
          { index: minIdx, type: 'swapped' },
          ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
        ],
        comparisons,
        swaps,
        minIdx,
        pass: i + 1,
      });
    } else {
      addStep({
        phase: 'no-swap',
        currentLine: 7,
        explanation: `Element ${array[i]} at index ${i} is already the minimum. No swap needed.`,
        highlights: [
          { index: i, type: 'placed' },
          ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
        ],
        comparisons,
        swaps,
        minIdx,
        pass: i + 1,
      });
    }

    addStep({
      phase: 'pass-complete',
      currentLine: 2,
      explanation: `Pass ${i + 1} complete. Sorted portion: [${array.slice(0, i + 1).join(', ')}]`,
      highlights: Array.from({ length: i + 1 }, (_, idx) => ({ index: idx, type: 'sorted' })),
      comparisons,
      swaps,
      pass: i + 1,
    });
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Sorting complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}`,
    highlights: array.map((_, idx) => ({ index: idx, type: 'sorted' })),
    comparisons,
    swaps,
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

  return {
    success: true,
    title: 'Sorted',
    message: `Array sorted using selection sort`,
    details: [`Comparisons: ${state.comparisons}`, `Swaps: ${state.swaps}`],
  };
};
