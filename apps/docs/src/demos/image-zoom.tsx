import { useState } from 'react';

import { Button, ImageZoom } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['ImageZoom'],
  api: [
    {
      title: 'ImageZoom',
      description:
        'Zooms an image in place: it flies out of its own thumbnail to the middle of the screen. Use `Image` with `preview` when the viewer needs rotate and zoom buttons.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Usually an <img>, but anything with a size works.',
        },
        {
          name: 'zoomMargin',
          type: 'number',
          default: '0',
          description: 'Space left between the zoomed image and the viewport.',
        },
        {
          name: 'zoomed',
          type: 'boolean',
          description: 'The controlled state. Goes with `onZoomChange`.',
        },
        {
          name: 'onZoomChange',
          type: '(zoomed: boolean) => void',
          description: 'Called when it zooms in or out.',
        },
        {
          name: 'backdropClassName',
          type: 'string',
          description: 'Styles the backdrop behind the zoomed image.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Turns zooming off entirely.',
        },
        {
          name: 'zoomLabel / unzoomLabel',
          type: 'string',
          description: 'Accessible names for the zoom and unzoom actions.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Click to zoom, click again or press Escape to close.
 */
export const Basic = () => (
  <ImageZoom>
    <img
      src="/demo/photo.svg"
      alt="An illustrative landscape"
      className="w-56 rounded-lg border"
    />
  </ImageZoom>
);

/**
 * Leaving a margin
 *
 * `zoomMargin` keeps the zoomed image off the edges of the screen.
 */
export const Margin = () => (
  <ImageZoom zoomMargin={64}>
    <img
      src="/demo/after.svg"
      alt="An image with a margin"
      className="w-56 rounded-lg border"
    />
  </ImageZoom>
);

/**
 * A darker backdrop
 */
export const Backdrop = () => (
  <ImageZoom backdropClassName="bg-black/85">
    <img
      src="/demo/before.svg"
      alt="An image on a dark backdrop"
      className="w-56 rounded-lg border"
    />
  </ImageZoom>
);

/**
 * Controlled
 *
 * With `zoomed` and `onZoomChange`, a button somewhere else can open it too.
 */
export const Controlled = () => {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <ImageZoom zoomed={zoomed} onZoomChange={setZoomed}>
        <img
          src="/demo/photo.svg"
          alt="A controlled image"
          className="w-40 rounded-lg border"
        />
      </ImageZoom>

      <Button size="sm" variant="secondary" onClick={() => setZoomed(true)}>
        Zoom from here
      </Button>
    </div>
  );
};

/**
 * In a gallery
 *
 * The image flies out of its own cell rather than from the middle of the
 * screen.
 */
export const Grid = () => (
  <div className="grid w-full grid-cols-3 gap-3 sm:max-w-md">
    {['photo', 'before', 'after'].map((name) => (
      <ImageZoom key={name}>
        <img
          src={`/demo/${name}.svg`}
          alt={name}
          className="aspect-square w-full rounded-lg border object-cover"
        />
      </ImageZoom>
    ))}
  </div>
);
