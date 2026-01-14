export const template = {
  name: 'Tree Traversals',
  description: 'In-order, Pre-order, Post-order, and Level-order traversals',
  code: {
    inorder: [
      { line: 'inorder(node):', indent: 0 },
      { line: 'if node is null: return', indent: 1 },
      { line: 'inorder(node.left)', indent: 1 },
      { line: 'visit(node)', indent: 1 },
      { line: 'inorder(node.right)', indent: 1 },
    ],
    preorder: [
      { line: 'preorder(node):', indent: 0 },
      { line: 'if node is null: return', indent: 1 },
      { line: 'visit(node)', indent: 1 },
      { line: 'preorder(node.left)', indent: 1 },
      { line: 'preorder(node.right)', indent: 1 },
    ],
    postorder: [
      { line: 'postorder(node):', indent: 0 },
      { line: 'if node is null: return', indent: 1 },
      { line: 'postorder(node.left)', indent: 1 },
      { line: 'postorder(node.right)', indent: 1 },
      { line: 'visit(node)', indent: 1 },
    ],
    levelorder: [
      { line: 'levelorder(root):', indent: 0 },
      { line: 'queue = [root]', indent: 1 },
      { line: 'while queue not empty:', indent: 1 },
      { line: 'node = queue.dequeue()', indent: 2 },
      { line: 'visit(node)', indent: 2 },
      { line: 'if node.left: queue.enqueue(node.left)', indent: 2 },
      { line: 'if node.right: queue.enqueue(node.right)', indent: 2 },
    ],
  },
};

export const complexity = {
  time: 'O(n)',
  space: 'O(h)',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
};

export const TRAVERSAL_INFO = {
  inorder: {
    name: 'In-order',
    order: 'Left → Root → Right',
    description: 'Visits nodes in sorted order for BST',
  },
  preorder: {
    name: 'Pre-order',
    order: 'Root → Left → Right',
    description: 'Useful for copying/serializing trees',
  },
  postorder: {
    name: 'Post-order',
    order: 'Left → Right → Root',
    description: 'Useful for deleting trees, evaluating expressions',
  },
  levelorder: {
    name: 'Level-order',
    order: 'Level by level (BFS)',
    description: 'Visits nodes by depth, uses a queue',
  },
};

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

const cloneTree = (node) => {
  if (!node) return null;
  const newNode = new TreeNode(node.value);
  newNode.id = node.id;
  newNode.left = cloneTree(node.left);
  newNode.right = cloneTree(node.right);
  return newNode;
};

const treeToArray = (node) => {
  if (!node) return [];
  return [
    { id: node.id, value: node.value, left: node.left?.id || null, right: node.right?.id || null },
    ...treeToArray(node.left),
    ...treeToArray(node.right),
  ];
};

const generateInorderSteps = (root) => {
  const steps = [];
  const tree = cloneTree(root);
  const treeArr = treeToArray(tree);
  const visited = [];
  const result = [];

  const addStep = (state) => {
    steps.push({
      tree: treeArr,
      visited: [...visited],
      result: [...result],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Starting in-order traversal (Left → Root → Right)',
    highlightedNodes: [],
    activeNode: null,
  });

  const inorder = (node) => {
    if (!node) {
      addStep({
        phase: 'null-check',
        currentLine: 1,
        explanation: 'Reached null node, returning',
        highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
        activeNode: null,
      });
      return;
    }

    addStep({
      phase: 'go-left',
      currentLine: 2,
      explanation: `At node ${node.value}, going left first`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
        { id: node.id, type: 'current' },
      ],
      activeNode: node.id,
    });

    inorder(node.left);

    visited.push(node.id);
    result.push(node.value);

    addStep({
      phase: 'visit',
      currentLine: 3,
      explanation: `Visiting node ${node.value} — added to result`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
      ],
      activeNode: node.id,
    });

    addStep({
      phase: 'go-right',
      currentLine: 4,
      explanation: `Node ${node.value} visited, now going right`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
      ],
      activeNode: node.id,
    });

    inorder(node.right);
  };

  inorder(tree);

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `In-order traversal complete! Result: [${result.join(', ')}]`,
    highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
    activeNode: null,
    done: true,
  });

  return steps;
};

const generatePreorderSteps = (root) => {
  const steps = [];
  const tree = cloneTree(root);
  const treeArr = treeToArray(tree);
  const visited = [];
  const result = [];

  const addStep = (state) => {
    steps.push({
      tree: treeArr,
      visited: [...visited],
      result: [...result],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Starting pre-order traversal (Root → Left → Right)',
    highlightedNodes: [],
    activeNode: null,
  });

  const preorder = (node) => {
    if (!node) {
      addStep({
        phase: 'null-check',
        currentLine: 1,
        explanation: 'Reached null node, returning',
        highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
        activeNode: null,
      });
      return;
    }

    visited.push(node.id);
    result.push(node.value);

    addStep({
      phase: 'visit',
      currentLine: 2,
      explanation: `Visiting node ${node.value} first — added to result`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
      ],
      activeNode: node.id,
    });

    addStep({
      phase: 'go-left',
      currentLine: 3,
      explanation: `Node ${node.value} visited, going left`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
      ],
      activeNode: node.id,
    });

    preorder(node.left);

    addStep({
      phase: 'go-right',
      currentLine: 4,
      explanation: `Left subtree of ${node.value} done, going right`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
      ],
      activeNode: node.id,
    });

    preorder(node.right);
  };

  preorder(tree);

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Pre-order traversal complete! Result: [${result.join(', ')}]`,
    highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
    activeNode: null,
    done: true,
  });

  return steps;
};

const generatePostorderSteps = (root) => {
  const steps = [];
  const tree = cloneTree(root);
  const treeArr = treeToArray(tree);
  const visited = [];
  const result = [];

  const addStep = (state) => {
    steps.push({
      tree: treeArr,
      visited: [...visited],
      result: [...result],
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Starting post-order traversal (Left → Right → Root)',
    highlightedNodes: [],
    activeNode: null,
  });

  const postorder = (node) => {
    if (!node) {
      addStep({
        phase: 'null-check',
        currentLine: 1,
        explanation: 'Reached null node, returning',
        highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
        activeNode: null,
      });
      return;
    }

    addStep({
      phase: 'go-left',
      currentLine: 2,
      explanation: `At node ${node.value}, going left first`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
        { id: node.id, type: 'current' },
      ],
      activeNode: node.id,
    });

    postorder(node.left);

    addStep({
      phase: 'go-right',
      currentLine: 3,
      explanation: `Left subtree of ${node.value} done, going right`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
        { id: node.id, type: 'current' },
      ],
      activeNode: node.id,
    });

    postorder(node.right);

    visited.push(node.id);
    result.push(node.value);

    addStep({
      phase: 'visit',
      currentLine: 4,
      explanation: `Both subtrees done, visiting node ${node.value} — added to result`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
      ],
      activeNode: node.id,
    });
  };

  postorder(tree);

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Post-order traversal complete! Result: [${result.join(', ')}]`,
    highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
    activeNode: null,
    done: true,
  });

  return steps;
};

const generateLevelorderSteps = (root) => {
  const steps = [];
  const tree = cloneTree(root);
  const treeArr = treeToArray(tree);
  const visited = [];
  const result = [];

  const addStep = (state) => {
    steps.push({
      tree: treeArr,
      visited: [...visited],
      result: [...result],
      ...state,
    });
  };

  if (!tree) {
    addStep({
      phase: 'done',
      currentLine: 0,
      explanation: 'Empty tree, nothing to traverse',
      highlightedNodes: [],
      activeNode: null,
      queue: [],
      done: true,
    });
    return steps;
  }

  const queue = [tree];
  const queueIds = [tree.id];

  addStep({
    phase: 'start',
    currentLine: 1,
    explanation: `Starting level-order traversal. Queue initialized with root [${tree.value}]`,
    highlightedNodes: [{ id: tree.id, type: 'queued' }],
    activeNode: null,
    queue: queueIds.map(id => treeArr.find(n => n.id === id)?.value),
  });

  while (queue.length > 0) {
    const node = queue.shift();
    queueIds.shift();

    addStep({
      phase: 'dequeue',
      currentLine: 3,
      explanation: `Dequeued node ${node.value} from front of queue`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
        { id: node.id, type: 'current' },
        ...queueIds.map(id => ({ id, type: 'queued' })),
      ],
      activeNode: node.id,
      queue: queueIds.map(id => treeArr.find(n => n.id === id)?.value),
    });

    visited.push(node.id);
    result.push(node.value);

    addStep({
      phase: 'visit',
      currentLine: 4,
      explanation: `Visiting node ${node.value} — added to result`,
      highlightedNodes: [
        ...visited.map(id => ({ id, type: 'visited' })),
        ...queueIds.map(id => ({ id, type: 'queued' })),
      ],
      activeNode: node.id,
      queue: queueIds.map(id => treeArr.find(n => n.id === id)?.value),
    });

    if (node.left) {
      queue.push(node.left);
      queueIds.push(node.left.id);

      addStep({
        phase: 'enqueue-left',
        currentLine: 5,
        explanation: `Enqueued left child ${node.left.value}`,
        highlightedNodes: [
          ...visited.map(id => ({ id, type: 'visited' })),
          ...queueIds.map(id => ({ id, type: 'queued' })),
        ],
        activeNode: node.id,
        queue: queueIds.map(id => treeArr.find(n => n.id === id)?.value),
      });
    }

    if (node.right) {
      queue.push(node.right);
      queueIds.push(node.right.id);

      addStep({
        phase: 'enqueue-right',
        currentLine: 6,
        explanation: `Enqueued right child ${node.right.value}`,
        highlightedNodes: [
          ...visited.map(id => ({ id, type: 'visited' })),
          ...queueIds.map(id => ({ id, type: 'queued' })),
        ],
        activeNode: node.id,
        queue: queueIds.map(id => treeArr.find(n => n.id === id)?.value),
      });
    }
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Level-order traversal complete! Result: [${result.join(', ')}]`,
    highlightedNodes: visited.map(id => ({ id, type: 'visited' })),
    activeNode: null,
    queue: [],
    done: true,
  });

  return steps;
};

export const buildTreeFromArray = (values) => {
  let root = null;
  for (const value of values) {
    if (root === null) {
      root = new TreeNode(value);
    } else {
      const insert = (node, val) => {
        if (val < node.value) {
          if (node.left === null) {
            node.left = new TreeNode(val);
          } else {
            insert(node.left, val);
          }
        } else if (val > node.value) {
          if (node.right === null) {
            node.right = new TreeNode(val);
          } else {
            insert(node.right, val);
          }
        }
      };
      insert(root, value);
    }
  }
  return root;
};

export const initialState = ({ tree, traversalType }) => {
  let steps;

  switch (traversalType) {
    case 'preorder':
      steps = generatePreorderSteps(tree);
      break;
    case 'postorder':
      steps = generatePostorderSteps(tree);
      break;
    case 'levelorder':
      steps = generateLevelorderSteps(tree);
      break;
    case 'inorder':
    default:
      steps = generateInorderSteps(tree);
      break;
  }

  return {
    traversalType,
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

  const info = TRAVERSAL_INFO[state.traversalType];

  return {
    success: true,
    title: '✓ Complete',
    message: `${info.name} traversal: [${state.result.join(', ')}]`,
    details: `${state.steps.length} steps`,
  };
};
