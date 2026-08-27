import { tv, type VariantProps } from 'tailwind-variants';

/**
 * `dotPosition` moves the dots to an edge, so the frame has to lay the
 * viewport and the dots out along the matching axis.
 */
export const carousel = tv({
  base: 'relative flex w-full',
  variants: {
    dotPosition: {
      top: 'flex-col-reverse gap-3',
      bottom: 'flex-col gap-3',
      left: 'flex-row-reverse items-center gap-3',
      right: 'flex-row items-center gap-3',
    },
  },
  defaultVariants: {
    dotPosition: 'bottom',
  },
});

export const carouselDots = tv({
  base: 'flex items-center justify-center gap-2',
  variants: {
    dotPosition: {
      top: 'flex-row',
      bottom: 'flex-row',
      left: 'flex-col',
      right: 'flex-col',
    },
  },
  defaultVariants: {
    dotPosition: 'bottom',
  },
});

export const carouselDot = tv({
  base: [
    'cursor-pointer rounded-full bg-border transition-all',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ],
  variants: {
    active: {
      true: 'bg-primary',
      false: 'hover:bg-muted-foreground/50',
    },
    dotPosition: {
      top: 'h-2',
      bottom: 'h-2',
      left: 'w-2',
      right: 'w-2',
    },
  },
  compoundVariants: [
    // The active dot stretches along the strip's axis rather than growing in
    // both directions, so the row of dots keeps its height.
    { active: true, dotPosition: 'top', class: 'w-6' },
    { active: true, dotPosition: 'bottom', class: 'w-6' },
    { active: false, dotPosition: 'top', class: 'w-2' },
    { active: false, dotPosition: 'bottom', class: 'w-2' },
    { active: true, dotPosition: 'left', class: 'h-6' },
    { active: true, dotPosition: 'right', class: 'h-6' },
    { active: false, dotPosition: 'left', class: 'h-2' },
    { active: false, dotPosition: 'right', class: 'h-2' },
  ],
  defaultVariants: {
    active: false,
    dotPosition: 'bottom',
  },
});

export const carouselArrow = tv({
  base: [
    'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center',
    'rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur',
    'transition-opacity hover:bg-background',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-0',
    '[&>svg]:size-4',
  ],
  variants: {
    side: {
      previous: 'left-2',
      next: 'right-2',
    },
  },
});

export type CarouselVariants = VariantProps<typeof carousel>;
