# Slider

One or two handles, with marks and a value tooltip.

```tsx
import { Slider } from '@antkit/react';
```

Pick a number, or a range of them.

```tsx
<Slider value={volume} onChange={(v) => setVolume(v as number)} />
<Slider range defaultValue={[20, 60]} marks={{ 0: '0%', 100: '100%' }} />
```

## Props

- `value`
- `defaultValue`
- `onChange`
- `onChangeComplete`
- `range`
- `vertical`
- `marks`
- `tooltip`
- `formatTooltip`

Source: `@antkit/react/src/components/slider/slider.tsx`
