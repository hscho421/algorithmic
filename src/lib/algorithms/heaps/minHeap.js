const HEAP_TYPES = {
  min: {
    label: 'Min',
    rootLabel: 'min',
    compareWord: 'smaller',
    orderSymbol: '<=',
    updateLabel: 'Decrease',
  },
  max: {
    label: 'Max',
    rootLabel: 'max',
    compareWord: 'larger',
    orderSymbol: '>=',
    updateLabel: 'Increase',
  },
};

export const template = {
  name: 'Binary Heap',
  description: 'Insert, extract, delete, and update-key operations on a binary heap',
  code: {
    insert: [
      { line: 'def insert(value):', indent: 0 },
      { line: 'heap.append(value)', indent: 1 },
      { line: 'i = len(heap) - 1', indent: 1 },
      { line: 'while i > 0:', indent: 1 },
      { line: 'parent = (i - 1) // 2', indent: 2 },
      { line: 'if in_order(heap[parent], heap[i]): break', indent: 2 },
      { line: 'heap[parent], heap[i] = heap[i], heap[parent]', indent: 2 },
      { line: 'i = parent', indent: 2 },
    ],
    extract: [
      { line: 'def extract_root():', indent: 0 },
      { line: 'if not heap: return None', indent: 1 },
      { line: 'root = heap[0]', indent: 1 },
      { line: 'last = heap.pop()', indent: 1 },
      { line: 'if heap: heap[0] = last', indent: 1 },
      { line: 'i = 0', indent: 1 },
      { line: 'while True:', indent: 1 },
      { line: 'left, right = 2*i + 1, 2*i + 2', indent: 2 },
      { line: 'best = i', indent: 2 },
      { line: 'if left < len(heap) and better(heap[left], heap[best]):', indent: 2 },
      { line: 'best = left', indent: 3 },
      { line: 'if right < len(heap) and better(heap[right], heap[best]):', indent: 2 },
      { line: 'best = right', indent: 3 },
      { line: 'if best == i: break', indent: 2 },
      { line: 'heap[i], heap[best] = heap[best], heap[i]', indent: 2 },
      { line: 'i = best', indent: 2 },
      { line: 'return root', indent: 1 },
    ],
    heapify: [
      { line: 'def build_heap(arr):', indent: 0 },
      { line: 'heap = arr', indent: 1 },
      { line: 'for i in range((n - 2) // 2, -1, -1):', indent: 1 },
      { line: 'sift_down(i)', indent: 2 },
    ],
    deleteIndex: [
      { line: 'def delete_index(i):', indent: 0 },
      { line: 'if i < 0 or i >= len(heap): return', indent: 1 },
      { line: 'heap[i], heap[-1] = heap[-1], heap[i]', indent: 1 },
      { line: 'heap.pop()', indent: 1 },
      { line: 'if i > 0 and higher_priority(heap[i], heap[parent(i)]):', indent: 1 },
      { line: 'bubble_up(i)', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: 'sift_down(i)', indent: 2 },
    ],
    changeKey: [
      { line: 'def change_key(i, value):', indent: 0 },
      { line: 'if i < 0 or i >= len(heap): return', indent: 1 },
      { line: 'heap[i] = value', indent: 1 },
      { line: 'if i > 0 and higher_priority(heap[i], heap[parent(i)]):', indent: 1 },
      { line: 'bubble_up(i)', indent: 2 },
      { line: 'else:', indent: 1 },
      { line: 'sift_down(i)', indent: 2 },
    ],
  },
};

export const complexity = {
  time: 'O(log n)',
  space: 'O(1)',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
};

const nodeId = (index) => `node-${index}`;

const heapToTree = (heap) => {
  return heap.map((value, index) => {
    const leftIndex = 2 * index + 1;
    const rightIndex = 2 * index + 2;
    return {
      id: nodeId(index),
      value,
      left: leftIndex < heap.length ? nodeId(leftIndex) : null,
      right: rightIndex < heap.length ? nodeId(rightIndex) : null,
    };
  });
};

const highlightNodes = (indices, type) => {
  return indices.map((index) => ({ id: nodeId(index), type }));
};

const highlightArray = (indices, type) => {
  return indices.map((index) => ({ index, type }));
};

const getParentIndex = (index) => {
  return index > 0 ? Math.floor((index - 1) / 2) : null;
};

const getInfo = (heapType) => HEAP_TYPES[heapType] || HEAP_TYPES.min;

const isHigherPriority = (a, b, heapType) => {
  return heapType === 'max' ? a > b : a < b;
};

const isInOrder = (parentValue, childValue, heapType) => {
  return heapType === 'max' ? parentValue >= childValue : parentValue <= childValue;
};

export const buildHeapFromArray = (values = [], heapType = 'min') => {
  const heap = values.filter((value) => Number.isFinite(value));
  const siftDown = (start, size) => {
    let i = start;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let best = i;

      if (left < size && isHigherPriority(heap[left], heap[best], heapType)) {
        best = left;
      }
      if (right < size && isHigherPriority(heap[right], heap[best], heapType)) {
        best = right;
      }
      if (best === i) return;

      [heap[i], heap[best]] = [heap[best], heap[i]];
      i = best;
    }
  };

  for (let i = Math.floor((heap.length - 2) / 2); i >= 0; i -= 1) {
    siftDown(i, heap.length);
  }

  return heap;
};

const addBaseStep = (steps, heap, state) => {
  steps.push({
    heap: [...heap],
    tree: heapToTree(heap),
    ...state,
  });
};

const bubbleUp = ({
  heap,
  startIndex,
  heapType,
  steps,
  currentLineBase,
  valueLabel,
  lineIndex,
}) => {
  let i = startIndex;
  while (i > 0) {
    addBaseStep(steps, heap, {
      phase: 'while-check',
      currentLine: lineIndex ?? (currentLineBase + 2),
      explanation: `i = ${i} > 0, compare with parent.`,
      highlightedNodes: highlightNodes([i], 'current'),
      activeNode: nodeId(i),
      highlights: highlightArray([i], 'current'),
      currentIndex: i,
      parentIndex: null,
    });

    const parent = getParentIndex(i);

    addBaseStep(steps, heap, {
      phase: 'parent',
      currentLine: lineIndex ?? (currentLineBase + 3),
      explanation: `Parent index = ${parent}. Compare heap[${parent}] = ${heap[parent]} with heap[${i}] = ${heap[i]}.`,
      highlightedNodes: highlightNodes([parent, i], 'comparing'),
      activeNode: nodeId(i),
      highlights: highlightArray([parent, i], 'compare'),
      currentIndex: i,
      parentIndex: parent,
    });

    if (isInOrder(heap[parent], heap[i], heapType)) {
      addBaseStep(steps, heap, {
        phase: 'in-order',
        currentLine: lineIndex ?? (currentLineBase + 4),
        explanation: `Heap property holds: ${heap[parent]} ${getInfo(heapType).orderSymbol} ${heap[i]}. Stop.`,
        highlightedNodes: highlightNodes([parent, i], 'visited'),
        activeNode: nodeId(i),
        highlights: highlightArray([parent, i], 'settled'),
        currentIndex: i,
        parentIndex: parent,
      });
      break;
    }

    addBaseStep(steps, heap, {
      phase: 'swap',
      currentLine: lineIndex ?? (currentLineBase + 5),
      explanation: `Swap ${heap[parent]} and ${heap[i]} to restore heap property.`,
      highlightedNodes: highlightNodes([parent, i], 'swapping'),
      activeNode: nodeId(i),
      highlights: highlightArray([parent, i], 'swap'),
      currentIndex: i,
      parentIndex: parent,
    });

    [heap[parent], heap[i]] = [heap[i], heap[parent]];

    addBaseStep(steps, heap, {
      phase: 'after-swap',
      currentLine: lineIndex ?? (currentLineBase + 5),
      explanation: `After swap, ${valueLabel} moves to index ${parent}.`,
      highlightedNodes: [
        { id: nodeId(parent), type: 'current' },
        { id: nodeId(i), type: 'visited' },
      ],
      activeNode: nodeId(parent),
      highlights: [
        { index: parent, type: 'current' },
        { index: i, type: 'settled' },
      ],
      currentIndex: parent,
      parentIndex: getParentIndex(parent),
    });

    i = parent;

    addBaseStep(steps, heap, {
      phase: 'move-up',
      currentLine: lineIndex ?? (currentLineBase + 6),
      explanation: `Set i = ${i} and continue bubbling up.`,
      highlightedNodes: highlightNodes([i], 'current'),
      activeNode: nodeId(i),
      highlights: highlightArray([i], 'current'),
      currentIndex: i,
      parentIndex: getParentIndex(i),
    });
  }

  return i;
};

const siftDown = ({
  heap,
  startIndex,
  heapType,
  steps,
  currentLineBase,
  valueLabel,
  lineIndex,
}) => {
  let i = startIndex;
  while (true) {
    addBaseStep(steps, heap, {
      phase: 'while-check',
      currentLine: lineIndex ?? (currentLineBase + 1),
      explanation: `Check children of index ${i}.`,
      highlightedNodes: highlightNodes([i], 'current'),
      activeNode: nodeId(i),
      highlights: highlightArray([i], 'current'),
      currentIndex: i,
      parentIndex: null,
    });

    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let best = i;

    addBaseStep(steps, heap, {
      phase: 'children',
      currentLine: lineIndex ?? (currentLineBase + 2),
      explanation: `Left = ${left < heap.length ? left : 'out'}, Right = ${right < heap.length ? right : 'out'}.`,
      highlightedNodes: highlightNodes(
        [i, left, right].filter((idx) => idx < heap.length),
        'comparing'
      ),
      activeNode: nodeId(i),
      highlights: highlightArray(
        [i, left, right].filter((idx) => idx < heap.length),
        'compare'
      ),
      currentIndex: i,
      parentIndex: null,
    });

    if (left < heap.length && isHigherPriority(heap[left], heap[best], heapType)) {
      best = left;
      addBaseStep(steps, heap, {
        phase: 'left-better',
        currentLine: lineIndex ?? (currentLineBase + 4),
        explanation: `heap[${left}] = ${heap[left]} is ${getInfo(heapType).compareWord}.`,
        highlightedNodes: highlightNodes([i, left], 'comparing'),
        activeNode: nodeId(left),
        highlights: highlightArray([i, left], 'compare'),
        currentIndex: i,
        parentIndex: null,
      });
    }

    if (right < heap.length && isHigherPriority(heap[right], heap[best], heapType)) {
      best = right;
      addBaseStep(steps, heap, {
        phase: 'right-better',
        currentLine: lineIndex ?? (currentLineBase + 6),
        explanation: `heap[${right}] = ${heap[right]} is now ${getInfo(heapType).compareWord}.`,
        highlightedNodes: highlightNodes([i, right], 'comparing'),
        activeNode: nodeId(right),
        highlights: highlightArray([i, right], 'compare'),
        currentIndex: i,
        parentIndex: null,
      });
    }

    if (best === i) {
      addBaseStep(steps, heap, {
        phase: 'heap-ok',
        currentLine: lineIndex ?? (currentLineBase + 8),
        explanation: 'Heap property restored. Stop heapify-down.',
        highlightedNodes: highlightNodes([i], 'visited'),
        activeNode: nodeId(i),
        highlights: highlightArray([i], 'settled'),
        currentIndex: i,
        parentIndex: null,
      });
      break;
    }

    addBaseStep(steps, heap, {
      phase: 'swap',
      currentLine: lineIndex ?? (currentLineBase + 9),
      explanation: `Swap heap[${i}] = ${heap[i]} with heap[${best}] = ${heap[best]}.`,
      highlightedNodes: highlightNodes([i, best], 'swapping'),
      activeNode: nodeId(i),
      highlights: highlightArray([i, best], 'swap'),
      currentIndex: i,
      parentIndex: null,
    });

    [heap[i], heap[best]] = [heap[best], heap[i]];

    addBaseStep(steps, heap, {
      phase: 'after-swap',
      currentLine: lineIndex ?? (currentLineBase + 9),
      explanation: `After swap, ${valueLabel} continues at index ${best}.`,
      highlightedNodes: [
        { id: nodeId(best), type: 'current' },
        { id: nodeId(i), type: 'visited' },
      ],
      activeNode: nodeId(best),
      highlights: [
        { index: best, type: 'current' },
        { index: i, type: 'settled' },
      ],
      currentIndex: best,
      parentIndex: null,
    });

    i = best;

    addBaseStep(steps, heap, {
      phase: 'move-down',
      currentLine: lineIndex ?? (currentLineBase + 10),
      explanation: `Set i = ${i} and continue.`,
      highlightedNodes: highlightNodes([i], 'current'),
      activeNode: nodeId(i),
      highlights: highlightArray([i], 'current'),
      currentIndex: i,
      parentIndex: null,
    });
  }

  return i;
};

const generateInsertSteps = (inputHeap, rawValue, heapType) => {
  const steps = [];
  const heap = [...inputHeap];
  const value = Number.isFinite(rawValue) ? rawValue : 0;

  addBaseStep(steps, heap, {
    phase: 'start',
    currentLine: 0,
    explanation: `Starting insert(${value}) into the ${heapType} heap.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
  });

  heap.push(value);
  let i = heap.length - 1;

  addBaseStep(steps, heap, {
    phase: 'push',
    currentLine: 1,
    explanation: `Append ${value} at the end (index ${i}).`,
    highlightedNodes: highlightNodes([i], 'inserted'),
    activeNode: nodeId(i),
    highlights: highlightArray([i], 'new'),
    currentIndex: i,
    parentIndex: null,
  });

  addBaseStep(steps, heap, {
    phase: 'set-index',
    currentLine: 2,
    explanation: `Set i = ${i} to bubble up as needed.`,
    highlightedNodes: highlightNodes([i], 'current'),
    activeNode: nodeId(i),
    highlights: highlightArray([i], 'current'),
    currentIndex: i,
    parentIndex: null,
  });

  i = bubbleUp({
    heap,
    startIndex: i,
    heapType,
    steps,
    currentLineBase: 1,
    valueLabel: value,
  });

  addBaseStep(steps, heap, {
    phase: 'done',
    currentLine: 0,
    explanation: `Insert complete. ${value} settled at index ${i}.`,
    highlightedNodes: highlightNodes([i], 'inserted'),
    activeNode: null,
    highlights: highlightArray([i], 'new'),
    currentIndex: i,
    parentIndex: getParentIndex(i),
    done: true,
  });

  return steps;
};

const generateExtractSteps = (inputHeap, heapType) => {
  const steps = [];
  const heap = [...inputHeap];
  const info = getInfo(heapType);

  addBaseStep(steps, heap, {
    phase: 'start',
    currentLine: 0,
    explanation: `Starting extract${info.rootLabel} from the heap.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    extracted: null,
    currentIndex: null,
    parentIndex: null,
  });

  if (heap.length === 0) {
    addBaseStep(steps, heap, {
      phase: 'empty',
      currentLine: 1,
      explanation: 'Heap is empty — nothing to extract.',
      highlightedNodes: [],
      activeNode: null,
      highlights: [],
      extracted: null,
      currentIndex: null,
      parentIndex: null,
      done: true,
    });
    return steps;
  }

  const rootValue = heap[0];

  addBaseStep(steps, heap, {
    phase: 'take-root',
    currentLine: 2,
    explanation: `${info.label} value is ${rootValue} at the root.`,
    highlightedNodes: highlightNodes([0], 'current'),
    activeNode: nodeId(0),
    highlights: highlightArray([0], 'root'),
    extracted: rootValue,
    currentIndex: 0,
    parentIndex: null,
  });

  const last = heap.pop();

  addBaseStep(steps, heap, {
    phase: 'pop-last',
    currentLine: 3,
    explanation: `Remove last element (${last}).`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    extracted: rootValue,
    currentIndex: null,
    parentIndex: null,
  });

  if (heap.length === 0) {
    addBaseStep(steps, heap, {
      phase: 'done',
      currentLine: 16,
      explanation: `Heap is now empty. Extracted ${rootValue}.`,
      highlightedNodes: [],
      activeNode: null,
      highlights: [],
      extracted: rootValue,
      currentIndex: null,
      parentIndex: null,
      done: true,
    });
    return steps;
  }

  heap[0] = last;

  addBaseStep(steps, heap, {
    phase: 'move-last',
    currentLine: 4,
    explanation: `Move ${last} to the root to restore heap shape.`,
    highlightedNodes: highlightNodes([0], 'inserting'),
    activeNode: nodeId(0),
    highlights: highlightArray([0], 'current'),
    extracted: rootValue,
    currentIndex: 0,
    parentIndex: null,
  });

  addBaseStep(steps, heap, {
    phase: 'set-index',
    currentLine: 5,
    explanation: 'Start heapify-down from index 0.',
    highlightedNodes: highlightNodes([0], 'current'),
    activeNode: nodeId(0),
    highlights: highlightArray([0], 'current'),
    extracted: rootValue,
    currentIndex: 0,
    parentIndex: null,
  });

  siftDown({
    heap,
    startIndex: 0,
    heapType,
    steps,
    currentLineBase: 5,
    valueLabel: rootValue,
  });

  addBaseStep(steps, heap, {
    phase: 'done',
    currentLine: 16,
    explanation: `Extract complete. Removed ${rootValue}.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    extracted: rootValue,
    currentIndex: null,
    parentIndex: null,
    done: true,
  });

  return steps;
};

const generateHeapifySteps = (values, heapType) => {
  const steps = [];
  const heap = values.filter((value) => Number.isFinite(value));

  addBaseStep(steps, heap, {
    phase: 'start',
    currentLine: 0,
    explanation: `Starting build-heap on ${heap.length} values.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
  });

  const startIndex = Math.floor((heap.length - 2) / 2);
  for (let i = startIndex; i >= 0; i -= 1) {
    addBaseStep(steps, heap, {
      phase: 'heapify-index',
      currentLine: 2,
      explanation: `Sift down from index ${i}.`,
      highlightedNodes: highlightNodes([i], 'current'),
      activeNode: nodeId(i),
      highlights: highlightArray([i], 'current'),
      currentIndex: i,
      parentIndex: null,
    });

    siftDown({
      heap,
      startIndex: i,
      heapType,
      steps,
      currentLineBase: 2,
      valueLabel: heap[i],
      lineIndex: 3,
    });
  }

  addBaseStep(steps, heap, {
    phase: 'done',
    currentLine: 0,
    explanation: `Heapify complete. ${heap.length} values arranged as a ${heapType} heap.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
    done: true,
  });

  return steps;
};

const generateDeleteSteps = (inputHeap, index, heapType) => {
  const steps = [];
  const heap = [...inputHeap];

  addBaseStep(steps, heap, {
    phase: 'start',
    currentLine: 0,
    explanation: `Starting delete at index ${index}.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
  });

  if (!Number.isInteger(index) || index < 0 || index >= heap.length) {
    addBaseStep(steps, heap, {
      phase: 'invalid',
      currentLine: 1,
      explanation: 'Index out of range — nothing to delete.',
      highlightedNodes: [],
      activeNode: null,
      highlights: [],
      currentIndex: null,
      parentIndex: null,
      error: true,
      done: true,
    });
    return steps;
  }

  const lastIndex = heap.length - 1;
  addBaseStep(steps, heap, {
    phase: 'swap-last',
    currentLine: 2,
    explanation: `Swap index ${index} with last index ${lastIndex}.`,
    highlightedNodes: highlightNodes([index, lastIndex], 'swapping'),
    activeNode: nodeId(index),
    highlights: highlightArray([index, lastIndex], 'swap'),
    currentIndex: index,
    parentIndex: getParentIndex(index),
  });

  [heap[index], heap[lastIndex]] = [heap[lastIndex], heap[index]];

  addBaseStep(steps, heap, {
    phase: 'pop-last',
    currentLine: 3,
    explanation: `Remove last element (${heap[lastIndex]}).`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: index,
    parentIndex: getParentIndex(index),
  });

  heap.pop();

  if (index >= heap.length) {
    addBaseStep(steps, heap, {
      phase: 'done',
      currentLine: 0,
      explanation: 'Delete complete.',
      highlightedNodes: [],
      activeNode: null,
      highlights: [],
      currentIndex: null,
      parentIndex: null,
      done: true,
    });
    return steps;
  }

  const parent = getParentIndex(index);
  if (parent !== null && isHigherPriority(heap[index], heap[parent], heapType)) {
    addBaseStep(steps, heap, {
      phase: 'bubble-up',
      currentLine: 4,
      explanation: 'Value has higher priority than parent. Bubble up.',
      highlightedNodes: highlightNodes([index, parent], 'comparing'),
      activeNode: nodeId(index),
      highlights: highlightArray([index, parent], 'compare'),
      currentIndex: index,
      parentIndex: parent,
    });

    bubbleUp({
      heap,
      startIndex: index,
      heapType,
      steps,
      currentLineBase: 1,
      valueLabel: heap[index],
      lineIndex: 5,
    });
  } else {
    addBaseStep(steps, heap, {
      phase: 'sift-down',
      currentLine: 5,
      explanation: 'Value may violate heap property below. Sift down.',
      highlightedNodes: highlightNodes([index], 'current'),
      activeNode: nodeId(index),
      highlights: highlightArray([index], 'current'),
      currentIndex: index,
      parentIndex: parent,
    });

    siftDown({
      heap,
      startIndex: index,
      heapType,
      steps,
      currentLineBase: 5,
      valueLabel: heap[index],
      lineIndex: 7,
    });
  }

  addBaseStep(steps, heap, {
    phase: 'done',
    currentLine: 0,
    explanation: `Delete complete at index ${index}.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
    done: true,
  });

  return steps;
};

const generateChangeKeySteps = (inputHeap, index, newValue, heapType) => {
  const steps = [];
  const heap = [...inputHeap];
  const nextValue = Number.isFinite(newValue) ? newValue : 0;

  addBaseStep(steps, heap, {
    phase: 'start',
    currentLine: 0,
    explanation: `Starting change-key at index ${index}.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
  });

  if (!Number.isInteger(index) || index < 0 || index >= heap.length) {
    addBaseStep(steps, heap, {
      phase: 'invalid',
      currentLine: 1,
      explanation: 'Index out of range — no update.',
      highlightedNodes: [],
      activeNode: null,
      highlights: [],
      currentIndex: null,
      parentIndex: null,
      error: true,
      done: true,
    });
    return steps;
  }

  const oldValue = heap[index];
  heap[index] = nextValue;

  addBaseStep(steps, heap, {
    phase: 'update',
    currentLine: 2,
    explanation: `Update heap[${index}] from ${oldValue} to ${nextValue}.`,
    highlightedNodes: highlightNodes([index], 'current'),
    activeNode: nodeId(index),
    highlights: highlightArray([index], 'current'),
    currentIndex: index,
    parentIndex: getParentIndex(index),
  });

  const parent = getParentIndex(index);
  if (parent !== null && isHigherPriority(heap[index], heap[parent], heapType)) {
    addBaseStep(steps, heap, {
      phase: 'bubble-up',
      currentLine: 3,
      explanation: 'Updated value has higher priority than parent. Bubble up.',
      highlightedNodes: highlightNodes([index, parent], 'comparing'),
      activeNode: nodeId(index),
      highlights: highlightArray([index, parent], 'compare'),
      currentIndex: index,
      parentIndex: parent,
    });

    bubbleUp({
      heap,
      startIndex: index,
      heapType,
      steps,
      currentLineBase: 1,
      valueLabel: heap[index],
      lineIndex: 4,
    });
  } else {
    addBaseStep(steps, heap, {
      phase: 'sift-down',
      currentLine: 4,
      explanation: 'Updated value may violate heap property below. Sift down.',
      highlightedNodes: highlightNodes([index], 'current'),
      activeNode: nodeId(index),
      highlights: highlightArray([index], 'current'),
      currentIndex: index,
      parentIndex: parent,
    });

    siftDown({
      heap,
      startIndex: index,
      heapType,
      steps,
      currentLineBase: 5,
      valueLabel: heap[index],
      lineIndex: 6,
    });
  }

  addBaseStep(steps, heap, {
    phase: 'done',
    currentLine: 0,
    explanation: `Key update complete at index ${index}.`,
    highlightedNodes: [],
    activeNode: null,
    highlights: [],
    currentIndex: null,
    parentIndex: null,
    done: true,
  });

  return steps;
};

export const initialState = ({
  heap,
  operation,
  value,
  heapType,
  index,
  newValue,
  inputValues,
}) => {
  const safeHeap = Array.isArray(heap) ? heap : [];
  const type = heapType === 'max' ? 'max' : 'min';
  const op = operation || 'insert';

  let steps = [];
  if (op === 'extract-root') {
    steps = generateExtractSteps(safeHeap, type);
  } else if (op === 'delete-index') {
    steps = generateDeleteSteps(safeHeap, index, type);
  } else if (op === 'change-key') {
    steps = generateChangeKeySteps(safeHeap, index, newValue, type);
  } else if (op === 'heapify') {
    const values = Array.isArray(inputValues) ? inputValues : safeHeap;
    steps = generateHeapifySteps(values, type);
  } else {
    steps = generateInsertSteps(safeHeap, value, type);
  }

  const initialHeap = steps[0]?.heap ? [...steps[0].heap] : [...safeHeap];

  return {
    heap: initialHeap,
    operation: op,
    heapType: type,
    value,
    index,
    newValue,
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

  const info = getInfo(state.heapType);

  if (state.operation === 'extract-root') {
    if (state.extracted === null || state.extracted === undefined) {
      return {
        success: false,
        title: 'Heap empty',
        message: 'No value extracted because the heap is empty.',
        details: 'Add values or build a heap first.',
      };
    }
    return {
      success: true,
      title: `✓ Extracted ${info.rootLabel}`,
      message: `Extracted ${info.rootLabel} value ${state.extracted}.`,
      details: `Heap now has ${state.heap?.length || 0} elements.`,
    };
  }

  if (state.operation === 'delete-index') {
    if (state.error) {
      return {
        success: false,
        title: 'Invalid index',
        message: 'Delete failed due to an out-of-range index.',
        details: 'Pick a valid index within the heap.',
      };
    }
    return {
      success: true,
      title: '✓ Deleted',
      message: `Delete operation complete at index ${state.index}.`,
      details: `Heap now has ${state.heap?.length || 0} elements.`,
    };
  }

  if (state.operation === 'change-key') {
    if (state.error) {
      return {
        success: false,
        title: 'Invalid index',
        message: 'Key update failed due to an out-of-range index.',
        details: 'Pick a valid index within the heap.',
      };
    }
    return {
      success: true,
      title: '✓ Updated',
      message: `Key updated at index ${state.index}.`,
      details: `Heap now has ${state.heap?.length || 0} elements.`,
    };
  }

  if (state.operation === 'heapify') {
    return {
      success: true,
      title: '✓ Heapified',
      message: `Built a ${state.heapType} heap from input values.`,
      details: `Heap size: ${state.heap?.length || 0} elements.`,
    };
  }

  return {
    success: true,
    title: '✓ Inserted',
    message: `Inserted value ${state.value}.`,
    details: `Heap now has ${state.heap?.length || 0} elements.`,
  };
};
