import Card from '../ui/Card';

const highlightSyntax = (line) => {
  const keywords = ['if', 'else', 'elif', 'while', 'for', 'return', 'and', 'or', 'not', 'in', 'is', 'null', 'true', 'false'];
  const functions = ['mergeSort', 'merge', 'insert', 'search', 'inorder', 'preorder', 'postorder', 'levelorder', 'visit', 'enqueue', 'dequeue', 'quickSort', 'partition', 'swap', 'BFS', 'DFS', 'dijkstra', 'extractMin', 'process'];
  
  const tokens = [];
  let remaining = line;
  
  while (remaining.length > 0) {
    let matched = false;

    
    if (remaining.startsWith('#')) {
      tokens.push({ type: 'comment', value: remaining });
      break;
    }


    const stringMatch = remaining.match(/^(['"])(.*?)\1/);
    if (stringMatch) {
      tokens.push({ type: 'string', value: stringMatch[0] });
      remaining = remaining.slice(stringMatch[0].length);
      matched = true;
      continue;
    }


    const numberMatch = remaining.match(/^\b\d+\b/);
    if (numberMatch) {
      tokens.push({ type: 'number', value: numberMatch[0] });
      remaining = remaining.slice(numberMatch[0].length);
      matched = true;
      continue;
    }


    const wordMatch = remaining.match(/^\b[a-zA-Z_][a-zA-Z0-9_]*\b/);
    if (wordMatch) {
      const word = wordMatch[0];
      if (keywords.includes(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (functions.includes(word)) {
        tokens.push({ type: 'function', value: word });
      } else {
        tokens.push({ type: 'variable', value: word });
      }
      remaining = remaining.slice(word.length);
      matched = true;
      continue;
    }


    const operatorMatch = remaining.match(/^(==|!=|<=|>=|<|>|\+|-|\*|\/|%|=|:|\[|\]|\(|\)|,)/);
    if (operatorMatch) {
      tokens.push({ type: 'operator', value: operatorMatch[0] });
      remaining = remaining.slice(operatorMatch[0].length);
      matched = true;
      continue;
    }


    const spaceMatch = remaining.match(/^\s+/);
    if (spaceMatch) {
      tokens.push({ type: 'space', value: spaceMatch[0] });
      remaining = remaining.slice(spaceMatch[0].length);
      matched = true;
      continue;
    }


    if (!matched) {
      tokens.push({ type: 'default', value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
};

const getTokenColor = (type) => {
  switch (type) {
    case 'keyword':
      return 'text-purple-600 dark:text-purple-400';
    case 'function':
      return 'text-blue-600 dark:text-blue-400';
    case 'number':
      return 'text-amber-600 dark:text-amber-400';
    case 'string':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'operator':
      return 'text-rose-600 dark:text-rose-400';
    case 'comment':
      return 'text-zinc-400 dark:text-zinc-500 italic';
    case 'variable':
      return 'text-zinc-700 dark:text-zinc-300';
    default:
      return 'text-zinc-700 dark:text-zinc-300';
  }
};

const HighlightedLine = ({ line, isActive, isPast }) => {
  if (!line || line.trim() === '') {
    return <span>&nbsp;</span>;
  }

  const tokens = highlightSyntax(line);

  return (
    <span>
      {tokens.map((token, idx) => (
        <span
          key={idx}
          className={`${isActive ? 'text-amber-900 dark:text-amber-100' : isPast ? 'opacity-60' : ''} ${!isActive ? getTokenColor(token.type) : ''}`}
        >
          {token.value}
        </span>
      ))}
    </span>
  );
};

export default function CodePanel({ code, currentLine, done, title, description }) {
  return (
    <div className="font-mono text-sm">
      {(title || description) && (
        <div className="mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          {title && <h3 className="text-zinc-700 dark:text-zinc-300 font-semibold">{title}</h3>}
          {description && <p className="text-zinc-500 text-xs mt-1">{description}</p>}
        </div>
      )}

      <div className="space-y-0.5">
        {code.map((item, idx) => {
          const isActive = idx === currentLine && !done;
          const isPast = idx < currentLine || done;

          return (
            <div
              key={idx}
              className={`
                flex items-center rounded px-2 py-1 transition-all duration-200
                ${isActive ? 'bg-amber-100 dark:bg-amber-500/20 border-l-2 border-amber-500' : 'border-l-2 border-transparent'}
              `}
            >
              <span className={`w-6 text-right mr-4 text-xs ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
                {idx + 1}
              </span>
              <span style={{ paddingLeft: `${item.indent * 1.5}rem` }}>
                <HighlightedLine line={item.line} isActive={isActive} isPast={isPast} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}