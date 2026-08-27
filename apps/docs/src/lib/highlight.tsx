import type { ReactNode } from 'react';

/**
 * A ~40-line TSX highlighter instead of Shiki or Prism: the snippets here are
 * short, and pulling a grammar engine into a docs bundle to colour six token
 * kinds is not a trade worth making.
 *
 * Order is the grammar — comments and strings have to win before anything
 * inside them is mistaken for code.
 */
const RULES: [string, RegExp][] = [
  ['tok-comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
  ['tok-string', /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/y],
  ['tok-tag', /<\/?[A-Za-z][\w.]*|\/>/y],
  [
    'tok-keyword',
    /\b(?:const|let|var|export|import|from|return|function|if|else|new|await|async|type|interface|as|of|in|true|false|null|undefined)\b/y,
  ],
  ['tok-type', /\b[A-Z][A-Za-z\d]*\b/y],
  ['tok-attr', /\b[a-zA-Z][\w-]*(?==)/y],
  ['tok-number', /\b\d[\d_]*(?:\.\d+)?\b/y],
  ['tok-punct', /[{}]/y],
];

export const highlight = (code: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let plain = '';
  let index = 0;

  const flush = () => {
    if (!plain) return;
    nodes.push(plain);
    plain = '';
  };

  while (index < code.length) {
    const hit = RULES.reduce<[string, string] | undefined>(
      (found, [name, pattern]) => {
        if (found) return found;
        pattern.lastIndex = index;
        const match = pattern.exec(code);
        return match ? [name, match[0]] : undefined;
      },
      undefined,
    );

    if (!hit) {
      plain += code[index];
      index += 1;
      continue;
    }

    flush();
    nodes.push(
      <span key={index} className={hit[0]}>
        {hit[1]}
      </span>,
    );
    index += hit[1].length;
  }

  flush();
  return nodes;
};
