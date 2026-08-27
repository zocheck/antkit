/**
 * Nothing to show and nothing to submit: `undefined`, `null`, `''`, or an
 * empty array.
 *
 * `0` and `false` are values, not absences — a quantity of zero and an unticked
 * box are both things the user chose. That is the whole reason this is a
 * function rather than `!value`, which gets it wrong for both.
 *
 * ```ts
 * isEmpty(0);       // false
 * isEmpty(false);   // false
 * isEmpty([]);      // true
 * ```
 *
 * Typed as a predicate so an early `if (isEmpty(x)) return` still narrows `x`
 * below it, the way the hand-written comparison chain used to.
 */
export const isEmpty = (value: unknown): value is undefined | null | '' | [] =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);
