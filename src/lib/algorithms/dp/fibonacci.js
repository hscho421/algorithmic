// Fibonacci Sequence with Dynamic Programming
// Demonstrates memoization and tabulation approaches

export const TEMPLATES = {
  memoization: {
    id: 'memoization',
    name: 'Fibonacci (Memoization)',
    description: 'Top-down approach with recursive calls and caching',
    approach: 'memoization',
    code: [
      { line: 'function fib(n, memo = {}):', indent: 0 },
      { line: 'if n <= 1: return n', indent: 1 },
      { line: 'if memo[n]: return memo[n]', indent: 1 },
      { line: '', indent: 0 },
      { line: 'memo[n] = fib(n-1) + fib(n-2)', indent: 1 },
      { line: 'return memo[n]', indent: 1 },
    ],
  },
  tabulation: {
    id: 'tabulation',
    name: 'Fibonacci (Tabulation)',
    description: 'Bottom-up approach building table iteratively',
    approach: 'tabulation',
    code: [
      { line: 'function fib(n):', indent: 0 },
      { line: 'if n <= 1: return n', indent: 1 },
      { line: '', indent: 0 },
      { line: 'dp = [0, 1]', indent: 1 },
      { line: 'for i = 2 to n:', indent: 1 },
      { line: 'dp[i] = dp[i-1] + dp[i-2]', indent: 2 },
      { line: 'return dp[n]', indent: 1 },
    ],
  },
};

export const complexity = {
  time: 'O(n)',
  space: 'O(n)',
  description: 'Linear time with memoization, constant space possible with optimization',
};

export function initialState({ n = 5, approach = 'tabulation' } = {}) {
  const template = TEMPLATES[approach];

  if (approach === 'memoization') {
    return {
      n,
      approach,
      template,
      callStack: [{ n, depth: 0, id: 0 }],
      memo: {},
      currentCall: 0,
      stepIndex: 0,
      done: false,
      currentLine: 1,
      result: null,
      explanation: `Starting fib(${n}) with memoization`,
      nextCallId: 1,
      completedCalls: [],
    };
  }

  // Tabulation approach
  const dp = n <= 1 ? [n] : [0, 1];
  return {
    n,
    approach,
    template,
    dp,
    i: 2,
    stepIndex: 0,
    done: n <= 1,
    currentLine: n <= 1 ? 2 : 5,
    result: n <= 1 ? n : null,
    explanation: n <= 1 ? `Base case: fib(${n}) = ${n}` : 'Building table from bottom up',
  };
}

export function executeStep(state) {
  if (state.done) return state;

  if (state.approach === 'memoization') {
    return executeMemoizationStep(state);
  }
  return executeTabulationStep(state);
}

function executeMemoizationStep(state) {
  const { callStack, memo, currentCall, nextCallId, completedCalls, n } = state;

  if (callStack.length === 0) {
    // All calls complete
    return {
      ...state,
      done: true,
      result: memo[n],
      currentLine: 6,
      explanation: `Final result: fib(${n}) = ${memo[n]}`,
    };
  }

  const call = callStack[currentCall];

  // Base case
  if (call.n <= 1) {
    memo[call.n] = call.n;
    const newCompleted = [...completedCalls, { ...call, result: call.n }];
    const newStack = callStack.filter((_, idx) => idx !== currentCall);

    return {
      ...state,
      memo: { ...memo },
      callStack: newStack,
      completedCalls: newCompleted,
      currentCall: Math.max(0, currentCall - 1),
      stepIndex: state.stepIndex + 1,
      currentLine: 2,
      explanation: `Base case: fib(${call.n}) = ${call.n}`,
    };
  }

  // Check memo
  if (memo[call.n] !== undefined) {
    const newCompleted = [...completedCalls, { ...call, result: memo[call.n] }];
    const newStack = callStack.filter((_, idx) => idx !== currentCall);

    return {
      ...state,
      callStack: newStack,
      completedCalls: newCompleted,
      currentCall: Math.max(0, currentCall - 1),
      stepIndex: state.stepIndex + 1,
      currentLine: 3,
      explanation: `Cache hit: fib(${call.n}) = ${memo[call.n]}`,
    };
  }

  // Need to make recursive calls
  if (!call.leftChild && !call.rightChild) {
    // Create child calls
    const leftChild = { n: call.n - 1, depth: call.depth + 1, id: nextCallId, parent: call.id };
    const rightChild = { n: call.n - 2, depth: call.depth + 1, id: nextCallId + 1, parent: call.id };

    const updatedCall = { ...call, leftChild: leftChild.id, rightChild: rightChild.id };
    const newStack = [
      ...callStack.slice(0, currentCall),
      updatedCall,
      leftChild,
      rightChild,
      ...callStack.slice(currentCall + 1),
    ];

    return {
      ...state,
      callStack: newStack,
      currentCall: currentCall + 1,
      nextCallId: nextCallId + 2,
      stepIndex: state.stepIndex + 1,
      currentLine: 5,
      explanation: `Making calls: fib(${call.n - 1}) + fib(${call.n - 2})`,
    };
  }

  // Both children computed, combine results
  const leftResult = memo[call.n - 1];
  const rightResult = memo[call.n - 2];

  if (leftResult !== undefined && rightResult !== undefined) {
    const result = leftResult + rightResult;
    memo[call.n] = result;
    const newCompleted = [...completedCalls, { ...call, result }];
    const newStack = callStack.filter((_, idx) => idx !== currentCall);

    return {
      ...state,
      memo: { ...memo },
      callStack: newStack,
      completedCalls: newCompleted,
      currentCall: Math.max(0, currentCall - 1),
      stepIndex: state.stepIndex + 1,
      currentLine: 5,
      explanation: `Computed: fib(${call.n}) = ${leftResult} + ${rightResult} = ${result}`,
    };
  }

  // Move to next call
  return {
    ...state,
    currentCall: currentCall + 1,
    stepIndex: state.stepIndex + 1,
  };
}

function executeTabulationStep(state) {
  const { dp, i, n } = state;

  if (i > n) {
    return {
      ...state,
      done: true,
      result: dp[n],
      currentLine: 7,
      explanation: `Table complete: fib(${n}) = ${dp[n]}`,
    };
  }

  const newValue = dp[i - 1] + dp[i - 2];
  const newDp = [...dp, newValue];

  return {
    ...state,
    dp: newDp,
    i: i + 1,
    stepIndex: state.stepIndex + 1,
    currentLine: 6,
    explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${newValue}`,
  };
}

export function getExplanation(state) {
  return state.explanation;
}

export function getResult(state) {
  if (!state.done) return null;

  return {
    success: true,
    title: 'Fibonacci Sequence Complete',
    message: `fib(${state.n}) = ${state.result}`,
    details: [
      `Approach: ${state.approach}`,
      `Steps taken: ${state.stepIndex}`,
      state.approach === 'memoization'
        ? `Recursive calls: ${state.completedCalls.length}`
        : `Table size: ${state.dp.length}`,
    ],
  };
}
