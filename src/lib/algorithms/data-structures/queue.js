// Queue Data Structure

export const template = {
  name: 'Queue',
  description: 'FIFO data structure - enqueue and dequeue operations',
  code: [
    { line: 'class Queue:', indent: 0 },
    { line: 'def __init__(self):', indent: 1 },
    { line: 'self.items = []', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def enqueue(self, item):', indent: 1 },
    { line: 'self.items.append(item)', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def dequeue(self):', indent: 1 },
    { line: 'if not self.is_empty():', indent: 2 },
    { line: 'return self.items.pop(0)', indent: 3 },
    { line: '', indent: 0 },
    { line: 'def front(self):', indent: 1 },
    { line: 'return self.items[0] if self.items else None', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(1) for enqueue, O(n) for dequeue (O(1) with deque)',
  space: 'O(n)',
  operations: {
    enqueue: 'O(1)',
    dequeue: 'O(n) or O(1) with deque',
    front: 'O(1)',
    isEmpty: 'O(1)',
  },
};

export function initialState({
  operations = ['enqueue(5)', 'enqueue(3)', 'enqueue(8)', 'dequeue()', 'enqueue(2)', 'front()', 'dequeue()'],
  initialQueue = [],
} = {}) {
  return {
    queue: [...initialQueue],
    operations: [...operations],
    currentOp: 0,
    lastResult: null,
    stepIndex: 0,
    done: false,
    currentLine: 2,
    explanation: 'Queue initialized (empty)',
    phase: 'init',
    history: [],
    animating: null,
    operation: null,
    highlightIndex: null,
    dequeuedValue: null,
  };
}

function parseOperation(op) {
  const enqueueMatch = op.match(/enqueue\((.+)\)/);
  if (enqueueMatch) {
    return { type: 'enqueue', value: enqueueMatch[1] };
  }
  if (op === 'dequeue()') {
    return { type: 'dequeue' };
  }
  if (op === 'front()') {
    return { type: 'front' };
  }
  return { type: 'unknown' };
}

export function executeStep(state) {
  if (state.done) return state;

  const { queue, operations, currentOp, history } = state;

  if (currentOp >= operations.length) {
    return {
      ...state,
      done: true,
      currentLine: 12,
      explanation: `All operations complete. Final queue: [${queue.join(', ')}]`,
      phase: 'done',
    };
  }

  const op = operations[currentOp];
  const parsed = parseOperation(op);
  const newQueue = [...queue];
  const newHistory = [...history];
  let explanation = '';
  let currentLine = 2;
  let lastResult = null;
  let animating = null;
  let highlightIndex = null;
  let dequeuedValue = null;

  switch (parsed.type) {
    case 'enqueue':
      newQueue.push(parsed.value);
      explanation = `enqueue(${parsed.value}): Added to back of queue`;
      currentLine = 5;
      animating = { type: 'enqueue', value: parsed.value };
      highlightIndex = newQueue.length - 1;
      newHistory.push({ op, result: null, queue: [...newQueue] });
      break;

    case 'dequeue':
      if (newQueue.length > 0) {
        lastResult = newQueue.shift();
        explanation = `dequeue(): Removed ${lastResult} from front`;
        animating = { type: 'dequeue', value: lastResult };
        dequeuedValue = lastResult;
        highlightIndex = 0;
      } else {
        explanation = `dequeue(): Queue is empty!`;
        lastResult = 'undefined';
      }
      currentLine = 9;
      newHistory.push({ op, result: lastResult, queue: [...newQueue] });
      break;

    case 'front':
      if (newQueue.length > 0) {
        lastResult = newQueue[0];
        explanation = `front(): Front element is ${lastResult}`;
        animating = { type: 'front', value: lastResult };
        highlightIndex = 0;
      } else {
        explanation = `front(): Queue is empty!`;
        lastResult = 'undefined';
      }
      currentLine = 12;
      newHistory.push({ op, result: lastResult, queue: [...newQueue] });
      break;

    default:
      explanation = `Unknown operation: ${op}`;
  }

  return {
    ...state,
    queue: newQueue,
    currentOp: currentOp + 1,
    lastResult,
    stepIndex: state.stepIndex + 1,
    currentLine,
    explanation,
    phase: parsed.type,
    history: newHistory,
    animating,
    operation: parsed.type,
    highlightIndex,
    dequeuedValue,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { queue, history } = state;

  return {
    success: true,
    title: 'Queue Operations Complete',
    message: `Final queue size: ${queue.length}`,
    details: [
      `Final queue (front to back): [${queue.join(', ')}]`,
      `Operations performed: ${history.length}`,
    ],
  };
}
