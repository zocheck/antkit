# Carousel

Slides that snap, with dots, arrows, autoplay and a fade effect.

```tsx
import { Carousel } from '@antkit/react';
```

A row of slides that snaps, with dots, arrows and autoplay.

```tsx
<Carousel autoplay slidesToShow={3} gap={16} aria-label="Featured courses">
  {courses.map((course) => (
    <CourseCard key={course.id} course={course} />
  ))}
</Carousel>
```

Reach for `Marquee` when the row should scroll on its own forever and
nobody needs to land on a particular item, and for `Tabs` when the panels
are destinations rather than a sequence.

Scrolling is CSS scroll-snap on a real scroll container, so touch and
trackpad gestures are the browser's, not ours. That is also why `infinite`
jumps back to the first slide at the end rather than looping seamlessly —
a seamless loop needs cloned slides, and cloned slides break the scrollbar
and the reading order.

## Props

- `children`
- `current`
- `defaultCurrent`
- `onChange`
- `autoplay`
- `autoplaySpeed`
- `dots`
- `dotPosition`
- `arrows`
- `effect`
- `infinite`
- `slidesToShow`
- `gap`
- `ref`

Source: `@antkit/react/src/components/carousel/carousel.tsx`
