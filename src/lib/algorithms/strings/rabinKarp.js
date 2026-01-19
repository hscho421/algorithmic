// Rabin-Karp Pattern Matching Algorithm (Rolling Hash)

export const template = {
  name: 'Rabin-Karp Algorithm',
  description: 'Pattern matching using rolling hash',
  code: [
    { line: 'def rabin_karp(text, pattern):', indent: 0 },
    { line: 'd = 256  # alphabet size', indent: 1 },
    { line: 'q = 101  # prime for mod', indent: 1 },
    { line: 'pattern_hash = hash(pattern)', indent: 1 },
    { line: 'window_hash = hash(text[0:m])', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(n - m + 1):', indent: 1 },
    { line: 'if pattern_hash == window_hash:', indent: 2 },
    { line: 'if text[i:i+m] == pattern:', indent: 3 },
    { line: 'return i  # found', indent: 4 },
    { line: '# roll hash', indent: 2 },
    { line: 'window_hash = roll(window_hash, i)', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(n + m) average, O(nm) worst',
  space: 'O(1)',
  bestCase: 'O(n + m)',
  averageCase: 'O(n + m)',
  worstCase: 'O(nm)',
  note: 'Worst case when all hash collisions',
};

const D = 256; // alphabet size
const Q = 101; // prime number for modulo

function computeHash(str, len) {
  let hash = 0;
  for (let i = 0; i < len; i++) {
    hash = (D * hash + str.charCodeAt(i)) % Q;
  }
  return hash;
}

function rollHash(oldHash, oldChar, newChar, h) {
  let newHash = (D * (oldHash - oldChar.charCodeAt(0) * h) + newChar.charCodeAt(0)) % Q;
  if (newHash < 0) newHash += Q;
  return newHash;
}

export function initialState({ text = 'GEEKS FOR GEEKS', pattern = 'GEEK' } = {}) {
  const n = text.length;
  const m = pattern.length;

  // Compute h = D^(m-1) % Q
  let h = 1;
  for (let i = 0; i < m - 1; i++) {
    h = (h * D) % Q;
  }

  const patternHash = computeHash(pattern, m);
  const windowHash = computeHash(text, m);

  return {
    text,
    pattern,
    n,
    m,
    h,
    patternHash,
    windowHash,
    i: 0,
    stepIndex: 0,
    done: false,
    currentLine: 4,
    explanation: `Pattern hash = ${patternHash}, Initial window hash = ${windowHash}`,
    matches: [],
    phase: 'init',
    hashMatch: patternHash === windowHash,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { text, pattern, n, m, h, patternHash, windowHash, i, matches } = state;

  // Check if we've finished
  if (i > n - m) {
    return {
      ...state,
      done: true,
      currentLine: 9,
      explanation: matches.length > 0
        ? `Done! Found ${matches.length} match(es) at position(s): ${matches.join(', ')}`
        : 'Done! Pattern not found.',
      phase: 'done',
    };
  }

  // Check if hashes match
  if (patternHash === windowHash) {
    // Verify character by character
    let match = true;
    for (let j = 0; j < m; j++) {
      if (text[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }

    if (match) {
      // Found a match, roll hash and continue
      let newWindowHash = windowHash;
      if (i < n - m) {
        newWindowHash = rollHash(windowHash, text[i], text[i + m], h);
      }

      return {
        ...state,
        i: i + 1,
        windowHash: newWindowHash,
        matches: [...matches, i],
        stepIndex: state.stepIndex + 1,
        currentLine: 9,
        explanation: `Hash match! Verified: pattern found at position ${i}`,
        phase: 'found',
        hashMatch: true,
        verifying: true,
      };
    }

    // Hash collision (spurious hit)
    let newWindowHash = windowHash;
    if (i < n - m) {
      newWindowHash = rollHash(windowHash, text[i], text[i + m], h);
    }

    return {
      ...state,
      i: i + 1,
      windowHash: newWindowHash,
      stepIndex: state.stepIndex + 1,
      currentLine: 8,
      explanation: `Hash match but characters differ (spurious hit). Rolling hash...`,
      phase: 'spurious',
      hashMatch: true,
      verifying: true,
    };
  }

  // Hashes don't match, roll the hash
  let newWindowHash = windowHash;
  if (i < n - m) {
    newWindowHash = rollHash(windowHash, text[i], text[i + m], h);
  }

  return {
    ...state,
    i: i + 1,
    windowHash: newWindowHash,
    stepIndex: state.stepIndex + 1,
    currentLine: 11,
    explanation: `Hash mismatch (${windowHash} != ${patternHash}). Rolling hash to ${newWindowHash}`,
    phase: 'rolling',
    hashMatch: false,
    verifying: false,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { text, pattern, matches, patternHash } = state;

  if (matches.length > 0) {
    return {
      success: true,
      title: 'Pattern Found!',
      message: `Found ${matches.length} occurrence(s)`,
      details: [
        `Positions: ${matches.join(', ')}`,
        `Pattern hash: ${patternHash}`,
        `Text: "${text}"`,
        `Pattern: "${pattern}"`,
      ],
    };
  }

  return {
    success: false,
    title: 'Pattern Not Found',
    message: `"${pattern}" not in "${text}"`,
    details: [`Pattern hash: ${patternHash}`],
  };
}
