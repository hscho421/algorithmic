// Coin Change - Minimum Coins Problem
// Given coins and amount, find minimum number of coins needed

export const TEMPLATES = {
  min_coins: {
    id: 'min_coins',
    name: 'Minimum Coins',
    description: 'Find minimum coins to make target amount',
    code: [
      { line: 'function coinChange(coins, amount):', indent: 0 },
      { line: 'dp = [∞, ∞, ..., ∞]  // size amount+1', indent: 1 },
      { line: 'dp[0] = 0', indent: 1 },
      { line: '', indent: 0 },
      { line: 'for i = 1 to amount:', indent: 1 },
      { line: 'for coin in coins:', indent: 2 },
      { line: 'if i >= coin:', indent: 3 },
      { line: 'dp[i] = min(dp[i], dp[i-coin] + 1)', indent: 4 },
      { line: '', indent: 0 },
      { line: 'return dp[amount] if valid else -1', indent: 1 },
    ],
  },
  count_ways: {
    id: 'count_ways',
    name: 'Count Ways',
    description: 'Count all possible ways to make target amount',
    code: [
      { line: 'function countWays(coins, amount):', indent: 0 },
      { line: 'dp = [0, 0, ..., 0]  // size amount+1', indent: 1 },
      { line: 'dp[0] = 1', indent: 1 },
      { line: '', indent: 0 },
      { line: 'for coin in coins:', indent: 1 },
      { line: 'for i = coin to amount:', indent: 2 },
      { line: 'dp[i] += dp[i - coin]', indent: 3 },
      { line: '', indent: 0 },
      { line: 'return dp[amount]', indent: 1 },
    ],
  },
};

export const complexity = {
  time: 'O(amount × coins)',
  space: 'O(amount)',
  description: 'Build table of size amount, checking each coin',
};

export function initialState({ coins = [1, 2, 5], amount = 11, mode = 'min_coins' } = {}) {
  const template = TEMPLATES[mode];
  const dp = mode === 'min_coins'
    ? Array(amount + 1).fill(Infinity)
    : Array(amount + 1).fill(0);

  dp[0] = mode === 'min_coins' ? 0 : 1;

  return {
    coins: [...coins].sort((a, b) => a - b),
    amount,
    mode,
    template,
    dp,
    i: 1,
    coinIndex: 0,
    stepIndex: 0,
    done: false,
    currentLine: 2,
    result: null,
    explanation: `Initializing: dp[0] = ${dp[0]}`,
    highlightCell: null,
    comparing: [],
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { coins, amount, dp, i, coinIndex, mode } = state;

  if (i > amount) {
    const result = mode === 'min_coins'
      ? (dp[amount] === Infinity ? -1 : dp[amount])
      : dp[amount];

    return {
      ...state,
      done: true,
      result,
      currentLine: mode === 'min_coins' ? 13 : 11,
      explanation: mode === 'min_coins'
        ? result === -1
          ? `Impossible to make amount ${amount}`
          : `Minimum coins needed: ${result}`
        : `Total ways to make ${amount}: ${result}`,
      highlightCell: amount,
    };
  }

  const coin = coins[coinIndex];

  if (mode === 'min_coins') {
    return executeMinCoinsStep(state);
  }
  return executeCountWaysStep(state);
}

function executeMinCoinsStep(state) {
  const { coins, amount, dp, i, coinIndex } = state;
  const coin = coins[coinIndex];

  // Check if we can use this coin
  if (i >= coin) {
    const currentValue = dp[i];
    const newValue = dp[i - coin] + 1;
    const willUpdate = newValue < currentValue;

    if (willUpdate) {
      const newDp = [...dp];
      newDp[i] = newValue;

      // Check if we have more coins to try for this amount
      if (coinIndex + 1 < coins.length) {
        return {
          ...state,
          dp: newDp,
          coinIndex: coinIndex + 1,
          stepIndex: state.stepIndex + 1,
          currentLine: 8,
          explanation: `dp[${i}] updated to ${newValue} using coin ${coin}`,
          highlightCell: i,
          comparing: [i, i - coin],
        };
      }

      // Move to next amount
      return {
        ...state,
        dp: newDp,
        i: i + 1,
        coinIndex: 0,
        stepIndex: state.stepIndex + 1,
        currentLine: 8,
        explanation: `dp[${i}] = ${newValue} (used coin ${coin})`,
        highlightCell: i,
        comparing: [],
      };
    }

    // No update needed, try next coin
    if (coinIndex + 1 < coins.length) {
      return {
        ...state,
        coinIndex: coinIndex + 1,
        stepIndex: state.stepIndex + 1,
        currentLine: 8,
        explanation: `dp[${i}] stays ${currentValue} (coin ${coin} doesn't improve)`,
        highlightCell: i,
        comparing: [i, i - coin],
      };
    }

    // Move to next amount
    return {
      ...state,
      i: i + 1,
      coinIndex: 0,
      stepIndex: state.stepIndex + 1,
      currentLine: 6,
      explanation: `Checked all coins for amount ${i}, moving to ${i + 1}`,
      highlightCell: null,
      comparing: [],
    };
  }

  // Can't use this coin, try next
  if (coinIndex + 1 < coins.length) {
    return {
      ...state,
      coinIndex: coinIndex + 1,
      stepIndex: state.stepIndex + 1,
      currentLine: 7,
      explanation: `Coin ${coin} too large for amount ${i}, skipping`,
      highlightCell: i,
      comparing: [],
    };
  }

  // Move to next amount
  return {
    ...state,
    i: i + 1,
    coinIndex: 0,
    stepIndex: state.stepIndex + 1,
    currentLine: 6,
    explanation: `Moving to amount ${i + 1}`,
    highlightCell: null,
    comparing: [],
  };
}

function executeCountWaysStep(state) {
  const { coins, amount, dp, i, coinIndex } = state;

  // In count_ways, we iterate coins in outer loop
  // For simplicity, we'll still step through one update at a time

  if (coinIndex >= coins.length) {
    return {
      ...state,
      done: true,
      result: dp[amount],
      currentLine: 11,
      explanation: `Total ways to make ${amount}: ${dp[amount]}`,
      highlightCell: amount,
    };
  }

  const coin = coins[coinIndex];

  if (i >= coin && i <= amount) {
    const newDp = [...dp];
    newDp[i] += dp[i - coin];

    const nextI = i + 1 <= amount ? i + 1 : amount + 1;
    const nextCoin = nextI > amount ? coinIndex + 1 : coinIndex;
    const nextAmount = nextI > amount ? coin : nextI;

    return {
      ...state,
      dp: newDp,
      i: nextAmount,
      coinIndex: nextCoin,
      stepIndex: state.stepIndex + 1,
      currentLine: 6,
      explanation: `dp[${i}] += dp[${i - coin}] = ${newDp[i]} (using coin ${coin})`,
      highlightCell: i,
      comparing: [i, i - coin],
    };
  }

  // Move to next position
  const nextI = i + 1;
  if (nextI > amount) {
    // Move to next coin
    return {
      ...state,
      i: coins[coinIndex + 1] || amount + 1,
      coinIndex: coinIndex + 1,
      stepIndex: state.stepIndex + 1,
      currentLine: 5,
      explanation: `Finished coin ${coin}, moving to next coin`,
      highlightCell: null,
      comparing: [],
    };
  }

  return {
    ...state,
    i: nextI,
    stepIndex: state.stepIndex + 1,
    explanation: `Moving to amount ${nextI} with coin ${coin}`,
  };
}

export function getExplanation(state) {
  return state.explanation;
}

export function getResult(state) {
  if (!state.done) return null;

  const { mode, result, amount } = state;

  if (mode === 'min_coins') {
    if (result === -1) {
      return {
        success: false,
        title: 'Impossible',
        message: `Cannot make amount ${amount} with given coins`,
        details: ['Try different coin denominations'],
      };
    }

    return {
      success: true,
      title: 'Solution Found',
      message: `Minimum coins needed: ${result}`,
      details: [
        `Target amount: ${amount}`,
        `Steps taken: ${state.stepIndex}`,
      ],
    };
  }

  // count_ways mode
  return {
    success: true,
    title: 'All Ways Counted',
    message: `${result} way${result === 1 ? '' : 's'} to make ${amount}`,
    details: [
      `Coins used: [${state.coins.join(', ')}]`,
      `Steps taken: ${state.stepIndex}`,
    ],
  };
}
