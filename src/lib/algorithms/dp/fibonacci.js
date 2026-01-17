// Fibonacci Sequence with Dynamic Programming
// Demonstrates tabulation approach

export const TEMPLATES = {
  tabulation: {
    id: 'tabulation',
    name: 'Fibonacci (Tabulation)',
    description: 'Bottom-up approach building table iteratively',
    approach: 'tabulation',
    code: [
      { line: 'def fib(n):', indent: 0 },
      { line: 'if n <= 1: return n', indent: 1 },
      { line: '', indent: 0 },
      { line: 'dp = [0, 1]', indent: 1 },
      { line: 'for i in range(2, n + 1):', indent: 1 },
      { line: 'dp[i] = dp[i - 1] + dp[i - 2]', indent: 2 },
      { line: 'return dp[n]', indent: 1 },
    ],
  },
};

export const complexity = {
  time: 'O(n)',
  space: 'O(n)',
  description: 'Linear time with a table; constant space possible with optimization',
};

export function initialState({ n = 5 } = {}) {
  const approach = 'tabulation';
  const template = TEMPLATES.tabulation;
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
  return executeTabulationStep(state);
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
      `Table size: ${state.dp.length}`,
    ],
  };
}
