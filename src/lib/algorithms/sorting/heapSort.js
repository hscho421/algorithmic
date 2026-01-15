export const template = {
  name: 'Heap Sort',
  description: 'Build a max heap, then extract the max to sort in-place',
  code: [
    { line: 'heapSort(arr):', indent: 0 },
    { line: 'buildMaxHeap(arr)', indent: 1 },
    { line: 'for end = n - 1 down to 1:', indent: 1 },
    { line: 'swap arr[0], arr[end]', indent: 2 },
    { line: 'siftDown(arr, 0, end)', indent: 2 },
    { line: '', indent: 0 },
    { line: 'buildMaxHeap(arr):', indent: 0 },
    { line: 'for i = (n-2)//2 down to 0:', indent: 1 },
    { line: 'siftDown(arr, i, n)', indent: 2 },
    { line: '', indent: 0 },
    { line: 'siftDown(arr, i, size):', indent: 0 },
    { line: 'while true:', indent: 1 },
    { line: 'left = 2*i + 1, right = 2*i + 2', indent: 2 },
    { line: 'largest = i', indent: 2 },
    { line: 'if left < size and arr[left] > arr[largest]:', indent: 2 },
    { line: 'largest = left', indent: 3 },
    { line: 'if right < size and arr[right] > arr[largest]:', indent: 2 },
    { line: 'largest = right', indent: 3 },
    { line: 'if largest == i: break', indent: 2 },
    { line: 'swap arr[i], arr[largest]', indent: 2 },
    { line: 'i = largest', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(n log n)',
  space: 'O(1)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
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

  const siftDown = (i, size) => {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;

      addStep({
        phase: 'sift-check',
        currentLine: 11,
        explanation: `Check children of index ${i}.`,
        highlights: [{ index: i, type: 'active' }],
        pointers: { i, left, right },
        heapSize: size,
      });

      if (left < size) {
        comparisons++;
        addStep({
          phase: 'compare-left',
          currentLine: 14,
          explanation: `Compare left child arr[${left}] = ${array[left]} with arr[${largest}] = ${array[largest]}.`,
          highlights: [
            { index: largest, type: 'comparing' },
            { index: left, type: 'comparing' },
          ],
          pointers: { i, left, right },
          heapSize: size,
        });
        if (array[left] > array[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        comparisons++;
        addStep({
          phase: 'compare-right',
          currentLine: 16,
          explanation: `Compare right child arr[${right}] = ${array[right]} with arr[${largest}] = ${array[largest]}.`,
          highlights: [
            { index: largest, type: 'comparing' },
            { index: right, type: 'comparing' },
          ],
          pointers: { i, left, right },
          heapSize: size,
        });
        if (array[right] > array[largest]) {
          largest = right;
        }
      }

      if (largest === i) {
        addStep({
          phase: 'heap-ok',
          currentLine: 18,
          explanation: 'Heap property satisfied at this node.',
          highlights: [{ index: i, type: 'sorted' }],
          pointers: { i },
          heapSize: size,
        });
        break;
      }

      addStep({
        phase: 'swap',
        currentLine: 19,
        explanation: `Swap arr[${i}] = ${array[i]} with arr[${largest}] = ${array[largest]}.`,
        highlights: [
          { index: i, type: 'swapping' },
          { index: largest, type: 'swapping' },
        ],
        pointers: { i, largest },
        heapSize: size,
      });

      [array[i], array[largest]] = [array[largest], array[i]];
      swaps++;

      addStep({
        phase: 'after-swap',
        currentLine: 19,
        explanation: `After swap, continue sifting at index ${largest}.`,
        highlights: [
          { index: i, type: 'swapped' },
          { index: largest, type: 'active' },
        ],
        pointers: { i: largest },
        heapSize: size,
      });

      i = largest;
    }
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Start heap sort by building a max heap.',
    highlights: [],
    pointers: {},
    heapSize: array.length,
  });

  for (let i = Math.floor((array.length - 2) / 2); i >= 0; i -= 1) {
    addStep({
      phase: 'build-heap',
      currentLine: 7,
      explanation: `Sift down from index ${i}.`,
      highlights: [{ index: i, type: 'active' }],
      pointers: { i },
      heapSize: array.length,
    });
    siftDown(i, array.length);
  }

  for (let end = array.length - 1; end > 0; end -= 1) {
    addStep({
      phase: 'extract-max',
      currentLine: 2,
      explanation: `Swap max at root with arr[${end}].`,
      highlights: [
        { index: 0, type: 'swapping' },
        { index: end, type: 'swapping' },
      ],
      pointers: { end },
      heapSize: end + 1,
    });

    [array[0], array[end]] = [array[end], array[0]];
    swaps++;

    addStep({
      phase: 'mark-sorted',
      currentLine: 3,
      explanation: `Position ${end} is now sorted.`,
      highlights: [
        { index: end, type: 'sorted' },
        { index: 0, type: 'active' },
      ],
      pointers: { end },
      heapSize: end,
    });

    siftDown(0, end);
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: 'Heap sort complete.',
    highlights: array.map((_, idx) => ({ index: idx, type: 'sorted' })),
    pointers: {},
    heapSize: 0,
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
    message: 'Array sorted using heap sort.',
    details: `Total swaps: ${state.swaps || 0}, comparisons: ${state.comparisons || 0}.`,
  };
};
