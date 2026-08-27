import { useEffect, useState } from 'react';

import {
  Button,
  MessageProvider,
  Sheet,
  SheetContent,
  SheetTrigger,
  Toaster,
  TooltipProvider,
  ConfigProvider,
} from '@antkit/react';
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from 'lucide-react';

import { Brand } from './components/brand';
import { Footer } from './components/footer';
import { viVN } from '@antkit/react/locale/vi-VN';

import { LanguageSwitch } from './components/language-switch';
import { Nav } from './components/nav';
import { SearchDialog, useSearchDialog } from './components/search-dialog';
import { LocaleProvider, useLocale as useDocsLocale, useT } from './lib/i18n';
import { link, useLinkRouting, useRoute } from './lib/router';
import { ComponentPage } from './pages/component-page';
import { Guide } from './pages/guide';
import { Home } from './pages/home';
import { BY_SLUG, GUIDES } from './registry';
import type { RegistryEntry } from './lib/types';

const GUIDE_PATHS: readonly string[] = GUIDES;

/**
 * The kit's own strings, picked by the same switch that drives the site's
 * chrome. English needs no entry — it is what every component falls back to.
 */
const KIT_LOCALES = { en: undefined, vi: viVN };

const useTheme = () => {
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('antkit-theme') === 'dark' ||
      (!localStorage.getItem('antkit-theme') &&
        matchMedia('(prefers-color-scheme: dark)').matches),
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('antkit-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark] as const;
};

type Page =
  | { kind: 'home' }
  | { kind: 'component'; entry: RegistryEntry; anchor?: string }
  | { kind: 'guide'; slug: string; anchor?: string };

/**
 * `/components/<slug>/<anchor>` is a component page, a known guide slug is a
 * guide, and anything else — `/` included — is the landing page, so an unknown
 * route lands somewhere useful rather than on a 404.
 */
const usePage = (): Page => {
  const path = useRoute();
  const [section, slug, anchor] = path.split('/');

  if (section === 'components') {
    const entry = BY_SLUG.get(slug);
    if (entry) return { kind: 'component', entry, anchor };
  }

  return GUIDE_PATHS.includes(section)
    ? { kind: 'guide', slug: section, anchor: slug }
    : { kind: 'home' };
};

/** The nav highlights component slugs and guide slugs from the same prop. */
const currentSlug = (page: Page) => {
  if (page.kind === 'component') return page.entry.slug;
  return page.kind === 'guide' ? page.slug : undefined;
};

const GITHUB = 'https://github.com/zocheck/antkit';

/** lucide dropped its brand icons in v1, so the mark travels with the link. */
const GithubMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-current">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

const TopLink = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) => (
  <a
    href={href}
    className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
      active
        ? 'bg-accent font-medium text-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`}
  >
    {label}
  </a>
);

/** The two top-level destinations, mirroring the sidebar's two halves. */
const TopLinks = ({ page }: { page: Page }) => {
  const t = useT();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <TopLink
        href={link('/introduction')}
        label={t.chrome.docs}
        active={page.kind === 'guide'}
      />
      <TopLink
        href={link('/components/button')}
        label={t.chrome.components}
        active={page.kind === 'component'}
      />
    </nav>
  );
};

const Shell = () => {
  const t = useT();
  const [dark, setDark] = useTheme();
  const [menu, setMenu] = useState(false);
  const search = useSearchDialog();
  const page = usePage();

  useLinkRouting();

  const { code } = useDocsLocale();

  return (
    <ConfigProvider locale={KIT_LOCALES[code]}>
      <TooltipProvider>
        <div className="min-h-dvh bg-background text-foreground">
          <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-full max-w-[100rem] items-center gap-2 px-4 lg:px-6">
              <Sheet open={menu} onOpenChange={setMenu}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t.chrome.openMenu}
                    className="lg:hidden"
                  >
                    <MenuIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto p-4">
                  <div className="grid gap-1 pb-4">
                    <Brand />
                    <p className="text-xs text-muted-foreground">
                      {t.chrome.tagline}
                    </p>
                  </div>
                  <Nav
                    current={currentSlug(page)}
                    onNavigate={() => setMenu(false)}
                  />
                </SheetContent>
              </Sheet>

              <Brand className="mr-2" />

              <TopLinks page={page} />

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => search.setOpen(true)}
                  aria-label={t.chrome.searchTitle}
                  className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/60 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:w-56 sm:pr-2"
                >
                  <SearchIcon className="size-4 shrink-0" />
                  <span className="hidden truncate sm:block">
                    {t.chrome.search}
                  </span>
                  <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 font-sans text-[10px] leading-none sm:block">
                    ⌘K
                  </kbd>
                </button>

                <LanguageSwitch />

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={dark ? t.chrome.toLight : t.chrome.toDark}
                  onClick={() => setDark(!dark)}
                >
                  {dark ? <SunIcon /> : <MoonIcon />}
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.chrome.github}
                >
                  <a href={GITHUB} target="_blank" rel="noreferrer">
                    <GithubMark />
                  </a>
                </Button>
              </div>
            </div>
          </header>

          {/* The landing page runs full-bleed: no rail, no reading column. */}
          {page.kind === 'home' ? (
            <main>
              <Home />
              <Footer github={GITHUB} />
            </main>
          ) : (
            <div className="mx-auto flex max-w-[100rem] gap-8 px-4 lg:px-6">
              <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto py-6 pr-2 lg:block">
                <Nav current={currentSlug(page)} />
              </aside>

              <main className="min-w-0 flex-1 py-8">
                {page.kind === 'component' ? (
                  <ComponentPage
                    key={page.entry.slug}
                    entry={page.entry}
                    anchor={page.anchor}
                  />
                ) : (
                  <Guide
                    key={page.slug}
                    slug={page.slug}
                    anchor={page.anchor}
                  />
                )}
              </main>
            </div>
          )}
        </div>

        <SearchDialog open={search.open} onOpenChange={search.setOpen} />
        <Toaster />
        <MessageProvider />
      </TooltipProvider>
    </ConfigProvider>
  );
};

export const App = () => (
  <LocaleProvider>
    <Shell />
  </LocaleProvider>
);
