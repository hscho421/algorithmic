# Algorithm Comparison Mode

## Overview
The Algorithm Comparison Mode allows users to compare 2-3 algorithms side-by-side with synchronized playback controls and performance metrics.

## Features

### 1. **Side-by-Side Visualization**
- View 2-3 algorithms running simultaneously
- Each algorithm has its own independent state and input
- Synchronized playback across all visualizers

### 2. **Global Playback Controls**
- **Step Forward** (Space): Execute one step on all algorithms
- **Step Backward** (Shift + Space): Revert one step on all algorithms
- **Run/Pause** (Enter): Auto-play through all steps
- **Reset** (R): Reset all algorithms to initial state
- **Speed Control** ([ and ]): Adjust playback speed (100-2000ms)

### 3. **Performance Metrics Table**
Real-time comparison of:
- Steps taken
- Comparisons made
- Current status (Ready, Running, Completed)
- Time complexity
- Space complexity

### 4. **Responsive Layout**
- 2 algorithms: Side-by-side on large screens
- 3 algorithms: 3-column grid on extra-large screens
- Single column on mobile devices

## How to Use

### Accessing Comparison Mode
1. Navigate to any category page (e.g., `/category/sorting`)
2. Click the "Compare Algorithms" button
3. Select 2-3 algorithms from the list
4. Click "Compare X Algorithms" to start

Direct URL format: `/compare/:categoryId`

### Controls
All keyboard shortcuts work the same as single visualizer mode:
- `Space` - Step forward
- `Shift + Space` - Step backward
- `Enter` - Run/Pause
- `R` - Reset
- `[` - Slower speed
- `]` - Faster speed
- `Esc` - Stop playback

### Currently Supported Categories
- **Sorting** (merge-sort, quick-sort, heap-sort)
- **Searching** (binary-search, sliding-window)
- **Trees** (bst, tree-traversals)
- **Heaps** (min-heap)
- **Strings** (trie)
- **Graphs** (bfs, dfs, dijkstra, topological-sort, union-find)
- **Dynamic Programming** (fibonacci, coin-change, lcs, knapsack)

### Visualization Mapping (Comparison Panels)
- **Sorting**: `SortingArrayVisualization`
  - merge-sort, quick-sort, heap-sort
- **Searching**:
  - binary-search → `ArrayVisualization`
  - sliding-window → `SlidingWindowVisualization`
- **Trees**: `TreeDisplay`
  - bst, tree-traversals
- **Heaps**:
  - min-heap → `TreeDisplay` + `HeapArrayDisplay` (combined)
- **Strings**:
  - trie → `TrieDisplay`
- **Graphs**:
  - bfs, dfs, dijkstra, topological-sort → `GraphDisplay`
  - union-find → `UnionFindDisplay`
- **Dynamic Programming**:
  - fibonacci, coin-change, lcs, knapsack → `DPTable1D`/`DPTable2D` via `DPVisualization`

## Implementation Details

### Architecture
- **ComparisonVisualizerPage**: Main page with algorithm selection UI
- **ComparisonVisualizer**: Orchestrates multiple visualizers
- **ComparisonControls**: Global playback controls
- **ComparisonMetrics**: Performance comparison table
- **ComparisonAlgorithmPanel**: Individual algorithm panel with its own state

### Adding Support for New Algorithms
To add comparison support for a new algorithm:

1. Import the algorithm module in `ComparisonAlgorithmPanel.jsx`:
```javascript
import * as newAlgorithm from '../../lib/algorithms/category/newAlgorithm';
```

2. Add to `ALGORITHM_MODULES` map:
```javascript
const ALGORITHM_MODULES = {
  'new-algorithm': newAlgorithm,
  // ... other algorithms
};
```

3. Add default inputs in `getDefaultInputs()` function:
```javascript
function getDefaultInputs(algorithmId) {
  const defaults = {
    'new-algorithm': { input1: 'value1', input2: 'value2' },
    // ...
  };
  return defaults[algorithmId] || { array: '5, 2, 8, 1, 9' };
}
```

4. Add input parsing in `parseInputForAlgorithm()` function if needed

5. Optionally add input rendering in `renderInputFields()` function for custom input UI

6. Ensure the algorithm module exports:
- `initialState(input)` - Returns initial state
- `executeStep(state)` - Returns next state
- `complexity` - Object with `time` and `space` properties

### State Management
Each visualizer maintains:
- Independent state and history
- Step count and comparison metrics
- Can step/can back flags
- Completion status

The parent ComparisonVisualizer coordinates:
- Synchronized playback
- Global speed control
- Aggregate metrics display

## Future Enhancements
- [ ] Add support for more algorithm categories (graphs, dynamic programming, etc.)
- [ ] Allow saving comparison configurations
- [ ] Export comparison results as report
- [ ] Add diff view showing which algorithm is ahead
- [ ] Graph performance metrics over time
- [ ] Support custom input per algorithm
