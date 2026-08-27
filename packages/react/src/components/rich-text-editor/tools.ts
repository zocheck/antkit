import type { ReactNode } from 'react';

import type { Editor } from '@tiptap/react';

/** Buttons the editor knows how to draw and wire up itself. */
export type RichTextEditorBuiltinTool =
  | 'undo'
  | 'redo'
  | 'block'
  | 'align'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'subscript'
  | 'superscript'
  | 'color'
  | 'highlight'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'link'
  | 'image'
  | 'table'
  | 'horizontalRule'
  | 'clear'
  | 'divider';

/**
 * A button of your own in the same toolbar. Everything it needs comes from the
 * editor instance, so it can run any Tiptap command — including ones added
 * through the `extensions` prop.
 *
 * ```tsx
 * <RichTextEditor
 *   extensions={[Mention]}
 *   toolbar={[
 *     ...DEFAULT_TOOLBAR,
 *     'divider',
 *     {
 *       key: 'mention',
 *       title: 'Mention',
 *       icon: <AtSignIcon />,
 *       onClick: (editor) => editor.chain().focus().insertContent('@').run(),
 *     },
 *   ]}
 * />
 * ```
 */
export type RichTextEditorCustomTool = {
  /** Identifies the button. Must be unique within the toolbar. */
  key: string;
  title: string;
  icon: ReactNode;
  /** Highlights the button. Re-read on every editor transaction. */
  isActive?: (editor: Editor) => boolean;
  /** Greys the button out. Re-read on every editor transaction. */
  isDisabled?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
};

export type RichTextEditorTool =
  | RichTextEditorBuiltinTool
  | RichTextEditorCustomTool;

export const isCustomTool = (
  tool: RichTextEditorTool,
): tool is RichTextEditorCustomTool => typeof tool !== 'string';

/** What `toolbar` falls back to: the common set, grouped by what it does. */
export const DEFAULT_TOOLBAR: RichTextEditorTool[] = [
  'undo',
  'redo',
  'divider',
  'block',
  'align',
  'divider',
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'divider',
  'color',
  'highlight',
  'divider',
  'bulletList',
  'orderedList',
  'taskList',
  'divider',
  'blockquote',
  'codeBlock',
  'divider',
  'link',
  'image',
  'table',
  'divider',
  'horizontalRule',
  'clear',
];

/** Marks and lists only — for a comment box or a short description field. */
export const COMPACT_TOOLBAR: RichTextEditorTool[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'divider',
  'bulletList',
  'orderedList',
  'divider',
  'link',
];
