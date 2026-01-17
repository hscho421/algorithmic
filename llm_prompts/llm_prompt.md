# DSA Visualizer — Project Prompt

You are working in a React + Vite project that visualizes data structures and algorithms. The goal is to provide an interactive, step-by-step learning environment where users can manipulate inputs, control playback (step/run/reset), and see live explanations, code, and state changes. The experience emphasizes clarity, visual intuition, and polished UI.

## Project Goals
- Teach core algorithms by showing their internal state transitions.
- Provide interactive controls (step, run, speed, back, reset) to inspect logic at a fine-grained level.
- Keep UI patterns consistent across all visualizers.
- Ship a strong landing experience that funnels users into categories and specific visualizers.
- Make the product feel premium and shareable.

## High-Level Features
- Multiple algorithm categories (searching, sorting, graphs, trees, heaps, strings, dynamic programming, etc.).
- Each visualizer includes:
  - Configuration inputs for parameters.
  - Playback controls with speed and step/back.
  - A main visualization pane.
  - A state panel (variables + metadata).
  - An info area with tabs for Explanation, Complexity, Guide, and Result.
  - A persistent Code panel with line highlighting.
- Full-screen-height three-column layout for visualizers.
- Responsive layout with adaptive visual sizing to avoid overflow.
- Home page with hero, quick starts, learning paths, and category browsing.
- Keyboard shortcuts for step/run/reset and speed changes.

## Key UI Layout
Visualizer pages use a 3-card, 3-column layout:
- Left card: configuration + controls.
- Center card: visualization + state.
- Right card: tabbed info (explanation/complexity/guide/result) and a fixed code panel.
- Cards share equal height and adapt to the viewport height.
- Columns are resizable on desktop via draggable separators with snap-to-default behavior.
- Info tabs are persisted per user (local storage) and auto-switch to Explanation when stepping/running.

## Routing and Pages
- `src/App.jsx` defines routes:
  - `/` Home
  - `/category/:categoryId` Category listings
  - `/visualize/:algorithmId` Visualizer page
  - static pages (roadmap/pricing/privacy/terms)
- `src/pages/HomePage.jsx` is the marketing landing page with hero, quick starts, paths, and categories.
- `src/pages/CategoryPage.jsx` renders category-specific algorithm cards.
- `src/pages/VisualizerPage.jsx` loads the visualizer by `algorithmId`.

## Data and Metadata
- `src/constants.js` contains global constants and `CATEGORIES` for routing.
- `src/data/algorithms.js` aggregates metadata for all algorithms and provides helpers:
  - `getAlgorithmsByCategory`
  - `getAlgorithmById`
  - `getCategoryById`
- Category metadata lives in `src/components/visualizers/<category>/index.js`.
  - Each algorithm entry includes id, name, description, and component mapping.

## Visualizer Architecture

### Layout
- `src/components/shared/layout/VisualizerLayout.jsx` defines the 3-card layout and behavior.
- It controls:
  - right-side info tabs and persistence
  - code panel placement
  - column resizing with snap
  - keyboard shortcuts for playback
- Layout uses Tailwind utilities with a grid-based layout.

### Visualizers
- Each algorithm visualizer lives in `src/components/visualizers/**`.
- Visualizers are responsible for:
  - rendering configuration inputs
  - defining control handlers
  - passing visualization content and state data
  - building `infoTabs` (explanation/complexity/guide/result)
  - supplying code lines and line highlights
- Shared visualization components live in `src/components/shared/visualization/**`.
  - `ArrayVisualization.jsx` for array-based visuals
  - `SortingArrayVisualization.jsx` for sorting visuals
  - `GraphDisplay.jsx` for graph visuals
  - `TrieDisplay.jsx` for trie visuals

### Algorithm Logic
- Algorithm step logic lives in `src/lib/algorithms/**`.
- Each algorithm typically exports:
  - `initialState` (builds initial step data)
  - `executeStep` (advances one step)
  - `getExplanation` (returns current explanation string)
  - `getResult` (final result summary)
  - `complexity` metadata
  - `code` template lines for highlighting
- Templates are formatted to match Python grammar where possible for consistent code display.
- Line numbers are used for code highlighting in the Code panel.

### Playback and State
- Visualizers use `useVisualizerState` + `usePlayback` hooks for step/run controls.
- State updates are deterministic and step-based for explainability.
- `ResultBanner` shows success/failure once done.
- Info tabs are memoized to avoid unnecessary re-renders.

## Styling and Motion
- TailwindCSS utilities are used for layout and styling.
- Global fonts are defined in `src/index.css`:
  - Display: Fraunces
  - Body: Space Grotesk
- Hero surfaces, background gradients, and animations (rise-in, float-slow) are also in `src/index.css`.
- Design uses clean cards, subtle shadows, and clear hierarchy.

## File Map (High Level)
- `src/App.jsx` — routing
- `src/pages/*` — page shells
- `src/components/layout/*` — page layout (sidebar, top nav)
- `src/components/shared/layout/*` — shared layout components
- `src/components/shared/visualization/*` — reusable visuals
- `src/components/shared/panels/*` — explanation, complexity, code, etc.
- `src/components/visualizers/*` — algorithm visualizers by category
- `src/lib/algorithms/*` — algorithm logic and templates

## UI Conventions and Constraints
- Avoid nested card components inside the main layout cards.
- Keep info sections flat and lightweight.
- For large arrays or tables, dynamically size elements to avoid overflow.
- Use `flex-1` + `overflow-y-auto` for scrollable sections only when necessary.
- Prefer consistent spacing and typography across visualizers.

## Common UX Patterns
- Explanation tab auto-selected when stepping or running.
- Code panel is always visible in the right column.
- Guide and Complexity are lightweight and not wrapped in extra cards.
- Visualization pane should fill available height without causing scroll in the main card.
- Graph/array visuals should scale to fit the container.

## How to Add a New Visualizer
1. Create a visualizer component under `src/components/visualizers/<category>/`.
2. Add algorithm logic in `src/lib/algorithms/<category>/`.
3. Export metadata in `src/components/visualizers/<category>/index.js`.
4. Wire it into `src/data/algorithms.js` via the category metadata.
5. Use `VisualizerLayout` and match the 3-card structure.
6. Provide `infoTabs` for explanation, complexity, guide, and result.

## Summary
This project is a polished interactive DSA learning tool. The architecture separates algorithm logic from visualization components, and a shared layout ensures uniform UX. Any new algorithm visualizer should follow existing patterns: expose step-based logic, use VisualizerLayout, and present explanation/code/state clearly.
