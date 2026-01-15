export { default as TrieVisualizer } from './TrieVisualizer';

export const metadata = {
  id: 'strings',
  name: 'Strings',
  description: 'String algorithms and prefix trees',
  algorithms: [
    {
      id: 'trie',
      name: 'Trie (Prefix Tree)',
      description: 'Insert and search words by prefix in O(L)',
      component: 'TrieVisualizer',
    },
  ],
};
