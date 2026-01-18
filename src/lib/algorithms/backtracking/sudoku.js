export const template = {
  name: 'Sudoku Solver',
  description: 'Solve a Sudoku puzzle using backtracking',
  code: [
    { line: 'def solve(board):', indent: 0 },
    { line: 'cell = find_empty(board)', indent: 1 },
    { line: 'if not cell: return True', indent: 1 },
    { line: 'row, col = cell', indent: 1 },
    { line: 'for num in 1..9:', indent: 1 },
    { line: 'if valid(board, row, col, num):', indent: 2 },
    { line: 'board[row][col] = num', indent: 3 },
    { line: 'if solve(board): return True', indent: 3 },
    { line: 'board[row][col] = 0', indent: 3 },
    { line: 'return False', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(9^(N))',
  space: 'O(N)',
  bestCase: 'O(N)',
  averageCase: 'O(9^N)',
  worstCase: 'O(9^N)',
};

const normalizePuzzle = (puzzleInput) => {
  const sanitized = (puzzleInput || '').replace(/[^0-9.]/g, '');
  const padded = sanitized.padEnd(81, '0').slice(0, 81);
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  const givens = new Set();

  for (let i = 0; i < 81; i++) {
    const char = padded[i];
    const value = char === '.' ? 0 : parseInt(char, 10) || 0;
    const row = Math.floor(i / 9);
    const col = i % 9;
    board[row][col] = value;
    if (value !== 0) {
      givens.add(`${row}-${col}`);
    }
  }

  return { board, givens: [...givens] };
};

const cloneBoard = (board) => board.map((row) => [...row]);

const findEmpty = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return null;
};

const getConflictCells = (board, row, col, num) => {
  const conflicts = [];
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) conflicts.push({ row, col: i });
    if (board[i][col] === num) conflicts.push({ row: i, col });
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) conflicts.push({ row: r, col: c });
    }
  }
  return conflicts;
};

const isValid = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
};

const generateSteps = (puzzleInput) => {
  const steps = [];
  const { board, givens } = normalizePuzzle(puzzleInput);

  const addStep = (state) => {
    steps.push({
      board: cloneBoard(board),
      givens,
      ...state,
    });
  };

  addStep({
    phase: 'start',
    currentLine: 0,
    explanation: 'Start solving the Sudoku puzzle.',
    currentRow: null,
    currentCol: null,
    candidate: null,
    conflictCells: [],
    backtracks: 0,
  });

  let solved = false;
  let backtracks = 0;

  const solve = () => {
    const empty = findEmpty(board);
    if (!empty) {
      addStep({
        phase: 'solved',
        currentLine: 2,
        explanation: 'Puzzle solved! All cells are filled.',
        currentRow: null,
        currentCol: null,
        candidate: null,
        conflictCells: [],
        backtracks,
        solved: true,
      });
      solved = true;
      return true;
    }

    const { row, col } = empty;

    addStep({
      phase: 'pick-cell',
      currentLine: 3,
      explanation: `Pick empty cell at (${row + 1}, ${col + 1}).`,
      currentRow: row,
      currentCol: col,
      candidate: null,
      conflictCells: [],
      backtracks,
    });

    for (let num = 1; num <= 9; num++) {
      addStep({
        phase: 'try',
        currentLine: 4,
        explanation: `Try ${num} at (${row + 1}, ${col + 1}).`,
        currentRow: row,
        currentCol: col,
        candidate: num,
        conflictCells: [],
        backtracks,
      });

      if (isValid(board, row, col, num)) {
        board[row][col] = num;

        addStep({
          phase: 'place',
          currentLine: 6,
          explanation: `Place ${num} at (${row + 1}, ${col + 1}).`,
          currentRow: row,
          currentCol: col,
          candidate: num,
          conflictCells: [],
          backtracks,
        });

        if (solve()) return true;

        board[row][col] = 0;
        backtracks += 1;

        addStep({
          phase: 'backtrack',
          currentLine: 8,
          explanation: `Backtrack: remove ${num} from (${row + 1}, ${col + 1}).`,
          currentRow: row,
          currentCol: col,
          candidate: num,
          conflictCells: [],
          backtracks,
        });
      } else {
        addStep({
          phase: 'conflict',
          currentLine: 5,
          explanation: `${num} conflicts in row, column, or box.`,
          currentRow: row,
          currentCol: col,
          candidate: num,
          conflictCells: getConflictCells(board, row, col, num),
          backtracks,
          conflict: true,
        });
      }
    }

    return false;
  };

  solve();

  if (!solved) {
    addStep({
      phase: 'no-solution',
      currentLine: 9,
      explanation: 'No solution exists for this puzzle.',
      currentRow: null,
      currentCol: null,
      candidate: null,
      conflictCells: [],
      backtracks,
      done: true,
    });
  } else {
    addStep({
      phase: 'done',
      currentLine: 2,
      explanation: `Solved with ${backtracks} backtrack(s).`,
      currentRow: null,
      currentCol: null,
      candidate: null,
      conflictCells: [],
      backtracks,
      done: true,
      solved: true,
    });
  }

  return steps;
};

export const initialState = ({ puzzleInput }) => {
  const steps = generateSteps(puzzleInput);
  return {
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
  return state.explanation || 'Initializing Sudoku...';
};

export const getResult = (state) => {
  if (!state.done) return null;

  if (state.solved) {
    return {
      success: true,
      title: 'Puzzle Solved',
      message: `Completed with ${state.backtracks || 0} backtrack(s).`,
      details: [],
    };
  }

  return {
    success: false,
    title: 'No Solution',
    message: 'This puzzle cannot be solved.',
    details: [],
  };
};
