import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';

import { Checkbox, type CheckboxProps } from '../checkbox';
import { Label } from '../label';

type CheckboxGroupContextValue = {
  value: string[];
  toggle: (itemValue: string, checked: boolean) => void;
  name?: string;
  disabled?: boolean;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);

/**
 * The group's state, for anything the components don't cover — a select-all
 * box, a counter, clearing the selection from a button outside the group.
 */
export const useCheckboxGroup = () => {
  const context = useContext(CheckboxGroupContext);

  if (!context) {
    throw new Error('useCheckboxGroup must be used inside a <CheckboxGroup>');
  }

  return context;
};

export type CheckboxGroupProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  /** Controlled selection. Pair with `onValueChange`. */
  value?: string[];
  /** Uncontrolled starting selection. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Submitted as `name[]` by each box, for a plain form post. */
  name?: string;
  /** Disables every box in the group. */
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

/**
 * Several independent checkboxes sharing one array of values.
 *
 * Radix has no checkbox-group primitive — a checkbox group is not a roving
 * focus widget, each box is tabbable on its own — so this is a thin controlled
 * wrapper over `Checkbox` rather than a primitive re-export.
 *
 * ```tsx
 * <CheckboxGroup defaultValue={['email']} onValueChange={setChannels}>
 *   <CheckboxOption value="email">Email</CheckboxOption>
 *   <CheckboxOption value="sms" description="Tính phí theo tin nhắn">SMS</CheckboxOption>
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = ({
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  orientation = 'vertical',
  className,
  ...props
}: CheckboxGroupProps) => {
  const [uncontrolled, setUncontrolled] = useState<string[]>(
    defaultValue ?? [],
  );
  const isControlled = value !== undefined;
  const selected = isControlled ? value : uncontrolled;

  const toggle = useCallback(
    (itemValue: string, checked: boolean) => {
      const current = isControlled ? value : uncontrolled;
      const next = checked
        ? current.includes(itemValue)
          ? current
          : [...current, itemValue]
        : current.filter((entry) => entry !== itemValue);

      if (next === current) return;

      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange, uncontrolled, value],
  );

  const context = useMemo(
    () => ({ value: selected, toggle, name, disabled }),
    [disabled, name, selected, toggle],
  );

  return (
    <CheckboxGroupContext value={context}>
      <div
        data-slot="checkbox-group"
        role="group"
        data-orientation={orientation}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'grid gap-2.5',
          'data-[orientation=horizontal]:auto-cols-max data-[orientation=horizontal]:grid-flow-col data-[orientation=horizontal]:gap-5',
          className,
        )}
        {...props}
      />
    </CheckboxGroupContext>
  );
};

export type CheckboxGroupItemProps = Omit<
  CheckboxProps,
  'checked' | 'defaultChecked' | 'value'
> & {
  value: string;
};

/**
 * The bare box, wired to the group. Use `CheckboxOption` when it has a label.
 */
export const CheckboxGroupItem = ({
  value,
  disabled,
  onCheckedChange,
  ...props
}: CheckboxGroupItemProps) => {
  const group = useCheckboxGroup();

  return (
    <Checkbox
      data-slot="checkbox-group-item"
      value={value}
      name={group.name ? `${group.name}[]` : undefined}
      checked={group.value.includes(value)}
      disabled={disabled ?? group.disabled}
      onCheckedChange={(checked) => {
        group.toggle(value, checked === true);
        onCheckedChange?.(checked);
      }}
      {...props}
    />
  );
};

export type CheckboxOptionProps = CheckboxGroupItemProps & {
  /** Secondary line under the label. */
  description?: ReactNode;
};

/**
 * One labelled choice: the box, its label, and an optional description.
 *
 * The description sits *inside* the label so clicking it toggles the box — see
 * `Radio` for the trade that buys.
 */
export const CheckboxOption = ({
  id,
  description,
  children,
  className,
  ...props
}: CheckboxOptionProps) => {
  const generatedId = useId();
  const itemId = id ?? generatedId;

  return (
    <div
      data-slot="checkbox-option"
      className={cn('flex items-start gap-2.5', className)}
    >
      <CheckboxGroupItem id={itemId} className="mt-0.5" {...props} />
      {(children || description) && (
        // `Label` already carries `peer-disabled:`, so being the box's direct
        // sibling is what makes a group-level `disabled` dim the text.
        <Label
          htmlFor={itemId}
          className="grid cursor-pointer gap-1 font-normal"
        >
          <span>{children}</span>
          {!!description && (
            <span
              data-slot="checkbox-option-description"
              className="text-sm font-normal text-muted-foreground"
            >
              {description}
            </span>
          )}
        </Label>
      )}
    </div>
  );
};
