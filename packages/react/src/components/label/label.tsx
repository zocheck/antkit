import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '../../utils';

/**
 * A caption bound to a form control. Clicking it moves focus to the control,
 * and it dims itself when that control is disabled.
 *
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 * ```
 *
 * `Form.Item` renders its own label from the `label` prop, so inside a form
 * you rarely reach for this directly.
 *
 * The dimming keys off a `peer-disabled` sibling or a `group-data-[disabled]`
 * ancestor — a control that is disabled without either marker leaves the label
 * looking active.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm font-medium leading-none select-none',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
