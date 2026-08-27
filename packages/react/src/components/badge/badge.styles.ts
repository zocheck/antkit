import { tv, type VariantProps } from 'tailwind-variants';

export const badge = tv({
  base: [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap',
    'rounded-full border px-2 py-0.5 text-xs font-medium transition-colors',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ],
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground',
      outline: 'border-border bg-background text-foreground',
      // Semantic states an admin table needs, using the brand palette rather
      // than raw Tailwind colours so they follow the theme.
      success: 'border-transparent bg-green-100 text-green-700',
      warning: 'border-transparent bg-orange-100 text-orange-700',
      info: 'border-transparent bg-blue-100 text-blue-700',
      muted: 'border-transparent bg-muted text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type BadgeVariants = VariantProps<typeof badge>;
