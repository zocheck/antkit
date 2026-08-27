# Image

An image with a placeholder, an error fallback and a zoom viewer.

```tsx
import { Image } from '@antkit/react';
```

An image that knows how to be loading, broken, and zoomable.

```tsx
<Image src={avatar} alt="Student photo" width={160} className="rounded-lg" />
<Image src={proof} alt="Payment receipt" placeholder preview={false} />
```

## Props

- `preview`
- `fallback`
- `placeholder`
- `wrapperClassName`
- `previewTitle`
- `previewLabels`

Source: `@antkit/react/src/components/image/image.tsx`
