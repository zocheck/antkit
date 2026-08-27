import { useEffect, useState } from 'react';

import { Spinner } from '@antkit/react';

import { Toc } from '../components/toc';
import { useLocale } from '../lib/i18n';
import type { LocaleCode } from '../lib/i18n';
import type { GuideModule } from '../lib/types';

/**
 * One module per language per page. Lazy like the demos: a guide pulls in the
 * registry and the code blocks, and the language nobody switched to should
 * not be in the entry chunk.
 */
const MODULES = import.meta.glob<GuideModule>('../content/*/*.tsx');

/** A page that has not been translated yet falls back to English. */
const load = (code: LocaleCode, slug: string) =>
  MODULES[`../content/${code}/${slug}.tsx`] ??
  MODULES[`../content/en/${slug}.tsx`];

export const Guide = ({ slug, anchor }: { slug: string; anchor?: string }) => {
  const { code } = useLocale();
  // Keyed by language and page, so switching either shows a spinner rather
  // than the previous page's prose — without resetting state inside an effect.
  const key = `${code}/${slug}`;
  const [cached, setCached] = useState<{
    key: string;
    module: GuideModule;
  } | null>(null);

  useEffect(() => {
    let current = true;

    load(code, slug)?.().then((module) => {
      if (current) setCached({ key: `${code}/${slug}`, module });
    });

    return () => {
      current = false;
    };
  }, [code, slug]);

  const loaded = cached?.key === key ? cached.module : null;

  // Anchors live in the route (`/installation/providers`), so scrolling is
  // ours to do — the browser only reacts to a bare `#id`.
  useEffect(() => {
    if (!loaded) return;
    if (!anchor) {
      globalThis.scrollTo({ top: 0 });
      return;
    }
    document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
  }, [loaded, anchor]);

  if (!loaded) return <Spinner className="size-5 text-muted-foreground" />;

  const { meta, Content } = loaded;

  return (
    <div className="flex min-w-0 gap-10">
      <article className="grid min-w-0 max-w-3xl flex-1 gap-10 pb-16">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            {meta.title}
          </h1>
          <p className="mt-3 text-md text-muted-foreground">
            {meta.description}
          </p>
        </header>

        <Content />
      </article>

      <Toc base={`/${slug}/`} items={meta.toc} />
    </div>
  );
};
