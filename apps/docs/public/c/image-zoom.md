# ImageZoom

Zoom an image in place on click.

```tsx
import { ImageZoom } from '@antkit/react';
```

Click to lift an image out of the page and back again.

```tsx
<ImageZoom>
  <img src={proof} alt="Payment receipt" className="rounded-md" />
</ImageZoom>
```

The zoomed copy animates from wherever the thumbnail sits, so the eye keeps
track of which image grew — that is the whole point of the effect. It scales
up to the image's natural size at most, never past it into a blur.

`Image` with `preview` is the other option: a full viewer with zoom and
rotate controls. Reach for this one when the image just needs to be bigger.

## Props

- `children`
- `zoomMargin`
- `backdropClassName`
- `zoomed`
- `onZoomChange`
- `disabled`
- `zoomLabel`
- `unzoomLabel`

Source: `@antkit/react/src/components/image-zoom/image-zoom.tsx`
