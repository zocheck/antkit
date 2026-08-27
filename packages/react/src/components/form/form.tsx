import { cloneElement, isValidElement, useId } from 'react';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

import { cn } from '../../utils';
import {
  Controller,
  FormProvider,
  useForm as useReactHookForm,
} from 'react-hook-form';
import type {
  FieldPath,
  FieldValues,
  SubmitErrorHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';

import {
  FormDescription,
  FormFieldContext,
  FormItemContext,
  FormLabel,
  FormMessage,
  useFieldAria,
} from './parts';
import { hasRequiredRule, rulesToValidate } from './rules';
import type { Rule } from './rules';

type FormProps<TFieldValues extends FieldValues> = Omit<
  ComponentProps<'form'>,
  'onSubmit'
> & {
  form: UseFormReturn<TFieldValues>;
  /** Called with the parsed values once every rule passes. */
  onFinish?: (values: TFieldValues) => unknown;
  /** Called with the field errors when validation fails. */
  onFinishFailed?: SubmitErrorHandler<TFieldValues>;
  layout?: 'vertical' | 'horizontal';
};

const FormRoot = <TFieldValues extends FieldValues>({
  form,
  onFinish,
  onFinishFailed,
  layout = 'vertical',
  className,
  children,
  ...props
}: FormProps<TFieldValues>) => {
  return (
    <FormProvider {...form}>
      <form
        data-slot="form"
        data-layout={layout}
        // The browser's own validation bubbles would fight the rules below, so
        // the rule engine stays the single source of truth.
        noValidate
        onSubmit={form.handleSubmit(
          (values) => void onFinish?.(values),
          onFinishFailed,
        )}
        className={cn('grid gap-5', className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

type FormItemProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: ReactNode;
  /** Hint rendered under the control. */
  description?: ReactNode;
  rules?: Rule<TFieldValues>[];
  /**
   * Which prop the control reads its value from. `Checkbox` and `Switch` want
   * `'checked'`; text inputs use the default.
   */
  valuePropName?: string;
  /** Forces the required marker when the rule list doesn't imply it. */
  required?: boolean;
  className?: string;
  children: ReactElement;
};

/**
 * A labelled, validated field.
 *
 * `rules` is the whole validation story — no resolver, no separate schema:
 *
 * ```tsx
 * <Form.Item
 *   name="email"
 *   label="Email"
 *   rules={[{ required: true }, { type: 'email' }]}
 * >
 *   <Input />
 * </Form.Item>
 * ```
 *
 * The child control is cloned with `value`/`onChange`/`onBlur` and the aria ids,
 * so it does not need to know it is inside a form.
 */
const FormItem = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  rules,
  valuePropName = 'value',
  required,
  className,
  children,
}: FormItemProps<TFieldValues, TName>) => {
  const id = useId();
  const isRequired = required ?? hasRequiredRule(rules as Rule<never>[]);

  return (
    <FormFieldContext value={{ name }}>
      <FormItemContext value={{ id }}>
        <div data-slot="form-item" className={cn('grid gap-2', className)}>
          {!!label && <FormLabel required={isRequired}>{label}</FormLabel>}

          <Controller
            name={name}
            rules={
              rules?.length ? { validate: rulesToValidate(rules) } : undefined
            }
            render={({ field }) => (
              <FieldControl field={field} valuePropName={valuePropName}>
                {children}
              </FieldControl>
            )}
          />

          {/*
            Error first, hint second: once a field is wrong, the correction
            matters more than the advice that came with it. `FormItemInput`
            renders `explain` then `extra`, so the message sits right under the
            control it belongs to and the hint stays put at the bottom of the
            field instead of being pushed around by an error appearing above it.
          */}
          <FormMessage />
          {!!description && <FormDescription>{description}</FormDescription>}
        </div>
      </FormItemContext>
    </FormFieldContext>
  );
};

type FieldControlProps = {
  field: Record<string, unknown>;
  valuePropName: string;
  children: ReactElement;
};

/**
 * Injects the react-hook-form field into the child control.
 *
 * Split out of `FormItem` because the aria ids come from a hook, and hooks
 * cannot be called inside `Controller`'s render callback.
 */
const FieldControl = ({
  field,
  valuePropName,
  children,
}: FieldControlProps) => {
  const aria = useFieldAria();

  if (!isValidElement(children)) return children;

  const { value, ...rest } = field;

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    ...rest,
    // An undefined value would flip the input from controlled to uncontrolled
    // mid-life and make React shout about it.
    [valuePropName]: value ?? '',
    ...aria,
    ...(children.props as Record<string, unknown>),
    // aria wins over anything the caller passed, otherwise the label and error
    // stop pointing at the control.
    ...aria,
  });
};

const useForm = <TFieldValues extends FieldValues>(
  props?: UseFormProps<TFieldValues>,
) =>
  useReactHookForm<TFieldValues>({
    // Errors appear once a field has been visited, not on the first keystroke.
    mode: 'onTouched',
    ...props,
  });

export const Form = Object.assign(FormRoot, {
  Item: FormItem,
  useForm,
});

export { FormItem, useForm };
export type { FormItemProps, FormProps };
