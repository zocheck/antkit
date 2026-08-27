import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { Loader2Icon } from 'lucide-react';
import { Switch as SwitchPrimitive } from 'radix-ui';

export type SwitchProps = Omit<
  ComponentProps<typeof SwitchPrimitive.Root>,
  'children'
> & {
  size?: 'sm' | 'default';
  /** Blocks interaction and spins the knob. */
  loading?: boolean;
  /** Text inside the track when on — e.g. `Bật`. */
  checkedChildren?: ReactNode;
  /** Text inside the track when off — e.g. `Tắt`. */
  uncheckedChildren?: ReactNode;
};

/**
 * An on/off toggle that commits immediately. Use `Checkbox` when the value is
 * only saved once the surrounding form is submitted.
 *
 * ```tsx
 * <Switch checked={active} onCheckedChange={setActive} />
 * <Switch defaultChecked checkedChildren="Bật" uncheckedChildren="Tắt" />
 * ```
 */
export const Switch = ({
  size = 'default',
  loading = false,
  checkedChildren,
  uncheckedChildren,
  disabled,
  className,
  ...props
}: SwitchProps) => {
  const hasLabels =
    checkedChildren !== undefined || uncheckedChildren !== undefined;
  const isSmall = size === 'sm';

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent transition-colors',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isSmall ? 'h-5 w-9' : 'h-6 w-11',
        // Labels need room the fixed widths above don't leave.
        hasLabels && (isSmall ? 'w-auto min-w-12' : 'w-auto min-w-14'),
        className,
      )}
      {...props}
    >
      {hasLabels && (
        <>
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs leading-none font-medium',
              'text-primary-foreground opacity-0 [[data-state=checked]>&]:opacity-100',
              isSmall ? 'left-1.5' : 'left-2',
            )}
          >
            {checkedChildren}
          </span>
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs leading-none font-medium',
              'text-muted-foreground opacity-0 [[data-state=unchecked]>&]:opacity-100',
              isSmall ? 'right-1.5' : 'right-2',
            )}
          >
            {uncheckedChildren}
          </span>
        </>
      )}

      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-center',
          'rounded-full bg-background shadow-sm ring-0',
          // Animating `left` rather than a translate keeps the knob correct on a
          // track whose width depends on its labels.
          'transition-[left] duration-200 ease-out',
          isSmall
            ? 'left-0 size-4 data-[state=checked]:left-[calc(100%-1rem)]'
            : 'left-0 size-5 data-[state=checked]:left-[calc(100%-1.25rem)]',
        )}
      >
        {loading && (
          <Loader2Icon
            className={cn(
              'animate-spin text-muted-foreground',
              isSmall ? 'size-2.5' : 'size-3',
            )}
          />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
};
