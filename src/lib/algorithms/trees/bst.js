export const template = {
  name: 'Binary Search Tree',
  description: 'Insert, search, and delete operations on BST',
  code: [
    { line: 'insert(node, value):', indent: 0 },
    { line: 'if node is null:', indent: 1 },
    { line: 'return new Node(value)', indent: 2 },
    { line: 'if value < node.value:', indent: 1 },
    { line: 'node.left = insert(node.left, value)', indent: 2 },
    { line: 'else if value > node.value:', indent: 1 },
    { line: 'node.right = insert(node.right, value)', indent: 2 },
    { line: 'return node', indent: 1 },
    { line: '', indent: 0 },
    { line: 'search(node, value):', indent: 0 },
    { line: 'if node is null: return false', indent: 1 },
    { line: 'if value == node.value: return true', indent: 1 },
    { line: 'if value < node.value:', indent: 1 },
    { line: 'return search(node.left, value)', indent: 2 },
    { line: 'else:', indent: 1 },
    { line: 'return search(node.right, value)', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(h)',
  space: 'O(h)',
  bestCase: 'O(log n)',
  averageCase: 'O(log n)',
  worstCase: 'O(n)',
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
    explanation: `Starting insertion of value ${value}`,
    highlightedNodes: [],
    activeNode: null,
    comparingValue: value,
  });

  const insert = (node, parentId = null, direction = null) => {
    if (!node) {
      const newNode = new TreeNode(value);
      
      addStep({
        phase: 'create',
        currentLine: 2,
        explanation: `Creating new node with value ${value}`,
        highlightedNodes: [{ id: newNode.id, type: 'inserting' }],
        activeNode: newNode.id,
        comparingValue: value,
      });

      return newNode;
    }

    addStep({
      phase: 'compare',
      currentLine: 3,
      explanation: `Comparing ${value} with node ${node.value}`,
      highlightedNodes: [{ id: node.id, type: 'comparing' }],
      activeNode: node.id,
      comparingValue: value,
    });

    if (value < node.value) {
      addStep({
        phase: 'go-left',
        currentLine: 4,
        explanation: `${value} < ${node.value}, going left`,
        highlightedNodes: [{ id: node.id, type: 'visited' }],
        activeNode: node.id,
        direction: 'left',
        comparingValue: value,
      });
      node.left = insert(node.left, node.id, 'left');
    } else if (value > node.value) {
      addStep({
        phase: 'go-right',
        currentLine: 6,
        explanation: `${value} > ${node.value}, going right`,
        highlightedNodes: [{ id: node.id, type: 'visited' }],
        activeNode: node.id,
        direction: 'right',
        comparingValue: value,
      });
      node.right = insert(node.right, node.id, 'right');
    } else {
      addStep({
        phase: 'duplicate',
        currentLine: 7,
        explanation: `Value ${value} already exists in tree`,
        highlightedNodes: [{ id: node.id, type: 'found' }],
        activeNode: node.id,
        comparingValue: value,
      });
    }

    return node;
  };

  tree = insert(tree);

  addStep({
    phase: 'done',
    currentLine: 7,
    explanation: `Insertion complete! Value ${value} added to tree`,
    highlightedNodes: treeToArray(tree).map(n => ({ id: n.id, type: n.value === value ? 'inserted' : 'default' })),
    activeNode: null,
    comparingValue: value,
    done: true,
  });

  return { steps, finalTree: tree };
};

const generateSearchSteps = (root, value) => {
  const steps = [];
  const tree = cloneTree(root);

  const addStep = (state) => {
    steps.push({
      tree: treeToArray(tree),
      treeRoot: tree,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 9,
    explanation: `Starting search for value ${value}`,
    highlightedNodes: [],
    activeNode: null,
    comparingValue: value,
  });

  let found = false;
  let foundNode = null;

  const search = (node) => {
    if (!node) {
      addStep({
        phase: 'not-found',
        currentLine: 10,
        explanation: `Reached null node — value ${value} not found`,
        highlightedNodes: [],
        activeNode: null,
        comparingValue: value,
      });
      return false;
    }

    addStep({
      phase: 'compare',
      currentLine: 11,
      explanation: `Comparing ${value} with node ${node.value}`,
      highlightedNodes: [{ id: node.id, type: 'comparing' }],
      activeNode: node.id,
      comparingValue: value,
    });

    if (value === node.value) {
      addStep({
        phase: 'found',
        currentLine: 11,
        explanation: `Found value ${value}!`,
        highlightedNodes: [{ id: node.id, type: 'found' }],
        activeNode: node.id,
        comparingValue: value,
      });
      found = true;
      foundNode = node;
      return true;
    }

    if (value < node.value) {
      addStep({
        phase: 'go-left',
        currentLine: 13,
        explanation: `${value} < ${node.value}, searching left subtree`,
        highlightedNodes: [{ id: node.id, type: 'visited' }],
        activeNode: node.id,
        direction: 'left',
        comparingValue: value,
      });
      return search(node.left);
    } else {
      addStep({
        phase: 'go-right',
        currentLine: 15,
        explanation: `${value} > ${node.value}, searching right subtree`,
        highlightedNodes: [{ id: node.id, type: 'visited' }],
        activeNode: node.id,
        direction: 'right',
        comparingValue: value,
      });
      return search(node.right);
    }
  };

  search(tree);

  addStep({
    phase: 'done',
    currentLine: found ? 11 : 10,
    explanation: found ? `Search complete! Found value ${value}` : `Search complete. Value ${value} not in tree`,
    highlightedNodes: foundNode ? [{ id: foundNode.id, type: 'found' }] : [],
    activeNode: foundNode?.id || null,
    comparingValue: value,
    found,
    done: true,
  });

  return { steps, found };
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

export const initialState = ({ tree, operation, value }) => {
  let result;
  if (operation === 'insert') {
    result = generateInsertSteps(tree, value);
  } else {
    result = generateSearchSteps(tree, value);
  }

  const { steps } = result;
  const finalTree = result.finalTree || tree;

  return {
    operation,
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

export const getExplanation = (state) => {
  return state.explanation || 'Initializing...';
};

export const getResult = (state) => {
  if (!state.done) return null;

  if (state.operation === 'insert') {
    return {
      success: true,
      title: '✓ Inserted',
      message: `Value ${state.value} inserted into BST`,
      details: `Steps: ${state.steps.length}`,
    };
  } else {
    return {
      success: state.found,
      title: state.found ? '✓ Found' : '✗ Not Found',
      message: state.found
        ? `Value ${state.value} exists in the tree`
        : `Value ${state.value} not found in tree`,
      details: `Steps: ${state.steps.length}`,
    };
  }
};
