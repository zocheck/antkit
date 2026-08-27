import { GUIDES, REGISTRY } from '../registry';
import type { Dictionary, GroupId } from './types';

/** Ignores case and Vietnamese diacritics, so "bo cuc" finds "Bố cục". */
export const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();

export type SearchHit = {
  /** Which list the hit is filed under in the results. */
  section: 'guide' | GroupId;
  slug: string;
  title: string;
  hint: string;
  href: string;
};

/**
 * Guides first, then components in registry order — a search for "form" should
 * land on the Form page before the pages that merely mention forms.
 */
const index = (t: Dictionary): SearchHit[] => [
  ...GUIDES.map((slug) => ({
    section: 'guide' as const,
    slug,
    title: t.guides[slug] ?? slug,
    hint: t.chrome.gettingStarted,
    href: `/${slug}`,
  })),
  ...REGISTRY.map((entry) => ({
    section: entry.group,
    slug: entry.slug,
    title: entry.title,
    hint: t.components[entry.slug] ?? '',
    href: `/components/${entry.slug}`,
  })),
];

/** An empty query returns everything, which is what the palette opens on. */
export const searchDocs = (query: string, t: Dictionary): SearchHit[] => {
  const needle = fold(query.trim());
  const hits = index(t);
  if (!needle) return hits;

  return hits.filter((hit) =>
    fold(`${hit.title} ${hit.slug} ${hit.hint}`).includes(needle),
  );
};
