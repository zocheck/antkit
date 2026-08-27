import * as React from 'react';
import { LoaderCircleIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import { Slot } from 'radix-ui';

import { button, type ButtonVariants } from './button.styles';

/**
 * The click wave, as two identical animations under different names. A CSS
 * animation does not restart when an attribute merely changes value, so
 * alternating `a`/`b` per click is what makes a second click wave again —
 * cheaper and steadier than toggling the attribute off across a frame.
 *
 * Deliberately faint and slow: a 4px spread at 12% opacity on `ease-out`. A
 * bigger spread on a curve that is near-vertical at the start reads as a flash
 * on a button you click often.
 * Tune it per button, or globally, by redeclaring `--wave-opacity`,
 * `--wave-spread` or `--wave-duration`.
 *
 * Only a variant that set `--wave` gets one: with the variable unset the
 * `box-shadow` is invalid at computed-value time, so `ghost` and `link` animate
 * nothing visible. React hoists and dedupes this by `href`, so it lands in
 * `<head>` once however many buttons render.
 */
const WaveStyles = () => (
  <style href="antkit-button-wave" precedence="default">
    {`@keyframes antkit-wave-a{from{box-shadow:0 0 0 0 var(--wave);opacity:var(--wave-opacity,.12)}to{box-shadow:0 0 0 var(--wave-spread,4px) var(--wave);opacity:0}}
@keyframes antkit-wave-b{from{box-shadow:0 0 0 0 var(--wave);opacity:var(--wave-opacity,.12)}to{box-shadow:0 0 0 var(--wave-spread,4px) var(--wave);opacity:0}}
[data-slot="button"][data-wave]::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none}
[data-slot="button"][data-wave="a"]::after{animation:antkit-wave-a var(--wave-duration,.5s) ease-out}
[data-slot="button"][data-wave="b"]::after{animation:antkit-wave-b var(--wave-duration,.5s) ease-out}
@media (prefers-reduced-motion: reduce){[data-slot="button"][data-wave]::after{animation:none!important}}`}
  </style>
);

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
    /**
     * The wave that spreads from the border on click. Tune its look with the
     * `--wave-opacity`, `--wave-spread` and `--wave-duration` variables.
     */
    wave?: boolean;
  };

/**
 * A button. `asChild` renders it as another element — a router link, say —
 * while keeping the styling and the focus ring.
 *
 * `variant` is `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' |
 * 'link'`, `size` is `'xs' | 'sm' | 'md' | 'lg' | 'xl'` plus the square
 * `'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'`, and `radius` is `'none' | 'sm' |
 * 'md' | 'lg' | 'xl' | 'full'`.
 *
 * ```tsx
 * <Button variant="outline" loading={saving} prefix={<SaveIcon />}>
 *   Save
 * </Button>
 *
 * <Button asChild variant="link">
 *   <a href="/pricing">See pricing</a>
 * </Button>
 * ```
 *
 * Reach for `DropdownMenu` when the click opens a list of actions rather than
 * performing one, and `Popconfirm` when it needs confirming first.
 *
 * `loading` implies `disabled` and takes over the `prefix` slot for the
 * spinner, so `suffix` is hidden while it is on. An icon-only button still
 * needs an accessible name — give it `aria-label`.
 */
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
      loadingLabel,
      wave = true,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const locale = useLocale();
    const Comp = asChild ? Slot.Root : 'button';
    const isDisabled = disabled || loading;
    // Alternates rather than counts: the CSS only cares which of the two
    // animations is named, and a boolean cannot go stale.
    const [wavedB, setWavedB] = React.useState<boolean | null>(null);

    return (
      <>
        {wave && <WaveStyles />}
        <Comp
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          data-radius={radius}
          // Keyboard activation fires `click` too, so Enter and Space wave.
          data-wave={
            wave && !isDisabled && wavedB !== null
              ? wavedB
                ? 'b'
                : 'a'
              : undefined
          }
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          disabled={isDisabled}
          className={button({ variant, size, radius, block, className })}
          onClick={(event) => {
            setWavedB((previous) => !previous);
            onClick?.(event);
          }}
          {...props}
        >
          {loading ? (
            <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
          ) : (
            prefix
          )}
          {loading && (
            <span className="sr-only">
              {loadingLabel ?? locale.common?.loading ?? 'Loading'}
            </span>
          )}
          {/*
           * `Slottable` marks which child is the caller's element. Without it,
           * `asChild` hands Slot three children — the two icon slots included,
           * even when they are `undefined` — and Slot only accepts one.
           */}
          {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
          {!loading && suffix}
        </Comp>
      </>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export { button as buttonStyles } from './button.styles';
