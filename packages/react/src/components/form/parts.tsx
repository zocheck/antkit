import { createContext, useContext } from 'react';
import type { ComponentProps } from 'react';

import { cn } from '../../utils';
import { Slot } from 'radix-ui';
import { useFormContext, useFormState } from 'react-hook-form';

import { useUiConfig } from '../../lib/ui-config';
import { Label } from '../label';

/**
 * The rendering pieces of a field. `FormItem` composes them for you; they stay
 * exported so a custom control can rebuild the same accessible markup.
 */

export const FormFieldContext = createContext<{ name: string } | null>(null);
export const FormItemContext = createContext<{ id: string } | null>(null);

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name as string });

  if (!fieldContext) {
    throw new Error('useFormField must be used inside a <Form.Item>');
  }
  if (!itemContext) {
    throw new Error('useFormField must be used inside a <Form.Item>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

/** Ids the control needs so the label, hint and error are announced with it. */
export const useFieldAria = () => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return {
    id: formItemId,
    'aria-invalid': !!error,
    'aria-describedby': error
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId,
  };
};

export function FormLabel({
  className,
  required,
  children,
  ...props
}: ComponentProps<typeof Label> & { required?: boolean }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    >
      {/*
        antd puts the marker before the label — `.ant-form-item-required::before`
        with a 4px gap — not after it. `-mr-1` trims the label's own 8px gap
        down to that 4.
      */}
      {required && (
        <span aria-hidden className="-mr-1 text-destructive">
          *
        </span>
      )}
      {children}
    </Label>
  );
}

export function FormControl({ ...props }: ComponentProps<typeof Slot.Root>) {
  return <Slot.Root data-slot="form-control" {...useFieldAria()} {...props} />;
}

export function FormDescription({ className, ...props }: ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function FormMessage({ className, ...props }: ComponentProps<'p'>) {
  const { translate } = useUiConfig();
  const { error, formMessageId } = useFormField();

  // Rule messages are i18n keys by default; the host wires `translate` through
  // `UiConfigProvider`. Literal text passes through unchanged.
  const body = error ? translate(String(error.message ?? '')) : props.children;

  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
}
