export const template = {
  name: 'Trie',
  description: 'Insert words and search prefixes efficiently',
  code: {
    insert: [
      { line: 'def insert(word):', indent: 0 },
      { line: 'node = root', indent: 1 },
      { line: 'for char in word:', indent: 1 },
      { line: 'if char not in node.children:', indent: 2 },
      { line: 'node.children[char] = TrieNode()', indent: 3 },
      { line: 'node = node.children[char]', indent: 2 },
      { line: 'node.is_end = True', indent: 1 },
    ],
    search: [
      { line: 'def search(word):', indent: 0 },
      { line: 'node = root', indent: 1 },
      { line: 'for char in word:', indent: 1 },
      { line: 'if char not in node.children: return False', indent: 2 },
      { line: 'node = node.children[char]', indent: 2 },
      { line: 'return node.is_end', indent: 1 },
    ],
    prefix: [
      { line: 'def starts_with(prefix):', indent: 0 },
      { line: 'node = root', indent: 1 },
      { line: 'for char in prefix:', indent: 1 },
      { line: 'if char not in node.children: return False', indent: 2 },
      { line: 'node = node.children[char]', indent: 2 },
      { line: 'return True', indent: 1 },
    ],
  },
};

export const complexity = {
  time: 'O(L)',
  space: 'O(ALPHABET * L)',
  bestCase: 'O(1)',
  averageCase: 'O(L)',
  worstCase: 'O(L)',
};

class TrieNode {
  constructor(char = '') {
    this.char = char;
    this.children = {};
    this.isEnd = false;
  }
}

const cloneTrie = (node) => {
  const newNode = new TrieNode(node.char);
  newNode.isEnd = node.isEnd;
  Object.entries(node.children).forEach(([key, child]) => {
    newNode.children[key] = cloneTrie(child);
  });
  return newNode;
};

const serializeTrie = (root) => {
  const nodes = [];
  const edges = [];
  const visit = (node, path = 'root', depth = 0) => {
    nodes.push({ id: path, char: node.char, isEnd: node.isEnd, depth });
    Object.entries(node.children).forEach(([char, child]) => {
      const childPath = `${path}.${char}`;
      edges.push({ from: path, to: childPath });
      visit(child, childPath, depth + 1);
    });
  };
  visit(root);
  return { nodes, edges };
};

const addStep = (steps, root, state) => {
  const { nodes, edges } = serializeTrie(root);
  steps.push({
    nodes,
    edges,
    ...state,
  });
};

const highlightPath = (pathIds, type = 'active') => {
  return pathIds.map((id) => ({ id, type }));
};

const buildPathId = (chars) => {
  return chars.length ? `root.${chars.join('.')}` : 'root';
};

const generateInsertSteps = (root, word) => {
  const steps = [];
  const trie = cloneTrie(root);
  const letters = word.split('');

  addStep(steps, trie, {
    phase: 'start',
    currentLine: 0,
    explanation: `Insert "${word}" into the trie.`,
    highlightedNodes: [],
    activeNode: 'root',
  });

  let node = trie;
  let path = [];

  letters.forEach((char, index) => {
    addStep(steps, trie, {
      phase: 'check-char',
      currentLine: 2,
      explanation: `Process char "${char}" at position ${index + 1}.`,
      highlightedNodes: highlightPath([buildPathId(path)], 'current'),
      activeNode: buildPathId(path),
    });

    if (!node.children[char]) {
      addStep(steps, trie, {
        phase: 'create-node',
        currentLine: 3,
        explanation: `Create node for "${char}".`,
        highlightedNodes: highlightPath([buildPathId(path)], 'comparing'),
        activeNode: buildPathId(path),
      });
      node.children[char] = new TrieNode(char);
    }

    node = node.children[char];
    path.push(char);

    addStep(steps, trie, {
      phase: 'advance',
      currentLine: 5,
      explanation: `Move to node "${char}".`,
      highlightedNodes: highlightPath([buildPathId(path)], 'current'),
      activeNode: buildPathId(path),
    });
  });

  node.isEnd = true;
  addStep(steps, trie, {
    phase: 'mark-end',
    currentLine: 6,
    explanation: `Mark end of word for "${word}".`,
    highlightedNodes: highlightPath([buildPathId(path)], 'found'),
    activeNode: buildPathId(path),
    done: true,
  });

  return { steps, trie };
};

const generateSearchSteps = (root, word, mode) => {
  const steps = [];
  const trie = cloneTrie(root);
  const letters = word.split('');

  addStep(steps, trie, {
    phase: 'start',
    currentLine: 0,
    explanation: `${mode === 'prefix' ? 'Check prefix' : 'Search'} "${word}" in the trie.`,
    highlightedNodes: [],
    activeNode: 'root',
  });

  let node = trie;
  let path = [];

  for (let i = 0; i < letters.length; i += 1) {
    const char = letters[i];
    addStep(steps, trie, {
      phase: 'check-char',
      currentLine: 2,
      explanation: `Check char "${char}".`,
      highlightedNodes: highlightPath([buildPathId(path)], 'current'),
      activeNode: buildPathId(path),
    });

    if (!node.children[char]) {
      addStep(steps, trie, {
        phase: 'missing',
        currentLine: 3,
        explanation: `Missing "${char}" — ${mode === 'prefix' ? 'prefix' : 'word'} not found.`,
        highlightedNodes: highlightPath([buildPathId(path)], 'visited'),
        activeNode: buildPathId(path),
        done: true,
        success: false,
      });
      return { steps, trie };
    }

    node = node.children[char];
    path.push(char);

    addStep(steps, trie, {
      phase: 'advance',
      currentLine: 4,
      explanation: `Move to node "${char}".`,
      highlightedNodes: highlightPath([buildPathId(path)], 'current'),
      activeNode: buildPathId(path),
    });
  }

  const success = mode === 'prefix' ? true : node.isEnd;
  addStep(steps, trie, {
    phase: 'done',
    currentLine: mode === 'prefix' ? 5 : 5,
    explanation: success
      ? `${mode === 'prefix' ? 'Prefix' : 'Word'} found.`
      : 'Reached end but word is incomplete.',
    highlightedNodes: highlightPath([buildPathId(path)], success ? 'found' : 'visited'),
    activeNode: buildPathId(path),
    done: true,
    success,
  });

  return { steps, trie };
};

export const buildTrieFromWords = (words = []) => {
  const root = new TrieNode();
  words.forEach((word) => {
    let node = root;
    word.split('').forEach((char) => {
      if (!node.children[char]) {
        node.children[char] = new TrieNode(char);
      }
      node = node.children[char];
    });
    node.isEnd = true;
  });
  return root;
};

export const initialState = ({ trie, operation, word }) => {
  const root = trie ? cloneTrie(trie) : new TrieNode();
  const normalized = (word || '').trim().toLowerCase();
  let steps = [];
  let resultTrie = root;

  if (operation === 'insert') {
    const result = generateInsertSteps(root, normalized);
    steps = result.steps;
    resultTrie = result.trie;
  } else {
    const mode = operation === 'prefix' ? 'prefix' : 'search';
    const result = generateSearchSteps(root, normalized, mode);
    steps = result.steps;
    resultTrie = result.trie;
  }

  return {
    trie: resultTrie,
    operation,
    word: normalized,
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

export const getExplanation = (state) => state.explanation || 'Initializing...';

export const getResult = (state) => {
  if (!state.done) return null;

  if (state.operation === 'insert') {
    return {
      success: true,
      title: '✓ Inserted',
      message: `Inserted "${state.word}" into the trie.`,
      details: 'Trie updated with new word.',
    };
  }

  if (state.success) {
    return {
      success: true,
      title: '✓ Found',
      message: `${state.operation === 'prefix' ? 'Prefix' : 'Word'} found.`,
      details: `"${state.word}" is present.`,
    };
  }

  return {
    success: false,
    title: 'Not found',
    message: `${state.operation === 'prefix' ? 'Prefix' : 'Word'} not found.`,
    details: `"${state.word}" is missing.`,
  };
};
