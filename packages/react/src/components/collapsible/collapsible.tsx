'use client';

import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

/**
 * A section that opens and closes in place. Uncontrolled by default; pass
 * `open` and `onOpenChange` to drive it yourself.
 *
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
 *   <CollapsibleContent>Whatever is worth hiding by default.</CollapsibleContent>
 * </Collapsible>
 * ```
 *
 * Use `Tabs` for several panels where one is always showing, and `Sheet` or
 * `Modal` when the content should sit above the page rather than push it down.
 *
 * The trigger renders a `<button>`; give it `asChild` to supply your own.
 */
const Collapsible = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

const CollapsibleTrigger = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
};

const CollapsibleContent = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
