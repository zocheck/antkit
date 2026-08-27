import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

import { cn } from '../../utils';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TableKit } from '@tiptap/extension-table';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import type { AnyExtension, Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import type { StarterKitOptions } from '@tiptap/starter-kit';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MinusIcon,
  QuoteIcon,
  RedoIcon,
  RemoveFormattingIcon,
  SquareCodeIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react';

import {
  ColorButton,
  HighlightButton,
  ImageButton,
  TableButton,
} from './media';
import {
  AlignPicker,
  BlockPicker,
  LinkButton,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from './parts';
import type { TextAlign as Alignment } from './parts';

// The tool list lives in its own module: a non-component export sitting beside
// a component turns every edit here into a full page reload under Fast Refresh.
import { DEFAULT_TOOLBAR, isCustomTool } from './tools';
import type { RichTextEditorTool } from './tools';
import { useLocale } from '../../lib/config';

const ALIGNMENTS: Alignment[] = ['left', 'center', 'right', 'justify'];
const MEGABYTE = 1024 * 1024;

export type RichTextEditorProps = {
  /** HTML. Pass it to drive the editor, leave it off to let it own the content. */
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;

  placeholder?: string;
  disabled?: boolean;
  /** Renders the content without the toolbar and without letting it be edited. */
  readOnly?: boolean;
  autoFocus?: boolean;

  /** Pick and order the buttons, or pass `false` to drop the toolbar. */
  toolbar?: RichTextEditorTool[] | false;
  /** Caps the plain-text length; typing past it is refused. */
  maxLength?: number;
  /** Show `used / maxLength` under the field. */
  showCount?: boolean;

  /**
   * Stores a picked, pasted or dropped image and returns its URL. Without it
   * the file is inlined as a `data:` URL — fine for a demo, but it lands in
   * `value` and travels with every save, so real uploads want this prop.
   */
  onUploadImage?: (file: File) => Promise<string>;
  /** Bytes. Anything larger is rejected before upload. Defaults to 5 MB. */
  maxImageSize?: number;
  /** `accept` for the file picker. Defaults to `image/*`. */
  imageAccept?: string;
  /** Upload failures and rejected files land here — wire it to a toast. */
  onError?: (error: Error) => void;

  /** Extra Tiptap extensions, appended after the built-in ones. */
  extensions?: AnyExtension[];
  /** Passed to StarterKit. `{ codeBlock: false }` turns a built-in off. */
  starterKit?: Partial<StarterKitOptions>;
  /** The Tiptap instance, once it exists — for commands the toolbar lacks. */
  onReady?: (editor: Editor) => void;

  minHeight?: number | string;
  maxHeight?: number | string;

  id?: string;
  className?: string;
  /** Styles the editable area, not the bordered wrapper. */
  contentClassName?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const size = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

const imagesIn = (list: FileList | null | undefined) =>
  [...(list ?? [])].filter((file) => file.type.startsWith('image/'));

const readAsDataUrl = (file: File, unreadable: string) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.addEventListener('error', () =>
      reject(reader.error ?? new Error(unreadable)),
    );
    reader.readAsDataURL(file);
  });

/**
 * Rich text editor built on Tiptap, with the toolbar wired up.
 *
 * ```tsx
 * const [body, setBody] = useState('<p>Hello</p>');
 *
 * <RichTextEditor
 *   value={body}
 *   onChange={setBody}
 *   placeholder="Write the email…"
 *   maxLength={2000}
 *   showCount
 *   onUploadImage={(file) => api.upload(file).then((res) => res.url)}
 *   onError={(error) => message.error(error.message)}
 * />
 * ```
 *
 * `value` is HTML and works controlled or uncontrolled. Controlled updates only
 * reach the document when they differ from what is already there, so typing
 * doesn't fight the round-trip through the parent's state.
 *
 * Out of the box: headings, alignment, the usual marks, text colour and
 * highlight, bullet/numbered/task lists, quotes, code blocks, links, images
 * (pick, paste or drop), tables, and a character count.
 *
 * Three ways to change what it does, smallest first:
 *
 * - `toolbar` picks and orders the buttons, and takes buttons of your own —
 *   see {@link RichTextEditorCustomTool}. `COMPACT_TOOLBAR` is a short preset.
 * - `starterKit` reaches the built-in extensions: `{ codeBlock: false }`.
 * - `extensions` adds your own, and `onReady` hands you the instance to drive
 *   them from outside.
 */
export const RichTextEditor = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  toolbar = DEFAULT_TOOLBAR,
  maxLength,
  showCount = false,
  onUploadImage,
  maxImageSize = 5 * MEGABYTE,
  imageAccept = 'image/*',
  onError,
  extensions,
  starterKit,
  onReady,
  minHeight = 160,
  maxHeight,
  id,
  className,
  contentClassName,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
}: RichTextEditorProps) => {
  const locale = useLocale();
  const editable = !disabled && !readOnly;
  // Tiptap normalises whatever HTML it parses — a list item comes back wrapped
  // in a `<p>`, a trailing paragraph is appended — and reports that as an update
  // at mount, which a controlled parent echoes back into `value`. Neither the
  // HTML we were seeded with nor the HTML we last handed out means the document
  // actually changed, so both are remembered and neither is written back: doing
  // so would rebuild the document and drop the caret at its end.
  const initial = value ?? defaultValue ?? '';
  const seeded = useRef(initial);
  const lastHtml = useRef(initial);
  // `editorProps` is read once, when the editor is built, so the paste and drop
  // handlers reach the current upload logic through a ref rather than a closure
  // over the props of whichever render happened to create the editor.
  const insertImages = useRef<(files: File[]) => void>(() => {});
  const announce = useRef(onReady);

  const editor = useEditor({
    editable,
    autofocus: autoFocus,
    content: initial,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: 'noreferrer noopener', target: '_blank' },
        },
        ...starterKit,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false, allowBase64: true }),
      TableKit.configure({ table: { resizable: true } }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
      CharacterCount.configure({ limit: maxLength ?? null }),
      ...(extensions ?? []),
    ],
    editorProps: {
      handlePaste: (_view, event) => {
        const files = imagesIn(event.clipboardData?.files);
        if (!files.length) return false;

        event.preventDefault();
        insertImages.current(files);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = imagesIn(event.dataTransfer?.files);
        if (!files.length) return false;

        event.preventDefault();
        insertImages.current(files);
        return true;
      },
    },
    onUpdate: ({ editor: instance }) => {
      lastHtml.current = instance.getHTML();
      onChange?.(lastHtml.current);
    },
    onBlur: () => onBlur?.(),
  });

  const addImages = async (files: File[]) => {
    if (!editor) return;

    for (const file of files) {
      if (file.size > maxImageSize) {
        onError?.(
          new Error(
            locale.editor?.imageTooLarge?.(
              file.name,
              Math.round(maxImageSize / MEGABYTE),
            ) ??
              `${file.name} is over ${Math.round(maxImageSize / MEGABYTE)} MB`,
          ),
        );
        continue;
      }

      try {
        const src = onUploadImage
          ? // Sequential on purpose: the images land in the order they came in.
            // eslint-disable-next-line no-await-in-loop
            await onUploadImage(file)
          : // eslint-disable-next-line no-await-in-loop
            await readAsDataUrl(
              file,
              locale.editor?.unreadableFile ?? 'Could not read the file',
            );

        editor.chain().focus().setImage({ src, alt: file.name }).run();
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };

  // Refreshed every render so the callbacks that outlive a render — paste and
  // drop, which the editor captured when it was built — run the latest props.
  useEffect(() => {
    insertImages.current = (files) => void addImages(files);
    announce.current = onReady;
  });

  // Once per editor, not once per render: a caller who passes an inline arrow
  // gives a new `onReady` every time, and depending on it would re-announce the
  // same instance on every pass.
  useEffect(() => {
    if (editor && !editor.isDestroyed) announce.current?.(editor);
  }, [editor]);

  // Tiptap parks the caret at the end of the document. Put it at the start
  // instead, so an editor nobody has touched yet doesn't light the toolbar up
  // for whatever its last block happens to be. After mount, not in `onCreate`:
  // the editor is built during render and a transaction that early lands in
  // React as a state update on a component that isn't mounted.
  // `isDestroyed` guards every one of these: StrictMode mounts, tears down and
  // remounts, and the effect scheduled by the first pass runs a second time
  // holding the instance Tiptap destroyed in between. Reading `commands` off
  // that instance throws.
  useEffect(() => {
    if (editor && !editor.isDestroyed && !autoFocus) {
      editor.commands.setTextSelection(0);
    }
  }, [editor, autoFocus]);

  // `editable` is set at creation, so keep it in step without rebuilding the
  // editor — a rebuild would throw away the undo history and the selection.
  // Silently: left to emit, it would fire `onChange` with content nobody
  // edited, and a parent that echoes that straight back resets the document.
  useEffect(() => {
    if (editor?.isDestroyed === false) editor.setEditable(editable, false);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || editor.isDestroyed || value === undefined) return;
    if (value === lastHtml.current || value === seeded.current) return;

    lastHtml.current = value;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const customTools = toolbar === false ? [] : toolbar.filter(isCustomTool);

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      // Also `isDestroyed`: StrictMode's remount runs this selector once more
      // against the instance Tiptap has already torn down, and a destroyed
      // editor has no view and no extension storage left to read.
      if (!instance || instance.isDestroyed) return null;

      const heading = [1, 2, 3].find((level) =>
        instance.isActive('heading', { level }),
      );

      return {
        headingLevel: (heading ?? null) as 1 | 2 | 3 | null,
        align:
          ALIGNMENTS.find((entry) => instance.isActive({ textAlign: entry })) ??
          null,
        color: instance.getAttributes('textStyle').color as string | undefined,
        highlight: instance.getAttributes('highlight').color as
          | string
          | undefined,
        bold: instance.isActive('bold'),
        italic: instance.isActive('italic'),
        underline: instance.isActive('underline'),
        strike: instance.isActive('strike'),
        code: instance.isActive('code'),
        subscript: instance.isActive('subscript'),
        superscript: instance.isActive('superscript'),
        bulletList: instance.isActive('bulletList'),
        orderedList: instance.isActive('orderedList'),
        taskList: instance.isActive('taskList'),
        blockquote: instance.isActive('blockquote'),
        codeBlock: instance.isActive('codeBlock'),
        link: instance.isActive('link'),
        inTable: instance.isActive('table'),
        canUndo: instance.can().undo(),
        canRedo: instance.can().redo(),
        characters: instance.storage.characterCount?.characters() ?? 0,
        custom: Object.fromEntries(
          customTools.map((tool) => [
            tool.key,
            {
              active: tool.isActive?.(instance) ?? false,
              disabled: tool.isDisabled?.(instance) ?? false,
            },
          ]),
        ),
      };
    },
  });

  if (!editor || !state) return null;

  const chain = () => editor.chain().focus();

  const buttons: Record<string, Parameters<typeof ToolbarButton>[0]> = {
    undo: {
      title: locale.editor?.undo ?? 'Undo',
      icon: <UndoIcon />,
      disabled: !state.canUndo,
      onClick: () => chain().undo().run(),
    },
    redo: {
      title: locale.editor?.redo ?? 'Redo',
      icon: <RedoIcon />,
      disabled: !state.canRedo,
      onClick: () => chain().redo().run(),
    },
    bold: {
      title: locale.editor?.bold ?? 'Bold',
      icon: <BoldIcon />,
      active: state.bold,
      onClick: () => chain().toggleBold().run(),
    },
    italic: {
      title: locale.editor?.italic ?? 'Italic',
      icon: <ItalicIcon />,
      active: state.italic,
      onClick: () => chain().toggleItalic().run(),
    },
    underline: {
      title: locale.editor?.underline ?? 'Underline',
      icon: <UnderlineIcon />,
      active: state.underline,
      onClick: () => chain().toggleUnderline().run(),
    },
    strike: {
      title: locale.editor?.strike ?? 'Strikethrough',
      icon: <StrikethroughIcon />,
      active: state.strike,
      onClick: () => chain().toggleStrike().run(),
    },
    code: {
      title: locale.editor?.inlineCode ?? 'Inline code',
      icon: <CodeIcon />,
      active: state.code,
      onClick: () => chain().toggleCode().run(),
    },
    subscript: {
      title: locale.editor?.subscript ?? 'Subscript',
      icon: <SubscriptIcon />,
      active: state.subscript,
      onClick: () => chain().toggleSubscript().run(),
    },
    superscript: {
      title: locale.editor?.superscript ?? 'Superscript',
      icon: <SuperscriptIcon />,
      active: state.superscript,
      onClick: () => chain().toggleSuperscript().run(),
    },
    bulletList: {
      title: locale.editor?.bulletList ?? 'Bullet list',
      icon: <ListIcon />,
      active: state.bulletList,
      onClick: () => chain().toggleBulletList().run(),
    },
    orderedList: {
      title: locale.editor?.orderedList ?? 'Numbered list',
      icon: <ListOrderedIcon />,
      active: state.orderedList,
      onClick: () => chain().toggleOrderedList().run(),
    },
    taskList: {
      title: locale.editor?.taskList ?? 'Task list',
      icon: <ListTodoIcon />,
      active: state.taskList,
      onClick: () => chain().toggleTaskList().run(),
    },
    blockquote: {
      title: locale.editor?.blockquote ?? 'Blockquote',
      icon: <QuoteIcon />,
      active: state.blockquote,
      onClick: () => chain().toggleBlockquote().run(),
    },
    codeBlock: {
      title: locale.editor?.codeBlock ?? 'Code block',
      icon: <SquareCodeIcon />,
      active: state.codeBlock,
      onClick: () => chain().toggleCodeBlock().run(),
    },
    horizontalRule: {
      title: locale.editor?.horizontalRule ?? 'Horizontal rule',
      icon: <MinusIcon />,
      onClick: () => chain().setHorizontalRule().run(),
    },
    clear: {
      title: locale.editor?.clearFormatting ?? 'Clear formatting',
      icon: <RemoveFormattingIcon />,
      onClick: () => chain().unsetAllMarks().clearNodes().run(),
    },
  };

  const renderTool = (tool: RichTextEditorTool, index: number) => {
    if (isCustomTool(tool)) {
      const own = state.custom[tool.key];

      return (
        <ToolbarButton
          key={tool.key}
          title={tool.title}
          icon={tool.icon}
          active={own?.active}
          disabled={disabled || own?.disabled}
          onClick={() => tool.onClick(editor)}
        />
      );
    }

    switch (tool) {
      case 'divider':
        return <ToolbarSeparator key={`divider-${index}`} />;
      case 'block':
        return (
          <BlockPicker
            key={tool}
            editor={editor}
            activeLevel={state.headingLevel}
            disabled={disabled}
          />
        );
      case 'align':
        return (
          <AlignPicker
            key={tool}
            editor={editor}
            active={state.align}
            disabled={disabled}
          />
        );
      case 'color':
        return (
          <ColorButton
            key={tool}
            editor={editor}
            active={state.color}
            disabled={disabled}
          />
        );
      case 'highlight':
        return (
          <HighlightButton
            key={tool}
            editor={editor}
            active={state.highlight}
            disabled={disabled}
          />
        );
      case 'link':
        return (
          <LinkButton
            key={tool}
            editor={editor}
            active={state.link}
            disabled={disabled}
          />
        );
      case 'image':
        return (
          <ImageButton
            key={tool}
            editor={editor}
            accept={imageAccept}
            disabled={disabled}
            onPickFiles={addImages}
          />
        );
      case 'table':
        return (
          <TableButton
            key={tool}
            editor={editor}
            inTable={state.inTable}
            disabled={disabled}
          />
        );
      default: {
        const button = buttons[tool];
        if (!button) return null;

        return (
          <ToolbarButton
            key={tool}
            {...button}
            disabled={disabled || button.disabled}
          />
        );
      }
    }
  };

  const contentStyle = {
    '--rte-min-height': size(minHeight),
    maxHeight: size(maxHeight),
  } as CSSProperties;

  return (
    <div
      data-slot="rich-text-editor"
      className={cn('flex w-full flex-col gap-1', className)}
    >
      <div
        aria-invalid={ariaInvalid}
        className={cn(
          'overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]',
          'focus-within:ring-2 focus-within:ring-ring',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          disabled && 'cursor-not-allowed opacity-50',
          'dark:bg-input/30',
        )}
      >
        {toolbar !== false && !readOnly && (
          <Toolbar>{toolbar.map(renderTool)}</Toolbar>
        )}

        <div
          id={id}
          aria-describedby={ariaDescribedby}
          style={contentStyle}
          className={cn(
            'overflow-y-auto text-sm',
            '[&_.tiptap]:min-h-(--rte-min-height) [&_.tiptap]:px-3 [&_.tiptap]:py-2 [&_.tiptap]:outline-none',
            '[&_.tiptap>*:first-child]:mt-0 [&_.tiptap>*:last-child]:mb-0',
            // Tiptap tags the first node while the document is empty and puts
            // the text on `data-placeholder`; this is what draws it.
            '[&_.is-editor-empty:first-child]:before:pointer-events-none [&_.is-editor-empty:first-child]:before:float-left [&_.is-editor-empty:first-child]:before:h-0',
            '[&_.is-editor-empty:first-child]:before:text-muted-foreground [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
            '[&_p]:my-2 [&_p]:leading-relaxed',
            '[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold',
            '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold',
            '[&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold',
            '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6',
            '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6',
            '[&_li]:my-0.5 [&_li>p]:my-0',
            // Task list. Only the `ul` carries `data-type`; the item is marked
            // by `data-checked`, and holds a `label` with the box and a `div`
            // with the text.
            '[&_[data-type=taskList]]:list-none [&_[data-type=taskList]]:pl-0.5',
            '[&_li[data-checked]]:flex [&_li[data-checked]]:items-start [&_li[data-checked]]:gap-2',
            '[&_li[data-checked]>label]:mt-0.5 [&_li[data-checked]>label]:shrink-0',
            '[&_li[data-checked]>div]:min-w-0 [&_li[data-checked]>div]:flex-1',
            '[&_li[data-checked=true]>div]:text-muted-foreground [&_li[data-checked=true]>div]:line-through',
            '[&_input[type=checkbox]]:size-4 [&_input[type=checkbox]]:accent-primary',
            '[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
            '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3',
            '[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.875em]',
            '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
            '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
            '[&_mark]:rounded-sm [&_mark]:px-0.5 [&_mark]:text-inherit',
            '[&_hr]:my-4 [&_hr]:border-t',
            '[&_strong]:font-semibold',
            '[&_img]:my-2 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md',
            // A resizable table gets a scrolling wrapper and per-cell handles,
            // which need the cells to be a positioning context.
            '[&_.tableWrapper]:my-3 [&_.tableWrapper]:overflow-x-auto',
            '[&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse',
            '[&_th]:relative [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold',
            '[&_td]:relative [&_td]:border [&_td]:border-border [&_td]:p-2',
            '[&_.selectedCell]:bg-accent',
            '[&_.column-resize-handle]:absolute [&_.column-resize-handle]:top-0 [&_.column-resize-handle]:right-0 [&_.column-resize-handle]:h-full [&_.column-resize-handle]:w-0.5 [&_.column-resize-handle]:bg-primary',
            '[&_.ProseMirror-selectednode]:outline [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-ring',
            contentClassName,
          )}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {showCount && (
        <span className="self-end text-xs text-muted-foreground tabular-nums">
          {maxLength ? `${state.characters} / ${maxLength}` : state.characters}
        </span>
      )}
    </div>
  );
};
