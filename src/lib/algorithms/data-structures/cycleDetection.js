export const template = {
  name: 'Cycle Detection',
  description: "Floyd's Tortoise and Hare algorithm — O(n)",
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  code: [
    { line: 'def has_cycle(head):', indent: 0 },
    { line: 'if not head or not head.next:', indent: 1 },
    { line: 'return False', indent: 2 },
    { line: 'slow = head', indent: 1 },
    { line: 'fast = head', indent: 1 },
    { line: 'while fast and fast.next:', indent: 1 },
    { line: 'slow = slow.next', indent: 2 },
    { line: 'fast = fast.next.next', indent: 2 },
    { line: 'if slow == fast:', indent: 2 },
    { line: 'return True  # Cycle detected', indent: 3 },
    { line: 'return False  # No cycle', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n)',
  space: 'O(1)',
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
};

const generateSteps = (values, cycleIndex) => {
  const steps = [];
  const n = values.length;
  const hasCycle = cycleIndex !== null && cycleIndex >= 0 && cycleIndex < n;

  // Build the linked list representation
  const nodes = values.map((val, idx) => ({
    value: val,
    next: idx < n - 1 ? idx + 1 : (hasCycle ? cycleIndex : null),
    id: idx,
  }));

  const addStep = (state) => {
    steps.push({
      nodes: nodes.map(n => ({ ...n })),
      hasCycle,
      cycleIndex,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Detect cycle in linked list using Floyd's algorithm (slow and fast pointers).`,
    slowIdx: null,
    fastIdx: null,
    visited: [],
  });

  if (n === 0 || n === 1) {
    addStep({
      phase: 'edge-case',
      currentLine: 2,
      explanation: `List has ${n} node(s). No cycle possible.`,
      slowIdx: null,
      fastIdx: null,
      visited: [],
      done: true,
      cycleFound: false,
    });
    return steps;
  }

  let slowIdx = 0;
  let fastIdx = 0;
  const visited = [];

  addStep({
    phase: 'init',
    currentLine: 4,
    explanation: `Initialize: slow = head (node ${nodes[slowIdx].value}), fast = head (node ${nodes[fastIdx].value})`,
    slowIdx,
    fastIdx,
    visited: [...visited],
  });

  let iterations = 0;
  const maxIterations = n * 2 + 5; // Safety limit

  while (fastIdx !== null && nodes[fastIdx].next !== null && iterations < maxIterations) {
    iterations++;

    // Move slow one step
    const prevSlowIdx = slowIdx;
    slowIdx = nodes[slowIdx].next;
    visited.push(prevSlowIdx);

    addStep({
      phase: 'move-slow',
      currentLine: 6,
      explanation: `Slow moves one step: ${nodes[prevSlowIdx].value} → ${nodes[slowIdx].value}`,
      slowIdx,
      fastIdx,
      visited: [...visited],
    });

    // Move fast two steps
    const prevFastIdx = fastIdx;
    fastIdx = nodes[fastIdx].next;
    if (fastIdx !== null) {
      fastIdx = nodes[fastIdx].next;
    }

    addStep({
      phase: 'move-fast',
      currentLine: 7,
      explanation: `Fast moves two steps: ${nodes[prevFastIdx].value} → ${fastIdx !== null ? nodes[fastIdx].value : 'null'}`,
      slowIdx,
      fastIdx,
      visited: [...visited],
    });

    // Check if they meet
    if (slowIdx === fastIdx) {
      addStep({
        phase: 'cycle-found',
        currentLine: 9,
        explanation: `Slow and fast meet at node ${nodes[slowIdx].value}! Cycle detected.`,
        slowIdx,
        fastIdx,
        visited: [...visited],
        done: true,
        cycleFound: true,
        meetingPoint: slowIdx,
      });
      return steps;
    }

    addStep({
      phase: 'check',
      currentLine: 8,
      explanation: `slow (${nodes[slowIdx].value}) ≠ fast (${fastIdx !== null ? nodes[fastIdx].value : 'null'}). Continue searching.`,
      slowIdx,
      fastIdx,
      visited: [...visited],
    });
  }

  addStep({
    phase: 'no-cycle',
    currentLine: 10,
    explanation: `Fast pointer reached end (null). No cycle in the list.`,
    slowIdx,
    fastIdx,
    visited: [...visited],
    done: true,
    cycleFound: false,
  });

  return steps;
};

export const initialState = ({ values, cycleIndex }) => {
  const steps = generateSteps(values, cycleIndex);
  return {
    values,
    cycleIndex,
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

  if (state.cycleFound) {
    return {
      success: true,
      title: 'Cycle Detected',
      message: `Slow and fast pointers met at node ${state.nodes[state.meetingPoint].value}`,
      details: ['Cycle exists in the linked list', "Floyd's algorithm: O(n) time, O(1) space"],
    };
  }

  return {
    success: true,
    title: 'No Cycle',
    message: 'The linked list has no cycle',
    details: ['Fast pointer reached the end', "Floyd's algorithm: O(n) time, O(1) space"],
  };
};
