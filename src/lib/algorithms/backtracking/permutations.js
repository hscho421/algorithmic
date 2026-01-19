// Permutations - Generate all permutations using backtracking

export const template = {
  name: 'Permutations',
  description: 'Generate all permutations of an array using backtracking',
  code: [
    { line: 'def permute(nums):', indent: 0 },
    { line: 'result = []', indent: 1 },
    { line: '', indent: 0 },
    { line: 'def backtrack(path, remaining):', indent: 1 },
    { line: 'if not remaining:', indent: 2 },
    { line: 'result.append(path[:])', indent: 3 },
    { line: 'return', indent: 3 },
    { line: '', indent: 0 },
    { line: 'for i, num in enumerate(remaining):', indent: 2 },
    { line: '# Choose', indent: 3 },
    { line: 'path.append(num)', indent: 3 },
    { line: '# Explore', indent: 3 },
    { line: 'backtrack(path, remaining[:i] + remaining[i+1:])', indent: 3 },
    { line: '# Unchoose (backtrack)', indent: 3 },
    { line: 'path.pop()', indent: 3 },
    { line: '', indent: 0 },
    { line: 'backtrack([], nums)', indent: 1 },
    { line: 'return result', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n! × n)',
  space: 'O(n!)',
  bestCase: 'O(n! × n)',
  averageCase: 'O(n! × n)',
  worstCase: 'O(n! × n)',
  note: 'n! permutations, each taking O(n) to copy',
};

const generateSteps = (nums) => {
  const steps = [];
  const result = [];

  if (nums.length === 0) {
    steps.push({
      nums: [],
      path: [],
      remaining: [],
      result: [[]],
      phase: 'done',
      currentLine: 17,
      explanation: 'Empty array - only one permutation: []',
      done: true,
      depth: 0,
      chosenIndex: null,
      tree: [],
    });
    return steps;
  }

  // Build a tree structure for visualization
  let nodeId = 0;
  const tree = [];

  const addStep = (state) => {
    steps.push({
      nums: [...nums],
      result: result.map(r => [...r]),
      tree: JSON.parse(JSON.stringify(tree)),
      ...state,
    });
  };

  // Initial step
  addStep({
    path: [],
    remaining: [...nums],
    phase: 'init',
    currentLine: 16,
    explanation: `Starting permutation generation for [${nums.join(', ')}]`,
    depth: 0,
    chosenIndex: null,
    currentNodeId: null,
  });

  const backtrack = (path, remaining, depth, parentId) => {
    // Base case - found a complete permutation
    if (remaining.length === 0) {
      result.push([...path]);

      addStep({
        path: [...path],
        remaining: [],
        phase: 'found',
        currentLine: 5,
        explanation: `Found permutation #${result.length}: [${path.join(', ')}]`,
        depth,
        chosenIndex: null,
        currentNodeId: parentId,
        foundPermutation: [...path],
      });
      return;
    }

    // Try each remaining element
    for (let i = 0; i < remaining.length; i++) {
      const num = remaining[i];
      const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      const currentId = ++nodeId;

      // Add node to tree
      tree.push({
        id: currentId,
        parentId,
        value: num,
        path: [...path, num],
        depth,
        status: 'exploring',
      });

      // Choose step
      addStep({
        path: [...path],
        remaining: [...remaining],
        phase: 'choose',
        currentLine: 10,
        explanation: `Choose: Add ${num} to path [${path.join(', ')}]`,
        depth,
        chosenIndex: i,
        chosenValue: num,
        currentNodeId: currentId,
      });

      path.push(num);

      // Explore step
      addStep({
        path: [...path],
        remaining: [...newRemaining],
        phase: 'explore',
        currentLine: 12,
        explanation: `Explore: path = [${path.join(', ')}], remaining = [${newRemaining.join(', ')}]`,
        depth: depth + 1,
        chosenIndex: null,
        currentNodeId: currentId,
      });

      // Recurse
      backtrack(path, newRemaining, depth + 1, currentId);

      // Update node status
      const node = tree.find(n => n.id === currentId);
      if (node) node.status = 'backtracked';

      // Unchoose step (backtrack)
      path.pop();

      addStep({
        path: [...path],
        remaining: [...remaining],
        phase: 'unchoose',
        currentLine: 14,
        explanation: `Backtrack: Remove ${num}, path = [${path.join(', ')}]`,
        depth,
        chosenIndex: i,
        unchosenValue: num,
        currentNodeId: parentId,
      });
    }
  };

  backtrack([], nums, 0, null);

  // Final step
  addStep({
    path: [],
    remaining: [...nums],
    phase: 'done',
    currentLine: 17,
    explanation: `Done! Generated ${result.length} permutations`,
    depth: 0,
    chosenIndex: null,
    currentNodeId: null,
    done: true,
  });

  return steps;
};

export function initialState({ nums = [1, 2, 3] } = {}) {
  const steps = generateSteps(nums);

  return {
    ...steps[0],
    steps,
    stepIndex: 0,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= state.steps.length) {
    return { ...state, done: true };
  }

  return {
    ...state,
    ...state.steps[nextIndex],
    stepIndex: nextIndex,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { result, nums } = state;
  const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
  const expected = factorial(nums.length);

  return {
    success: result.length === expected,
    title: `${result.length} Permutations Generated`,
    message: `All permutations of [${nums.join(', ')}]`,
    details: result.slice(0, 6).map((p, i) => `${i + 1}. [${p.join(', ')}]`).concat(
      result.length > 6 ? [`... and ${result.length - 6} more`] : []
    ),
  };
}
