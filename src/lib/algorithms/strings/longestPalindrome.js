// Longest Palindromic Substring (Expand Around Center)

export const template = {
  name: 'Longest Palindromic Substring',
  description: 'Find longest palindrome by expanding around centers',
  code: [
    { line: 'def longest_palindrome(s):', indent: 0 },
    { line: 'result = ""', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(len(s)):', indent: 1 },
    { line: '# Odd length palindrome', indent: 2 },
    { line: 'odd = expand(s, i, i)', indent: 2 },
    { line: '# Even length palindrome', indent: 2 },
    { line: 'even = expand(s, i, i+1)', indent: 2 },
    { line: '', indent: 0 },
    { line: 'longer = odd if len(odd) > len(even) else even', indent: 2 },
    { line: 'if len(longer) > len(result):', indent: 2 },
    { line: 'result = longer', indent: 3 },
    { line: '', indent: 0 },
    { line: 'return result', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n²)',
  space: 'O(1)',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  note: "Manacher's algorithm can achieve O(n)",
};

function expandAroundCenter(s, left, right) {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  return { start: left + 1, end: right - 1 };
}

export function initialState({ s = 'babad' } = {}) {
  return {
    s,
    n: s.length,
    i: 0,
    result: { start: 0, end: 0, str: s[0] || '' },
    stepIndex: 0,
    done: false,
    currentLine: 3,
    explanation: `Starting search for longest palindrome in "${s}"`,
    phase: 'init',
    expandingOdd: false,
    expandingEven: false,
    currentCenter: null,
    currentPalindrome: null,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { s, n, i, result, phase } = state;

  // Check if we've finished
  if (i >= n) {
    return {
      ...state,
      done: true,
      currentLine: 13,
      explanation: `Done! Longest palindrome: "${result.str}" (length ${result.str.length})`,
      phase: 'done',
    };
  }

  if (phase === 'init' || phase === 'next-center') {
    // Start expanding from center i (odd length)
    return {
      ...state,
      stepIndex: state.stepIndex + 1,
      currentLine: 5,
      explanation: `Center ${i}: expanding for odd-length palindrome around '${s[i]}'`,
      phase: 'expand-odd',
      currentCenter: i,
      expandingOdd: true,
      expandingEven: false,
    };
  }

  if (phase === 'expand-odd') {
    const { start, end } = expandAroundCenter(s, i, i);
    const oddPalindrome = s.slice(start, end + 1);

    return {
      ...state,
      stepIndex: state.stepIndex + 1,
      currentLine: 7,
      explanation: `Odd palindrome: "${oddPalindrome}" (${start}-${end}). Now trying even...`,
      phase: 'expand-even',
      oddResult: { start, end, str: oddPalindrome },
      expandingOdd: false,
      expandingEven: true,
      highlightRange: { start, end },
    };
  }

  if (phase === 'expand-even') {
    const { start, end } = expandAroundCenter(s, i, i + 1);
    const evenPalindrome = start <= end ? s.slice(start, end + 1) : '';
    const oddResult = state.oddResult;

    // Determine which is longer
    const longer = oddResult.str.length >= evenPalindrome.length ? oddResult : { start, end, str: evenPalindrome };

    let newResult = result;
    let updated = false;
    if (longer.str.length > result.str.length) {
      newResult = longer;
      updated = true;
    }

    return {
      ...state,
      i: i + 1,
      result: newResult,
      stepIndex: state.stepIndex + 1,
      currentLine: updated ? 11 : 10,
      explanation: updated
        ? `Found longer palindrome: "${longer.str}"! Updated result.`
        : `Best from center ${i}: "${longer.str}" (not longer than current "${result.str}")`,
      phase: 'next-center',
      expandingOdd: false,
      expandingEven: false,
      evenResult: { start, end, str: evenPalindrome },
      highlightRange: updated ? { start: newResult.start, end: newResult.end } : state.highlightRange,
      updated,
    };
  }

  return state;
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { s, result } = state;

  return {
    success: true,
    title: 'Longest Palindrome Found',
    message: `"${result.str}" (length ${result.str.length})`,
    details: [
      `Position: ${result.start} to ${result.end}`,
      `Original string: "${s}"`,
    ],
  };
}
