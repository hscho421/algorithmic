export const template = {
  name: 'AVL Tree',
  description: 'Self-balancing BST with rotations',
  code: [
    { line: 'def insert(node, value):', indent: 0 },
    { line: 'if node is None: return Node(value)', indent: 1 },
    { line: 'if value < node.value: node.left = insert(node.left, value)', indent: 1 },
    { line: 'elif value > node.value: node.right = insert(node.right, value)', indent: 1 },
    { line: 'update_height(node)', indent: 1 },
    { line: 'balance = height(left) - height(right)', indent: 1 },
    { line: 'if balance > 1 and value < node.left.value: return rotate_right(node)', indent: 1 },
    { line: 'if balance < -1 and value > node.right.value: return rotate_left(node)', indent: 1 },
    { line: 'if balance > 1 and value > node.left.value:', indent: 1 },
    { line: 'node.left = rotate_left(node.left)', indent: 2 },
    { line: 'return rotate_right(node)', indent: 2 },
    { line: 'if balance < -1 and value < node.right.value:', indent: 1 },
    { line: 'node.right = rotate_right(node.right)', indent: 2 },
    { line: 'return rotate_left(node)', indent: 2 },
    { line: 'return node', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(log n)',
  space: 'O(log n)',
  bestCase: 'O(log n)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
};

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.id = Math.random().toString(36).slice(2, 9);
  }
}

const height = (node) => (node ? node.height : 0);

const updateHeight = (node) => {
  if (!node) return;
  node.height = Math.max(height(node.left), height(node.right)) + 1;
};

const getBalance = (node) => (node ? height(node.left) - height(node.right) : 0);

const cloneTree = (node) => {
  if (!node) return null;
  const newNode = new TreeNode(node.value);
  newNode.id = node.id;
  newNode.height = node.height;
  newNode.left = cloneTree(node.left);
  newNode.right = cloneTree(node.right);
  return newNode;
};

const treeToArray = (node) => {
  if (!node) return [];
  return [
    {
      id: node.id,
      value: node.value,
      left: node.left?.id || null,
      right: node.right?.id || null,
    },
    ...treeToArray(node.left),
    ...treeToArray(node.right),
  ];
};

const rotateRight = (y) => {
  const x = y.left;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  updateHeight(y);
  updateHeight(x);
  return x;
};

const rotateLeft = (x) => {
  const y = x.right;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  updateHeight(x);
  updateHeight(y);
  return y;
};

const generateInsertSteps = (root, value) => {
  const steps = [];
  let tree = cloneTree(root);

  const addStep = (state) => {
    steps.push({
      tree: treeToArray(tree),
      treeRoot: tree,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Insert ${value} into AVL tree`,
    highlightedNodes: [],
    activeNode: null,
  });

  const insert = (node) => {
    if (!node) {
      const newNode = new TreeNode(value);
      addStep({
        phase: 'insert',
        currentLine: 1,
        explanation: `Create node ${value}`,
        highlightedNodes: [{ id: newNode.id, type: 'inserting' }],
        activeNode: newNode.id,
      });
      return newNode;
    }

    addStep({
      phase: 'compare',
      currentLine: 2,
      explanation: `Compare ${value} with ${node.value}`,
      highlightedNodes: [{ id: node.id, type: 'comparing' }],
      activeNode: node.id,
    });

    if (value < node.value) {
      node.left = insert(node.left);
    } else if (value > node.value) {
      node.right = insert(node.right);
    } else {
      addStep({
        phase: 'duplicate',
        currentLine: 3,
        explanation: `${value} already exists`,
        highlightedNodes: [{ id: node.id, type: 'found' }],
        activeNode: node.id,
      });
      return node;
    }

    updateHeight(node);
    const balance = getBalance(node);

    addStep({
      phase: 'balance-check',
      currentLine: 5,
      explanation: `Balance at ${node.value} = ${balance}`,
      highlightedNodes: [{ id: node.id, type: balance > 1 || balance < -1 ? 'current' : 'visited' }],
      activeNode: node.id,
    });

    if (balance > 1 && value < node.left.value) {
      addStep({
        phase: 'rotate-right',
        currentLine: 6,
        explanation: `LL case: rotate right at ${node.value}`,
        highlightedNodes: [
          { id: node.id, type: 'current' },
          { id: node.left.id, type: 'visited' },
        ],
        activeNode: node.id,
      });
      return rotateRight(node);
    }

    if (balance < -1 && value > node.right.value) {
      addStep({
        phase: 'rotate-left',
        currentLine: 7,
        explanation: `RR case: rotate left at ${node.value}`,
        highlightedNodes: [
          { id: node.id, type: 'current' },
          { id: node.right.id, type: 'visited' },
        ],
        activeNode: node.id,
      });
      return rotateLeft(node);
    }

    if (balance > 1 && value > node.left.value) {
      addStep({
        phase: 'rotate-left-right',
        currentLine: 8,
        explanation: `LR case: rotate left at ${node.left.value}, then right at ${node.value}`,
        highlightedNodes: [
          { id: node.id, type: 'current' },
          { id: node.left.id, type: 'visited' },
        ],
        activeNode: node.id,
      });
      node.left = rotateLeft(node.left);
      return rotateRight(node);
    }

    if (balance < -1 && value < node.right.value) {
      addStep({
        phase: 'rotate-right-left',
        currentLine: 11,
        explanation: `RL case: rotate right at ${node.right.value}, then left at ${node.value}`,
        highlightedNodes: [
          { id: node.id, type: 'current' },
          { id: node.right.id, type: 'visited' },
        ],
        activeNode: node.id,
      });
      node.right = rotateRight(node.right);
      return rotateLeft(node);
    }

    return node;
  };

  tree = insert(tree);

  addStep({
    phase: 'done',
    currentLine: 14,
    explanation: `Insertion complete`,
    highlightedNodes: treeToArray(tree).map((n) => ({ id: n.id, type: n.value === value ? 'inserted' : 'default' })),
    activeNode: null,
    done: true,
  });

  return { steps, finalTree: tree };
};

export const buildAVLFromArray = (values) => {
  let root = null;
  values.forEach((value) => {
    const insert = (node, val) => {
      if (!node) return new TreeNode(val);
      if (val < node.value) node.left = insert(node.left, val);
      else if (val > node.value) node.right = insert(node.right, val);
      updateHeight(node);
      const balance = getBalance(node);
      if (balance > 1 && val < node.left.value) return rotateRight(node);
      if (balance < -1 && val > node.right.value) return rotateLeft(node);
      if (balance > 1 && val > node.left.value) {
        node.left = rotateLeft(node.left);
        return rotateRight(node);
      }
      if (balance < -1 && val < node.right.value) {
        node.right = rotateRight(node.right);
        return rotateLeft(node);
      }
      return node;
    };
    root = insert(root, value);
  });
  return root;
};

export const initialState = ({ tree, value }) => {
  const { steps, finalTree } = generateInsertSteps(tree, value);
  return {
    value,
    steps,
    stepIndex: 0,
    finalTree,
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
  if (!state.done) return null;
  return {
    success: true,
    title: 'AVL Insertion Complete',
    message: `Inserted ${state.value} with balancing`,
    details: `Steps: ${state.steps.length}`,
  };
};
