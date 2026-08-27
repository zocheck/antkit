import { Image } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Image'],
  api: [
    {
      title: 'Image',
      description:
        'Takes every prop an <img> does except `placeholder`, which is redefined. Use `Avatar` for pictures that are identity — someone’s profile photo.',
      props: [
        {
          name: 'preview',
          type: 'boolean',
          default: 'true',
          description: 'Click the image to open the full-screen viewer.',
        },
        {
          name: 'fallback',
          type: 'ReactNode | string',
          description:
            'Shown when the image fails to load: another URL, a node, or the default icon.',
        },
        {
          name: 'placeholder',
          type: 'ReactNode | boolean',
          default: 'false',
          description:
            '`true` shows a skeleton while it loads, or pass a node of your own.',
        },
        {
          name: 'wrapperClassName',
          type: 'string',
          description:
            'Styles the wrapper; `className` still lands on the <img> itself.',
        },
        {
          name: 'previewTitle',
          type: 'string',
          description:
            'The accessible name of the viewer dialog. Defaults to `alt`.',
        },
        {
          name: 'previewLabels',
          type: 'ImagePreviewLabels',
          description:
            'Labels for the viewer’s buttons: open, close, zoom in, zoom out, rotate left, rotate right.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Click the image to open the viewer: zoom in, zoom out, rotate either way.
 */
export const Basic = () => (
  <Image
    src="/demo/photo.svg"
    alt="An illustrative landscape"
    wrapperClassName="w-64 overflow-hidden rounded-lg border"
    className="w-64"
  />
);

/**
 * A placeholder while loading
 *
 * `placeholder` holds the image's exact space, so the layout does not jump.
 */
export const Placeholder = () => (
  <Image
    src="/demo/after.svg"
    alt="An image with a skeleton"
    placeholder
    wrapperClassName="w-64 overflow-hidden rounded-lg border"
    className="w-64"
  />
);

/**
 * A failed load
 *
 * With no `fallback` a default icon is drawn; pass another URL or a node to
 * decide for yourself.
 */
export const Fallback = () => (
  <>
    <Image
      src="/this-image-does-not-exist.png"
      alt="A broken image"
      wrapperClassName="size-32 rounded-lg border"
      className="size-32"
    />

    <Image
      src="/this-image-does-not-exist.png"
      alt="A broken image with a replacement"
      fallback="/demo/photo.svg"
      wrapperClassName="size-32 overflow-hidden rounded-lg border"
      className="size-32 object-cover"
    />
  </>
);

/**
 * Turning the viewer off
 *
 * `preview={false}` for images that are purely decorative.
 */
export const NoPreview = () => (
  <Image
    src="/demo/photo.svg"
    alt=""
    preview={false}
    wrapperClassName="w-48 overflow-hidden rounded-lg border"
    className="w-48"
  />
);

/**
 * In a grid
 *
 * `wrapperClassName` handles the frame and `className` the <img> itself —
 * which is why there are two props rather than one.
 */
export const Gallery = () => (
  <div className="grid w-full grid-cols-3 gap-3 sm:max-w-md">
    {['photo', 'before', 'after'].map((name) => (
      <Image
        key={name}
        src={`/demo/${name}.svg`}
        alt={name}
        placeholder
        wrapperClassName="aspect-square overflow-hidden rounded-lg border"
        className="size-full object-cover"
      />
    ))}
  </div>
);
