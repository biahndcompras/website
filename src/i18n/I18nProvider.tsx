import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Locale } from '../types';
import { translations, type TranslationKey } from './translations';

export const DEFAULT_LOCALE: Locale = 'es';
export const BIA_LOCALE_STORAGE_KEY = 'bia-honduras-locale';

export interface LocaleStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

interface DocumentLike {
  documentElement: {
    lang: string;
  };
}

export const isLocale = (value: unknown): value is Locale =>
  value === 'es' || value === 'en';

function getBrowserStorage(): LocaleStorage | null {
  try {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
  } catch {
    // Access to storage can be blocked by browser privacy settings.
  }

  try {
    if (typeof globalThis !== 'undefined') {
      return (globalThis as { localStorage?: LocaleStorage }).localStorage ?? null;
    }
  } catch {
    // Access to storage can be blocked by browser privacy settings.
  }

  return null;
}

export function readStoredLocale(
  storage: LocaleStorage | null = getBrowserStorage(),
): Locale {
  try {
    const storedLocale = storage?.getItem(BIA_LOCALE_STORAGE_KEY);
    return isLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeStoredLocale(
  locale: Locale,
  storage: LocaleStorage | null = getBrowserStorage(),
): void {
  if (!isLocale(locale)) {
    return;
  }

  try {
    storage?.setItem(BIA_LOCALE_STORAGE_KEY, locale);
  } catch {
    // Locale changes should still work when storage is unavailable.
  }
}

export function setDocumentLanguage(
  locale: Locale,
  targetDocument?: DocumentLike | null,
): void {
  if (!isLocale(locale)) {
    return;
  }

  try {
    const documentToUpdate =
      targetDocument ?? (typeof document !== 'undefined' ? document : null);
    if (documentToUpdate?.documentElement) {
      documentToUpdate.documentElement.lang = locale;
    }
  } catch {
    // The provider remains usable in non-DOM environments.
  }
}

export function translate(
  key: TranslationKey,
  locale?: Locale,
): string;
export function translate(
  key: string,
  locale?: Locale | string,
): string;
export function translate(key: string, locale: Locale | string = DEFAULT_LOCALE): string {
  const activeTranslations = isLocale(locale) ? translations[locale] : translations.en;
  const lookup = (dictionary: typeof translations.en) => {
    if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
      return undefined;
    }

    const value = dictionary[key as TranslationKey];
    return typeof value === 'string' ? value : undefined;
  };
  const activeValue = lookup(activeTranslations);
  const fallbackValue = lookup(translations.en);

  return activeValue ?? fallbackValue ?? key;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, locale?: Locale | string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  const setLocale = useCallback((nextLocale: Locale) => {
    if (!isLocale(nextLocale)) {
      return;
    }

    setLocaleState(nextLocale);
    writeStoredLocale(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === DEFAULT_LOCALE ? 'en' : DEFAULT_LOCALE);
  }, [locale, setLocale]);

  useEffect(() => {
    setDocumentLanguage(locale);
  }, [locale]);

  const t = useCallback(
    (key: string, requestedLocale?: Locale | string) =>
      translate(key, requestedLocale ?? locale),
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}

export default I18nProvider;
