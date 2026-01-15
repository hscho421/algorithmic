export const TEMPLATES = {
  fixed_max_sum: {
    id: 'fixed_max_sum',
    name: 'Fixed Window: Max Sum',
    description: 'Find the maximum sum of any subarray of size k.',
    inputType: 'array',
    code: [
      { line: 'windowSum = sum(arr[0..k-1])', indent: 0 },
      { line: 'maxSum = windowSum', indent: 0 },
      { line: 'for r from k to n-1:', indent: 0 },
      { line: 'windowSum += arr[r] - arr[r-k]', indent: 1 },
      { line: 'if windowSum > maxSum:', indent: 1 },
      { line: 'maxSum = windowSum', indent: 2 },
    ],
  },
  min_len_subarray: {
    id: 'min_len_subarray',
    name: 'Variable Window: Min Length',
    description: 'Smallest subarray length with sum >= target.',
    inputType: 'array',
    code: [
      { line: 'l = 0; sum = 0; minLen = ∞', indent: 0 },
      { line: 'for r from 0 to n-1:', indent: 0 },
      { line: 'sum += arr[r]', indent: 1 },
      { line: 'while sum >= target:', indent: 1 },
      { line: 'minLen = min(minLen, r-l+1)', indent: 2 },
      { line: 'sum -= arr[l]; l++', indent: 2 },
    ],
  },
  longest_unique: {
    id: 'longest_unique',
    name: 'String: Longest Unique Substring',
    description: 'Longest substring without repeating characters.',
    inputType: 'string',
    code: [
      { line: 'l = 0; best = 0; lastSeen = {}', indent: 0 },
      { line: 'for r from 0 to n-1:', indent: 0 },
      { line: 'if s[r] seen at >= l: l = lastSeen[s[r]] + 1', indent: 1 },
      { line: 'lastSeen[s[r]] = r', indent: 1 },
      { line: 'best = max(best, r-l+1)', indent: 1 },
    ],
  },
};

export const complexity = {
  fixed_max_sum: { time: 'O(n)', space: 'O(1)' },
  min_len_subarray: { time: 'O(n)', space: 'O(1)' },
  longest_unique: { time: 'O(n)', space: 'O(1)' },
};

const addStep = (steps, step) => {
  steps.push({ ...step });
};

const buildArraySteps = (array, mode, options) => {
  const steps = [];
  const n = array.length;

  if (n === 0) {
    addStep(steps, {
      items: array,
      itemType: 'number',
      l: null,
      r: null,
      activeIndex: null,
      phase: 'empty',
      currentLine: 0,
      explanation: 'Array is empty.',
      done: true,
      error: 'Provide at least one number.',
    });
    return steps;
  }

  if (mode === 'fixed_max_sum') {
    const k = options.k;
    if (k < 1 || k > n) {
      addStep(steps, {
        items: array,
        itemType: 'number',
        l: null,
        r: null,
        activeIndex: null,
        phase: 'invalid',
        currentLine: 0,
        explanation: 'Window size must be between 1 and n.',
        done: true,
        error: 'Invalid window size.',
      });
      return steps;
    }

    let windowSum = array.slice(0, k).reduce((sum, val) => sum + val, 0);
    let maxSum = windowSum;
    let bestRange = [0, k - 1];

    addStep(steps, {
      items: array,
      itemType: 'number',
      l: 0,
      r: k - 1,
      activeIndex: k - 1,
      windowSum,
      maxSum,
      bestRange,
      k,
      phase: 'init',
      currentLine: 0,
      explanation: `Initialize window sum for first ${k} elements.`,
    });

    for (let r = k; r < n; r += 1) {
      const l = r - k + 1;
      windowSum += array[r] - array[r - k];

      addStep(steps, {
        items: array,
        itemType: 'number',
        l,
        r,
        activeIndex: r,
        windowSum,
        maxSum,
        bestRange,
        k,
        phase: 'slide',
        currentLine: 3,
        explanation: `Slide window: add ${array[r]}, remove ${array[r - k]}.`,
      });

      if (windowSum > maxSum) {
        maxSum = windowSum;
        bestRange = [l, r];
        addStep(steps, {
          items: array,
          itemType: 'number',
          l,
          r,
          activeIndex: r,
          windowSum,
          maxSum,
          bestRange,
          k,
          phase: 'update-best',
          currentLine: 4,
          explanation: 'New maximum sum found.',
        });
      }
    }

    addStep(steps, {
      items: array,
      itemType: 'number',
      l: bestRange[0],
      r: bestRange[1],
      activeIndex: bestRange[1],
      windowSum: maxSum,
      maxSum,
      bestRange,
      k,
      phase: 'done',
      currentLine: 5,
      explanation: `Best window sum is ${maxSum}.`,
      done: true,
      result: { maxSum, bestRange },
    });
  }

  if (mode === 'min_len_subarray') {
    const target = options.target;
    let l = 0;
    let sum = 0;
    let minLen = Infinity;
    let bestRange = null;

    addStep(steps, {
      items: array,
      itemType: 'number',
      l,
      r: null,
      activeIndex: null,
      sum,
      minLen,
      bestRange,
      target,
      phase: 'init',
      currentLine: 0,
      explanation: 'Start with empty window.',
    });

    for (let r = 0; r < n; r += 1) {
      sum += array[r];
      addStep(steps, {
        items: array,
        itemType: 'number',
        l,
        r,
        activeIndex: r,
        sum,
        minLen,
        bestRange,
        target,
        phase: 'expand',
        currentLine: 2,
        explanation: `Expand window by adding ${array[r]}.`,
      });

      while (sum >= target && l <= r) {
        const length = r - l + 1;
        if (length < minLen) {
          minLen = length;
          bestRange = [l, r];
          addStep(steps, {
            items: array,
            itemType: 'number',
            l,
            r,
            activeIndex: r,
            sum,
            minLen,
            bestRange,
            target,
            phase: 'update-best',
            currentLine: 4,
            explanation: 'Found a smaller valid window.',
          });
        }

        sum -= array[l];
        l += 1;
        addStep(steps, {
          items: array,
          itemType: 'number',
          l,
          r,
          activeIndex: r,
          sum,
          minLen,
          bestRange,
          target,
          phase: 'shrink',
          currentLine: 5,
          explanation: 'Shrink window from the left.',
        });
      }
    }

    addStep(steps, {
      items: array,
      itemType: 'number',
      l: bestRange ? bestRange[0] : null,
      r: bestRange ? bestRange[1] : null,
      activeIndex: bestRange ? bestRange[1] : null,
      sum,
      minLen,
      bestRange,
      target,
      phase: 'done',
      currentLine: 5,
      explanation: bestRange ? `Best window length is ${minLen}.` : 'No window meets the target.',
      done: true,
      result: { minLen: minLen === Infinity ? 0 : minLen, bestRange },
    });
  }

  return steps;
};

const buildStringSteps = (text) => {
  const steps = [];
  const chars = text.split('');
  const n = chars.length;

  if (n === 0) {
    addStep(steps, {
      items: chars,
      itemType: 'char',
      l: null,
      r: null,
      activeIndex: null,
      phase: 'empty',
      currentLine: 0,
      explanation: 'String is empty.',
      done: true,
      error: 'Provide at least one character.',
    });
    return steps;
  }

  let l = 0;
  let bestLen = 0;
  let bestRange = [0, 0];
  const lastSeen = new Map();

  addStep(steps, {
    items: chars,
    itemType: 'char',
    l,
    r: null,
    activeIndex: null,
    bestLen,
    bestRange,
    phase: 'init',
    currentLine: 0,
    explanation: 'Start with empty window.',
  });

  for (let r = 0; r < n; r += 1) {
    const char = chars[r];
    if (lastSeen.has(char) && lastSeen.get(char) >= l) {
      const newL = lastSeen.get(char) + 1;
      addStep(steps, {
        items: chars,
        itemType: 'char',
        l,
        r,
        activeIndex: r,
        bestLen,
        bestRange,
        phase: 'duplicate',
        currentLine: 2,
        explanation: `Duplicate "${char}" found. Move left pointer.`,
      });
      l = newL;
    }

    lastSeen.set(char, r);
    const windowLen = r - l + 1;

    addStep(steps, {
      items: chars,
      itemType: 'char',
      l,
      r,
      activeIndex: r,
      bestLen,
      bestRange,
      phase: 'expand',
      currentLine: 3,
      explanation: `Include "${char}" in the window.`,
    });

    if (windowLen > bestLen) {
      bestLen = windowLen;
      bestRange = [l, r];
      addStep(steps, {
        items: chars,
        itemType: 'char',
        l,
        r,
        activeIndex: r,
        bestLen,
        bestRange,
        phase: 'update-best',
        currentLine: 4,
        explanation: 'New longest unique substring.',
      });
    }
  }

  addStep(steps, {
    items: chars,
    itemType: 'char',
    l: bestRange[0],
    r: bestRange[1],
    activeIndex: bestRange[1],
    bestLen,
    bestRange,
    phase: 'done',
    currentLine: 4,
    explanation: `Best length is ${bestLen}.`,
    done: true,
    result: { bestLen, bestRange },
  });

  return steps;
};

export const initialState = ({ mode, array = [], k = 3, target = 7, text = '' }) => {
  const template = TEMPLATES[mode] || TEMPLATES.fixed_max_sum;
  const steps = template.inputType === 'string'
    ? buildStringSteps(text.trim())
    : buildArraySteps(array, mode, { k, target });

  return {
    mode,
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
  if (!state?.done) return null;
  if (state.error) {
    return {
      success: false,
      title: 'Invalid input',
      message: state.error,
      details: 'Update the inputs and try again.',
    };
  }

  if (state.mode === 'fixed_max_sum') {
    const { maxSum, bestRange } = state.result || {};
    return {
      success: true,
      title: '✓ Max sum found',
      message: `Best sum is ${maxSum}.`,
      details: bestRange ? `Window: [${bestRange[0]}, ${bestRange[1]}]` : 'No window available.',
    };
  }

  if (state.mode === 'min_len_subarray') {
    const { minLen, bestRange } = state.result || {};
    if (!bestRange) {
      return {
        success: false,
        title: 'No valid window',
        message: 'No subarray meets the target.',
        details: 'Try a smaller target or larger numbers.',
      };
    }
    return {
      success: true,
      title: '✓ Min length found',
      message: `Smallest length is ${minLen}.`,
      details: `Window: [${bestRange[0]}, ${bestRange[1]}]`,
    };
  }

  const { bestLen, bestRange } = state.result || {};
  return {
    success: true,
    title: '✓ Longest unique substring',
    message: `Best length is ${bestLen}.`,
    details: bestRange ? `Window: [${bestRange[0]}, ${bestRange[1]}]` : 'No substring found.',
  };
};
