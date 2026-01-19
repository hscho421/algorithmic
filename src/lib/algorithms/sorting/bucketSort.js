// Bucket Sort Algorithm

export const template = {
  name: 'Bucket Sort',
  description: 'Distribute elements into buckets, sort each, concatenate',
  code: [
    { line: 'def bucket_sort(arr):', indent: 0 },
    { line: 'n = len(arr)', indent: 1 },
    { line: 'buckets = [[] for _ in range(n)]', indent: 1 },
    { line: '', indent: 0 },
    { line: '# Distribute elements', indent: 1 },
    { line: 'for x in arr:', indent: 1 },
    { line: 'idx = int(n * x)  # for [0,1) range', indent: 2 },
    { line: 'buckets[idx].append(x)', indent: 2 },
    { line: '', indent: 0 },
    { line: '# Sort each bucket', indent: 1 },
    { line: 'for bucket in buckets:', indent: 1 },
    { line: 'bucket.sort()  # insertion sort', indent: 2 },
    { line: '', indent: 0 },
    { line: '# Concatenate', indent: 1 },
    { line: 'result = []', indent: 1 },
    { line: 'for bucket in buckets:', indent: 1 },
    { line: 'result.extend(bucket)', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(n + k) average, O(n²) worst',
  space: 'O(n + k)',
  bestCase: 'O(n + k)',
  averageCase: 'O(n + k)',
  worstCase: 'O(n²)',
  note: 'k = number of buckets. Best for uniformly distributed data in [0,1)',
};

export function initialState({ arr = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68] } = {}) {
  const n = arr.length;
  const numBuckets = Math.max(5, Math.ceil(Math.sqrt(n)));

  return {
    arr: [...arr],
    original: [...arr],
    n,
    numBuckets,
    buckets: Array(numBuckets).fill(null).map(() => []),
    phase: 'init',
    currentIdx: 0,
    currentBucket: 0,
    result: [],
    stepIndex: 0,
    done: false,
    currentLine: 2,
    explanation: `Initialize ${numBuckets} empty buckets for ${n} elements`,
    highlightIdx: null,
    highlightBucket: null,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { arr, n, numBuckets, buckets, phase, currentIdx, currentBucket, result } = state;

  // Phase 1: Distribute elements into buckets
  if (phase === 'init' || phase === 'distributing') {
    if (currentIdx >= n) {
      return {
        ...state,
        phase: 'sorting',
        currentBucket: 0,
        stepIndex: state.stepIndex + 1,
        currentLine: 10,
        explanation: 'Distribution complete. Now sorting each bucket...',
        highlightIdx: null,
        highlightBucket: null,
      };
    }

    const value = arr[currentIdx];
    const bucketIdx = Math.min(Math.floor(value * numBuckets), numBuckets - 1);
    const newBuckets = buckets.map((b, i) => i === bucketIdx ? [...b, value] : [...b]);

    return {
      ...state,
      buckets: newBuckets,
      phase: 'distributing',
      currentIdx: currentIdx + 1,
      stepIndex: state.stepIndex + 1,
      currentLine: 7,
      explanation: `arr[${currentIdx}] = ${value.toFixed(2)} → bucket[${bucketIdx}]`,
      highlightIdx: currentIdx,
      highlightBucket: bucketIdx,
    };
  }

  // Phase 2: Sort each bucket
  if (phase === 'sorting') {
    if (currentBucket >= numBuckets) {
      return {
        ...state,
        phase: 'concatenating',
        currentBucket: 0,
        stepIndex: state.stepIndex + 1,
        currentLine: 14,
        explanation: 'All buckets sorted. Now concatenating...',
        highlightBucket: null,
      };
    }

    const newBuckets = buckets.map((b, i) => {
      if (i === currentBucket) {
        return [...b].sort((a, b) => a - b);
      }
      return [...b];
    });

    const bucketContent = buckets[currentBucket];
    const sortedContent = newBuckets[currentBucket];

    return {
      ...state,
      buckets: newBuckets,
      currentBucket: currentBucket + 1,
      stepIndex: state.stepIndex + 1,
      currentLine: 11,
      explanation: bucketContent.length > 0
        ? `Sorted bucket[${currentBucket}]: [${bucketContent.map(v => v.toFixed(2)).join(', ')}] → [${sortedContent.map(v => v.toFixed(2)).join(', ')}]`
        : `Bucket[${currentBucket}] is empty`,
      highlightBucket: currentBucket,
    };
  }

  // Phase 3: Concatenate
  if (phase === 'concatenating') {
    if (currentBucket >= numBuckets) {
      return {
        ...state,
        done: true,
        currentLine: 16,
        explanation: `Done! Sorted array: [${result.map(v => v.toFixed(2)).join(', ')}]`,
        phase: 'done',
        highlightBucket: null,
      };
    }

    const bucketContent = buckets[currentBucket];
    const newResult = [...result, ...bucketContent];

    return {
      ...state,
      result: newResult,
      currentBucket: currentBucket + 1,
      stepIndex: state.stepIndex + 1,
      currentLine: 16,
      explanation: bucketContent.length > 0
        ? `Appended bucket[${currentBucket}]: [${bucketContent.map(v => v.toFixed(2)).join(', ')}]`
        : `Bucket[${currentBucket}] is empty, skip`,
      highlightBucket: currentBucket,
    };
  }

  return state;
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { original, result, numBuckets } = state;

  return {
    success: true,
    title: 'Array Sorted!',
    message: `Used ${numBuckets} buckets`,
    details: [
      `Original: [${original.map(v => v.toFixed(2)).join(', ')}]`,
      `Sorted: [${result.map(v => v.toFixed(2)).join(', ')}]`,
    ],
  };
}
