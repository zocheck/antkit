import type { ComponentType } from 'react';

/** One row of an API table. `type` is rendered as code, so keep it copy-pastable. */
export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

/** Components with parts (Card, Timeline, Tabs…) get one table per part. */
export type ApiTable = {
  title: string;
  description?: string;
  props: PropRow[];
};

export type DemoMeta = {
  /** Names to show in the page's import line. */
  imports: string[];
  /** Extra import lines, for types or icons a demo needs. */
  extraImports?: string[];
  api: ApiTable[];
};

/**
 * A demo module: one file per component, exporting `meta` plus one arrow
 * component per example. Every other export is treated as an example, in file
 * order, with its JSDoc block supplying the title and description.
 */
export type DemoModule = {
  meta: DemoMeta;
} & Record<string, ComponentType | DemoMeta>;

/** Sidebar sections, in the order they are shown. */
export const GROUPS = [
  'general',
  'layout',
  'navigation',
  'dataEntry',
  'dataDisplay',
  'feedback',
] as const;

export type GroupId = (typeof GROUPS)[number];

export type RegistryEntry = {
  /** URL segment, matching the demo file name and its key in `components`. */
  slug: string;
  /** Heading on the page and label in the nav — a component name, never translated. */
  title: string;
  group: GroupId;
};

/** A landing-page block: a heading and the paragraph under it. */
export type HomeSection = {
  title: string;
  body: string;
};

/** Everything written on the landing page, in one place per language. */
export type HomeCopy = {
  /** Goes in the copyable chip above the headline. Never translated. */
  installCommand: string;
  /** Two lines: the first is set bold, the second lighter. */
  headlineLead: string;
  headlineRest: string;
  /** Takes the number of components, counted off the registry. */
  subtitle: (components: number) => string;
  ctaStart: string;
  ctaBrowse: string;
  /** The one-line reassurance under the buttons. */
  trust: string;
  /** Labels only — the numbers beside them are counted, not written. */
  stats: {
    components: string;
    packages: string;
    buildSteps: string;
    licence: string;
  };
  api: HomeSection;
  radix: HomeSection;
  tokens: HomeSection;
  agents: HomeSection;
  /** The title counts both numbers off the registry rather than spelling them. */
  gallery: { title: (groups: number, components: number) => string } & Omit<
    HomeSection,
    'title'
  > & { cta: string };
  install: HomeSection & { cta: string };
  footer: {
    docs: string;
    components: string;
    source: string;
    licence: string;
  };
};

/** One entry in a page's "on this page" list. */
export type TocItem = {
  id: string;
  title: string;
};

export type GuideMeta = {
  title: string;
  description: string;
  toc: TocItem[];
};

/** A guide module: `content/<locale>/<slug>.tsx`, one per language. */
export type GuideModule = {
  meta: GuideMeta;
  Content: ComponentType;
};

/** Languages the site knows how to be. Only registered ones are selectable. */
export type Locale = 'en' | 'vi';

/**
 * Everything on the site that is language, rather than code. A new language is
 * one file implementing this type — see `lib/i18n.tsx`.
 */
export type Dictionary = {
  /** Label in the language switcher, written in the language itself. */
  name: string;
  /** Goes on `<html lang>`, so screen readers pick the right voice. */
  lang: string;
  chrome: {
    openMenu: string;
    toLight: string;
    toDark: string;
    language: string;
    search: string;
    noResults: string;
    gettingStarted: string;
    /** One line under the wordmark, in the mobile menu. */
    tagline: string;
    docs: string;
    components: string;
    github: string;
    /** Title of the ⌘K dialog, read out to screen readers. */
    searchTitle: string;
    searchDescription: string;
    /** The three key hints along the bottom of the ⌘K dialog. */
    hintNavigate: string;
    hintOpen: string;
    hintClose: string;
  };
  page: {
    onThisPage: string;
    api: string;
    prop: string;
    type: string;
    default: string;
    description: string;
    /** Takes the section title, e.g. "Link to Loading". */
    linkTo: (title: string) => string;
    /** Takes the demo path that is missing. */
    missingDemo: (path: string) => string;
    demoBroken: string;
    /** Takes the number of hidden lines. */
    showAll: (lines: number) => string;
    copy: string;
    copied: string;
  };
  home: HomeCopy;
  /** The handful of strings the kit's components ask their host to translate. */
  groups: Record<GroupId, string>;
  /** Nav label per guide, keyed by guide slug. */
  guides: Record<string, string>;
  /** One line per component, keyed by registry slug. */
  components: Record<string, string>;
};
