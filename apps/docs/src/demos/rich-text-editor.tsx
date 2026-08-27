import { lazy, Suspense, useState } from 'react';

import { Spinner } from '@antkit/react';
import {
  COMPACT_TOOLBAR,
  DEFAULT_TOOLBAR,
} from '@antkit/react/rich-text-editor/tools';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

/**
 * TipTap and ProseMirror weigh 211 KB gzipped, so the editor lives behind its
 * own subpath and is always lazy — this page is the only place in the docs
 * that has to load them.
 */
const RichTextEditor = lazy(() =>
  import('@antkit/react/rich-text-editor').then((module) => ({
    default: module.RichTextEditor,
  })),
);

const Editor = (props: React.ComponentProps<typeof RichTextEditor>) => (
  <Suspense
    fallback={
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-border">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    }
  >
    <RichTextEditor {...props} />
  </Suspense>
);

/** Fakes an upload endpoint: waits a beat, then hands back a local URL. */
const uploadImage = (file: File) =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 600);
  });

export const meta: DemoMeta = {
  imports: [],
  extraImports: [
    "import { RichTextEditor } from '@antkit/react/rich-text-editor';",
    "import { COMPACT_TOOLBAR, DEFAULT_TOOLBAR } from '@antkit/react/rich-text-editor/tools';",
  ],
  api: [
    {
      title: 'RichTextEditor',
      description:
        'It sits outside the root barrel and TipTap is an optional peer, so installing @antkit/react normally does not pull it in. Import it from the subpath and wrap it in `lazy()` so it lands in its own chunk.',
      props: [
        {
          name: 'value',
          type: 'string',
          description:
            'HTML. Pass it and you control the content; leave it out and the editor holds its own.',
        },
        {
          name: 'defaultValue',
          type: 'string',
          description: 'The starting HTML when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(html: string) => void',
          description: 'Called with the new HTML after every change.',
        },
        {
          name: 'toolbar',
          type: 'RichTextEditorTool[] | false',
          default: 'DEFAULT_TOOLBAR',
          description:
            'Picks and orders the buttons, or `false` to drop the toolbar entirely.',
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: 'Displays the content only: no toolbar, no editing.',
        },
        {
          name: 'maxLength',
          type: 'number',
          description:
            'Caps the plain-text length; anything past it is refused.',
        },
        {
          name: 'showCount',
          type: 'boolean',
          default: 'false',
          description: 'Shows `used / limit` under the frame.',
        },
        {
          name: 'onUploadImage',
          type: '(file: File) => Promise<string>',
          description:
            'Stores an image that was picked, pasted or dropped, and returns its URL. Without this prop the image is inlined as a `data:` URL — fine for a demo, but it then lives inside `value` and travels with every save.',
        },
        {
          name: 'maxImageSize',
          type: 'number',
          default: '5 MB',
          description:
            'In bytes. Anything larger is refused before it uploads.',
        },
        {
          name: 'imageAccept',
          type: 'string',
          default: "'image/*'",
          description: 'The `accept` of the file picker.',
        },
        {
          name: 'onError',
          type: '(error: Error) => void',
          description:
            'Where upload failures and refused files come out — wire it to a toast.',
        },
        {
          name: 'extensions',
          type: 'AnyExtension[]',
          description:
            'Extra TipTap extensions, appended after the built-in ones.',
        },
        {
          name: 'starterKit',
          type: 'Partial<StarterKitOptions>',
          description:
            'Passed down to StarterKit. `{ codeBlock: false }` turns one feature off.',
        },
        {
          name: 'onReady',
          type: '(editor: Editor) => void',
          description:
            'Hands back the TipTap instance once it exists — for commands the toolbar does not cover.',
        },
        {
          name: 'minHeight / maxHeight',
          type: 'number | string',
          description: 'The height of the editing area.',
        },
        {
          name: 'editorClassName',
          type: 'string',
          description: 'Styles the editing area, not the bordered frame.',
        },
      ],
    },
    {
      title: 'Toolbar presets',
      description:
        'Plain data, imported straight from `@antkit/react/rich-text-editor/tools` without dragging TipTap along.',
      props: [
        {
          name: 'DEFAULT_TOOLBAR',
          type: 'RichTextEditorTool[]',
          description:
            'The full set: formatting, lists, links, images, tables.',
        },
        {
          name: 'COMPACT_TOOLBAR',
          type: 'RichTextEditorTool[]',
          description: 'A compact set for a comment box or a note.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * The content is HTML — what goes into `value` is what comes out of
 * `onChange`.
 */
export const Basic = () => {
  const [body, setBody] = useState(
    '<h2>Welcome</h2><p>The <strong>IELTS 6.5+</strong> course starts on <em>12 September</em>.</p><ul><li>Timetable: Mon, Wed, Fri</li><li>Teacher: Miriam Cole</li></ul>',
  );

  return (
    <div className="w-full">
      <Editor
        value={body}
        onChange={setBody}
        onUploadImage={uploadImage}
        onError={(error) => toast.error(error.message)}
        minHeight={180}
      />
    </div>
  );
};

/**
 * A compact toolbar
 *
 * `COMPACT_TOOLBAR` drops tables, images and the advanced formatting — enough
 * for a comment box.
 */
export const Compact = () => (
  <div className="w-full">
    <Editor
      toolbar={COMPACT_TOOLBAR}
      placeholder="Write a comment…"
      minHeight={120}
      maxLength={500}
      showCount
    />
  </div>
);

/**
 * Choosing the buttons
 *
 * `toolbar` takes an array, so it picks both which buttons appear and the
 * order they appear in.
 */
export const CustomToolbar = () => (
  <div className="w-full">
    <Editor
      toolbar={['bold', 'italic', 'link', 'bulletList', 'undo', 'redo']}
      defaultValue="<p>Six buttons and no more.</p>"
      minHeight={120}
    />
  </div>
);

/**
 * No toolbar
 *
 * `toolbar={false}` leaves the bare editing area — the shortcuts still work.
 */
export const NoToolbar = () => (
  <div className="w-full">
    <Editor
      toolbar={false}
      defaultValue="<p>Ctrl/Cmd + B still sets bold.</p>"
      minHeight={100}
    />
  </div>
);

/**
 * Read-only
 *
 * `readOnly` turns the editor into a block that displays HTML, for a review
 * page.
 */
export const ReadOnly = () => (
  <div className="w-full">
    <Editor
      readOnly
      value="<h3>Terms</h3><p>Tuition is payable three working days before the first session.</p>"
    />
  </div>
);

/**
 * Every button
 *
 * `DEFAULT_TOOLBAR` is the full set. An inserted image goes through
 * `onUploadImage` — here a stub that waits 600ms and returns a local URL.
 */
export const FullToolbar = () => (
  <div className="w-full">
    <Editor
      toolbar={DEFAULT_TOOLBAR}
      onUploadImage={uploadImage}
      maxImageSize={2 * 1024 * 1024}
      onError={(error) => toast.error(error.message)}
      minHeight={200}
      maxHeight={360}
    />
  </div>
);
