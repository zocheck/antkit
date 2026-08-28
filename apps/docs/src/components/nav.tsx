import { useState } from 'react';

import { ChevronRightIcon } from 'lucide-react';

import { GROUP_ICONS } from '../lib/group-icons';
import { useT } from '../lib/i18n';
import { GROUPS, GUIDES, REGISTRY } from '../registry';
import type { GroupId } from '../lib/types';
import { link } from '../lib/router';

type Item = { slug: string; label: string; href: string };

const Link = ({
  item,
  active,
  onNavigate,
}: {
  item: Item;
  active: boolean;
  onNavigate?: () => void;
}) => (
  <a
    href={item.href}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    className={`block truncate rounded-lg px-3 py-1.5 transition-colors ${
      active
        ? 'bg-primary font-medium text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`}
  >
    {item.label}
  </a>
);

const Section = ({
  id,
  label,
  items,
  current,
  onNavigate,
}: {
  id: GroupId | 'guides';
  label: string;
  items: Item[];
  current?: string;
  onNavigate?: () => void;
}) => {
  const Icon = GROUP_ICONS[id];
  const [open, setOpen] = useState(true);
  const [shown, setShown] = useState(current);

  // A collapsed group would hide the page you just landed on, so navigating
  // into one reopens it — while leaving a deliberate collapse alone otherwise.
  if (shown !== current) {
    setShown(current);
    if (items.some((item) => item.slug === current)) setOpen(true);
  }

  return (
    <div className="grid gap-0.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
          <Icon className="size-3.5" />
        </span>
        <span className="truncate text-[13px] font-semibold text-foreground">
          {label}
        </span>
        <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
          {items.length}
        </span>
        <ChevronRightIcon
          className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>

      {open && (
        <div className="ml-[0.6875rem] grid gap-0.5 border-l border-border pl-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              item={item}
              active={item.slug === current}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * The sidebar menu: guides first, then one collapsible section per component
 * group. Searching lives in the header's ⌘K palette rather than a second box
 * here — see `components/search-dialog.tsx`.
 */
export const Nav = ({
  current,
  onNavigate,
}: {
  current?: string;
  onNavigate?: () => void;
}) => {
  const t = useT();

  return (
    <nav className="grid gap-3 text-sm">
      <Section
        id="guides"
        label={t.chrome.gettingStarted}
        items={GUIDES.map((slug) => ({
          slug,
          label: t.guides[slug] ?? slug,
          href: link(`/${slug}`),
        }))}
        current={current}
        onNavigate={onNavigate}
      />

      {GROUPS.map((group) => (
        <Section
          key={group}
          id={group}
          label={t.groups[group]}
          items={REGISTRY.filter((entry) => entry.group === group).map(
            (entry) => ({
              slug: entry.slug,
              label: entry.title,
              href: link(`/components/${entry.slug}`),
            }),
          )}
          current={current}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
};
