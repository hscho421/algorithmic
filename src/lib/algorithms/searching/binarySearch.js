export const TEMPLATES = {
  lower_bound: {
    name: 'Lower Bound [l, r)',
    description: 'Find first index where a[i] ≥ target',
    halfOpen: true,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n', indent: 0 },
      { line: 'while l < r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if a[m] < target:', indent: 1 },
      { line: 'l = m + 1', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: 'r = m', indent: 2 },
      { line: 'return l', indent: 0 },
    ],
  },
  upper_bound: {
    name: 'Upper Bound [l, r)',
    description: 'Find first index where a[i] > target',
    halfOpen: true,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n', indent: 0 },
      { line: 'while l < r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if a[m] <= target:', indent: 1 },
      { line: 'l = m + 1', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: 'r = m', indent: 2 },
      { line: 'return l', indent: 0 },
    ],
  },
  exact_search: {
    name: 'Exact Search [l, r]',
    description: 'Find exact index or return -1',
    halfOpen: false,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n - 1', indent: 0 },
      { line: 'while l <= r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if a[m] == target:', indent: 1 },
      { line: 'return m', indent: 2 },
      { line: 'elif a[m] < target:', indent: 1 },
      { line: 'l = m + 1', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: 'r = m - 1', indent: 2 },
      { line: 'return -1', indent: 0 },
    ],
  },
};

export const complexity = {
  time: 'O(log n)',
  space: 'O(1)',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
};

export const initialState = ({ array, target, templateKey }) => {
  const template = TEMPLATES[templateKey];
  const n = array.length;
  return {
    array,
    target,
    templateKey,
    n,
    l: 0,
    r: template.halfOpen ? n : n - 1,
    m: null,
    done: false,
    result: null,
    currentLine: 0,
    iteration: 0,
    comparison: null,
  };
};

export const executeStep = (state) => {
  const { array, target, templateKey, n, l, r, done } = state;
  const template = TEMPLATES[templateKey];

  if (done || n === 0) {
    return {
      ...state,
      done: true,
      result: n === 0 ? (template.halfOpen ? 0 : -1) : state.result,
    };
  }

  if (templateKey === 'exact_search') {
    if (l > r) {
      return { ...state, done: true, result: -1, currentLine: 10 };
    }
    const m = Math.floor((l + r) / 2);
    if (array[m] === target) {
      return { ...state, m, done: true, result: m, currentLine: 5, comparison: 'equal' };
    } else if (array[m] < target) {
      return { ...state, m, l: m + 1, currentLine: 7, comparison: 'less', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m - 1, currentLine: 9, comparison: 'greater', iteration: state.iteration + 1 };
    }
  } else {
    if (l >= r) {
      return { ...state, done: true, result: l, currentLine: 8 };
    }
    const m = Math.floor((l + r) / 2);
    const condition = templateKey === 'lower_bound' ? array[m] < target : array[m] <= target;
    if (condition) {
      return { ...state, m, l: m + 1, currentLine: 5, comparison: 'less', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m, currentLine: 7, comparison: 'greater_or_equal', iteration: state.iteration + 1 };
    }
  }
};

export const getExplanation = (state) => {
  const { done, result, templateKey, m, array, target, comparison} = state;

  if (done) {
    if (templateKey === 'exact_search') {
      return result !== -1
        ? `Found target ${target} at index ${result}.`
        : `Target ${target} not found in the array.`;
    }
    return `Search complete. Result index: ${result}`;
  }

  if (m === null) {
    return 'Initializing search bounds...';
  }

  const value = array[m];
  if (comparison === 'less') {
    return `a[${m}] = ${value} < ${target}, so target must be in right half. Moving L to ${m + 1}.`;
  }
  if (comparison === 'greater') {
    return `a[${m}] = ${value} > ${target}, so target must be in left half. Moving R to ${m - 1}.`;
  }
  if (comparison === 'greater_or_equal') {
    return `a[${m}] = ${value} ≥ ${target}, so target could be at ${m} or earlier. Moving R to ${m}.`;
  }
  if (comparison === 'equal') {
    return `a[${m}] = ${value} equals target ${target}. Found!`;
  }

  return `Checking middle element at index ${m}.`;
};

export const getResult = (state) => {
  if (!state.done) return null;

  const { result, templateKey, target, array } = state;

  if (templateKey === 'exact_search') {
    return {
      success: result !== -1,
      title: result !== -1 ? '✓ Found' : '✗ Not Found',
      message: result !== -1
        ? `Found target ${target} at index ${result}`
        : `Target ${target} not found in array`,
      details: `Result: ${result}`,
    };
  }

  const atIndex = result < array.length ? array[result] : null;
  const label = templateKey === 'lower_bound' ? 'a[i] ≥' : 'a[i] >';

  return {
    success: true,
    title: '✓ Complete',
    message: `First index where ${label} ${target} is ${result}${atIndex !== null ? ` (value: ${atIndex})` : ''}`,
    details: `Result: ${result}`,
  };
};
