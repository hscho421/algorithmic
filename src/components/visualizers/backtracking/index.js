export { default as NQueensVisualizer } from './NQueensVisualizer';

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
  ],
};
