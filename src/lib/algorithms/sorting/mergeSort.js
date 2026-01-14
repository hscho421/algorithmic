export const template = {
  name: 'Merge Sort',
  description: 'Divide and conquer sorting algorithm — O(n log n)',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  code: [
    { line: 'mergeSort(arr, l, r):', indent: 0 },
    { line: 'if l >= r: return', indent: 1 },
    { line: 'm = (l + r) // 2', indent: 1 },
    { line: 'mergeSort(arr, l, m)', indent: 1 },
    { line: 'mergeSort(arr, m+1, r)', indent: 1 },
    { line: 'merge(arr, l, m, r)', indent: 1 },
    { line: '', indent: 0 },
    { line: 'merge(arr, l, m, r):', indent: 0 },
    { line: 'left = arr[l:m+1]', indent: 1 },
    { line: 'right = arr[m+1:r+1]', indent: 1 },
    { line: 'i = j = 0, k = l', indent: 1 },
    { line: 'while i < len(left) and j < len(right):', indent: 1 },
    { line: 'if left[i] <= right[j]:', indent: 2 },
    { line: 'arr[k] = left[i]; i++', indent: 3 },
    { line: 'else:', indent: 2 },
    { line: 'arr[k] = right[j]; j++', indent: 3 },
    { line: 'k++', indent: 2 },
    { line: 'copy remaining elements', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n log n)',
  space: 'O(n)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
};

const generateSteps = (inputArray) => {
  const steps = [];
  const array = [...inputArray];
  
  const addStep = (state) => {
    steps.push({
      array: [...array],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Starting merge sort on the entire array.',
    highlights: [],
    ranges: [{ l: 0, r: array.length - 1, type: 'active' }],
    comparisons: 0,
    writes: 0,
  });

  let comparisons = 0;
  let writes = 0;

  const mergeSort = (l, r, depth = 0) => {
    if (l >= r) {
      addStep({
        phase: 'base',
        currentLine: 1,
        explanation: `Base case: subarray [${l}] has ${l > r ? 'no' : 'one'} element, already sorted.`,
        highlights: [{ index: l, type: 'sorted' }],
        ranges: [{ l, r, type: 'active' }],
        comparisons,
        writes,
        depth,
      });
      return;
    }

    const m = Math.floor((l + r) / 2);

    addStep({
      phase: 'divide',
      currentLine: 2,
      explanation: `Dividing [${l}..${r}] at middle index ${m}. Left: [${l}..${m}], Right: [${m + 1}..${r}]`,
      highlights: [{ index: m, type: 'pivot' }],
      ranges: [
        { l, r: m, type: 'left' },
        { l: m + 1, r, type: 'right' },
      ],
      comparisons,
      writes,
      depth,
    });

    addStep({
      phase: 'recurse-left',
      currentLine: 3,
      explanation: `Recursively sorting left half [${l}..${m}]`,
      highlights: [],
      ranges: [{ l, r: m, type: 'active' }],
      comparisons,
      writes,
      depth,
    });

    mergeSort(l, m, depth + 1);

    addStep({
      phase: 'recurse-right',
      currentLine: 4,
      explanation: `Recursively sorting right half [${m + 1}..${r}]`,
      highlights: [],
      ranges: [{ l: m + 1, r, type: 'active' }],
      comparisons,
      writes,
      depth,
    });

    mergeSort(m + 1, r, depth + 1);

    addStep({
      phase: 'merge-start',
      currentLine: 5,
      explanation: `Merging sorted halves [${l}..${m}] and [${m + 1}..${r}]`,
      highlights: [],
      ranges: [
        { l, r: m, type: 'left' },
        { l: m + 1, r, type: 'right' },
      ],
      comparisons,
      writes,
      depth,
    });

    const left = array.slice(l, m + 1);
    const right = array.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    addStep({
      phase: 'merge-copy',
      currentLine: 8,
      explanation: `Copied left=[${left.join(', ')}] and right=[${right.join(', ')}]`,
      highlights: [],
      ranges: [
        { l, r: m, type: 'left' },
        { l: m + 1, r, type: 'right' },
      ],
      leftCopy: left,
      rightCopy: right,
      comparisons,
      writes,
      depth,
    });

    while (i < left.length && j < right.length) {
      comparisons++;
      
      if (left[i] <= right[j]) {
        addStep({
          phase: 'compare',
          currentLine: 12,
          explanation: `Comparing left[${i}]=${left[i]} ≤ right[${j}]=${right[j]}. Taking ${left[i]} from left.`,
          highlights: [
            { index: k, type: 'writing' },
          ],
          comparing: { leftIdx: i, rightIdx: j, leftVal: left[i], rightVal: right[j] },
          ranges: [{ l, r, type: 'merging' }],
          leftCopy: left,
          rightCopy: right,
          leftPointer: i,
          rightPointer: j,
          comparisons,
          writes,
          depth,
        });
        
        array[k] = left[i];
        writes++;
        i++;
      } else {
        addStep({
          phase: 'compare',
          currentLine: 14,
          explanation: `Comparing left[${i}]=${left[i]} > right[${j}]=${right[j]}. Taking ${right[j]} from right.`,
          highlights: [
            { index: k, type: 'writing' },
          ],
          comparing: { leftIdx: i, rightIdx: j, leftVal: left[i], rightVal: right[j] },
          ranges: [{ l, r, type: 'merging' }],
          leftCopy: left,
          rightCopy: right,
          leftPointer: i,
          rightPointer: j,
          comparisons,
          writes,
          depth,
        });
        
        array[k] = right[j];
        writes++;
        j++;
      }
      k++;

      addStep({
        phase: 'after-place',
        currentLine: 16,
        explanation: `Placed element at index ${k - 1}. Array is now [${array.join(', ')}]`,
        highlights: [{ index: k - 1, type: 'placed' }],
        ranges: [{ l, r, type: 'merging' }],
        leftCopy: left,
        rightCopy: right,
        leftPointer: i,
        rightPointer: j,
        comparisons,
        writes,
        depth,
      });
    }

    while (i < left.length) {
      array[k] = left[i];
      writes++;
      
      addStep({
        phase: 'copy-remaining',
        currentLine: 17,
        explanation: `Copying remaining left element ${left[i]} to index ${k}`,
        highlights: [{ index: k, type: 'placed' }],
        ranges: [{ l, r, type: 'merging' }],
        comparisons,
        writes,
        depth,
      });
      
      i++;
      k++;
    }

    while (j < right.length) {
      array[k] = right[j];
      writes++;
      
      addStep({
        phase: 'copy-remaining',
        currentLine: 17,
        explanation: `Copying remaining right element ${right[j]} to index ${k}`,
        highlights: [{ index: k, type: 'placed' }],
        ranges: [{ l, r, type: 'merging' }],
        comparisons,
        writes,
        depth,
      });
      
      j++;
      k++;
    }

    addStep({
      phase: 'merge-done',
      currentLine: 5,
      explanation: `Merge complete for [${l}..${r}]: [${array.slice(l, r + 1).join(', ')}]`,
      highlights: array.slice(l, r + 1).map((_, idx) => ({ index: l + idx, type: 'sorted' })),
      ranges: [{ l, r, type: 'sorted' }],
      comparisons,
      writes,
      depth,
    });
  };

  if (array.length > 0) {
    mergeSort(0, array.length - 1);
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Sorting complete! Total comparisons: ${comparisons}, Total writes: ${writes}`,
    highlights: array.map((_, idx) => ({ index: idx, type: 'sorted' })),
    ranges: [{ l: 0, r: array.length - 1, type: 'sorted' }],
    comparisons,
    writes,
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
    message: `Array sorted using merge sort`,
    details: `Comparisons: ${state.comparisons} | Writes: ${state.writes}`,
  };
};
