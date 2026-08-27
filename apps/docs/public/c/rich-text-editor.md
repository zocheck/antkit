# RichTextEditor

A formatting editor with images and tables — load it lazily.

```tsx
import { COMPACT_TOOLBAR, DEFAULT_TOOLBAR, RichTextEditor } from '@antkit/react';
```

Rich text editor built on Tiptap, with the toolbar wired up.

```tsx
const [body, setBody] = useState('<p>Hello</p>');

<RichTextEditor
  value={body}
  onChange={setBody}
  placeholder="Write the email…"
  maxLength={2000}
  showCount
  onUploadImage={(file) => api.upload(file).then((res) => res.url)}
  onError={(error) => message.error(error.message)}
/>
```

`value` is HTML and works controlled or uncontrolled. Controlled updates only
reach the document when they differ from what is already there, so typing
doesn't fight the round-trip through the parent's state.

Out of the box: headings, alignment, the usual marks, text colour and
highlight, bullet/numbered/task lists, quotes, code blocks, links, images
(pick, paste or drop), tables, and a character count.

Three ways to change what it does, smallest first:

- `toolbar` picks and orders the buttons, and takes buttons of your own —
  see {@link RichTextEditorCustomTool}. `COMPACT_TOOLBAR` is a short preset.
- `starterKit` reaches the built-in extensions: `{ codeBlock: false }`.
- `extensions` adds your own, and `onReady` hands you the instance to drive
  them from outside.

## Props

- `value`
- `defaultValue`
- `onChange`
- `onBlur`
- `placeholder`
- `disabled`
- `readOnly`
- `autoFocus`
- `toolbar`
- `maxLength`
- `showCount`
- `onUploadImage`
- `maxImageSize`
- `imageAccept`
- `onError`
- `extensions`
- `starterKit`
- `onReady`
- `minHeight`
- `maxHeight`
- `id`
- `className`
- `contentClassName`
- `aria-invalid`
- `aria-describedby`

Source: `@antkit/react/src/components/rich-text-editor/rich-text-editor.tsx`
