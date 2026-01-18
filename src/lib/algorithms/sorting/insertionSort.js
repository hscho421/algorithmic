export const template = {
  name: 'Insertion Sort',
  description: 'Build sorted array one element at a time — O(n²)',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: [
    { line: 'def insertion_sort(arr):', indent: 0 },
    { line: 'for i in range(1, len(arr)):', indent: 1 },
    { line: 'key = arr[i]', indent: 2 },
    { line: 'j = i - 1', indent: 2 },
    { line: 'while j >= 0 and arr[j] > key:', indent: 2 },
    { line: 'arr[j + 1] = arr[j]', indent: 3 },
    { line: 'j -= 1', indent: 3 },
    { line: 'arr[j + 1] = key', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(n²)',
  space: 'O(1)',
  bestCase: 'O(n)',
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
    explanation: `Starting insertion sort. First element [${array[0]}] is already "sorted".`,
    highlights: [{ index: 0, type: 'sorted' }],
    comparisons: 0,
    shifts: 0,
  });

  let comparisons = 0;
  let shifts = 0;

  for (let i = 1; i < n; i++) {
    const key = array[i];

    addStep({
      phase: 'pick-key',
      currentLine: 2,
      explanation: `Pick key = ${key} at index ${i}. Insert it into sorted portion [0..${i - 1}]`,
      highlights: [
        { index: i, type: 'active' },
        ...Array.from({ length: i }, (_, idx) => ({ index: idx, type: 'sorted' })),
      ],
      comparisons,
      shifts,
      key,
      keyIndex: i,
    });

    let j = i - 1;

    addStep({
      phase: 'start-compare',
      currentLine: 3,
      explanation: `Start comparing from j = ${j}`,
      highlights: [
        { index: i, type: 'active' },
        { index: j, type: 'comparing' },
        ...Array.from({ length: j }, (_, idx) => ({ index: idx, type: 'sorted' })),
      ],
      comparisons,
      shifts,
      key,
      keyIndex: i,
      j,
    });

    while (j >= 0 && array[j] > key) {
      comparisons++;

      addStep({
        phase: 'compare',
        currentLine: 4,
        explanation: `arr[${j}]=${array[j]} > key=${key}? Yes! Shift arr[${j}] to the right.`,
        highlights: [
          { index: j, type: 'comparing' },
          { index: j + 1, type: 'writing' },
        ],
        comparisons,
        shifts,
        key,
        keyIndex: i,
        j,
      });

      array[j + 1] = array[j];
      shifts++;

      addStep({
        phase: 'shift',
        currentLine: 5,
        explanation: `Shifted ${array[j]} from index ${j} to ${j + 1}`,
        highlights: [
          { index: j + 1, type: 'swapped' },
        ],
        comparisons,
        shifts,
        key,
        keyIndex: i,
        j,
      });

      j--;

      if (j >= 0) {
        addStep({
          phase: 'move-left',
          currentLine: 6,
          explanation: `Move j to ${j}, continue comparing`,
          highlights: [
            { index: j, type: 'comparing' },
            { index: j + 1, type: 'active' },
          ],
          comparisons,
          shifts,
          key,
          keyIndex: i,
          j,
        });
      }
    }

    if (j >= 0) {
      comparisons++;
      addStep({
        phase: 'stop-compare',
        currentLine: 4,
        explanation: `arr[${j}]=${array[j]} > key=${key}? No! Found insertion point.`,
        highlights: [
          { index: j, type: 'sorted' },
          { index: j + 1, type: 'writing' },
        ],
        comparisons,
        shifts,
        key,
        keyIndex: i,
        j,
      });
    }

    array[j + 1] = key;

    addStep({
      phase: 'insert',
      currentLine: 7,
      explanation: `Insert key=${key} at index ${j + 1}`,
      highlights: [
        { index: j + 1, type: 'placed' },
        ...Array.from({ length: i + 1 }, (_, idx) =>
          idx !== j + 1 ? { index: idx, type: 'sorted' } : null
        ).filter(Boolean),
      ],
      comparisons,
      shifts,
      key,
      keyIndex: j + 1,
    });

    addStep({
      phase: 'iteration-complete',
      currentLine: 1,
      explanation: `Sorted portion is now [0..${i}]: [${array.slice(0, i + 1).join(', ')}]`,
      highlights: Array.from({ length: i + 1 }, (_, idx) => ({ index: idx, type: 'sorted' })),
      comparisons,
      shifts,
    });
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Sorting complete! Total comparisons: ${comparisons}, Total shifts: ${shifts}`,
    highlights: array.map((_, idx) => ({ index: idx, type: 'sorted' })),
    comparisons,
    shifts,
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
    message: `Array sorted using insertion sort`,
    details: [`Comparisons: ${state.comparisons}`, `Shifts: ${state.shifts}`],
  };
};
