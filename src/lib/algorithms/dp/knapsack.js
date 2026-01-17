// 0/1 Knapsack Problem
// Given items with weights and values, maximize value within weight capacity

export const TEMPLATES = {
  knapsack: {
    id: 'knapsack',
    name: '0/1 Knapsack',
    description: 'Maximize value within weight capacity',
    code: [
      { line: 'def knapsack(weights, values, capacity):', indent: 0 },
      { line: 'n = len(weights)', indent: 1 },
      { line: 'dp = [[0] * (capacity + 1) for _ in range(n + 1)]', indent: 1 },
      { line: '', indent: 0 },
      { line: 'for i in range(1, n + 1):', indent: 1 },
      { line: 'for w in range(capacity + 1):', indent: 2 },
      { line: '# Option 1: Don\'t take item', indent: 3 },
      { line: 'dp[i][w] = dp[i-1][w]', indent: 3 },
      { line: '', indent: 0 },
      { line: '# Option 2: Take item if it fits', indent: 3 },
      { line: 'if weights[i-1] <= w:', indent: 3 },
      { line: 'with_item = dp[i - 1][w - weights[i - 1]] + values[i - 1]', indent: 4 },
      { line: 'dp[i][w] = max(dp[i][w], with_item)', indent: 4 },
      { line: '', indent: 0 },
      { line: 'return dp[n][capacity]', indent: 1 },
    ],
  },
};

export const complexity = {
  time: 'O(n × capacity)',
  space: 'O(n × capacity)',
  description: 'Build 2D table for all items and weights',
};

export function initialState({ weights = [2, 3, 4, 5], values = [3, 4, 5, 6], capacity = 8 } = {}) {
  const n = weights.length;

  // Create items array for display
  const items = weights.map((w, idx) => ({
    id: idx,
    weight: w,
    value: values[idx],
    name: `Item ${idx + 1}`,
  }));

  // Create dp table
  const dp = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  return {
    weights,
    values,
    items,
    capacity,
    n,
    dp,
    i: 1,
    w: 0,
    stepIndex: 0,
    done: false,
    currentLine: 6,
    result: null,
    explanation: 'Initialized table with base case (0 items = 0 value)',
    highlightCell: null,
    comparing: [],
    decision: null,
    selectedItems: null,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { weights, values, capacity, n, dp, i, w } = state;

  if (i > n) {
    // Backtrack to find which items were selected
    const selectedItems = backtrackItems(weights, values, capacity, dp);

    return {
      ...state,
      done: true,
      result: dp[n][capacity],
      selectedItems,
      currentLine: 19,
      explanation: `Maximum value: ${dp[n][capacity]}`,
      highlightCell: [n, capacity],
    };
  }

  const itemWeight = weights[i - 1];
  const itemValue = values[i - 1];
  const newDp = dp.map((row) => [...row]);

  // First, set to value without taking item
  const withoutItem = dp[i - 1][w];
  newDp[i][w] = withoutItem;

  let decision = 'skip';
  let explanation = `Item ${i}: weight=${itemWeight}, value=${itemValue}. `;

  // Check if we can take the item
  if (itemWeight <= w) {
    const remainingCapacity = w - itemWeight;
    const withItem = dp[i - 1][remainingCapacity] + itemValue;

    if (withItem > withoutItem) {
      newDp[i][w] = withItem;
      decision = 'take';
      explanation += `Take it! ${withItem} > ${withoutItem}`;
    } else {
      decision = 'skip_better';
      explanation += `Skip it. ${withoutItem} ≥ ${withItem}`;
    }
  } else {
    explanation += `Too heavy (${itemWeight} > ${w})`;
  }

  const nextW = w + 1;
  const nextI = nextW > capacity ? i + 1 : i;
  const finalW = nextW > capacity ? 0 : nextW;

  return {
    ...state,
    dp: newDp,
    i: nextI,
    w: finalW,
    stepIndex: state.stepIndex + 1,
    currentLine: itemWeight <= w ? 13 : 9,
    explanation,
    highlightCell: [i, w],
    comparing: itemWeight <= w ? [[i - 1, w], [i - 1, w - itemWeight]] : [[i - 1, w]],
    decision,
  };
}

function backtrackItems(weights, values, capacity, dp) {
  const n = weights.length;
  const selected = [];
  let i = n;
  let w = capacity;

  while (i > 0 && w > 0) {
    // Check if current item was included
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push({
        index: i - 1,
        weight: weights[i - 1],
        value: values[i - 1],
      });
      w -= weights[i - 1];
    }
    i--;
  }

  return selected.reverse();
}

export function getExplanation(state) {
  return state.explanation;
}

export function getResult(state) {
  if (!state.done) return null;

  const totalWeight = state.selectedItems.reduce((sum, item) => sum + item.weight, 0);
  const itemsList = state.selectedItems.map((item) => `Item ${item.index + 1}`).join(', ');

  return {
    success: true,
    title: 'Optimal Solution Found',
    message: `Maximum value: ${state.result}`,
    details: [
      `Capacity: ${state.capacity}`,
      `Items selected: ${state.selectedItems.length > 0 ? itemsList : 'None'}`,
      `Total weight: ${totalWeight}`,
      `Steps taken: ${state.stepIndex}`,
    ],
  };
}
