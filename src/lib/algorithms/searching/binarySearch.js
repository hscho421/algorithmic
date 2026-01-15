export const TEMPLATES = {
  lower_bound: {
    name: 'Lower Bound',
    description: 'Find first index where a[i] ≥ target',
    category: 'classic',
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
    name: 'Upper Bound',
    description: 'Find first index where a[i] > target',
    category: 'classic',
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
    name: 'Exact Search',
    description: 'Find exact index or return -1',
    category: 'classic',
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
  first_occurrence: {
    name: 'First Occurrence',
    description: 'Find leftmost index of target (or -1)',
    category: 'classic',
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
      { line: 'if l < n and a[l] == target:', indent: 0 },
      { line: 'return l', indent: 1 },
      { line: 'return -1', indent: 0 },
    ],
  },
  last_occurrence: {
    name: 'Last Occurrence',
    description: 'Find rightmost index of target (or -1)',
    category: 'classic',
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
      { line: 'if l > 0 and a[l-1] == target:', indent: 0 },
      { line: 'return l - 1', indent: 1 },
      { line: 'return -1', indent: 0 },
    ],
  },
  rotated_min: {
    name: 'Min in Rotated Array',
    description: 'Find minimum element in rotated sorted array',
    category: 'rotated',
    halfOpen: false,
    useRotatedArray: true,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n - 1', indent: 0 },
      { line: 'while l < r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if a[m] > a[r]:', indent: 1 },
      { line: '# min is in right half', indent: 2 },
      { line: 'l = m + 1', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: '# min is in left half (including m)', indent: 2 },
      { line: 'r = m', indent: 2 },
      { line: 'return l', indent: 0 },
    ],
  },
  rotated_search: {
    name: 'Search in Rotated Array',
    description: 'Find target in rotated sorted array',
    category: 'rotated',
    halfOpen: false,
    useRotatedArray: true,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n - 1', indent: 0 },
      { line: 'while l <= r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if a[m] == target: return m', indent: 1 },
      { line: 'if a[l] <= a[m]:', indent: 1 },
      { line: '# left half is sorted', indent: 2 },
      { line: 'if a[l] <= target < a[m]:', indent: 2 },
      { line: 'r = m - 1', indent: 3 },
      { line: 'else:', indent: 2 },
      { line: 'l = m + 1', indent: 3 },
      { line: 'else:', indent: 1 },
      { line: '# right half is sorted', indent: 2 },
      { line: 'if a[m] < target <= a[r]:', indent: 2 },
      { line: 'l = m + 1', indent: 3 },
      { line: 'else:', indent: 2 },
      { line: 'r = m - 1', indent: 3 },
      { line: 'return -1', indent: 0 },
    ],
  },
  peak_element: {
    name: 'Find Peak Element',
    description: 'Find any local maximum in array',
    category: 'special',
    halfOpen: false,
    usePeakArray: true,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n - 1', indent: 0 },
      { line: 'while l < r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if a[m] < a[m + 1]:', indent: 1 },
      { line: '# peak is to the right', indent: 2 },
      { line: 'l = m + 1', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: '# peak is at m or to the left', indent: 2 },
      { line: 'r = m', indent: 2 },
      { line: 'return l', indent: 0 },
    ],
  },
  sqrt: {
    name: 'Integer Square Root',
    description: 'Find floor(sqrt(n)) using binary search',
    category: 'special',
    halfOpen: true,
    useSqrtMode: true,
    code: [
      { line: 'l = 0', indent: 0 },
      { line: 'r = n + 1', indent: 0 },
      { line: 'while l < r:', indent: 0 },
      { line: 'm = (l + r) // 2', indent: 1 },
      { line: 'if m * m <= n:', indent: 1 },
      { line: 'l = m + 1', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: 'r = m', indent: 2 },
      { line: 'return l - 1', indent: 0 },
    ],
  },
};

export const CATEGORIES = {
  classic: { name: 'Classic', description: 'Standard binary search patterns' },
  rotated: { name: 'Rotated Array', description: 'Search in rotated sorted arrays' },
  special: { name: 'Special', description: 'Other binary search applications' },
};

export const complexity = {
  time: 'O(log n)',
  space: 'O(1)',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
};

// Generate a rotated sorted array
export const generateRotatedArray = (size = 8) => {
  const sorted = Array.from({ length: size }, (_, i) => i * 2 + 1);
  const rotation = Math.floor(Math.random() * (size - 1)) + 1;
  return [...sorted.slice(rotation), ...sorted.slice(0, rotation)];
};

// Generate array with a peak
export const generatePeakArray = (size = 8) => {
  const peak = Math.floor(Math.random() * (size - 2)) + 1;
  const arr = [];
  for (let i = 0; i <= peak; i++) {
    arr.push(i * 3 + Math.floor(Math.random() * 3));
  }
  for (let i = peak + 1; i < size; i++) {
    arr.push(arr[arr.length - 1] - Math.floor(Math.random() * 3) - 1);
  }
  return arr;
};

export const initialState = ({ array, target, templateKey }) => {
  const template = TEMPLATES[templateKey];
  const n = array.length;
  
  // For sqrt mode, target is the number to find sqrt of
  if (template.useSqrtMode) {
    return {
      array: Array.from({ length: Math.min(target + 1, 20) }, (_, i) => i),
      target,
      templateKey,
      n: target + 1,
      l: 0,
      r: target + 1,
      m: null,
      done: false,
      result: null,
      currentLine: 0,
      iteration: 0,
      comparison: null,
      sqrtMode: true,
    };
  }
  
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

  // Integer Square Root
  if (templateKey === 'sqrt') {
    if (l >= r) {
      return { ...state, done: true, result: l - 1, currentLine: 8 };
    }
    const m = Math.floor((l + r) / 2);
    if (m * m <= target) {
      return { ...state, m, l: m + 1, currentLine: 5, comparison: 'less_or_equal', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m, currentLine: 7, comparison: 'greater', iteration: state.iteration + 1 };
    }
  }

  // Peak Element
  if (templateKey === 'peak_element') {
    if (l >= r) {
      return { ...state, done: true, result: l, currentLine: 10 };
    }
    const m = Math.floor((l + r) / 2);
    if (array[m] < array[m + 1]) {
      return { ...state, m, l: m + 1, currentLine: 6, comparison: 'ascending', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m, currentLine: 9, comparison: 'descending', iteration: state.iteration + 1 };
    }
  }

  // Rotated Min
  if (templateKey === 'rotated_min') {
    if (l >= r) {
      return { ...state, done: true, result: l, currentLine: 10 };
    }
    const m = Math.floor((l + r) / 2);
    if (array[m] > array[r]) {
      return { ...state, m, l: m + 1, currentLine: 6, comparison: 'min_right', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m, currentLine: 9, comparison: 'min_left', iteration: state.iteration + 1 };
    }
  }

  // Rotated Search
  if (templateKey === 'rotated_search') {
    if (l > r) {
      return { ...state, done: true, result: -1, currentLine: 17 };
    }
    const m = Math.floor((l + r) / 2);
    if (array[m] === target) {
      return { ...state, m, done: true, result: m, currentLine: 4, comparison: 'equal' };
    }
    
    if (array[l] <= array[m]) {
      // Left half is sorted
      if (array[l] <= target && target < array[m]) {
        return { ...state, m, r: m - 1, currentLine: 8, comparison: 'left_sorted_go_left', iteration: state.iteration + 1 };
      } else {
        return { ...state, m, l: m + 1, currentLine: 10, comparison: 'left_sorted_go_right', iteration: state.iteration + 1 };
      }
    } else {
      // Right half is sorted
      if (array[m] < target && target <= array[r]) {
        return { ...state, m, l: m + 1, currentLine: 14, comparison: 'right_sorted_go_right', iteration: state.iteration + 1 };
      } else {
        return { ...state, m, r: m - 1, currentLine: 16, comparison: 'right_sorted_go_left', iteration: state.iteration + 1 };
      }
    }
  }

  // First Occurrence
  if (templateKey === 'first_occurrence') {
    if (l >= r) {
      const found = l < n && array[l] === target;
      return { ...state, done: true, result: found ? l : -1, currentLine: found ? 9 : 10 };
    }
    const m = Math.floor((l + r) / 2);
    if (array[m] < target) {
      return { ...state, m, l: m + 1, currentLine: 5, comparison: 'less', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m, currentLine: 7, comparison: 'greater_or_equal', iteration: state.iteration + 1 };
    }
  }

  // Last Occurrence
  if (templateKey === 'last_occurrence') {
    if (l >= r) {
      const found = l > 0 && array[l - 1] === target;
      return { ...state, done: true, result: found ? l - 1 : -1, currentLine: found ? 9 : 10 };
    }
    const m = Math.floor((l + r) / 2);
    if (array[m] <= target) {
      return { ...state, m, l: m + 1, currentLine: 5, comparison: 'less_or_equal', iteration: state.iteration + 1 };
    } else {
      return { ...state, m, r: m, currentLine: 7, comparison: 'greater', iteration: state.iteration + 1 };
    }
  }

  // Exact Search
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
  }

  // Lower Bound / Upper Bound
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
};

export const getExplanation = (state) => {
  const { done, result, templateKey, m, array, target, comparison, l, r } = state;
  const template = TEMPLATES[templateKey];

  if (done) {
    if (templateKey === 'sqrt') {
      return `✓ floor(sqrt(${target})) = ${result}. Since ${result}² = ${result * result} ≤ ${target} < ${(result + 1) * (result + 1)} = ${result + 1}²`;
    }
    if (templateKey === 'peak_element') {
      return `✓ Peak found at index ${result} with value ${array[result]}.`;
    }
    if (templateKey === 'rotated_min') {
      return `✓ Minimum element is ${array[result]} at index ${result}.`;
    }
    if (templateKey === 'rotated_search') {
      return result !== -1
        ? `✓ Found target ${target} at index ${result}.`
        : `✗ Target ${target} not found in rotated array.`;
    }
    if (templateKey === 'first_occurrence' || templateKey === 'last_occurrence') {
      return result !== -1
        ? `✓ ${templateKey === 'first_occurrence' ? 'First' : 'Last'} occurrence of ${target} at index ${result}.`
        : `✗ Target ${target} not found in array.`;
    }
    if (templateKey === 'exact_search') {
      return result !== -1
        ? `✓ Found target ${target} at index ${result}.`
        : `✗ Target ${target} not found in the array.`;
    }
    const meaning = templateKey === 'lower_bound' 
      ? `First position where value ≥ ${target}` 
      : `First position where value > ${target}`;
    return `✓ Search complete. Result: index ${result}. ${meaning}.`;
  }

  if (m === null) {
    if (templateKey === 'sqrt') {
      return `Finding floor(sqrt(${target})). Search range: [0, ${target}].`;
    }
    if (templateKey === 'peak_element') {
      return `Finding a peak element. A peak is greater than its neighbors.`;
    }
    if (templateKey === 'rotated_min') {
      return `Finding minimum in rotated array. The array was sorted then rotated.`;
    }
    if (templateKey === 'rotated_search') {
      return `Searching for ${target} in rotated sorted array.`;
    }
    const intervalType = template.halfOpen 
      ? `Half-open interval [${l}, ${r}): R=${r} is excluded` 
      : `Closed interval [${l}, ${r}]: both endpoints included`;
    return `Initializing: ${intervalType}. Ready to search.`;
  }

  const value = array[m];

  // Special explanations for different algorithms
  if (templateKey === 'sqrt') {
    if (comparison === 'less_or_equal') {
      return `${m}² = ${m * m} ≤ ${target}. Answer could be ${m} or higher. Move L to ${m + 1}.`;
    }
    return `${m}² = ${m * m} > ${target}. Answer must be less than ${m}. Move R to ${m}.`;
  }

  if (templateKey === 'peak_element') {
    if (comparison === 'ascending') {
      return `a[${m}] = ${value} < a[${m + 1}] = ${array[m + 1]}. Slope is going up, so peak is to the RIGHT. Move L to ${m + 1}.`;
    }
    return `a[${m}] = ${value} ≥ a[${m + 1}] = ${array[m + 1]}. Slope is going down or at peak. Peak is HERE or LEFT. Move R to ${m}.`;
  }

  if (templateKey === 'rotated_min') {
    if (comparison === 'min_right') {
      return `a[${m}] = ${value} > a[${r}] = ${array[r]}. The rotation point (minimum) is in the RIGHT half. Move L to ${m + 1}.`;
    }
    return `a[${m}] = ${value} ≤ a[${r}] = ${array[r]}. The minimum is at ${m} or in the LEFT half. Move R to ${m}.`;
  }

  if (templateKey === 'rotated_search') {
    if (comparison === 'equal') {
      return `a[${m}] = ${value} equals target ${target}. Found!`;
    }
    if (comparison === 'left_sorted_go_left') {
      return `Left half [${l}..${m}] is sorted. Target ${target} is in range [${array[l]}, ${value}), so search LEFT.`;
    }
    if (comparison === 'left_sorted_go_right') {
      return `Left half [${l}..${m}] is sorted. Target ${target} is NOT in range [${array[l]}, ${value}), so search RIGHT.`;
    }
    if (comparison === 'right_sorted_go_right') {
      return `Right half [${m}..${r}] is sorted. Target ${target} is in range (${value}, ${array[r]}], so search RIGHT.`;
    }
    if (comparison === 'right_sorted_go_left') {
      return `Right half [${m}..${r}] is sorted. Target ${target} is NOT in range (${value}, ${array[r]}], so search LEFT.`;
    }
  }

  // Standard explanations
  if (templateKey === 'exact_search') {
    if (comparison === 'less') {
      return `a[${m}] = ${value} < ${target}. Target is LARGER, so it must be in the RIGHT half. Move L to ${m + 1}.`;
    }
    if (comparison === 'greater') {
      return `a[${m}] = ${value} > ${target}. Target is SMALLER, so it must be in the LEFT half. Move R to ${m - 1}.`;
    }
    if (comparison === 'equal') {
      return `a[${m}] = ${value} equals target ${target}. Found!`;
    }
  }
  
  if (comparison === 'less') {
    return `a[${m}] = ${value} < ${target}. The answer must be to the RIGHT. Move L to ${m + 1}.`;
  }
  if (comparison === 'less_or_equal') {
    return `a[${m}] = ${value} ≤ ${target}. The answer must be to the RIGHT. Move L to ${m + 1}.`;
  }
  if (comparison === 'greater' || comparison === 'greater_or_equal') {
    return `a[${m}] = ${value} ≥ ${target}. Index ${m} could be the answer or earlier. Move R to ${m}.`;
  }

  return `Checking middle element at index ${m}.`;
};

export const getResult = (state) => {
  if (!state.done) return null;

  const { result, templateKey, target, array } = state;

  if (templateKey === 'sqrt') {
    return {
      success: true,
      title: '✓ Complete',
      message: `floor(sqrt(${target})) = ${result}`,
      details: `${result}² = ${result * result} ≤ ${target} < ${(result + 1) * (result + 1)} = ${result + 1}²`,
    };
  }

  if (templateKey === 'peak_element') {
    return {
      success: true,
      title: '✓ Peak Found',
      message: `Peak at index ${result} with value ${array[result]}`,
      details: `array[${result}] = ${array[result]}`,
    };
  }

  if (templateKey === 'rotated_min') {
    return {
      success: true,
      title: '✓ Minimum Found',
      message: `Minimum value ${array[result]} at index ${result}`,
      details: `Rotation point: index ${result}`,
    };
  }

  if (templateKey === 'rotated_search' || templateKey === 'exact_search' || 
      templateKey === 'first_occurrence' || templateKey === 'last_occurrence') {
    return {
      success: result !== -1,
      title: result !== -1 ? '✓ Found' : '✗ Not Found',
      message: result !== -1
        ? `Found target ${target} at index ${result}`
        : `Target ${target} not found`,
      details: `Result: ${result}`,
    };
  }

  const atIndex = result < array.length ? array[result] : null;
  const label = templateKey === 'lower_bound' ? 'a[i] ≥' : 'a[i] >';

  return {
    success: true,
    title: '✓ Complete',
    message: `First index where ${label} ${target} is ${result}${atIndex !== null ? ` (value: ${atIndex})` : ''}`,
    details: result >= array.length ? 'Points past end of array' : `array[${result}] = ${atIndex}`,
  };
};
