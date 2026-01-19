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

const generateSteps = (s) => {
  const steps = [];
  const n = s.length;

  if (n === 0) {
    steps.push({
      s,
      phase: 'done',
      center: null,
      left: null,
      right: null,
      bestStart: 0,
      bestEnd: -1,
      currentLine: 13,
      explanation: 'Empty string - no palindrome',
      done: true,
    });
    return steps;
  }

  let bestStart = 0;
  let bestEnd = 0;

  // Initial step
  steps.push({
    s,
    phase: 'init',
    center: null,
    left: null,
    right: null,
    bestStart: 0,
    bestEnd: 0,
    currentLine: 1,
    explanation: `Starting search for longest palindrome in "${s}"`,
  });

  for (let i = 0; i < n; i++) {
    // Step: Selecting center for odd-length palindrome
    steps.push({
      s,
      phase: 'center',
      center: i,
      left: i,
      right: i,
      bestStart,
      bestEnd,
      currentLine: 3,
      explanation: `Center ${i}: Trying position '${s[i]}' as center for odd-length palindrome`,
      isOdd: true,
    });

    // Expand for odd-length palindrome
    let left = i;
    let right = i;

    while (left >= 0 && right < n && s[left] === s[right]) {
      // Show expansion step
      steps.push({
        s,
        phase: 'expand',
        center: i,
        left,
        right,
        bestStart,
        bestEnd,
        currentLine: 5,
        explanation: `Expanding: s[${left}]='${s[left]}' == s[${right}]='${s[right]}' ✓`,
        isOdd: true,
        match: true,
      });

      // Check if this is better
      const currentLen = right - left + 1;
      const bestLen = bestEnd - bestStart + 1;
      if (currentLen > bestLen) {
        bestStart = left;
        bestEnd = right;
        steps.push({
          s,
          phase: 'update',
          center: i,
          left,
          right,
          bestStart,
          bestEnd,
          currentLine: 11,
          explanation: `New best! "${s.slice(left, right + 1)}" (length ${currentLen})`,
          isOdd: true,
        });
      }

      left--;
      right++;
    }

    // Show mismatch if expansion stopped due to character mismatch
    if (left >= 0 && right < n && s[left] !== s[right]) {
      steps.push({
        s,
        phase: 'expand',
        center: i,
        left,
        right,
        bestStart,
        bestEnd,
        currentLine: 5,
        explanation: `Mismatch: s[${left}]='${s[left]}' != s[${right}]='${s[right]}' ✗`,
        isOdd: true,
        match: false,
      });
    }

    // Step: Selecting center for even-length palindrome
    if (i < n - 1) {
      steps.push({
        s,
        phase: 'center',
        center: i,
        left: i,
        right: i + 1,
        bestStart,
        bestEnd,
        currentLine: 7,
        explanation: `Center ${i}: Trying between '${s[i]}' and '${s[i + 1]}' for even-length palindrome`,
        isOdd: false,
      });

      // Expand for even-length palindrome
      left = i;
      right = i + 1;

      while (left >= 0 && right < n && s[left] === s[right]) {
        steps.push({
          s,
          phase: 'expand',
          center: i,
          left,
          right,
          bestStart,
          bestEnd,
          currentLine: 7,
          explanation: `Expanding: s[${left}]='${s[left]}' == s[${right}]='${s[right]}' ✓`,
          isOdd: false,
          match: true,
        });

        const currentLen = right - left + 1;
        const bestLen = bestEnd - bestStart + 1;
        if (currentLen > bestLen) {
          bestStart = left;
          bestEnd = right;
          steps.push({
            s,
            phase: 'update',
            center: i,
            left,
            right,
            bestStart,
            bestEnd,
            currentLine: 11,
            explanation: `New best! "${s.slice(left, right + 1)}" (length ${currentLen})`,
            isOdd: false,
          });
        }

        left--;
        right++;
      }

      // Show mismatch if expansion stopped due to character mismatch
      if (left >= 0 && right < n && s[left] !== s[right]) {
        steps.push({
          s,
          phase: 'expand',
          center: i,
          left,
          right,
          bestStart,
          bestEnd,
          currentLine: 7,
          explanation: `Mismatch: s[${left}]='${s[left]}' != s[${right}]='${s[right]}' ✗`,
          isOdd: false,
          match: false,
        });
      }
    }
  }

  // Final step
  steps.push({
    s,
    phase: 'done',
    center: null,
    left: null,
    right: null,
    bestStart,
    bestEnd,
    currentLine: 13,
    explanation: `Done! Longest palindrome: "${s.slice(bestStart, bestEnd + 1)}" (length ${bestEnd - bestStart + 1})`,
    done: true,
  });

  return steps;
};

export function initialState({ s = 'babad' } = {}) {
  const steps = generateSteps(s);

  return {
    ...steps[0],
    steps,
    stepIndex: 0,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= state.steps.length) {
    return { ...state, done: true };
  }

  return {
    ...state,
    ...state.steps[nextIndex],
    stepIndex: nextIndex,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { s, bestStart, bestEnd } = state;
  const palindrome = s.slice(bestStart, bestEnd + 1);

  return {
    success: true,
    title: 'Longest Palindrome Found',
    message: `"${palindrome}" (length ${palindrome.length})`,
    details: [
      `Position: ${bestStart} to ${bestEnd}`,
      `Original string: "${s}"`,
    ],
  };
}
