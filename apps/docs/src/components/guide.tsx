import type { ReactNode } from 'react';

/**
 * The prose primitives the guide pages are written with. Deliberately four
 * small components rather than a markdown pipeline: the guides embed live
 * `CodeBlock`s and links into the component pages, which markdown would only
 * get in the way of.
 */

export const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="grid scroll-mt-24 gap-3">
    <h2 className="text-lg font-medium">{title}</h2>
    {children}
  </section>
);

export const P = ({ children }: { children: ReactNode }) => (
  <p className="max-w-2xl text-sm/6 text-muted-foreground">{children}</p>
);

export const C = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
    {children}
  </code>
);

export const A = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    {...(href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}
    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
  >
    {children}
  </a>
);

export type GuideRow = { key: string; cells: [ReactNode, ReactNode] };

/** Head cells and body rows as nodes — the guides only ever need two columns. */
export const Table = ({
  head,
  rows,
}: {
  head: [ReactNode, ReactNode];
  rows: GuideRow[];
}) => (
  <div className="max-w-2xl overflow-x-auto rounded-xl border border-border">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-muted/60 text-left">
          <th className="px-4 py-2.5 font-medium">{head[0]}</th>
          <th className="px-4 py-2.5 font-medium">{head[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key} className="border-t border-border align-top">
            <td className="px-4 py-2.5">{row.cells[0]}</td>
            <td className="px-4 py-2.5 text-muted-foreground">
              {row.cells[1]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
