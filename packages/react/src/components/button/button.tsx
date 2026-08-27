import * as React from 'react';
import { LoaderCircleIcon } from 'lucide-react';
import { Slot } from 'radix-ui';

import { button, type ButtonVariants } from './button.styles';

// `prefix` is a global RDFa attribute typed as `string` on every DOM element,
// so it has to be dropped before the icon slot below can redeclare it — an
// intersection would leave it `string & ReactNode`, which no icon satisfies.
export type ButtonProps = Omit<React.ComponentProps<'button'>, 'prefix'> &
  ButtonVariants & {
    asChild?: boolean;
    /** Content rendered before the button label, usually an icon. */
    prefix?: React.ReactNode;
    /** Content rendered after the button label, usually an icon. */
    suffix?: React.ReactNode;
    /** Shows progress and prevents duplicate submits while an action is pending. */
    loading?: boolean;
    loadingLabel?: string;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      radius = 'md',
      asChild = false,
      prefix,
      suffix,
      block = false,
      loading = false,
      loadingLabel = 'Loading',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-radius={radius}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        className={button({ variant, size, radius, block, className })}
        {...props}
      >
        {loading ? (
          <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
        ) : (
          prefix
        )}
        {loading && <span className="sr-only">{loadingLabel}</span>}
        {children}
        {!loading && suffix}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export { button as buttonStyles } from './button.styles';
