// Kadane's Algorithm - Maximum Subarray Sum

export const template = {
  name: "Kadane's Algorithm",
  description: 'Find the contiguous subarray with maximum sum',
  code: [
    { line: 'def max_subarray(arr):', indent: 0 },
    { line: 'max_sum = arr[0]', indent: 1 },
    { line: 'current_sum = arr[0]', indent: 1 },
    { line: 'start = end = temp_start = 0', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(1, len(arr)):', indent: 1 },
    { line: 'if current_sum + arr[i] < arr[i]:', indent: 2 },
    { line: 'current_sum = arr[i]', indent: 3 },
    { line: 'temp_start = i', indent: 3 },
    { line: 'else:', indent: 2 },
    { line: 'current_sum += arr[i]', indent: 3 },
    { line: '', indent: 0 },
    { line: 'if current_sum > max_sum:', indent: 2 },
    { line: 'max_sum = current_sum', indent: 3 },
    { line: 'start, end = temp_start, i', indent: 3 },
    { line: '', indent: 0 },
    { line: 'return max_sum, start, end', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n)',
  space: 'O(1)',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  note: 'Single pass through the array',
};

const generateSteps = (arr) => {
  const steps = [];
  const n = arr.length;

  if (n === 0) {
    steps.push({
      arr: [],
      phase: 'done',
      currentIndex: null,
      maxSum: 0,
      currentSum: 0,
      start: 0,
      end: -1,
      tempStart: 0,
      currentLine: 16,
      explanation: 'Empty array - no subarray',
      done: true,
    });
    return steps;
  }

  let maxSum = arr[0];
  let currentSum = arr[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  // Initial step
  steps.push({
    arr: [...arr],
    phase: 'init',
    currentIndex: 0,
    maxSum,
    currentSum,
    start,
    end,
    tempStart,
    currentLine: 1,
    explanation: `Initialize: max_sum = ${maxSum}, current_sum = ${currentSum}`,
    highlightIndices: [0],
    subarrayRange: { start: 0, end: 0 },
    bestRange: { start: 0, end: 0 },
  });

  for (let i = 1; i < n; i++) {
    // Check step - should we extend or start fresh?
    const extendSum = currentSum + arr[i];
    const startFresh = arr[i];

    steps.push({
      arr: [...arr],
      phase: 'compare',
      currentIndex: i,
      maxSum,
      currentSum,
      start,
      end,
      tempStart,
      currentLine: 6,
      explanation: `Index ${i}: Compare extend (${currentSum} + ${arr[i]} = ${extendSum}) vs start fresh (${arr[i]})`,
      highlightIndices: [i],
      comparing: { extend: extendSum, fresh: startFresh },
      subarrayRange: { start: tempStart, end: i },
      bestRange: { start, end },
    });

    if (startFresh > extendSum) {
      // Start fresh
      currentSum = arr[i];
      tempStart = i;

      steps.push({
        arr: [...arr],
        phase: 'start-fresh',
        currentIndex: i,
        maxSum,
        currentSum,
        start,
        end,
        tempStart,
        currentLine: 7,
        explanation: `Start fresh at index ${i}: current_sum = ${arr[i]} (better than extending)`,
        highlightIndices: [i],
        subarrayRange: { start: i, end: i },
        bestRange: { start, end },
        action: 'fresh',
      });
    } else {
      // Extend current subarray
      currentSum = extendSum;

      steps.push({
        arr: [...arr],
        phase: 'extend',
        currentIndex: i,
        maxSum,
        currentSum,
        start,
        end,
        tempStart,
        currentLine: 10,
        explanation: `Extend subarray: current_sum = ${currentSum}`,
        highlightIndices: Array.from({ length: i - tempStart + 1 }, (_, j) => tempStart + j),
        subarrayRange: { start: tempStart, end: i },
        bestRange: { start, end },
        action: 'extend',
      });
    }

    // Check if we found a new maximum
    if (currentSum > maxSum) {
      const oldMax = maxSum;
      maxSum = currentSum;
      start = tempStart;
      end = i;

      steps.push({
        arr: [...arr],
        phase: 'new-max',
        currentIndex: i,
        maxSum,
        currentSum,
        start,
        end,
        tempStart,
        currentLine: 13,
        explanation: `New maximum found! max_sum = ${maxSum} (was ${oldMax}), subarray [${start}...${end}]`,
        highlightIndices: Array.from({ length: end - start + 1 }, (_, j) => start + j),
        subarrayRange: { start: tempStart, end: i },
        bestRange: { start, end },
        isNewMax: true,
      });
    } else {
      steps.push({
        arr: [...arr],
        phase: 'no-update',
        currentIndex: i,
        maxSum,
        currentSum,
        start,
        end,
        tempStart,
        currentLine: 12,
        explanation: `current_sum (${currentSum}) ≤ max_sum (${maxSum}), no update needed`,
        highlightIndices: Array.from({ length: i - tempStart + 1 }, (_, j) => tempStart + j),
        subarrayRange: { start: tempStart, end: i },
        bestRange: { start, end },
      });
    }
  }

  // Final step
  const subarrayStr = arr.slice(start, end + 1).join(', ');
  steps.push({
    arr: [...arr],
    phase: 'done',
    currentIndex: null,
    maxSum,
    currentSum,
    start,
    end,
    tempStart,
    currentLine: 16,
    explanation: `Done! Maximum subarray sum = ${maxSum}, subarray: [${subarrayStr}]`,
    highlightIndices: Array.from({ length: end - start + 1 }, (_, j) => start + j),
    subarrayRange: { start, end },
    bestRange: { start, end },
    done: true,
  });

  return steps;
};

export function initialState({ arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4] } = {}) {
  const steps = generateSteps(arr);

  return {
    ...steps[0],
    steps,
    stepIndex: 0,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= state.steps.length) {
    return { ...state, done: true };
  }

  return {
    ...state,
    ...state.steps[nextIndex],
    stepIndex: nextIndex,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { arr, maxSum, start, end } = state;
  const subarray = arr.slice(start, end + 1);

  return {
    success: true,
    title: 'Maximum Subarray Found',
    message: `Sum = ${maxSum}`,
    details: [
      `Subarray: [${subarray.join(', ')}]`,
      `Indices: ${start} to ${end}`,
      `Length: ${end - start + 1}`,
    ],
  };
}
