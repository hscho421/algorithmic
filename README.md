# DSA Visualizer

An interactive web application for visualizing data structures and algorithms step-by-step. Learn by watching, not just reading.

![DSA Visualizer](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC)

## ✨ Features

- **Interactive Visualizations**: Step-by-step visualizations of algorithms with real-time state updates
- **Playback Controls**: Play, pause, step forward/backward through algorithm execution
- **Speed Control**: Adjustable animation speed for better understanding
- **Multiple Panels**: 
  - Code panel showing algorithm implementation
  - State panel displaying current data structures
  - Explanation panel with step-by-step descriptions
  - Complexity panel showing time and space complexity
- **Dark Mode**: Full dark mode support for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multiple Categories**: Organized by algorithm categories for easy navigation

## 🚀 Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.12.0** - Client-side routing
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **ESLint** - Code linting

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/hscho421/dsa-visualizer.git
cd dsa-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

1. **Browse Categories**: Start from the home page and select an algorithm category
2. **Choose Algorithm**: Click on any algorithm to open its visualizer
3. **Interact**: 
   - Use playback controls to step through the algorithm
   - Adjust speed with the speed slider
   - Navigate back and forth through the execution history
   - View code, state, and explanations in the side panels

## 📚 Available Algorithms

### 🔍 Searching
- **Binary Search** - Search in sorted arrays with O(log n) complexity

### 🔄 Sorting
- **Merge Sort** - Divide and conquer sorting with O(n log n) complexity
- **Quick Sort** - In-place partitioning with O(n log n) average complexity

### 🌳 Trees
- **Binary Search Tree** - Insert and search operations with O(log n) average complexity
- **Tree Traversals** - In-order, pre-order, post-order, and level-order traversals

### 🕸️ Graphs
- **Breadth-First Search (BFS)** - Level-by-level traversal using a queue
- **Depth-First Search (DFS)** - Deep exploration using a stack
- **Dijkstra's Algorithm** - Shortest path in weighted graphs
- **Topological Sort** - Order vertices in a directed acyclic graph
- **Union Find** - Disjoint set union with path compression

### 🚧 Coming Soon
- Heaps
- Dynamic Programming
- Data Structures
- Strings
- Backtracking

## 📁 Project Structure

```
dsa-visualizer/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Sidebar, PageLayout
│   │   ├── shared/          # Reusable UI components
│   │   │   ├── controls/    # Playback controls, speed slider
│   │   │   ├── panels/      # Code, state, explanation panels
│   │   │   ├── ui/          # Basic UI components
│   │   │   └── visualization/ # Graph, Tree displays
│   │   └── visualizers/     # Algorithm-specific visualizers
│   ├── lib/
│   │   ├── algorithms/      # Algorithm implementations
│   │   └── dataStructures/  # Data structure implementations
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── pages/               # Page components
│   ├── data/                # Algorithm metadata
│   └── constants.js         # App-wide constants
├── public/                  # Static assets
└── package.json
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding a New Algorithm

1. Create a new visualizer component in `src/components/visualizers/[category]/`
2. Implement the algorithm logic in `src/lib/algorithms/[category]/`
3. Add metadata to the category's `index.js` file
4. Register the component in `src/pages/VisualizerPage.jsx`

## 🎨 Design Principles

- **Modular Architecture**: Each algorithm is self-contained with its own visualizer
- **State Management**: Custom hooks manage algorithm state and history
- **Reusable Components**: Shared UI components ensure consistency
- **Metadata-Driven**: Algorithms are defined declaratively for easy extension

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with ❤️ for students and developers learning data structures and algorithms.

---

**Happy Learning!** 🎓
