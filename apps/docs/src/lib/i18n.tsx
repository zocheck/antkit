import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { en } from './locales/en';
import { vi } from './locales/vi';
import type { Dictionary, Locale } from './types';

export const LOCALES: Record<Locale, Dictionary> = { vi, en };

/** Alias kept short at the call site: `locale.code` is a `LocaleCode`. */
export type LocaleCode = Locale;

export const LOCALE_CODES = Object.keys(LOCALES) as LocaleCode[];

/** What an untranslated page falls back to. */
export const FALLBACK: LocaleCode = 'en';

const STORAGE_KEY = 'antkit-locale';

const isLocale = (value: string | null): value is LocaleCode =>
  !!value && value in LOCALES;

/**
 * Vietnamese wins a tie: this kit is built for a Vietnamese product, so a
 * Vietnamese browser lands on the Vietnamese guides. Any other
 * `navigator.language` gets English. The demos themselves are English in both
 * languages — they are sample code, not prose.
 */
const detect = (): LocaleCode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;

  return navigator.language.toLowerCase().startsWith('vi') ? 'vi' : FALLBACK;
};

type LocaleContextValue = {
  code: LocaleCode;
  t: Dictionary;
  setLocale: (code: LocaleCode) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [code, setLocale] = useState<LocaleCode>(detect);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = LOCALES[code].lang;
  }, [code]);

  const value = useMemo<LocaleContextValue>(
    () => ({ code, t: LOCALES[code], setLocale }),
    [code],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used inside a LocaleProvider');
  }

  return context;
};

/** The dictionary on its own — what most components actually want. */
export const useT = () => useLocale().t;
