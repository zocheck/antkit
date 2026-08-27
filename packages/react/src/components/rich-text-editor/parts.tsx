import { cloneElement, createContext, useContext, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '../../utils';
import { useLocale } from '../../lib/config';
import type { Locale } from '../../lib/config';
import type { Editor } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronDownIcon,
  LinkIcon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { Tooltip, TooltipProvider } from '../tooltip';

/** Whether the toolbar has been reached, and its tooltips are worth mounting. */
const ToolbarTooltipsContext = createContext(false);

export type ToolbarProps = {
  children: ReactNode;
};

/**
 * The row the buttons sit in.
 *
 * It withholds the tooltips until the pointer or the keyboard actually reaches
 * it. A Radix tooltip is a whole positioning subtree per button, and a full
 * toolbar is twenty-odd of them — mounted eagerly they are the most expensive
 * thing the editor puts on the page, all of it to describe buttons nobody has
 * pointed at yet. Until then the `title` attribute says the same thing, and it
 * hands over the moment the real one exists, so the two never both show.
 */
export const Toolbar = ({ children }: ToolbarProps) => {
  const [reached, setReached] = useState(false);
  const reach = () => setReached(true);

  return (
    <ToolbarTooltipsContext.Provider value={reached}>
      <div
        data-slot="rich-text-editor-toolbar"
        className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1"
        onPointerEnter={reach}
        onFocusCapture={reach}
      >
        {reached ? <TooltipProvider>{children}</TooltipProvider> : children}
      </div>
    </ToolbarTooltipsContext.Provider>
  );
};

export type ToolbarTooltipProps = {
  title: string;
  children: ReactElement<{ title?: string }>;
};

export const ToolbarTooltip = ({ title, children }: ToolbarTooltipProps) => {
  const reached = useContext(ToolbarTooltipsContext);

  if (!reached) return cloneElement(children, { title });

  return <Tooltip title={title}>{children}</Tooltip>;
};

export type ToolbarButtonProps = {
  title: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const ToolbarButton = ({
  title,
  icon,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) => (
  <ToolbarTooltip title={title}>
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={cn(active && 'bg-accent text-accent-foreground')}
      // The editor loses its selection the moment the button takes focus, so
      // never let it: the command runs on mousedown-prevented, click-handled.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {icon}
    </Button>
  </ToolbarTooltip>
);

export const ToolbarSeparator = () => (
  <Separator orientation="vertical" className="mx-0.5 h-5" />
);

export type BlockOption = {
  label: string;
  /** `null` is the plain paragraph. */
  level: 1 | 2 | 3 | null;
};

const heading = (locale: Locale, level: number) =>
  locale.editor?.heading?.(level) ?? `Heading ${level}`;

const blocks = (locale: Locale): BlockOption[] => [
  { label: locale.editor?.bodyText ?? 'Body text', level: null },
  { label: heading(locale, 1), level: 1 },
  { label: heading(locale, 2), level: 2 },
  { label: heading(locale, 3), level: 3 },
];

export type BlockPickerProps = {
  editor: Editor;
  /** Heading level of the block the cursor is in, `null` for a paragraph. */
  activeLevel: 1 | 2 | 3 | null;
  disabled?: boolean;
};

/** Swaps the block the cursor sits in between paragraph and the headings. */
export const BlockPicker = ({
  editor,
  activeLevel,
  disabled = false,
}: BlockPickerProps) => {
  const locale = useLocale();
  const active =
    blocks(locale).find((block) => block.level === activeLevel) ??
    blocks(locale)[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="w-28 justify-between"
          onMouseDown={(event) => event.preventDefault()}
        >
          {active.label}
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {blocks(locale).map((block) => (
          <DropdownMenuItem
            key={block.label}
            className={cn(block.level === activeLevel && 'bg-accent')}
            onSelect={() => {
              const chain = editor.chain().focus();
              if (block.level === null) chain.setParagraph().run();
              else chain.setHeading({ level: block.level }).run();
            }}
          >
            {block.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

const alignments = (
  locale: Locale,
): { value: TextAlign; label: string; icon: ReactNode }[] => [
  {
    value: 'left',
    label: locale.editor?.alignLeft ?? 'Align left',
    icon: <AlignLeftIcon />,
  },
  {
    value: 'center',
    label: locale.editor?.alignCenter ?? 'Align centre',
    icon: <AlignCenterIcon />,
  },
  {
    value: 'right',
    label: locale.editor?.alignRight ?? 'Align right',
    icon: <AlignRightIcon />,
  },
  {
    value: 'justify',
    label: locale.editor?.alignJustify ?? 'Justify',
    icon: <AlignJustifyIcon />,
  },
];

export type AlignPickerProps = {
  editor: Editor;
  /** Alignment of the block the cursor is in. `null` means the default. */
  active: TextAlign | null;
  disabled?: boolean;
};

export const AlignPicker = ({
  editor,
  active,
  disabled = false,
}: AlignPickerProps) => {
  const locale = useLocale();
  const current = alignments(locale).find((entry) => entry.value === active);

  return (
    <DropdownMenu>
      <ToolbarTooltip title={locale.editor?.alignment ?? 'Alignment'}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={locale.editor?.alignment ?? 'Alignment'}
            disabled={disabled}
            className="gap-1 px-2"
            onMouseDown={(event) => event.preventDefault()}
          >
            {current?.icon ?? <AlignLeftIcon />}
            <ChevronDownIcon className="size-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
      </ToolbarTooltip>
      <DropdownMenuContent align="start">
        {alignments(locale).map((entry) => (
          <DropdownMenuItem
            key={entry.value}
            className={cn(entry.value === active && 'bg-accent')}
            onSelect={() =>
              editor.chain().focus().setTextAlign(entry.value).run()
            }
          >
            {entry.icon}
            {entry.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type LinkButtonProps = {
  editor: Editor;
  active: boolean;
  disabled?: boolean;
};

/**
 * Sets a link on the current selection, or edits the one already under the
 * cursor. Applying with an empty field removes the link.
 */
export const LinkButton = ({
  editor,
  active,
  disabled = false,
}: LinkButtonProps) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState('');

  const apply = () => {
    const url = href.trim();
    const chain = editor.chain().focus().extendMarkRange('link');

    if (url) chain.setLink({ href: url }).run();
    else chain.unsetLink().run();

    setOpen(false);
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // Seed the field from the link under the cursor each time it opens.
        if (next) setHref(editor.getAttributes('link').href ?? '');
        setOpen(next);
      }}
    >
      <ToolbarTooltip title={locale.editor?.insertLink ?? 'Insert link'}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={locale.editor?.insertLink ?? 'Insert link'}
            aria-pressed={active}
            disabled={disabled}
            className={cn(active && 'bg-accent text-accent-foreground')}
            onMouseDown={(event) => event.preventDefault()}
          >
            <LinkIcon />
          </Button>
        </PopoverTrigger>
      </ToolbarTooltip>

      <PopoverContent className="flex w-72 items-center gap-1.5 p-2">
        <Input
          autoFocus
          value={href}
          placeholder="https://"
          className="h-8"
          onChange={(event) => setHref(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              apply();
            }
          }}
        />
        {active && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={locale.editor?.removeLink ?? 'Remove link'}
            onClick={remove}
          >
            <Trash2Icon />
          </Button>
        )}
        <Button type="button" size="sm" onClick={apply}>
          {locale.editor?.save ?? 'Save'}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
