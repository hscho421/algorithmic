// LRU Cache Implementation

export const template = {
  name: 'LRU Cache',
  description: 'Least Recently Used cache with O(1) operations',
  code: [
    { line: 'class LRUCache:', indent: 0 },
    { line: 'def __init__(self, capacity):', indent: 1 },
    { line: 'self.capacity = capacity', indent: 2 },
    { line: 'self.cache = OrderedDict()', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def get(self, key):', indent: 1 },
    { line: 'if key not in self.cache:', indent: 2 },
    { line: 'return -1', indent: 3 },
    { line: 'self.cache.move_to_end(key)', indent: 2 },
    { line: 'return self.cache[key]', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def put(self, key, value):', indent: 1 },
    { line: 'if key in self.cache:', indent: 2 },
    { line: 'self.cache.move_to_end(key)', indent: 3 },
    { line: 'self.cache[key] = value', indent: 2 },
    { line: 'if len(self.cache) > self.capacity:', indent: 2 },
    { line: 'self.cache.popitem(last=False)', indent: 3 },
  ],
};

export const complexity = {
  time: 'O(1) for get and put',
  space: 'O(capacity)',
  operations: {
    get: 'O(1)',
    put: 'O(1)',
  },
  note: 'Uses OrderedDict or HashMap + DoublyLinkedList',
};

export function initialState({
  capacity = 3,
  operations = ['put(1,1)', 'put(2,2)', 'get(1)', 'put(3,3)', 'get(2)', 'put(4,4)', 'get(1)', 'get(3)', 'get(4)'],
  initialCache = [],
} = {}) {
  const seed = initialCache.map(([key, value]) => ({
    key: Number.isNaN(Number(key)) ? key : Number(key),
    value,
  }));
  return {
    capacity,
    cache: seed, // Array of {key, value} in order (first = LRU, last = MRU)
    operations: [...operations],
    currentOp: 0,
    lastResult: null,
    stepIndex: 0,
    done: false,
    currentLine: 3,
    explanation: `LRU Cache initialized with capacity ${capacity}`,
    phase: 'init',
    history: [],
    evicted: null,
    operation: null,
    highlightKey: null,
    evictedKey: null,
    order: seed.slice().reverse().map((entry) => String(entry.key)),
    cacheMap: Object.fromEntries(seed.map((entry) => [String(entry.key), entry.value])),
  };
}

function parseOperation(op) {
  const putMatch = op.match(/put\((\d+),\s*(\d+)\)/);
  if (putMatch) {
    return { type: 'put', key: parseInt(putMatch[1]), value: parseInt(putMatch[2]) };
  }
  const getMatch = op.match(/get\((\d+)\)/);
  if (getMatch) {
    return { type: 'get', key: parseInt(getMatch[1]) };
  }
  return { type: 'unknown' };
}

export function executeStep(state) {
  if (state.done) return state;

  const { capacity, cache, operations, currentOp, history } = state;

  if (currentOp >= operations.length) {
    return {
      ...state,
      done: true,
      currentLine: 16,
      explanation: `All operations complete. Cache: [${cache.map(e => `${e.key}:${e.value}`).join(', ')}]`,
      phase: 'done',
    };
  }

  const op = operations[currentOp];
  const parsed = parseOperation(op);
  let newCache = [...cache];
  const newHistory = [...history];
  let explanation = '';
  let currentLine = 3;
  let lastResult = null;
  let evicted = null;
  let highlightKey = null;

  switch (parsed.type) {
    case 'get': {
      highlightKey = parsed.key;
      const idx = newCache.findIndex(e => e.key === parsed.key);
      if (idx === -1) {
        lastResult = -1;
        explanation = `get(${parsed.key}): Key not found, return -1`;
        currentLine = 7;
      } else {
        const item = newCache.splice(idx, 1)[0];
        newCache.push(item); // Move to end (MRU)
        lastResult = item.value;
        explanation = `get(${parsed.key}): Found value ${item.value}, moved to MRU`;
        currentLine = 9;
      }
      newHistory.push({ op, result: lastResult, cache: newCache.map(e => ({ ...e })) });
      break;
    }

    case 'put': {
      highlightKey = parsed.key;
      const idx = newCache.findIndex(e => e.key === parsed.key);
      if (idx !== -1) {
        // Key exists, update and move to end
        newCache.splice(idx, 1);
        newCache.push({ key: parsed.key, value: parsed.value });
        explanation = `put(${parsed.key}, ${parsed.value}): Updated existing key, moved to MRU`;
        currentLine = 14;
      } else {
        // New key
        if (newCache.length >= capacity) {
          evicted = newCache.shift(); // Remove LRU
          explanation = `put(${parsed.key}, ${parsed.value}): Cache full! Evicted LRU key ${evicted.key}`;
          currentLine = 16;
        } else {
          explanation = `put(${parsed.key}, ${parsed.value}): Added new entry`;
          currentLine = 14;
        }
        newCache.push({ key: parsed.key, value: parsed.value });
      }
      newHistory.push({ op, result: null, cache: newCache.map(e => ({ ...e })), evicted });
      break;
    }

    default:
      explanation = `Unknown operation: ${op}`;
  }

  return {
    ...state,
    cache: newCache,
    currentOp: currentOp + 1,
    lastResult,
    stepIndex: state.stepIndex + 1,
    currentLine,
    explanation,
    phase: parsed.type,
    history: newHistory,
    evicted,
    operation: parsed.type,
    highlightKey,
    evictedKey: evicted?.key ?? null,
    order: newCache.slice().reverse().map((entry) => String(entry.key)),
    cacheMap: Object.fromEntries(newCache.map((entry) => [String(entry.key), entry.value])),
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { cache, capacity, history } = state;
  const evictions = history.filter(h => h.evicted).length;

  return {
    success: true,
    title: 'LRU Cache Operations Complete',
    message: `Cache: ${cache.length}/${capacity} items`,
    details: [
      `Contents (LRU → MRU): [${cache.map(e => `${e.key}:${e.value}`).join(', ')}]`,
      `Operations: ${history.length}`,
      `Evictions: ${evictions}`,
    ],
  };
}
