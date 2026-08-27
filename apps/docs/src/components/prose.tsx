import type { ReactNode } from 'react';

/**
 * The one bit of markdown worth supporting in a JSDoc line: `backticks` around
 * a prop or a value. Anything more and the demo comments would need a parser.
 */
export const Prose = ({ text }: { text: string }) => {
  // Odd entries are what sat between the backticks — how `String.split` with a
  // capturing group interleaves matches with the text around them. The key is
  // the offset in the original string, which is stable and unique per part.
  const parts = text.split(/`([^`]+)`/g);

  const nodes = parts.map((part, index): ReactNode => {
    if (index % 2 === 0) return part;

    return (
      <code
        key={parts.slice(0, index).join('').length}
        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
      >
        {part}
      </code>
    );
  });

  return <>{nodes}</>;
};
