import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@antkit/react';
import { CornerDownLeftIcon, SearchIcon } from 'lucide-react';

import { useT } from '../lib/i18n';
import { navigate } from '../lib/router';
import { searchDocs } from '../lib/search';
import type { SearchHit } from '../lib/search';

const Kbd = ({ children }: { children: string }) => (
  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] leading-none text-muted-foreground">
    {children}
  </kbd>
);

/**
 * Opens on ⌘K / Ctrl+K anywhere on the site. Returns the props the header's
 * search button needs, so the button and the shortcut stay one piece of state.
 */
export const useSearchDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'k' ||
        !(event.metaKey || event.ctrlKey)
      ) {
        return;
      }

      event.preventDefault();
      setOpen((wasOpen) => !wasOpen);
    };

    addEventListener('keydown', onKeyDown);
    return () => removeEventListener('keydown', onKeyDown);
  }, []);

  return { open, setOpen };
};

export const SearchDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const t = useT();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => searchDocs(query, t), [query, t]);
  const active = hits[Math.min(cursor, hits.length - 1)];

  useEffect(() => {
    list.current
      ?.querySelector(`[data-index="${cursor}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  // Reopening on a stale query would show results for something the user has
  // long forgotten typing.
  const change = (next: boolean) => {
    if (!next) {
      setQuery('');
      setCursor(0);
    }

    onOpenChange(next);
  };

  const go = (hit: SearchHit) => {
    navigate(hit.href);
    change(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setCursor((at) => (at + step + hits.length) % Math.max(hits.length, 1));
    }

    if (event.key === 'Enter' && active) {
      event.preventDefault();
      go(active);
    }
  };

  const label = (hit: SearchHit) =>
    hit.section === 'guide' ? t.chrome.gettingStarted : t.groups[hit.section];

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent
        showCloseButton={false}
        className="top-[12vh] max-w-[min(36rem,calc(100vw-2rem))] gap-0 overflow-hidden overflow-y-hidden p-0"
      >
        <DialogTitle className="sr-only">{t.chrome.searchTitle}</DialogTitle>
        <DialogDescription className="sr-only">
          {t.chrome.searchDescription}
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
              if (list.current) list.current.scrollTop = 0;
            }}
            onKeyDown={onKeyDown}
            placeholder={t.chrome.search}
            aria-label={t.chrome.searchTitle}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Kbd>esc</Kbd>
        </div>

        <div ref={list} className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          {hits.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t.chrome.noResults}
            </p>
          )}

          {hits.map((hit, index) => (
            <button
              key={`${hit.section}-${hit.slug}`}
              type="button"
              data-index={index}
              data-active={hit === active}
              onMouseMove={() => setCursor(index)}
              onClick={() => go(hit)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left data-[active=true]:bg-accent"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {hit.title}
                </span>
                {hit.hint && (
                  <span className="block truncate text-xs text-muted-foreground">
                    {hit.hint}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {label(hit)}
              </span>
              {hit === active && (
                <CornerDownLeftIcon className="size-3.5 shrink-0 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            {t.chrome.hintNavigate}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            {t.chrome.hintOpen}
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            {t.chrome.hintClose}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
