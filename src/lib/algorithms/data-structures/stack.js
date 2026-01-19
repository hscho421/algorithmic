// Stack Data Structure with Applications

export const template = {
  name: 'Stack',
  description: 'LIFO data structure - push and pop operations',
  code: [
    { line: 'class Stack:', indent: 0 },
    { line: 'def __init__(self):', indent: 1 },
    { line: 'self.items = []', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def push(self, item):', indent: 1 },
    { line: 'self.items.append(item)', indent: 2 },
    { line: '', indent: 0 },
    { line: 'def pop(self):', indent: 1 },
    { line: 'if not self.is_empty():', indent: 2 },
    { line: 'return self.items.pop()', indent: 3 },
    { line: '', indent: 0 },
    { line: 'def peek(self):', indent: 1 },
    { line: 'return self.items[-1] if self.items else None', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(1) for push, pop, peek',
  space: 'O(n)',
  operations: {
    push: 'O(1)',
    pop: 'O(1)',
    peek: 'O(1)',
    isEmpty: 'O(1)',
  },
};

export function initialState({
  operations = ['push(5)', 'push(3)', 'push(8)', 'pop()', 'push(2)', 'peek()', 'pop()'],
  initialStack = [],
} = {}) {
  return {
    stack: [...initialStack],
    operations: [...operations],
    currentOp: 0,
    lastResult: null,
    stepIndex: 0,
    done: false,
    currentLine: 2,
    explanation: 'Stack initialized (empty)',
    phase: 'init',
    history: [],
    animating: null,
    operation: null,
    highlightIndex: null,
    poppedValue: null,
  };
}

function parseOperation(op) {
  const pushMatch = op.match(/push\((.+)\)/);
  if (pushMatch) {
    return { type: 'push', value: pushMatch[1] };
  }
  if (op === 'pop()') {
    return { type: 'pop' };
  }
  if (op === 'peek()') {
    return { type: 'peek' };
  }
  return { type: 'unknown' };
}

export function executeStep(state) {
  if (state.done) return state;

  const { stack, operations, currentOp, history } = state;

  if (currentOp >= operations.length) {
    return {
      ...state,
      done: true,
      currentLine: 12,
      explanation: `All operations complete. Final stack: [${stack.join(', ')}]`,
      phase: 'done',
    };
  }

  const op = operations[currentOp];
  const parsed = parseOperation(op);
  const newStack = [...stack];
  const newHistory = [...history];
  let explanation = '';
  let currentLine = 2;
  let lastResult = null;
  let animating = null;
  let highlightIndex = null;
  let poppedValue = null;

  switch (parsed.type) {
    case 'push':
      newStack.push(parsed.value);
      explanation = `push(${parsed.value}): Added to top of stack`;
      currentLine = 5;
      animating = { type: 'push', value: parsed.value };
      highlightIndex = newStack.length - 1;
      newHistory.push({ op, result: null, stack: [...newStack] });
      break;

    case 'pop':
      if (newStack.length > 0) {
        lastResult = newStack.pop();
        explanation = `pop(): Removed ${lastResult} from top`;
        animating = { type: 'pop', value: lastResult };
        poppedValue = lastResult;
        highlightIndex = newStack.length;
      } else {
        explanation = `pop(): Stack is empty!`;
        lastResult = 'undefined';
      }
      currentLine = 9;
      newHistory.push({ op, result: lastResult, stack: [...newStack] });
      break;

    case 'peek':
      if (newStack.length > 0) {
        lastResult = newStack[newStack.length - 1];
        explanation = `peek(): Top element is ${lastResult}`;
        animating = { type: 'peek', value: lastResult };
        highlightIndex = newStack.length - 1;
      } else {
        explanation = `peek(): Stack is empty!`;
        lastResult = 'undefined';
      }
      currentLine = 12;
      newHistory.push({ op, result: lastResult, stack: [...newStack] });
      break;

    default:
      explanation = `Unknown operation: ${op}`;
  }

  return {
    ...state,
    stack: newStack,
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
    poppedValue,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { stack, history } = state;

  return {
    success: true,
    title: 'Stack Operations Complete',
    message: `Final stack size: ${stack.length}`,
    details: [
      `Final stack (bottom to top): [${stack.join(', ')}]`,
      `Operations performed: ${history.length}`,
    ],
  };
}
