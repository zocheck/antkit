# Marquee

A looping strip of content that pauses on hover.

```tsx
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem, MarqueeStyles } from '@antkit/react';
```

A row of items scrolling past, for logos, testimonials, a ticker of recent
runs.

```tsx
<Marquee>
  <MarqueeFade side="left" />
  <MarqueeFade side="right" />
  <MarqueeContent speed={40}>
    {logos.map((logo) => (
      <MarqueeItem key={logo.id} className="h-10">
        <img src={logo.src} alt={logo.name} className="h-full" />
      </MarqueeItem>
    ))}
  </MarqueeContent>
</Marquee>
```

A vertical marquee needs a height on this element — there is nothing else to
bound it.


Source: `@antkit/react/src/components/marquee/marquee.tsx`
