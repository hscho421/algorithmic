export const calculatePositions = (vertices) => {
  const positions = {};
  const count = vertices.length;

  if (count === 0) return positions;

  if (count === 1) {
    positions[vertices[0]] = { x: 50, y: 50 };
    return positions;
  }

  if (count === 2) {
    positions[vertices[0]] = { x: 25, y: 50 };
    positions[vertices[1]] = { x: 75, y: 50 };
    return positions;
  }

  // Arrange in a circle for 3+ vertices
  const centerX = 50;
  const centerY = 50;
  const radius = 35;

  vertices.forEach((vertex, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    positions[vertex] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return positions;
};
