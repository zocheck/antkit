import { tv, type VariantProps } from 'tailwind-variants';

/**
 * `tv` already runs tailwind-merge over the result, so the component hands it
 * `className` directly instead of wrapping the call in `cn` — one merge pass,
 * and a caller's `px-6` still beats the size variant's padding.
 */
export const button = tv({
  base: [
    // `relative` is what the click wave's `::after` anchors to.
    'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'text-sm font-medium transition-all outline-hidden',
    'focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  variants: {
    variant: {
      // `--wave` is the colour the click wave spreads in. A variant that sets
      // it opts into the wave; `ghost` and `link` leave it unset and stay
      // still — a wave on a borderless button reads as a smudge.
      default:
        'bg-primary text-primary-foreground hover:bg-primary/90 [--wave:var(--color-primary)]',
      destructive:
        'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [--wave:var(--color-destructive)]',
      outline:
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 [--wave:var(--color-primary)]',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 [--wave:var(--color-secondary-foreground)]',
      ghost:
        'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 px-4 py-2 has-[>svg]:px-3',
      xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
      md: 'h-10 px-4 py-2 has-[>svg]:px-3',
      lg: 'h-11 rounded-md px-6 has-[>svg]:px-4',
      xl: 'h-12 rounded-lg px-8 text-base has-[>svg]:px-5',
      icon: 'size-10',
      'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
      'icon-sm': 'size-8',
      'icon-lg': 'size-11',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    block: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    radius: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
