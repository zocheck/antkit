import { useEffect, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';

import { Spinner } from '@antkit/react';

import { CodeBlock } from '../components/code-block';
import { Example } from '../components/example';
import { Prose } from '../components/prose';
import { PropsTable } from '../components/props-table';
import { Toc } from '../components/toc';
import { useT } from '../lib/i18n';
import { parseExamples, slugify } from '../lib/source';
import type { ParsedExample } from '../lib/source';
import type { DemoMeta, RegistryEntry } from '../lib/types';
import { link } from '../lib/router';

/**
 * Lazy on purpose. An eager glob would put every demo — TipTap included — in
 * the entry chunk, so opening `Button` would download the editor.
 */
const MODULES = import.meta.glob<Record<string, unknown>>('../demos/*.tsx');
const SOURCES = import.meta.glob<string>('../demos/*.tsx', {
  query: '?raw',
  import: 'default',
});

type Loaded = {
  meta: DemoMeta;
  demos: Record<string, ComponentType>;
  examples: ParsedExample[];
};

const load = async (slug: string): Promise<Loaded | null> => {
  const key = `../demos/${slug}.tsx`;
  if (!MODULES[key] || !SOURCES[key]) return null;

  const [module, source] = await Promise.all([MODULES[key](), SOURCES[key]()]);

  return {
    meta: module.meta as DemoMeta,
    demos: module as unknown as Record<string, ComponentType>,
    examples: parseExamples(source),
  };
};

const importLine = (meta: DemoMeta) =>
  [
    // A component living outside the barrel — the editor — has nothing to
    // import from it, and an empty `import { }` line is worse than none.
    ...(meta.imports.length
      ? [`import { ${meta.imports.join(', ')} } from '@antkit/react';`]
      : []),
    ...(meta.extraImports ?? []),
  ].join('\n');

export const ComponentPage = ({
  entry,
  anchor,
}: {
  entry: RegistryEntry;
  anchor?: string;
}) => {
  const t = useT();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [missing, setMissing] = useState(false);

  // `App` keys this component by slug, so a route change remounts it and the
  // initial state is already clean — no reset needed here.
  useEffect(() => {
    let current = true;

    load(entry.slug).then((result) => {
      if (!current) return;
      if (result) setLoaded(result);
      else setMissing(true);
    });

    return () => {
      current = false;
    };
  }, [entry.slug]);

  // Anchors live in the route (`/components/button/loading`), so scrolling is
  // ours to do — the browser only reacts to a bare `#id`.
  useEffect(() => {
    if (!loaded) return;
    if (!anchor) {
      globalThis.scrollTo({ top: 0 });
      return;
    }
    document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
  }, [loaded, anchor]);

  if (missing) {
    return (
      <Article entry={entry}>
        <p className="text-sm text-muted-foreground">
          <Prose
            text={t.page.missingDemo(`apps/docs/src/demos/${entry.slug}.tsx`)}
          />
        </p>
      </Article>
    );
  }

  if (!loaded) {
    return (
      <Article entry={entry}>
        <Spinner className="size-5 text-muted-foreground" />
      </Article>
    );
  }

  const { meta, demos, examples } = loaded;

  return (
    <div className="flex min-w-0 gap-10">
      <Article entry={entry}>
        <CodeBlock code={importLine(meta)} collapsible={false} wrap />

        <div className="grid gap-10">
          {examples.map((example) => {
            const Demo = demos[example.name];
            if (!Demo) return null;

            return (
              <Example
                key={example.name}
                id={slugify(example.name)}
                href={link(
                  `/components/${entry.slug}/${slugify(example.name)}`,
                )}
                title={example.title}
                description={example.description}
                code={example.code}
              >
                <Demo />
              </Example>
            );
          })}
        </div>

        {meta.api.length > 0 && (
          <div className="grid gap-6 border-t border-border pt-8">
            <h2 id="api" className="scroll-mt-24 text-lg font-medium">
              {t.page.api}
            </h2>
            {meta.api.map((table) => (
              <PropsTable key={table.title} table={table} />
            ))}
          </div>
        )}
      </Article>

      <Toc
        base={`/components/${entry.slug}/`}
        items={[
          ...examples.map((example) => ({
            id: slugify(example.name),
            title: example.title,
          })),
          ...(meta.api.length > 0 ? [{ id: 'api', title: t.page.api }] : []),
        ]}
      />
    </div>
  );
};

const Article = ({
  entry,
  children,
}: {
  entry: RegistryEntry;
  children: ReactNode;
}) => {
  const t = useT();

  return (
    <article className="grid min-w-0 flex-1 gap-8 pb-16">
      <header>
        <p className="text-sm text-muted-foreground">{t.groups[entry.group]}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {entry.title}
        </h1>
        <p className="mt-2 text-md text-muted-foreground">
          {t.components[entry.slug]}
        </p>
      </header>
      {children}
    </article>
  );
};
