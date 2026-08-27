import { tv, type VariantProps } from 'tailwind-variants';

export const tabsList = tv({
  base: 'flex shrink-0 data-[orientation=vertical]:flex-col',
  variants: {
    variant: {
      // Segmented control on a muted track — the default shadcn look.
      default: [
        'w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground',
        'data-[orientation=vertical]:h-fit data-[orientation=vertical]:w-auto',
      ],
      // Underlined tabs for page-level navigation, where a filled track is
      // too heavy.
      underline: [
        'w-full items-stretch gap-4 border-border text-muted-foreground',
        'data-[orientation=horizontal]:border-b data-[orientation=vertical]:w-auto data-[orientation=vertical]:border-l',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type TabsListVariants = VariantProps<typeof tabsList>;
