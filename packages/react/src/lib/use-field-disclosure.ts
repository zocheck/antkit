import { useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

/** Radix dispatches its outside-interaction events as this shape. */
type OutsideEvent = CustomEvent<{ originalEvent: Event }>;

export type FieldDisclosureOptions = {
  open: boolean;
  setOpen: (next: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

/**
 * Opens a picker's panel from the whole field, not just its icon button.
 *
 * A segmented date/time field looks like a text input, so people click the
 * middle of it and expect the panel — hunting for a 32px icon is a step nobody
 * should have to learn. This wires that up for `DatePicker`, `TimePicker` and
 * their range variants, which all share the anchor-plus-trigger layout.
 *
 * ```tsx
 * const disclosure = useFieldDisclosure({ open, setOpen, disabled, readOnly });
 *
 * <Popover open={open} onOpenChange={setOpen}>
 *   <PopoverAnchor asChild>
 *     <div {...disclosure.fieldProps}>…segments…</div>
 *   </PopoverAnchor>
 *   <PopoverContent {...disclosure.contentProps}>…</PopoverContent>
 * </Popover>
 * ```
 *
 * Typing keeps working while the panel is up: focus never leaves the segment
 * that was clicked, and moving between segments doesn't count as clicking away.
 */
export const useFieldDisclosure = ({
  open,
  setOpen,
  disabled,
  readOnly,
}: FieldDisclosureOptions) => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const locked = disabled || readOnly;

  /**
   * Whether the panel should take focus when it opens. Reaching for the icon or
   * pressing Alt+Down is a request to *be* in the panel; clicking a segment is
   * a request to type in that segment, and a panel that grabs focus there would
   * swallow the next keystroke.
   *
   * A ref rather than state because every writer sets it in the same event that
   * flips `open`, so the render that mounts the panel already sees the new
   * value.
   */
  const focusPanel = useRef(true);

  const isInsideField = (target: EventTarget | null) =>
    target instanceof Node && !!fieldRef.current?.contains(target);

  const keepOpen = (event: OutsideEvent) => {
    // The field is the popover's anchor, so Radix counts it as outside. Without
    // this, clicking the minute segment would close the panel that clicking the
    // hour segment just opened.
    if (isInsideField(event.detail.originalEvent.target)) {
      event.preventDefault();
    }
  };

  return {
    fieldRef,

    /**
     * Pass to a panel that focuses itself on mount — `Calendar`'s `autoFocus`.
     * Read it during render; it is already correct by the time the panel mounts.
     */
    get autoFocusPanel() {
      return focusPanel.current;
    },

    /** Spread onto the element wrapping the field. */
    fieldProps: {
      ref: fieldRef,
      onMouseDown: (event: MouseEvent) => {
        if (locked || open) return;
        // The icon is a real PopoverTrigger and toggles on its own; opening
        // here too would fight it on the way back closed.
        if (
          event.target instanceof Element &&
          event.target.closest('[data-picker-toggle]')
        ) {
          return;
        }

        focusPanel.current = false;
        setOpen(true);
      },
      onKeyDown: (event: KeyboardEvent) => {
        if (locked) return;

        // Bare arrows already step the focused segment, so opening takes the
        // combobox convention of Alt+Down instead.
        if (event.altKey && event.key === 'ArrowDown') {
          event.preventDefault();
          focusPanel.current = true;
          setOpen(true);
          return;
        }

        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
        }
      },
    },

    /** Spread onto `PopoverContent`. */
    contentProps: {
      // Focus stays on the segment the user clicked, so they can keep typing
      // with the panel open.
      onOpenAutoFocus: (event: Event) => event.preventDefault(),
      onPointerDownOutside: keepOpen,
      onFocusOutside: keepOpen,
    },

    /** Spread onto the icon button, so the field click handler leaves it alone. */
    toggleProps: {
      'data-picker-toggle': '',
      // Both paths run before the trigger's own click opens the panel.
      onMouseDown: () => {
        focusPanel.current = true;
      },
      onKeyDown: () => {
        focusPanel.current = true;
      },
    },
  };
};
