import { isEmpty } from './is-empty';

/**
 * `Nguyễn Thị Ánh Nguyệt` → `nguyen-thi-anh-nguyet`.
 *
 * Unicode normalisation splits an accented letter into its base plus a
 * combining mark, so stripping the marks folds every Latin script — Vietnamese,
 * French, Polish — in one pass rather than one regex per vowel. `đ`, `ø` and
 * `ł` are the exceptions: they are letters in their own right rather than
 * composed ones, so nothing decomposes and each has to be named.
 */
export const slugify = (value?: string) => {
  if (!value) return value;

  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[øØ]/g, 'o')
    .replace(/[łŁ]/g, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export type CurrencyFormat = {
  /** For `InputNumber`'s `formatter`. */
  formatter: (value?: string | number | null) => string;
  /** For `InputNumber`'s `parser` — the inverse, back to bare digits. */
  parser: (value?: string) => string;
};

/**
 * A `formatter` / `parser` pair for `InputNumber`, built from the locale rather
 * than from hand-rolled regexes, so grouping and the symbol's side are whatever
 * that locale actually does.
 *
 * ```tsx
 * const usd = currencyFormat('en-US', 'USD');
 * <InputNumber {...usd} value={price} onChange={setPrice} />
 *
 * const vnd = currencyFormat('vi-VN', 'VND');
 * ```
 */
export const currencyFormat = (
  locale = 'en-US',
  currency = 'USD',
): CurrencyFormat => {
  const format = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  return {
    formatter: (value) => (isEmpty(value) ? '' : format.format(Number(value))),
    // Everything that is not a digit is grouping, spacing or the symbol, and
    // none of those belong in the value the caller gets back.
    parser: (value) => (value ? value.replace(/\D/g, '') : ''),
  };
};

export const parseYoutubeIdFromUrl = (url: string) => {
  const regexYoutubeUrl = new RegExp(
    /(https?:\/\/)?(www\.)?(youtu\.be\/|youtube(?:-nocookie)?\.com\/(embed\/|v\/|watch\?(.+&)*v=))(?<videoId>(\w|-){11})/gim,
  );
  const execValue = regexYoutubeUrl.exec(url);
  regexYoutubeUrl.lastIndex = 0;
  return execValue?.groups?.videoId;
};
