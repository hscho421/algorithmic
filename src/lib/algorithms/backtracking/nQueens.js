export const template = {
  name: 'N-Queens',
  description: 'Place N queens on an N×N board with no conflicts',
  timeComplexity: 'O(N!)',
  spaceComplexity: 'O(N²)',
  code: [
    { line: 'def solve_n_queens(n):', indent: 0 },
    { line: 'board = [[0] * n for _ in range(n)]', indent: 1 },
    { line: 'solve(board, 0, n)', indent: 1 },
    { line: '', indent: 0 },
    { line: 'def solve(board, row, n):', indent: 0 },
    { line: 'if row == n:', indent: 1 },
    { line: 'return True  # All queens placed!', indent: 2 },
    { line: 'for col in range(n):', indent: 1 },
    { line: 'if is_safe(board, row, col, n):', indent: 2 },
    { line: 'board[row][col] = 1', indent: 3 },
    { line: 'if solve(board, row + 1, n):', indent: 3 },
    { line: 'return True', indent: 4 },
    { line: 'board[row][col] = 0  # Backtrack', indent: 3 },
    { line: 'return False', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(N!)',
  space: 'O(N²)',
  bestCase: 'O(N)',
  averageCase: 'O(N!)',
  worstCase: 'O(N!)',
};

const isSafe = (board, row, col, n) => {
  // Check column
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 1) return false;
  }

  // Check upper-left diagonal
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return false;
  }

  // Check upper-right diagonal
  for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 1) return false;
  }

  return true;
};

const generateSteps = (n) => {
  const steps = [];
  const board = Array.from({ length: n }, () => Array(n).fill(0));

  const addStep = (state) => {
    steps.push({
      board: board.map(row => [...row]),
      n,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: `Solve ${n}-Queens: Place ${n} queens on a ${n}×${n} board so no two attack each other.`,
    currentRow: null,
    currentCol: null,
    checking: [],
    queens: [],
  });

  const getQueens = () => {
    const queens = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === 1) queens.push({ row: i, col: j });
      }
    }
    return queens;
  };

  const getAttackCells = (row, col) => {
    const cells = [];
    // Column
    for (let i = 0; i < row; i++) {
      cells.push({ row: i, col });
    }
    // Upper-left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      cells.push({ row: i, col: j });
    }
    // Upper-right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      cells.push({ row: i, col: j });
    }
    return cells;
  };

  let solved = false;
  let backtracks = 0;

  const solve = (row) => {
    if (solved) return true;

    if (row === n) {
      addStep({
        phase: 'solved',
        currentLine: 6,
        explanation: `All ${n} queens placed successfully!`,
        currentRow: null,
        currentCol: null,
        checking: [],
        queens: getQueens(),
        solved: true,
      });
      solved = true;
      return true;
    }

    addStep({
      phase: 'try-row',
      currentLine: 7,
      explanation: `Row ${row}: Try placing a queen in each column`,
      currentRow: row,
      currentCol: null,
      checking: [],
      queens: getQueens(),
    });

    for (let col = 0; col < n; col++) {
      if (solved) return true;

      const attackCells = getAttackCells(row, col);

      addStep({
        phase: 'check-safe',
        currentLine: 8,
        explanation: `Check if (${row}, ${col}) is safe: checking column and diagonals`,
        currentRow: row,
        currentCol: col,
        checking: attackCells,
        queens: getQueens(),
      });

      if (isSafe(board, row, col, n)) {
        board[row][col] = 1;

        addStep({
          phase: 'place-queen',
          currentLine: 9,
          explanation: `Safe! Place queen at (${row}, ${col})`,
          currentRow: row,
          currentCol: col,
          checking: [],
          queens: getQueens(),
        });

        if (solve(row + 1)) {
          return true;
        }

        // Backtrack
        board[row][col] = 0;
        backtracks++;

        addStep({
          phase: 'backtrack',
          currentLine: 12,
          explanation: `Backtrack! Remove queen from (${row}, ${col}). Dead end reached.`,
          currentRow: row,
          currentCol: col,
          checking: [],
          queens: getQueens(),
          backtracks,
        });
      } else {
        addStep({
          phase: 'not-safe',
          currentLine: 8,
          explanation: `Not safe! Position (${row}, ${col}) is under attack.`,
          currentRow: row,
          currentCol: col,
          checking: attackCells,
          queens: getQueens(),
          conflict: true,
        });
      }
    }

    addStep({
      phase: 'row-failed',
      currentLine: 13,
      explanation: `Row ${row}: No valid position found. Returning false to backtrack.`,
      currentRow: row,
      currentCol: null,
      checking: [],
      queens: getQueens(),
    });

    return false;
  };

  solve(0);

  if (!solved) {
    addStep({
      phase: 'no-solution',
      currentLine: 13,
      explanation: `No solution exists for ${n}-Queens.`,
      currentRow: null,
      currentCol: null,
      checking: [],
      queens: [],
      done: true,
    });
  } else {
    addStep({
      phase: 'done',
      currentLine: 6,
      explanation: `Solution found! ${backtracks} backtrack(s) were needed.`,
      currentRow: null,
      currentCol: null,
      checking: [],
      queens: getQueens(),
      done: true,
      backtracks,
    });
  }

  return steps;
};

export const initialState = ({ n }) => {
  const steps = generateSteps(n);
  return {
    n,
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

  if (state.solved) {
    return {
      success: true,
      title: 'Solution Found',
      message: `Placed ${state.n} queens on the board`,
      details: [
        `Board size: ${state.n}×${state.n}`,
        `Backtracks: ${state.backtracks || 0}`,
      ],
    };
  }

  return {
    success: false,
    title: 'No Solution',
    message: `Cannot place ${state.n} queens without conflicts`,
    details: [],
  };
};
