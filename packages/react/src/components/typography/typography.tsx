import { useState } from 'react';
import type { ComponentProps, ElementType, ReactNode } from 'react';

import { cn } from '../../utils';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';

export type TypographyType =
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | undefined;

export type CopyableConfig = {
  /** Defaults to the rendered children when they are a plain string. */
  text?: string;
  onCopy?: () => void;
};

export type EllipsisConfig = {
  /** Clamp to this many lines. `1` uses a real single-line truncate. */
  rows?: number;
  /** Adds a "show more / show less" toggle under the text. */
  expandable?: boolean;
};

const TYPE_CLASS: Record<Exclude<TypographyType, undefined>, string> = {
  secondary: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  danger: 'text-destructive',
};

type BaseProps = {
  children?: ReactNode;
  type?: TypographyType;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  /** Strikethrough. Named for the effect, not for the `<del>` element. */
  deleted?: boolean;
  code?: boolean;
  mark?: boolean;
  disabled?: boolean;
  /** `true` clamps to one line; pass an object for more. */
  ellipsis?: boolean | EllipsisConfig;
  /** `true` copies the text as-is; pass an object to override what's copied. */
  copyable?: boolean | CopyableConfig;
  className?: string;
};

/**
 * Shared shell for Text / Paragraph / Title: it owns the modifier classes, the
 * clamping and the copy button so the three only differ by element and size.
 */
const useTypography = ({
  children,
  type,
  strong,
  italic,
  underline,
  deleted,
  code,
  mark,
  disabled,
  ellipsis,
  copyable,
}: BaseProps) => {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const clamp = ellipsis === true ? { rows: 1 } : ellipsis || null;
  const rows = clamp?.rows ?? 1;

  const copy = copyable === true ? {} : copyable || null;
  // Only a plain string can be copied without a `text` override — anything
  // else would stringify to "[object Object]".
  const copyText = copy?.text ?? (typeof children === 'string' ? children : '');

  const onCopy = async () => {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      copy?.onCopy?.();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access is denied outside a secure context or without a user
      // gesture; there is nothing useful to tell the user, so stay quiet.
    }
  };

  const modifiers = cn(
    type && TYPE_CLASS[type],
    strong && 'font-semibold',
    italic && 'italic',
    underline && 'underline underline-offset-2',
    deleted && 'line-through',
    disabled && 'cursor-not-allowed text-muted-foreground opacity-60',
    code &&
      'rounded-sm border bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground',
    mark &&
      'bg-amber-100 text-amber-900 dark:bg-amber-500/25 dark:text-amber-100',
  );

  const clampClass =
    clamp && !expanded
      ? rows === 1
        ? 'block truncate'
        : 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]'
      : undefined;

  const clampStyle =
    clamp && !expanded && rows > 1 ? { WebkitLineClamp: rows } : undefined;

  const toggle =
    clamp?.expandable === true ? (
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          'ml-1 cursor-pointer align-baseline text-xs text-primary hover:underline',
          'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        {expanded
          ? (locale.common?.collapse ?? 'Show less')
          : (locale.common?.expand ?? 'Show more')}
      </button>
    ) : null;

  const copyButton = copy ? (
    <button
      type="button"
      onClick={onCopy}
      aria-label={
        copied
          ? (locale.common?.copied ?? 'Copied')
          : (locale.common?.copy ?? 'Copy')
      }
      className={cn(
        'ml-1 inline-flex cursor-pointer align-middle text-muted-foreground transition-colors hover:text-foreground',
        'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-green-600 dark:text-green-400" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  ) : null;

  return { modifiers, clampClass, clampStyle, toggle, copyButton };
};

export type TextProps = BaseProps &
  Omit<ComponentProps<'span'>, keyof BaseProps | 'color'>;

/**
 * Inline text with modifiers.
 *
 * ```tsx
 * <Text type="secondary">Updated 5 minutes ago</Text>
 * <Text copyable>HV-2026-0042</Text>
 * <Text ellipsis>{row.note}</Text>
 * ```
 *
 * `ellipsis` and `copyable` are the two that earn their keep in a table cell —
 * a long note that must not break the row height, and an id worth copying.
 */
export const Text = ({
  children,
  type,
  strong,
  italic,
  underline,
  deleted,
  code,
  mark,
  disabled,
  ellipsis,
  copyable,
  className,
  ...props
}: TextProps) => {
  const { modifiers, clampClass, clampStyle, toggle, copyButton } =
    useTypography({
      children,
      type,
      strong,
      italic,
      underline,
      deleted,
      code,
      mark,
      disabled,
      ellipsis,
      copyable,
    });

  return (
    <span
      data-slot="text"
      className={cn('min-w-0 text-sm', modifiers, clampClass, className)}
      style={clampStyle}
      {...props}
    >
      {children}
      {toggle}
      {copyButton}
    </span>
  );
};

export type ParagraphProps = BaseProps &
  Omit<ComponentProps<'p'>, keyof BaseProps | 'color'>;

/** Block-level text. Same modifiers as `Text`, with paragraph spacing. */
export const Paragraph = ({
  children,
  type,
  strong,
  italic,
  underline,
  deleted,
  code,
  mark,
  disabled,
  ellipsis,
  copyable,
  className,
  ...props
}: ParagraphProps) => {
  const { modifiers, clampClass, clampStyle, toggle, copyButton } =
    useTypography({
      children,
      type,
      strong,
      italic,
      underline,
      deleted,
      code,
      mark,
      disabled,
      ellipsis,
      copyable,
    });

  return (
    <p
      data-slot="paragraph"
      className={cn(
        'min-w-0 text-sm leading-relaxed not-last:mb-3',
        modifiers,
        clampClass,
        className,
      )}
      style={clampStyle}
      {...props}
    >
      {children}
      {toggle}
      {copyButton}
    </p>
  );
};

const HEADING = {
  1: 'text-2xl font-semibold tracking-tight',
  2: 'text-xl font-semibold tracking-tight',
  3: 'text-lg font-semibold',
  4: 'text-base font-semibold',
  5: 'text-sm font-semibold',
} as const;

export type TitleLevel = 1 | 2 | 3 | 4 | 5;

export type TitleProps = BaseProps &
  Omit<ComponentProps<'h1'>, keyof BaseProps | 'color'> & {
    /** Maps to `h1`–`h5`. Pick it for document structure, not for size. */
    level?: TitleLevel;
  };

/**
 * A heading.
 *
 * ```tsx
 * <Title level={3}>Students</Title>
 * ```
 *
 * The level sets the element, so choose it by where the heading sits in the
 * page outline and adjust the look with `className` if the default is wrong.
 */
export const Title = ({
  level = 1,
  children,
  type,
  strong,
  italic,
  underline,
  deleted,
  code,
  mark,
  disabled,
  ellipsis,
  copyable,
  className,
  ...props
}: TitleProps) => {
  const { modifiers, clampClass, clampStyle, toggle, copyButton } =
    useTypography({
      children,
      type,
      strong,
      italic,
      underline,
      deleted,
      code,
      mark,
      disabled,
      ellipsis,
      copyable,
    });

  const Heading = `h${level}` as ElementType;

  return (
    <Heading
      data-slot="title"
      className={cn(
        'min-w-0',
        HEADING[level],
        modifiers,
        clampClass,
        className,
      )}
      style={clampStyle}
      {...props}
    >
      {children}
      {toggle}
      {copyButton}
    </Heading>
  );
};

/**
 * Namespaced access. `Text` and `Title` are common enough
 * words that importing them bare can collide in an app file — reach for
 * `Typography.Text` there.
 */
export const Typography = { Text, Title, Paragraph };
