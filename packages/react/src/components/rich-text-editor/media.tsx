import { useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

import { cn } from '../../utils';
import { useLocale } from '../../lib/config';
import type { Editor } from '@tiptap/react';
import {
  BanIcon,
  BaselineIcon,
  HighlighterIcon,
  ImageIcon,
  TableIcon,
  UploadIcon,
} from 'lucide-react';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Spinner } from '../spinner';
import { ToolbarTooltip } from './parts';

/**
 * A toolbar button that opens a popover. Same focus dance as `ToolbarButton`:
 * the editor must keep its selection while the trigger is pressed.
 */
type PopoverButtonProps = {
  title: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  contentClassName?: string;
};

const PopoverButton = ({
  title,
  icon,
  active = false,
  disabled = false,
  open,
  onOpenChange,
  children,
  contentClassName,
}: PopoverButtonProps) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <ToolbarTooltip title={title}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={title}
          aria-pressed={active}
          disabled={disabled}
          className={cn(active && 'bg-accent text-accent-foreground')}
          onMouseDown={(event) => event.preventDefault()}
        >
          {icon}
        </Button>
      </PopoverTrigger>
    </ToolbarTooltip>
    <PopoverContent className={cn('w-auto p-2', contentClassName)}>
      {children}
    </PopoverContent>
  </Popover>
);

/**
 * Swatches for text colour and highlight. Deliberately literal hex values
 * rather than theme tokens: the colour is written into the saved HTML, where
 * a `var(--primary)` would resolve against whatever renders it later.
 */
const SWATCHES = [
  '#18181b',
  '#71717a',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#db2777',
];

type SwatchGridProps = {
  active?: string;
  onPick: (color: string) => void;
  onClear: () => void;
  clearLabel: string;
};

const SwatchGrid = ({
  active,
  onPick,
  onClear,
  clearLabel,
}: SwatchGridProps) => (
  <div className="flex w-44 flex-col gap-2">
    <div className="grid grid-cols-5 gap-1">
      {SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          aria-pressed={color === active}
          style={{ backgroundColor: color }}
          className={cn(
            'size-7 cursor-pointer rounded-md border border-border/60 transition-transform hover:scale-110',
            color === active && 'ring-2 ring-ring ring-offset-1',
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onPick(color)}
        />
      ))}
    </div>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      prefix={<BanIcon />}
      className="justify-start"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClear}
    >
      {clearLabel}
    </Button>
  </div>
);

export type ColorButtonProps = {
  editor: Editor;
  /** Colour on the current selection, if any. */
  active?: string;
  disabled?: boolean;
};

export const ColorButton = ({
  editor,
  active,
  disabled = false,
}: ColorButtonProps) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <PopoverButton
      title={locale.editor?.textColour ?? 'Text colour'}
      icon={
        <span className="relative flex flex-col items-center">
          <BaselineIcon className="size-3.5" />
          <span
            className="mt-px h-1 w-3.5 rounded-full"
            style={{ backgroundColor: active ?? 'currentColor' }}
          />
        </span>
      }
      active={!!active}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <SwatchGrid
        active={active}
        clearLabel={locale.editor?.clearTextColour ?? 'Clear text colour'}
        onPick={(color) => {
          editor.chain().focus().setColor(color).run();
          setOpen(false);
        }}
        onClear={() => {
          editor.chain().focus().unsetColor().run();
          setOpen(false);
        }}
      />
    </PopoverButton>
  );
};

export type HighlightButtonProps = {
  editor: Editor;
  active?: string;
  disabled?: boolean;
};

export const HighlightButton = ({
  editor,
  active,
  disabled = false,
}: HighlightButtonProps) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <PopoverButton
      title={locale.editor?.highlight ?? 'Highlight'}
      icon={<HighlighterIcon />}
      active={!!active}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <SwatchGrid
        active={active}
        clearLabel={locale.editor?.clearHighlight ?? 'Clear highlight'}
        onPick={(color) => {
          editor.chain().focus().setHighlight({ color }).run();
          setOpen(false);
        }}
        onClear={() => {
          editor.chain().focus().unsetHighlight().run();
          setOpen(false);
        }}
      />
    </PopoverButton>
  );
};

export type ImageButtonProps = {
  editor: Editor;
  disabled?: boolean;
  accept: string;
  /** Runs the picked file through the caller's upload and inserts the result. */
  onPickFiles: (files: File[]) => Promise<void>;
};

/** Insert an image: pick a file from the machine, or paste a URL. */
export const ImageButton = ({
  editor,
  disabled = false,
  accept,
  onPickFiles,
}: ImageButtonProps) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const insertUrl = () => {
    const url = src.trim();
    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
    setSrc('');
    setOpen(false);
  };

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    // Reset first: picking the same file twice has to fire `change` again.
    event.target.value = '';
    if (!files.length) return;

    setBusy(true);
    try {
      await onPickFiles(files);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <PopoverButton
      title={locale.editor?.insertImage ?? 'Insert image'}
      icon={<ImageIcon />}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
      contentClassName="w-72"
    >
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          block
          prefix={busy ? <Spinner /> : <UploadIcon />}
          disabled={busy}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => fileInput.current?.click()}
        >
          {busy
            ? (locale.editor?.uploading ?? 'Uploading…')
            : (locale.editor?.chooseImage ?? 'Choose an image')}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={pick}
        />

        <div className="flex items-center gap-1.5">
          <Input
            value={src}
            placeholder="https://…"
            className="h-8"
            onChange={(event) => setSrc(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                insertUrl();
              }
            }}
          />
          <Button type="button" size="sm" onClick={insertUrl}>
            {locale.editor?.insert ?? 'Insert'}
          </Button>
        </div>
      </div>
    </PopoverButton>
  );
};

export type TableButtonProps = {
  editor: Editor;
  /** The cursor sits inside a table, so the row/column entries can run. */
  inTable: boolean;
  disabled?: boolean;
};

/** Inserts a table, and edits the one the cursor is in. */
export const TableButton = ({
  editor,
  inTable,
  disabled = false,
}: TableButtonProps) => {
  const locale = useLocale();
  const run = (action: (chain: ReturnType<Editor['chain']>) => void) => () =>
    action(editor.chain().focus());

  return (
    <DropdownMenu>
      <ToolbarTooltip title={locale.editor?.table ?? 'Table'}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={locale.editor?.table ?? 'Table'}
            aria-pressed={inTable}
            disabled={disabled}
            className={cn(inTable && 'bg-accent text-accent-foreground')}
            onMouseDown={(event) => event.preventDefault()}
          >
            <TableIcon />
          </Button>
        </DropdownMenuTrigger>
      </ToolbarTooltip>

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem
          onSelect={run((chain) =>
            chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
          )}
        >
          {locale.editor?.insertTable ?? 'Insert a 3 × 3 table'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.addColumnBefore().run())}
        >
          {locale.editor?.columnBefore ?? 'Add a column before'}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.addColumnAfter().run())}
        >
          {locale.editor?.columnAfter ?? 'Add a column after'}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.deleteColumn().run())}
        >
          {locale.editor?.deleteColumn ?? 'Delete column'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.addRowBefore().run())}
        >
          {locale.editor?.rowAbove ?? 'Add a row above'}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.addRowAfter().run())}
        >
          {locale.editor?.rowBelow ?? 'Add a row below'}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.deleteRow().run())}
        >
          {locale.editor?.deleteRow ?? 'Delete row'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.mergeOrSplit().run())}
        >
          {locale.editor?.mergeCells ?? 'Merge or split cells'}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!inTable}
          onSelect={run((chain) => chain.toggleHeaderRow().run())}
        >
          {locale.editor?.toggleHeaderRow ?? 'Toggle the header row'}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={!inTable}
          onSelect={run((chain) => chain.deleteTable().run())}
        >
          {locale.editor?.deleteTable ?? 'Delete table'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
