// KMP (Knuth-Morris-Pratt) Pattern Matching Algorithm

export const template = {
  name: 'KMP Algorithm',
  description: 'Efficient pattern matching using prefix function',
  code: [
    { line: 'def kmp_search(text, pattern):', indent: 0 },
    { line: 'lps = compute_lps(pattern)', indent: 1 },
    { line: 'i = j = 0', indent: 1 },
    { line: '', indent: 0 },
    { line: 'while i < len(text):', indent: 1 },
    { line: 'if text[i] == pattern[j]:', indent: 2 },
    { line: 'i += 1; j += 1', indent: 3 },
    { line: 'if j == len(pattern):', indent: 3 },
    { line: 'return i - j  # found', indent: 4 },
    { line: 'elif i < len(text) and text[i] != pattern[j]:', indent: 2 },
    { line: 'if j != 0: j = lps[j-1]', indent: 3 },
    { line: 'else: i += 1', indent: 3 },
  ],
};

export const complexity = {
  time: 'O(n + m)',
  space: 'O(m)',
  bestCase: 'O(n)',
  averageCase: 'O(n + m)',
  worstCase: 'O(n + m)',
  note: 'n = text length, m = pattern length',
};

function computeLPS(pattern) {
  const m = pattern.length;
  const lps = Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

export function initialState({ text = 'ABABDABACDABABCABAB', pattern = 'ABABCABAB' } = {}) {
  const lps = computeLPS(pattern);

  return {
    text,
    pattern,
    lps,
    i: 0,
    j: 0,
    stepIndex: 0,
    done: false,
    currentLine: 1,
    explanation: `LPS array computed: [${lps.join(', ')}]`,
    matches: [],
    phase: 'init',
    comparing: false,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { text, pattern, lps, i, j, matches } = state;
  const n = text.length;
  const m = pattern.length;

  // Check if we've finished searching
  if (i >= n) {
    return {
      ...state,
      done: true,
      currentLine: 8,
      explanation: matches.length > 0
        ? `Search complete! Found ${matches.length} match(es) at position(s): ${matches.join(', ')}`
        : 'Search complete! Pattern not found.',
      phase: 'done',
    };
  }

  // Compare characters
  if (text[i] === pattern[j]) {
    const newJ = j + 1;
    const newI = i + 1;

    // Check if we found a complete match
    if (newJ === m) {
      const matchPos = newI - m;
      return {
        ...state,
        i: newI,
        j: lps[j],
        matches: [...matches, matchPos],
        stepIndex: state.stepIndex + 1,
        currentLine: 8,
        explanation: `Match found at position ${matchPos}! Continue searching...`,
        phase: 'found',
        comparing: true,
        matchStart: matchPos,
      };
    }

    return {
      ...state,
      i: newI,
      j: newJ,
      stepIndex: state.stepIndex + 1,
      currentLine: 6,
      explanation: `text[${i}]='${text[i]}' == pattern[${j}]='${pattern[j]}': advance both pointers`,
      phase: 'matching',
      comparing: true,
    };
  }

  // Mismatch
  if (j !== 0) {
    return {
      ...state,
      j: lps[j - 1],
      stepIndex: state.stepIndex + 1,
      currentLine: 10,
      explanation: `Mismatch! text[${i}]='${text[i]}' != pattern[${j}]='${pattern[j]}': use LPS, j = lps[${j - 1}] = ${lps[j - 1]}`,
      phase: 'mismatch-lps',
      comparing: false,
    };
  }

  return {
    ...state,
    i: i + 1,
    stepIndex: state.stepIndex + 1,
    currentLine: 11,
    explanation: `Mismatch at j=0! text[${i}]='${text[i]}' != pattern[0]='${pattern[0]}': advance text pointer`,
    phase: 'mismatch-advance',
    comparing: false,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { text, pattern, matches, lps } = state;

  if (matches.length > 0) {
    return {
      success: true,
      title: 'Pattern Found!',
      message: `Found ${matches.length} occurrence(s)`,
      details: [
        `Positions: ${matches.join(', ')}`,
        `Text: "${text}"`,
        `Pattern: "${pattern}"`,
        `LPS: [${lps.join(', ')}]`,
      ],
    };
  }

  return {
    success: false,
    title: 'Pattern Not Found',
    message: `"${pattern}" not in "${text}"`,
    details: [`LPS: [${lps.join(', ')}]`],
  };
}
