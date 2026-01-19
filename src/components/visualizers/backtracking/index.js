export { default as NQueensVisualizer } from './NQueensVisualizer';
export { default as SudokuVisualizer } from './SudokuVisualizer';
export { default as PermutationsVisualizer } from './PermutationsVisualizer';

export const metadata = {
  id: 'backtracking',
  name: 'Backtracking',
  description: 'Algorithms that explore all possibilities through recursive trial and error',
  algorithms: [
    {
      id: 'n-queens',
      name: 'N-Queens',
      description: 'Place N queens on an N×N chessboard',
      component: 'NQueensVisualizer',
      difficulty: 'Medium',
      tags: ['Recursion', 'Constraint Satisfaction'],
    },
    {
      id: 'sudoku',
      name: 'Sudoku Solver',
      description: 'Solve a Sudoku puzzle with backtracking',
      component: 'SudokuVisualizer',
      difficulty: 'Hard',
      tags: ['Backtracking', 'Constraint Satisfaction'],
    },
    {
      id: 'permutations',
      name: 'Permutations',
      description: 'Generate all permutations using backtracking',
      component: 'PermutationsVisualizer',
      difficulty: 'Medium',
      tags: ['Recursion', 'Combinatorics'],
    },
  ],
};
