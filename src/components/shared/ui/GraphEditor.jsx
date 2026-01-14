import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Checkbox from './Checkbox';

export default function GraphEditor({
  vertices,
  edges,
  onVerticesChange,
  onEdgesChange,
  directed = false,
  weighted = false,
  onDirectedChange,
}) {
  const [newVertex, setNewVertex] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');

  const handleAddVertex = () => {
    const trimmed = newVertex.trim();
    if (trimmed && !vertices.includes(trimmed)) {
      onVerticesChange([...vertices, trimmed]);
      setNewVertex('');
    }
  };

  const handleRemoveVertex = (vertex) => {
    onVerticesChange(vertices.filter((v) => v !== vertex));
    // Also remove edges connected to this vertex
    onEdgesChange(
      edges.filter(([from, to]) => from !== vertex && to !== vertex)
    );
  };

  const handleAddEdge = () => {
    if (edgeFrom && edgeTo && edgeFrom !== edgeTo) {
      // Check if edge already exists
      const exists = edges.some(
        ([from, to]) =>
          (from === edgeFrom && to === edgeTo) ||
          (!directed && from === edgeTo && to === edgeFrom)
      );

      if (!exists) {
        const newEdge = weighted
          ? [edgeFrom, edgeTo, parseInt(edgeWeight) || 1]
          : [edgeFrom, edgeTo];
        onEdgesChange([...edges, newEdge]);
        setEdgeFrom('');
        setEdgeTo('');
        setEdgeWeight('1');
      }
    }
  };

  const handleRemoveEdge = (index) => {
    onEdgesChange(edges.filter((_, i) => i !== index));
  };

  const vertexOptions = vertices.map((v) => ({ value: v, label: v }));

  return (
    <div className="space-y-4">
      {/* Directed toggle */}
      {onDirectedChange && (
        <Checkbox
          label="Directed graph"
          checked={directed}
          onChange={(e) => onDirectedChange(e.target.checked)}
        />
      )}

      {/* Add Vertex */}
      <div>
        <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
          Add Vertex
        </label>
        <div className="flex gap-2">
          <Input
            value={newVertex}
            onChange={(e) => setNewVertex(e.target.value.toUpperCase())}
            placeholder="e.g. A, B, C"
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddVertex()}
          />
          <Button onClick={handleAddVertex} disabled={!newVertex.trim()}>
            Add
          </Button>
        </div>
      </div>

      {/* Vertices List */}
      {vertices.length > 0 && (
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
            Vertices ({vertices.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {vertices.map((v) => (
              <div
                key={v}
                className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 py-1 border border-zinc-200 dark:border-zinc-700"
              >
                <span className="font-mono text-sm text-zinc-900 dark:text-white">{v}</span>
                <button
                  onClick={() => handleRemoveVertex(v)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors ml-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Edge */}
      {vertices.length >= 2 && (
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
            Add Edge
          </label>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={edgeFrom}
              onChange={(e) => setEdgeFrom(e.target.value)}
              options={[{ value: '', label: 'From' }, ...vertexOptions]}
              className="flex-1 min-w-[70px]"
            />
            <span className="self-center text-zinc-500">→</span>
            <Select
              value={edgeTo}
              onChange={(e) => setEdgeTo(e.target.value)}
              options={[{ value: '', label: 'To' }, ...vertexOptions]}
              className="flex-1 min-w-[70px]"
            />
            {weighted && (
              <Input
                type="number"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                placeholder="Weight"
                className="w-20"
                min="1"
              />
            )}
            <Button
              onClick={handleAddEdge}
              disabled={!edgeFrom || !edgeTo || edgeFrom === edgeTo}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Edges List */}
      {edges.length > 0 && (
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
            Edges ({edges.length})
          </label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {edges.map((edge, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-200 dark:border-zinc-700"
              >
                <span className="font-mono text-sm text-zinc-900 dark:text-white">
                  {edge[0]} {directed ? '→' : '—'} {edge[1]}
                  {weighted && edge[2] !== undefined && (
                    <span className="text-zinc-500 ml-2">(w: {edge[2]})</span>
                  )}
                </span>
                <button
                  onClick={() => handleRemoveEdge(idx)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="text-xs text-zinc-500 dark:text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <p>Tip: Add at least 2 vertices before adding edges.</p>
      </div>
    </div>
  );
}
