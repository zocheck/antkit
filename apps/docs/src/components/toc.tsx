import { useT } from '../lib/i18n';
import type { TocItem } from '../lib/types';

/**
 * The "on this page" rail. It takes plain items and a route prefix rather than
 * reading the DOM, so a component page and a guide page can both feed it.
 */
export const Toc = ({ base, items }: { base: string; items: TocItem[] }) => {
  const t = useT();

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20 hidden h-fit w-52 shrink-0 xl:block">
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {t.page.onThisPage}
      </p>
      <ul className="grid gap-1.5 border-l border-border text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`${base}${item.id}`}
              className="-ml-px block border-l border-transparent pl-3 text-muted-foreground hover:border-primary hover:text-foreground"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
