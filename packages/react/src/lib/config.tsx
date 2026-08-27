import { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import type { Locale } from './locale';

/**
 * Which component ran out of rows, so one renderer can answer a table body and
 * a select's dropdown differently — they are very different amounts of space.
 */
export type EmptySlot =
  | 'auto-complete'
  | 'command-menu'
  | 'select'
  | 'table'
  | 'transfer'
  | 'tree-select';

export type RenderEmpty = (slot: EmptySlot) => ReactNode;

/**
 * The semantic tokens `@antkit/styles` declares, named without their `--`.
 * Anything else is passed through as long as it starts with `--`.
 */
export type ThemeToken =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'radius'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring';

export type ThemeTokens = Partial<Record<ThemeToken, string>> & {
  [custom: `--${string}`]: string;
};

export type Theme = {
  /**
   * Which of the two palettes in `@antkit/styles` this subtree runs on. Left
   * out, it inherits whatever the nearest `dark`/`light` ancestor set — usually
   * the class the app toggles on `<html>`.
   */
  mode?: 'light' | 'dark';
  /** Overrides for this subtree, written as CSS custom properties. */
  tokens?: ThemeTokens;
};

export type Config = {
  locale: Locale;
  renderEmpty?: RenderEmpty;
};

export type ConfigProviderProps = {
  /**
   * The strings the kit renders on its own — only the ones you want changed.
   * Anything left out stays English.
   */
  locale?: Locale;
  /**
   * Replaces the default `Empty` wherever a component runs out of rows. Return
   * nothing for a slot to leave that one on the default.
   */
  renderEmpty?: RenderEmpty;
  /** Palette and token overrides for everything under this provider. */
  theme?: Theme;
  children: ReactNode;
};

const ConfigContext = createContext<Config>({ locale: {} });

/**
 * One level of merging: a group the caller names replaces that group's keys,
 * a group they leave out is inherited whole. Nothing here nests deep enough
 * for a recursive merge to pay for itself.
 */
const mergeLocale = (base: Locale, locale?: Locale): Locale => {
  if (!locale) return base;

  const merged: Locale = { ...base, ...locale };

  for (const key of Object.keys(locale) as (keyof Locale)[]) {
    const group = locale[key];
    if (group && typeof group === 'object') {
      merged[key] = { ...(base[key] as object), ...group } as never;
    }
  }

  return merged;
};

/** `{ primary: '#e11d48' }` → `{ '--primary': '#e11d48' }`. */
const toCustomProperties = (tokens: ThemeTokens): CSSProperties =>
  Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [
      name.startsWith('--') ? name : `--${name}`,
      value,
    ]),
  ) as CSSProperties;

/**
 * Everything the kit has to be told once: the strings it renders on its own,
 * what an empty list looks like, and which palette a subtree runs on. Wrap the
 * app near the root, and nest it wherever one branch has to differ.
 *
 * ```tsx
 * import { viVN } from '@antkit/react/locale/vi-VN';
 *
 * <ConfigProvider
 *   locale={viVN}
 *   renderEmpty={(slot) => <Empty size={slot === 'table' ? 'default' : 'sm'} />}
 *   theme={{ mode: 'dark', tokens: { primary: '#e11d48', radius: '8px' } }}
 * >
 *   {children}
 * </ConfigProvider>
 * ```
 *
 * Everything is English until you say otherwise, and a prop always beats the
 * locale — `<DatePicker clearLabel="…" />` wins over `datePicker.clearDate`,
 * so one-off wording needs no locale of its own.
 *
 * Still not a token system: `theme` writes CSS custom properties onto one
 * wrapper and nothing else happens at runtime. Change `@antkit/styles` when
 * the whole product changes colour — this is for the subtree that has to
 * differ, a tenant's brand or a preview pane. A nested provider inherits what
 * it does not set, so re-theming a branch need not restate the locale.
 *
 * `theme` cannot reach portalled content. `Tooltip`, `Popover`, `DropdownMenu`,
 * `Modal`, `Sheet`, `Image`, `MessageProvider` and `NotificationProvider`
 * render into `document.body`, which is outside the wrapper the tokens sit on,
 * so they keep the page's palette. Put the tokens on `<html>` or `<body>`
 * instead when a popup has to match.
 */
export const ConfigProvider = ({
  locale,
  renderEmpty,
  theme,
  children,
}: ConfigProviderProps) => {
  const parent = useContext(ConfigContext);

  const value = useMemo(
    () => ({
      // Merged over the parent's, so a nested provider that changes two
      // words keeps the language the branch above it set.
      locale: mergeLocale(parent.locale, locale),
      renderEmpty: renderEmpty ?? parent.renderEmpty,
    }),
    [locale, renderEmpty, parent],
  );

  // `display: contents` so the wrapper carries the tokens without becoming a
  // box — custom properties still inherit through it, but a grid or flex
  // parent above still lays out `children` as its own.
  const scoped = theme ? (
    <div
      data-slot="config-theme"
      className={theme.mode}
      style={{
        display: 'contents',
        ...(theme.tokens ? toCustomProperties(theme.tokens) : null),
      }}
    >
      {children}
    </div>
  ) : (
    children
  );

  return <ConfigContext value={value}>{scoped}</ConfigContext>;
};

export const useConfig = () => useContext(ConfigContext);

/** The active locale, already merged over the English defaults. */
export const useLocale = () => useContext(ConfigContext).locale;

export type { Locale };
