import { metadata as searchingMetadata } from '../components/visualizers/searching';
import { metadata as sortingMetadata } from '../components/visualizers/sorting';
import { metadata as treesMetadata } from '../components/visualizers/trees';
import { metadata as heapsMetadata } from '../components/visualizers/heaps';
import { metadata as stringsMetadata } from '../components/visualizers/strings';
import { metadata as graphsMetadata } from '../components/visualizers/graphs';

export const ALGORITHMS = {
  searching: searchingMetadata,
  sorting: sortingMetadata,
  trees: treesMetadata,
  heaps: heapsMetadata,
  strings: stringsMetadata,
  graphs: graphsMetadata,
};

export const getAlgorithmsByCategory = (categoryId) => {
  return ALGORITHMS[categoryId]?.algorithms || [];
};

export const getAlgorithmById = (algorithmId) => {
  for (const category of Object.values(ALGORITHMS)) {
    const algorithm = category.algorithms.find((a) => a.id === algorithmId);
    if (algorithm) {
      return { ...algorithm, categoryId: category.id };
    }
  }
  return null;
};

export const getCategoryById = (categoryId) => {
  return ALGORITHMS[categoryId] || null;
};
