export const template = {
  name: 'Linked List Reversal',
  description: 'Reverse a singly linked list in-place — O(n)',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  code: [
    { line: 'def reverse_list(head):', indent: 0 },
    { line: 'prev = None', indent: 1 },
    { line: 'curr = head', indent: 1 },
    { line: 'while curr:', indent: 1 },
    { line: 'next_temp = curr.next', indent: 2 },
    { line: 'curr.next = prev', indent: 2 },
    { line: 'prev = curr', indent: 2 },
    { line: 'curr = next_temp', indent: 2 },
    { line: 'return prev', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n)',
  space: 'O(1)',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
};

const generateSteps = (values) => {
  const steps = [];
  const n = values.length;

  // Build the linked list representation
  const buildList = (vals) => {
    return vals.map((val, idx) => ({
      value: val,
      next: idx < vals.length - 1 ? idx + 1 : null,
      id: idx,
    }));
  };

  let nodes = buildList(values);

  const addStep = (state) => {
    steps.push({
      nodes: nodes.map(n => ({ ...n })),
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Reverse linked list: ${values.join(' → ')} → null`,
    prevIdx: null,
    currIdx: 0,
    nextIdx: null,
    reversed: [],
  });

  let prevIdx = null;
  let currIdx = 0;
  const reversed = [];

  addStep({
    phase: 'init',
    currentLine: 2,
    explanation: `Initialize prev = null, curr = head (node ${nodes[currIdx].value})`,
    prevIdx,
    currIdx,
    nextIdx: null,
    reversed: [...reversed],
  });

  while (currIdx !== null) {
    const nextIdx = nodes[currIdx].next;

    addStep({
      phase: 'save-next',
      currentLine: 4,
      explanation: `Save next: next_temp = curr.next = ${nextIdx !== null ? `node ${nodes[nextIdx].value}` : 'null'}`,
      prevIdx,
      currIdx,
      nextIdx,
      reversed: [...reversed],
    });

    // Reverse the link
    nodes[currIdx].next = prevIdx;

    addStep({
      phase: 'reverse-link',
      currentLine: 5,
      explanation: `Reverse link: curr.next = prev (${prevIdx !== null ? `node ${nodes[prevIdx].value}` : 'null'})`,
      prevIdx,
      currIdx,
      nextIdx,
      reversed: [...reversed, currIdx],
    });

    // Move prev
    prevIdx = currIdx;
    reversed.push(currIdx);

    addStep({
      phase: 'move-prev',
      currentLine: 6,
      explanation: `Move prev: prev = curr (node ${nodes[prevIdx].value})`,
      prevIdx,
      currIdx,
      nextIdx,
      reversed: [...reversed],
    });

    // Move curr
    currIdx = nextIdx;

    addStep({
      phase: 'move-curr',
      currentLine: 7,
      explanation: `Move curr: curr = next_temp (${currIdx !== null ? `node ${nodes[currIdx].value}` : 'null'})`,
      prevIdx,
      currIdx,
      nextIdx: null,
      reversed: [...reversed],
    });
  }

  // Build reversed string
  const reversedValues = [];
  let idx = prevIdx;
  while (idx !== null) {
    reversedValues.push(nodes[idx].value);
    idx = nodes[idx].next;
  }

  addStep({
    phase: 'done',
    currentLine: 8,
    explanation: `Reversal complete! New list: ${reversedValues.join(' → ')} → null`,
    prevIdx,
    currIdx: null,
    nextIdx: null,
    reversed: [...reversed],
    done: true,
  });

  return steps;
};

export const initialState = ({ values }) => {
  const steps = generateSteps(values);
  return {
    values,
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

  return {
    success: true,
    title: 'Reversed',
    message: 'Linked list reversed successfully',
    details: [`Nodes processed: ${state.values.length}`, 'Space complexity: O(1)'],
  };
};
