export const template = {
  name: 'Bubble Sort',
  description: 'Compare adjacent elements and swap if out of order — O(n²)',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: [
    { line: 'def bubble_sort(arr):', indent: 0 },
    { line: 'n = len(arr)', indent: 1 },
    { line: 'for i in range(n):', indent: 1 },
    { line: 'swapped = False', indent: 2 },
    { line: 'for j in range(0, n - i - 1):', indent: 2 },
    { line: 'if arr[j] > arr[j + 1]:', indent: 3 },
    { line: 'arr[j], arr[j + 1] = arr[j + 1], arr[j]', indent: 4 },
    { line: 'swapped = True', indent: 4 },
    { line: 'if not swapped:', indent: 2 },
    { line: 'break', indent: 3 },
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
    explanation: `Starting bubble sort on array of ${n} elements.`,
    highlights: [],
    comparisons: 0,
    swaps: 0,
  });

  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n; i++) {
    let swapped = false;

    addStep({
      phase: 'outer-loop',
      currentLine: 2,
      explanation: `Pass ${i + 1}: Bubble the largest unsorted element to position ${n - i - 1}`,
      highlights: array.slice(n - i).map((_, idx) => ({ index: n - i + idx, type: 'sorted' })),
      comparisons,
      swaps,
      pass: i + 1,
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;

      addStep({
        phase: 'compare',
        currentLine: 5,
        explanation: `Comparing arr[${j}]=${array[j]} with arr[${j + 1}]=${array[j + 1]}`,
        highlights: [
          { index: j, type: 'comparing' },
          { index: j + 1, type: 'comparing' },
          ...array.slice(n - i).map((_, idx) => ({ index: n - i + idx, type: 'sorted' })),
        ],
        comparisons,
        swaps,
        pass: i + 1,
      });

      if (array[j] > array[j + 1]) {
        addStep({
          phase: 'swap',
          currentLine: 6,
          explanation: `${array[j]} > ${array[j + 1]}, swapping elements`,
          highlights: [
            { index: j, type: 'swapping' },
            { index: j + 1, type: 'swapping' },
            ...array.slice(n - i).map((_, idx) => ({ index: n - i + idx, type: 'sorted' })),
          ],
          comparisons,
          swaps,
          pass: i + 1,
        });

        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        swapped = true;

        addStep({
          phase: 'after-swap',
          currentLine: 6,
          explanation: `Swapped! Array is now [${array.join(', ')}]`,
          highlights: [
            { index: j, type: 'swapped' },
            { index: j + 1, type: 'swapped' },
            ...array.slice(n - i).map((_, idx) => ({ index: n - i + idx, type: 'sorted' })),
          ],
          comparisons,
          swaps,
          pass: i + 1,
        });
      } else {
        addStep({
          phase: 'no-swap',
          currentLine: 5,
          explanation: `${array[j]} ≤ ${array[j + 1]}, no swap needed`,
          highlights: [
            { index: j, type: 'active' },
            { index: j + 1, type: 'active' },
            ...array.slice(n - i).map((_, idx) => ({ index: n - i + idx, type: 'sorted' })),
          ],
          comparisons,
          swaps,
          pass: i + 1,
        });
      }
    }

    addStep({
      phase: 'pass-complete',
      currentLine: 8,
      explanation: `Pass ${i + 1} complete. Element ${array[n - i - 1]} is now in correct position.`,
      highlights: array.slice(n - i - 1).map((_, idx) => ({ index: n - i - 1 + idx, type: 'sorted' })),
      comparisons,
      swaps,
      pass: i + 1,
    });

    if (!swapped) {
      addStep({
        phase: 'early-exit',
        currentLine: 9,
        explanation: `No swaps in this pass — array is already sorted!`,
        highlights: array.map((_, idx) => ({ index: idx, type: 'sorted' })),
        comparisons,
        swaps,
        pass: i + 1,
      });
      break;
    }
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
    message: `Array sorted using bubble sort`,
    details: [`Comparisons: ${state.comparisons}`, `Swaps: ${state.swaps}`],
  };
};
