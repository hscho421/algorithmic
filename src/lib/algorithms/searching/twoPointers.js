export const template = {
  name: 'Two Pointers',
  description: 'Find a pair with target sum using two pointers — O(n)',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  code: [
    { line: 'def two_sum_sorted(arr, target):', indent: 0 },
    { line: 'left, right = 0, len(arr) - 1', indent: 1 },
    { line: 'while left < right:', indent: 1 },
    { line: 'current_sum = arr[left] + arr[right]', indent: 2 },
    { line: 'if current_sum == target:', indent: 2 },
    { line: 'return [left, right]', indent: 3 },
    { line: 'elif current_sum < target:', indent: 2 },
    { line: 'left += 1', indent: 3 },
    { line: 'else:', indent: 2 },
    { line: 'right -= 1', indent: 3 },
    { line: 'return []', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n)',
  space: 'O(1)',
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
};

const generateSteps = (inputArray, target) => {
  const steps = [];
  const array = [...inputArray].sort((a, b) => a - b);

  const addStep = (state) => {
    steps.push({
      array: [...array],
      target,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Find two numbers in sorted array that sum to ${target}.`,
    l: null,
    r: null,
    currentSum: null,
  });

  let left = 0;
  let right = array.length - 1;

  addStep({
    phase: 'init',
    currentLine: 1,
    explanation: `Initialize left pointer at index 0 (value ${array[left]}) and right pointer at index ${right} (value ${array[right]}).`,
    l: left,
    r: right,
    currentSum: null,
  });

  let found = false;
  let iterations = 0;

  while (left < right) {
    iterations++;
    const currentSum = array[left] + array[right];

    addStep({
      phase: 'calculate',
      currentLine: 3,
      explanation: `Calculate sum: arr[${left}] + arr[${right}] = ${array[left]} + ${array[right]} = ${currentSum}`,
      l: left,
      r: right,
      currentSum,
    });

    if (currentSum === target) {
      addStep({
        phase: 'found',
        currentLine: 5,
        explanation: `Found! ${array[left]} + ${array[right]} = ${target}. Indices: [${left}, ${right}]`,
        l: left,
        r: right,
        currentSum,
        found: true,
      });
      found = true;
      break;
    } else if (currentSum < target) {
      addStep({
        phase: 'too-small',
        currentLine: 7,
        explanation: `Sum ${currentSum} < target ${target}. Need larger sum, so move left pointer right.`,
        l: left,
        r: right,
        currentSum,
      });
      left++;
      if (left < right) {
        addStep({
          phase: 'move-left',
          currentLine: 7,
          explanation: `Left pointer moved to index ${left} (value ${array[left]}).`,
          l: left,
          r: right,
          currentSum: null,
        });
      }
    } else {
      addStep({
        phase: 'too-large',
        currentLine: 9,
        explanation: `Sum ${currentSum} > target ${target}. Need smaller sum, so move right pointer left.`,
        l: left,
        r: right,
        currentSum,
      });
      right--;
      if (left < right) {
        addStep({
          phase: 'move-right',
          currentLine: 9,
          explanation: `Right pointer moved to index ${right} (value ${array[right]}).`,
          l: left,
          r: right,
          currentSum: null,
        });
      }
    }
  }

  if (!found) {
    addStep({
      phase: 'not-found',
      currentLine: 10,
      explanation: `No pair found that sums to ${target}. Pointers crossed.`,
      l: left,
      r: right,
      currentSum: null,
      done: true,
    });
  } else {
    addStep({
      phase: 'done',
      currentLine: 5,
      explanation: `Solution found in ${iterations} iterations. Pair: [${array[left]}, ${array[right]}] at indices [${left}, ${right}].`,
      l: left,
      r: right,
      currentSum: target,
      done: true,
      foundIndices: [left, right],
    });
  }

  return steps;
};

export const initialState = ({ array, target }) => {
  const steps = generateSteps(array, target);
  return {
    array: [...array].sort((a, b) => a - b),
    target,
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

  if (state.foundIndices) {
    return {
      success: true,
      title: 'Pair Found',
      message: `Found pair that sums to ${state.target}`,
      details: [
        `Indices: [${state.foundIndices.join(', ')}]`,
        `Values: [${state.array[state.foundIndices[0]]}, ${state.array[state.foundIndices[1]]}]`,
      ],
    };
  }

  return {
    success: false,
    title: 'No Pair Found',
    message: `No two numbers sum to ${state.target}`,
    details: [],
  };
};
