// Dynamic Programming Visualizers
export { default as FibonacciVisualizer } from './FibonacciVisualizer';
export { default as CoinChangeVisualizer } from './CoinChangeVisualizer';
export { default as LCSVisualizer } from './LCSVisualizer';
export { default as KnapsackVisualizer } from './KnapsackVisualizer';

export const metadata = {
  id: 'dynamic-programming',
  name: 'Dynamic Programming',
  description: 'Master memoization and tabulation techniques for optimal substructure problems',
  algorithms: [
    {
      id: 'fibonacci',
      name: 'Fibonacci Sequence',
      description: 'Classic DP intro with memoization vs tabulation',
      component: 'FibonacciVisualizer',
      difficulty: 'Easy',
      tags: ['Recursion', 'Memoization'],
    },
    {
      id: 'coin-change',
      name: 'Coin Change',
      description: 'Minimum coins or count ways to make amount',
      component: 'CoinChangeVisualizer',
      difficulty: 'Medium',
      tags: ['Combinatorics', 'Tabulation'],
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      description: 'Find longest subsequence common to two strings',
      component: 'LCSVisualizer',
      difficulty: 'Hard',
      tags: ['Tabulation', 'Strings'],
    },
    {
      id: 'knapsack',
      name: '0/1 Knapsack',
      description: 'Maximize value within weight capacity',
      component: 'KnapsackVisualizer',
      difficulty: 'Hard',
      tags: ['Optimization', 'Combinatorics'],
    },
  ],
};
