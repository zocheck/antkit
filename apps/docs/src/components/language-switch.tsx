import { Button } from '@antkit/react';

import { LOCALES, LOCALE_CODES, useLocale, useT } from '../lib/i18n';

/**
 * Two codes rather than a dropdown: with a handful of languages a menu is one
 * more click for no more information, and the codes read the same in both.
 */
export const LanguageSwitch = () => {
  const { code, setLocale } = useLocale();
  const t = useT();

  return (
    <div className="flex items-center gap-0.5" aria-label={t.chrome.language}>
      {LOCALE_CODES.map((option) => (
        <Button
          key={option}
          size="xs"
          variant={option === code ? 'secondary' : 'ghost'}
          aria-pressed={option === code}
          onClick={() => setLocale(option)}
          className="font-medium uppercase"
        >
          {option}
          <span className="sr-only">{LOCALES[option].name}</span>
        </Button>
      ))}
    </div>
  );
};
