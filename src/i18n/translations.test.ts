import { describe, expect, it } from 'vitest';
import type { Locale } from '../types';
import { translations, translationKeys } from './translations';
import {
  BIA_LOCALE_STORAGE_KEY,
  DEFAULT_LOCALE,
  readStoredLocale,
  setDocumentLanguage,
  translate,
  writeStoredLocale,
} from './I18nProvider';

const LOCALES = ['es', 'en'] as const satisfies readonly Locale[];

describe('BIA translations', () => {
  it('keeps Spanish and English translation keys aligned', () => {
    expect(Object.keys(translations.es).sort()).toEqual(
      Object.keys(translations.en).sort(),
    );
  });

  it('exposes a complete navigation label set without hub wording', () => {
    const navigationKeys = translationKeys.filter((key) =>
      key.startsWith('navigation.'),
    );

    expect(navigationKeys).toEqual([
      'navigation.home',
      'navigation.nosotros',
      'navigation.marcas',
      'navigation.calidad',
      'navigation.talento',
      'navigation.contactanos',
      'navigation.contact',
      'navigation.openMenu',
      'navigation.closeMenu',
    ]);

    for (const key of navigationKeys) {
      for (const locale of LOCALES) {
        const value = translate(key, locale);

        expect(value).toBe(translations[locale][key]);
        expect(value.trim().length).toBeGreaterThan(0);
        expect(value).not.toMatch(/\bhubs?\b/i);
      }
    }
  });

  it('labels each secondary page in Spanish and English', () => {
    expect(translate('navigation.nosotros', 'es')).toBe('Nosotros');
    expect(translate('navigation.nosotros', 'en')).toBe('About us');
    expect(translate('navigation.marcas', 'es')).toBe('Marcas');
    expect(translate('navigation.marcas', 'en')).toBe('Brands');
    expect(translate('navigation.calidad', 'es')).toBe('Calidad');
    expect(translate('navigation.calidad', 'en')).toBe('Quality');
    expect(translate('navigation.talento', 'es')).toBe('Talento');
    expect(translate('navigation.talento', 'en')).toBe('Talent');
    expect(translate('navigation.contactanos', 'es')).toBe('Contáctanos');
    expect(translate('navigation.contactanos', 'en')).toBe('Contact us');
  });

  it('never publishes an empty or unresolved translation value', () => {
    for (const locale of LOCALES) {
      for (const key of translationKeys) {
        const value = translations[locale][key];

        expect(value.trim().length, `${locale}:${key}`).toBeGreaterThan(0);
        expect(value, `${locale}:${key}`).not.toMatch(
          /\bundefined\b|\[object Object\]/,
        );
      }
    }
  });

  it('uses Spanish as the default translation locale', () => {
    expect(DEFAULT_LOCALE).toBe('es');
    expect(translate('navigation.home')).toBe(translations.es['navigation.home']);
  });

  it('falls back to English for an unknown locale and never returns undefined for an unknown key', () => {
    expect(translate('navigation.home', 'fr' as Locale)).toBe(
      translations.en['navigation.home'],
    );
    expect(translate('missing.translation.key', 'es')).toBe('missing.translation.key');
  });

  it('does not expose object prototype properties as translation values', () => {
    expect(translate('toString', 'es')).toBe('toString');
  });

  it('reads and writes a valid locale under the BIA storage key', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    writeStoredLocale('en', storage);
    expect(values.get(BIA_LOCALE_STORAGE_KEY)).toBe('en');
    expect(readStoredLocale(storage)).toBe('en');
  });

  it('handles unavailable or throwing storage without crashing', () => {
    const unavailableStorage = {
      getItem: () => {
        throw new Error('storage unavailable');
      },
      setItem: () => {
        throw new Error('storage unavailable');
      },
    };

    expect(readStoredLocale(unavailableStorage)).toBe(DEFAULT_LOCALE);
    expect(() => writeStoredLocale('en', unavailableStorage)).not.toThrow();
  });

  it('synchronizes the document language when the locale changes', () => {
    const previousDocument = globalThis.document;
    const documentElement = { lang: '' };
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: { documentElement },
    });

    try {
      setDocumentLanguage('en');
      expect(documentElement.lang).toBe('en');
      setDocumentLanguage('es');
      expect(documentElement.lang).toBe('es');
    } finally {
      if (previousDocument === undefined) {
        delete (globalThis as { document?: Document }).document;
      } else {
        Object.defineProperty(globalThis, 'document', {
          configurable: true,
          value: previousDocument,
        });
      }
    }
  });
});
