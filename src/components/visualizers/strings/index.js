export { default as TrieVisualizer } from './TrieVisualizer';
export { default as KMPVisualizer } from './KMPVisualizer';
export { default as RabinKarpVisualizer } from './RabinKarpVisualizer';
export { default as LongestPalindromeVisualizer } from './LongestPalindromeVisualizer';

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
      difficulty: 'Hard',
      tags: ['Prefix Tree', 'Lexicographical'],
    },
    {
      id: 'kmp',
      name: 'KMP Pattern Matching',
      description: 'Search pattern using prefix table',
      component: 'KMPVisualizer',
      difficulty: 'Medium',
      tags: ['Pattern Matching', 'Linear Time'],
    },
    {
      id: 'rabin-karp',
      name: 'Rabin-Karp',
      description: 'Pattern matching with rolling hash',
      component: 'RabinKarpVisualizer',
      difficulty: 'Medium',
      tags: ['Pattern Matching', 'Hashing'],
    },
    {
      id: 'longest-palindrome',
      name: 'Longest Palindromic Substring',
      description: 'Expand around center to find longest palindrome',
      component: 'LongestPalindromeVisualizer',
      difficulty: 'Medium',
      tags: ['Strings', 'Two Pointers'],
    },
  ],
};
