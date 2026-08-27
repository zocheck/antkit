import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * Sonner's toast host, wired to the kit's tokens and icon set. Render it once,
 * near the root of the app; `toast()` comes from `sonner` itself.
 *
 * ```tsx
 * import { toast } from 'sonner';
 *
 * <Toaster position="bottom-right" />;
 *
 * toast('Invoice deleted', {
 *   action: { label: 'Undo', onClick: () => restore(invoice) },
 * });
 * ```
 *
 * Use `message.success()` for a plain "it worked" pill — it needs no host in
 * the tree and no action. `Alert` when the notice belongs in the page rather
 * than over it, `Notification` for something the user has to dismiss.
 *
 * A toast renders outside the React tree that called it, so it cannot read
 * context. Translate the text before you pass it in.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
