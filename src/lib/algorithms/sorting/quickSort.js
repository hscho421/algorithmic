export const template = {
  name: 'Quick Sort',
  description: 'Divide and conquer with in-place partitioning — O(n log n) average',
  code: [
    { line: 'def quick_sort(arr, lo, hi):', indent: 0 },
    { line: 'if lo >= hi: return', indent: 1 },
    { line: 'pivot = partition(arr, lo, hi)', indent: 1 },
    { line: 'quick_sort(arr, lo, pivot - 1)', indent: 1 },
    { line: 'quick_sort(arr, pivot + 1, hi)', indent: 1 },
    { line: '', indent: 0 },
    { line: 'def partition(arr, lo, hi):', indent: 0 },
    { line: 'pivot = arr[hi]', indent: 1 },
    { line: 'i = lo - 1', indent: 1 },
    { line: 'for j in range(lo, hi):', indent: 1 },
    { line: 'if arr[j] <= pivot:', indent: 2 },
    { line: 'i += 1', indent: 3 },
    { line: 'arr[i], arr[j] = arr[j], arr[i]', indent: 3 },
    { line: 'arr[i + 1], arr[hi] = arr[hi], arr[i + 1]', indent: 1 },
    { line: 'return i + 1', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n log n)',
  space: 'O(log n)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n²)',
};

const generateSteps = (inputArray) => {
  const steps = [];
  const array = [...inputArray];
  let comparisons = 0;
  let swaps = 0;

  const addStep = (state) => {
    steps.push({
      array: [...array],
      comparisons,
      swaps,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Starting Quick Sort on the entire array.',
    highlights: [],
    pivotIndex: null,
    partitionRange: null,
    pointers: {},
  });

  const quickSort = (lo, hi, depth = 0) => {
    if (lo >= hi) {
      if (lo === hi) {
        addStep({
          phase: 'base-single',
          currentLine: 1,
          explanation: `Base case: single element at index ${lo} is already sorted.`,
          highlights: [{ index: lo, type: 'sorted' }],
          pivotIndex: null,
          partitionRange: { lo, hi },
          pointers: {},
          depth,
        });
      }
      return;
    }

    addStep({
      phase: 'partition-start',
      currentLine: 6,
      explanation: `Starting partition on range [${lo}..${hi}]. Pivot is arr[${hi}] = ${array[hi]}`,
      highlights: [{ index: hi, type: 'pivot' }],
      pivotIndex: hi,
      partitionRange: { lo, hi },
      pointers: {},
      depth,
    });

    const pivotValue = array[hi];
    let i = lo - 1;

    addStep({
      phase: 'partition-init',
      currentLine: 8,
      explanation: `Pivot = ${pivotValue}, i starts at ${i} (before the range)`,
      highlights: [{ index: hi, type: 'pivot' }],
      pivotIndex: hi,
      partitionRange: { lo, hi },
      pointers: { i, j: lo },
      depth,
    });

    for (let j = lo; j < hi; j++) {
      comparisons++;

      addStep({
        phase: 'compare',
        currentLine: 10,
        explanation: `Comparing arr[${j}] = ${array[j]} with pivot ${pivotValue}`,
        highlights: [
          { index: hi, type: 'pivot' },
          { index: j, type: 'comparing' },
          ...(i >= lo ? [{ index: i, type: 'i-pointer' }] : []),
        ],
        pivotIndex: hi,
        partitionRange: { lo, hi },
        pointers: { i, j },
        depth,
      });

      if (array[j] <= pivotValue) {
        i++;

        addStep({
          phase: 'increment-i',
          currentLine: 11,
          explanation: `${array[j]} <= ${pivotValue}, increment i to ${i}`,
          highlights: [
            { index: hi, type: 'pivot' },
            { index: j, type: 'comparing' },
            { index: i, type: 'i-pointer' },
          ],
          pivotIndex: hi,
          partitionRange: { lo, hi },
          pointers: { i, j },
          depth,
        });

        if (i !== j) {
          addStep({
            phase: 'swap',
            currentLine: 12,
            explanation: `Swapping arr[${i}] = ${array[i]} with arr[${j}] = ${array[j]}`,
            highlights: [
              { index: hi, type: 'pivot' },
              { index: i, type: 'swapping' },
              { index: j, type: 'swapping' },
            ],
            pivotIndex: hi,
            partitionRange: { lo, hi },
            pointers: { i, j },
            depth,
          });

          [array[i], array[j]] = [array[j], array[i]];
          swaps++;

          addStep({
            phase: 'after-swap',
            currentLine: 12,
            explanation: `After swap: arr[${i}] = ${array[i]}, arr[${j}] = ${array[j]}`,
            highlights: [
              { index: hi, type: 'pivot' },
              { index: i, type: 'swapped' },
              { index: j, type: 'swapped' },
            ],
            pivotIndex: hi,
            partitionRange: { lo, hi },
            pointers: { i, j },
            depth,
          });
        } else {
          addStep({
            phase: 'no-swap-needed',
            currentLine: 12,
            explanation: `i == j, no swap needed`,
            highlights: [
              { index: hi, type: 'pivot' },
              { index: i, type: 'i-pointer' },
            ],
            pivotIndex: hi,
            partitionRange: { lo, hi },
            pointers: { i, j },
            depth,
          });
        }
      } else {
        addStep({
          phase: 'skip',
          currentLine: 10,
          explanation: `${array[j]} > ${pivotValue}, skip (don't move i)`,
          highlights: [
            { index: hi, type: 'pivot' },
            { index: j, type: 'comparing' },
            ...(i >= lo ? [{ index: i, type: 'i-pointer' }] : []),
          ],
          pivotIndex: hi,
          partitionRange: { lo, hi },
          pointers: { i, j },
          depth,
        });
      }
    }

    const pivotFinalPos = i + 1;

    addStep({
      phase: 'pivot-swap',
      currentLine: 13,
      explanation: `Placing pivot in final position: swap arr[${pivotFinalPos}] = ${array[pivotFinalPos]} with arr[${hi}] = ${array[hi]}`,
      highlights: [
        { index: pivotFinalPos, type: 'swapping' },
        { index: hi, type: 'swapping' },
      ],
      pivotIndex: hi,
      partitionRange: { lo, hi },
      pointers: { i, pivotFinal: pivotFinalPos },
      depth,
    });

    [array[pivotFinalPos], array[hi]] = [array[hi], array[pivotFinalPos]];
    swaps++;

    addStep({
      phase: 'pivot-placed',
      currentLine: 14,
      explanation: `Pivot ${pivotValue} is now at its final sorted position [${pivotFinalPos}]`,
      highlights: [{ index: pivotFinalPos, type: 'sorted' }],
      pivotIndex: pivotFinalPos,
      partitionRange: { lo, hi },
      pointers: {},
      depth,
    });

    addStep({
      phase: 'recurse-left',
      currentLine: 3,
      explanation: `Recursively sorting left partition [${lo}..${pivotFinalPos - 1}]`,
      highlights: [
        { index: pivotFinalPos, type: 'sorted' },
        ...Array.from({ length: pivotFinalPos - lo }, (_, idx) => ({ index: lo + idx, type: 'active' })),
      ],
      pivotIndex: pivotFinalPos,
      partitionRange: { lo, hi: pivotFinalPos - 1 },
      pointers: {},
      depth,
    });

    quickSort(lo, pivotFinalPos - 1, depth + 1);

    addStep({
      phase: 'recurse-right',
      currentLine: 4,
      explanation: `Recursively sorting right partition [${pivotFinalPos + 1}..${hi}]`,
      highlights: [
        { index: pivotFinalPos, type: 'sorted' },
        ...Array.from({ length: hi - pivotFinalPos }, (_, idx) => ({ index: pivotFinalPos + 1 + idx, type: 'active' })),
      ],
      pivotIndex: pivotFinalPos,
      partitionRange: { lo: pivotFinalPos + 1, hi },
      pointers: {},
      depth,
    });

    quickSort(pivotFinalPos + 1, hi, depth + 1);
  };

  if (array.length > 0) {
    quickSort(0, array.length - 1);
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Sorting complete! Comparisons: ${comparisons}, Swaps: ${swaps}`,
    highlights: array.map((_, idx) => ({ index: idx, type: 'sorted' })),
    pivotIndex: null,
    partitionRange: null,
    pointers: {},
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
    title: '✓ Sorted',
    message: `Array sorted using quick sort`,
    details: `Comparisons: ${state.comparisons} | Swaps: ${state.swaps}`,
  };
};
