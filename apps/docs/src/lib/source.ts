export type ParsedExample = {
  name: string;
  title: string;
  description?: string;
  code: string;
};

const EXPORT = /^export const (\w+)/;

const dedent = (code: string) => {
  const lines = code.split('\n');
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.length - line.trimStart().length),
  );
  return lines.map((line) => line.slice(indent)).join('\n');
};

/**
 * `export const Basic = () => (<Button />);` is how a demo has to be written to
 * render, but the useful thing to copy is the JSX inside. Unwrap that one shape
 * and leave anything with hooks or local state as a whole component.
 */
const unwrap = (code: string) => {
  const body = code.match(/^const \w+ = \(\) => \(\n([\s\S]*)\n\);$/);
  return body ? dedent(body[1]) : code;
};

/** Reads the JSDoc block sitting directly above `start`, if there is one. */
const commentAbove = (lines: string[], start: number) => {
  let end = start - 1;
  while (end >= 0 && !lines[end].trim()) end -= 1;
  if (end < 0 || lines[end].trim() !== '*/') return undefined;

  let open = end;
  while (open >= 0 && lines[open].trim() !== '/**') open -= 1;
  if (open < 0) return undefined;

  const body = lines
    .slice(open + 1, end)
    .map((line) => line.trim().replace(/^\*\s?/, ''))
    .join('\n')
    .trim();

  const [title, ...rest] = body.split('\n\n');
  return {
    open,
    title: title.replace(/\n/g, ' ').trim(),
    description: rest.join('\n\n').replace(/\n/g, ' ').trim() || undefined,
  };
};

/**
 * Turns a demo file's own source into the examples shown on its page, so the
 * code block can never drift from what is rendered next to it.
 */
export const parseExamples = (raw: string): ParsedExample[] => {
  const lines = raw.split('\n');
  const starts: { index: number; name: string }[] = [];

  lines.forEach((line, index) => {
    const match = line.match(EXPORT);
    if (match) starts.push({ index, name: match[1] });
  });

  return starts.flatMap(({ index, name }, position) => {
    if (name === 'meta') return [];

    const doc = commentAbove(lines, index);
    const next = starts[position + 1];
    const nextDoc = next ? commentAbove(lines, next.index) : undefined;
    const stop = next ? (nextDoc?.open ?? next.index) : lines.length;

    const code = unwrap(
      lines
        .slice(index, stop)
        .join('\n')
        .trim()
        .replace(/^export /, ''),
    );

    return [
      {
        name,
        title: doc?.title ?? name,
        description: doc?.description,
        code,
      },
    ];
  });
};

/** `PascalCase` → `pascal-case`, for anchor ids. */
export const slugify = (value: string) =>
  value
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z\d]+/g, '-')
    .replace(/(^-|-$)/g, '');
