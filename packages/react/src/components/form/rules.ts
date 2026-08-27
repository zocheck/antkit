import type { FieldValues, Validate } from 'react-hook-form';

import { isEmpty } from '../../utils';
import type { Locale } from '../../lib/config';

/**
 * Declarative validation: rules listed on the field itself, not a schema
 * declared beside it.
 *
 * A rule object may combine several constraints; each is checked in turn and
 * the first failure wins. Rules compile down to react-hook-form validators, so
 * async and cross-field checks come for free.
 */
export type Rule<TFieldValues extends FieldValues = FieldValues> = {
  /** Rejects undefined, null, '', and []. */
  required?: boolean;
  /** With `required`, also rejects a string that is only whitespace. */
  whitespace?: boolean;
  type?: 'string' | 'email' | 'url' | 'number' | 'integer';
  /** String length, or numeric value when the field is a number. */
  min?: number;
  max?: number;
  /** Exact string length. */
  len?: number;
  pattern?: RegExp;
  /**
   * Custom check. Return `true`/nothing to pass, or a message to fail.
   * Rejecting the promise fails with the rejection's message.
   */
  validator?: (
    value: unknown,
    values: TFieldValues,
  ) => boolean | string | void | Promise<boolean | string | void>;
  /**
   * Message shown when this rule fails.
   *
   * Rendered through `ConfigProvider`'s `translate`, so it can be an i18n key
   * or literal text — i18next returns an unknown key unchanged. For messages
   * that interpolate (`"at least 8 characters"`), translate in the component
   * where you declare the rule and pass the result here.
   */
  message?: string;
};

/** Fallback message keys when a rule doesn't carry its own `message`. */
const DEFAULT_MESSAGES = {
  required: 'validation.required',
  email: 'validation.email',
  url: 'validation.url',
  number: 'validation.number',
  integer: 'validation.integer',
  min: 'validation.min',
  max: 'validation.max',
  len: 'validation.len',
  pattern: 'validation.pattern',
  invalid: 'validation.invalid',
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isUrl = (value: string) => {
  try {
    const url = new URL(value);
    return !!url.protocol;
  } catch {
    return false;
  }
};

/**
 * These helpers deliberately take a narrowed shape rather than `Rule<T>`: the
 * generic only appears in `validator`, which makes `Rule<T>` contravariant and
 * therefore not assignable to `Rule<FieldValues>`.
 */
type ConstraintRule = Pick<Rule, 'type' | 'min' | 'max' | 'len'>;

const checkType = (
  rule: ConstraintRule,
  value: unknown,
): keyof typeof DEFAULT_MESSAGES | null => {
  switch (rule.type) {
    case 'email':
      return EMAIL_PATTERN.test(String(value)) ? null : 'email';
    case 'url':
      return isUrl(String(value)) ? null : 'url';
    case 'number':
      return Number.isNaN(Number(value)) ? 'number' : null;
    case 'integer':
      return Number.isInteger(Number(value)) ? null : 'integer';
    default:
      return null;
  }
};

const checkSize = (
  rule: ConstraintRule,
  value: unknown,
): keyof typeof DEFAULT_MESSAGES | null => {
  const numeric = rule.type === 'number' || rule.type === 'integer';
  const size = numeric ? Number(value) : String(value).length;

  if (rule.len !== undefined && size !== rule.len) return 'len';
  if (rule.min !== undefined && size < rule.min) return 'min';
  if (rule.max !== undefined && size > rule.max) return 'max';

  return null;
};

const runRule = async <TFieldValues extends FieldValues>(
  rule: Rule<TFieldValues>,
  value: unknown,
  values: TFieldValues,
): Promise<true | string> => {
  const fail = (fallback: keyof typeof DEFAULT_MESSAGES) =>
    rule.message ?? DEFAULT_MESSAGES[fallback];

  if (rule.required) {
    const blank =
      isEmpty(value) ||
      (rule.whitespace && typeof value === 'string' && !value.trim());

    if (blank) return fail('required');
  }

  // Only `required` complains about an empty field — this is what lets an
  // optional field carry format rules without forcing a value.
  if (isEmpty(value)) return true;

  const typeError = checkType(rule, value);
  if (typeError) return fail(typeError);

  const sizeError = checkSize(rule, value);
  if (sizeError) return fail(sizeError);

  if (rule.pattern && !rule.pattern.test(String(value))) {
    return fail('pattern');
  }

  if (rule.validator) {
    try {
      const result = await rule.validator(value, values);
      if (result === false) return fail('invalid');
      if (typeof result === 'string') return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return message || fail('invalid');
    }
  }

  return true;
};

/**
 * Compiles `rules` into the record of validators react-hook-form expects. Each
 * rule gets its own key so RHF reports the first failing one.
 */
export const rulesToValidate = <TFieldValues extends FieldValues>(
  rules: Rule<TFieldValues>[],
): Record<string, Validate<unknown, TFieldValues>> => {
  const validate: Record<string, Validate<unknown, TFieldValues>> = {};

  rules.forEach((rule, index) => {
    validate[`rule${index}`] = (value: unknown, values: TFieldValues) =>
      runRule(rule, value, values);
  });

  return validate;
};

/** True when any rule in the list makes the field mandatory. */
export const hasRequiredRule = (rules: Rule<never>[] | undefined) =>
  !!rules?.some((rule) => rule.required);

/**
 * Turns a `validation.*` fallback key back into the sentence the active locale
 * wants. A rule that carried its own `message` never produced a key, so that
 * text falls through unchanged.
 */
export const localiseRuleMessage = (message: string, locale: Locale) => {
  const key = message.startsWith('validation.') ? message.slice(11) : '';

  return key
    ? (locale.validation?.[key as keyof NonNullable<Locale['validation']>] ??
        message)
    : message;
};
