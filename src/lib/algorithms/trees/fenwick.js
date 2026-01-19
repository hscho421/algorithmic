export const template = {
  name: 'Fenwick Tree (BIT)',
  description: 'Efficient prefix sums with point updates',
  code: [
    { line: 'def update(i, delta):', indent: 0 },
    { line: 'while i <= n:', indent: 1 },
    { line: 'bit[i] += delta', indent: 2 },
    { line: 'i += i & -i', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def prefix_sum(i):', indent: 0 },
    { line: 'res = 0', indent: 1 },
    { line: 'while i > 0:', indent: 1 },
    { line: 'res += bit[i]', indent: 2 },
    { line: 'i -= i & -i', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(log n)',
  space: 'O(n)',
  operations: {
    update: 'O(log n)',
    query: 'O(log n)',
  },
};

const buildBit = (arr) => {
  const n = arr.length;
  const bit = Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    let idx = i + 1;
    while (idx <= n) {
      bit[idx] += arr[i];
      idx += idx & -idx;
    }
  }
  return bit;
};

const generateSteps = (arr, op) => {
  const steps = [];
  const bit = buildBit(arr);

  const addStep = (state) => {
    steps.push({
      arr: [...arr],
      bit: [...bit],
      ...state,
    });
  };

  addStep({
    phase: 'init',
    currentLine: 0,
    explanation: 'Fenwick tree built from initial array',
    highlightedIndices: [],
    result: null,
  });

  if (op.type === 'update') {
    let idx = op.index + 1;
    let stepIndex = 0;
    while (idx <= arr.length) {
      bit[idx] += op.delta;
      addStep({
        phase: 'update',
        currentLine: 2,
        explanation: `Update bit[${idx}] += ${op.delta}`,
        highlightedIndices: [idx],
        updateIndex: op.index,
        delta: op.delta,
        stepIndex: stepIndex + 1,
      });
      idx += idx & -idx;
      stepIndex += 1;
    }
  }

  if (op.type === 'query') {
    const prefix = (index) => {
      let sum = 0;
      let idx = index + 1;
      while (idx > 0) {
        sum += bit[idx];
        addStep({
          phase: 'query',
          currentLine: 8,
          explanation: `Accumulate bit[${idx}] = ${bit[idx]}`,
          highlightedIndices: [idx],
          queryIndex: index,
          runningSum: sum,
        });
        idx -= idx & -idx;
      }
      return sum;
    };

    const rightSum = prefix(op.right);
    const leftSum = op.left > 0 ? prefix(op.left - 1) : 0;
    const rangeSum = rightSum - leftSum;

    addStep({
      phase: 'result',
      currentLine: 8,
      explanation: `Range sum [${op.left}, ${op.right}] = ${rightSum} - ${leftSum} = ${rangeSum}`,
      highlightedIndices: [],
      result: rangeSum,
      done: true,
    });
  }

  if (op.type === 'update') {
    addStep({
      phase: 'result',
      currentLine: 3,
      explanation: `Update complete at index ${op.index} (delta ${op.delta})`,
      highlightedIndices: [],
      done: true,
    });
  }

  return steps;
};

export const initialState = ({ arr, operation }) => {
  const steps = generateSteps(arr, operation);
  return {
    arr,
    operation,
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

export const getExplanation = (state) => state.explanation || 'Initializing...';

export const getResult = (state) => {
  if (!state.done) return null;
  if (state.operation?.type === 'query') {
    return {
      success: true,
      title: 'Range Sum',
      message: `Result: ${state.result ?? 0}`,
      details: [],
    };
  }
  return {
    success: true,
    title: 'Update Complete',
    message: 'Fenwick tree updated',
    details: [],
  };
};
