export const template = {
  name: 'Radix Sort',
  description: 'Sort by processing individual digits — O(d × n)',
  timeComplexity: 'O(d × n)',
  spaceComplexity: 'O(n + k)',
  code: [
    { line: 'def radix_sort(arr):', indent: 0 },
    { line: 'max_val = max(arr)', indent: 1 },
    { line: 'exp = 1', indent: 1 },
    { line: 'while max_val // exp > 0:', indent: 1 },
    { line: 'counting_sort_by_digit(arr, exp)', indent: 2 },
    { line: 'exp *= 10', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def counting_sort_by_digit(arr, exp):', indent: 0 },
    { line: 'count = [0] * 10', indent: 1 },
    { line: 'for num in arr:', indent: 1 },
    { line: 'digit = (num // exp) % 10', indent: 2 },
    { line: 'count[digit] += 1', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(d × n)',
  space: 'O(n + k)',
  bestCase: 'O(d × n)',
  averageCase: 'O(d × n)',
  worstCase: 'O(d × n)',
};

const getDigit = (num, exp) => Math.floor(num / exp) % 10;

const generateSteps = (inputArray) => {
  const steps = [];
  let array = [...inputArray];
  const n = array.length;
  const maxVal = Math.max(...array);
  const maxDigits = maxVal.toString().length;

  const addStep = (state) => {
    steps.push({
      array: [...array],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Starting radix sort. Max value is ${maxVal} which has ${maxDigits} digit(s).`,
    highlights: [],
    buckets: null,
    currentDigit: null,
    exp: null,
  });

  let exp = 1;
  let pass = 0;

  while (Math.floor(maxVal / exp) > 0) {
    pass++;
    const digitName = exp === 1 ? 'ones' : exp === 10 ? 'tens' : exp === 100 ? 'hundreds' : `10^${Math.log10(exp)}`;

    addStep({
      phase: 'start-pass',
      currentLine: 3,
      explanation: `Pass ${pass}: Sort by ${digitName} digit (exp = ${exp})`,
      highlights: [],
      buckets: Array.from({ length: 10 }, () => []),
      currentDigit: digitName,
      exp,
    });

    // Initialize buckets
    const buckets = Array.from({ length: 10 }, () => []);

    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
      const digit = getDigit(array[i], exp);

      addStep({
        phase: 'get-digit',
        currentLine: 10,
        explanation: `arr[${i}] = ${array[i]}, ${digitName} digit = ${digit}. Place in bucket ${digit}.`,
        highlights: [{ index: i, type: 'comparing' }],
        buckets: buckets.map(b => [...b]),
        currentDigit: digitName,
        exp,
        highlightBucket: digit,
      });

      buckets[digit].push(array[i]);

      addStep({
        phase: 'place-bucket',
        currentLine: 11,
        explanation: `Placed ${array[i]} in bucket ${digit}. Bucket ${digit}: [${buckets[digit].join(', ')}]`,
        highlights: [{ index: i, type: 'active' }],
        buckets: buckets.map(b => [...b]),
        currentDigit: digitName,
        exp,
        highlightBucket: digit,
      });
    }

    addStep({
      phase: 'buckets-filled',
      currentLine: 4,
      explanation: `All elements distributed by ${digitName} digit. Now collect from buckets 0-9.`,
      highlights: [],
      buckets: buckets.map(b => [...b]),
      currentDigit: digitName,
      exp,
    });

    // Collect elements from buckets
    let idx = 0;
    for (let digit = 0; digit < 10; digit++) {
      if (buckets[digit].length === 0) continue;

      addStep({
        phase: 'collect-bucket',
        currentLine: 4,
        explanation: `Collecting from bucket ${digit}: [${buckets[digit].join(', ')}]`,
        highlights: [],
        buckets: buckets.map(b => [...b]),
        currentDigit: digitName,
        exp,
        highlightBucket: digit,
      });

      for (const val of buckets[digit]) {
        array[idx] = val;

        addStep({
          phase: 'collect-element',
          currentLine: 4,
          explanation: `arr[${idx}] = ${val} from bucket ${digit}`,
          highlights: [{ index: idx, type: 'placed' }],
          buckets: buckets.map(b => [...b]),
          currentDigit: digitName,
          exp,
          highlightBucket: digit,
        });

        idx++;
      }
    }

    addStep({
      phase: 'pass-complete',
      currentLine: 5,
      explanation: `Pass ${pass} complete. Array after sorting by ${digitName}: [${array.join(', ')}]`,
      highlights: array.map((_, i) => ({ index: i, type: 'active' })),
      buckets: null,
      currentDigit: digitName,
      exp,
    });

    exp *= 10;
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Sorting complete! Processed ${maxDigits} digit position(s) in ${pass} passes.`,
    highlights: array.map((_, i) => ({ index: i, type: 'sorted' })),
    buckets: null,
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

  const maxVal = Math.max(...state.array);
  const digits = maxVal.toString().length;
  return {
    success: true,
    title: 'Sorted',
    message: `Array sorted using radix sort`,
    details: [`Digits processed: ${digits}`, `Time: O(${digits} × n)`],
  };
};
