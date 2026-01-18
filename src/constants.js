export const COLORS = {
  primary: '#3b82f6',    // blue-500
  secondary: '#10b981',  // emerald-500
  accent: '#f59e0b',     // amber-500
  danger: '#ef4444',     // red-500
  
  pointer: {
    left: '#3b82f6',     // blue
    right: '#ef4444',    // red
    mid: '#10b981',      // green
    current: '#f59e0b',  // amber
    visited: '#8b5cf6',  // purple
    found: '#10b981',    // green
    comparing: '#f59e0b', // amber
  },
  
  state: {
    inactive: '#3f3f46', // zinc-700
    active: '#fafafa',   // zinc-50
    highlight: '#fbbf24', // amber-400
  }
};

export const TIMING = {
  default: 500,
  fast: 100,
  slow: 2000,
  step: {
    min: 100,
    max: 2000,
    default: 500,
  }
};

export const FREE_SAVED_INPUTS_LIMIT = 3;
export const PRO_CHECKPOINT_LIMIT = 10;
export const PRO_CATEGORY_IDS = [
  'graphs',
  'dynamic-programming',
  'strings',
];

export const isProCategory = (categoryId) => PRO_CATEGORY_IDS.includes(categoryId);

export const CATEGORIES = [
  { id: 'searching', name: 'Searching', icon: 'Search', path: '/category/searching' },
  { id: 'sorting', name: 'Sorting', icon: 'ArrowUpDown', path: '/category/sorting' },
  { id: 'trees', name: 'Trees', icon: 'GitBranch', path: '/category/trees' },
  { id: 'heaps', name: 'Heaps', icon: 'Layers', path: '/category/heaps' },
  { id: 'graphs', name: 'Graphs', icon: 'Share2', path: '/category/graphs' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', icon: 'Grid3X3', path: '/category/dynamic-programming' },
  { id: 'data-structures', name: 'Data Structures', icon: 'Database', path: '/category/data-structures' },
  { id: 'strings', name: 'Strings', icon: 'Type', path: '/category/strings' },
  { id: 'backtracking', name: 'Backtracking', icon: 'Undo2', path: '/category/backtracking' },
];
