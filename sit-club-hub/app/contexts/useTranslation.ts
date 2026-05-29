import { useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { translations, TranslationKey } from './translations';

export function useTranslation() {
  const { lang } = useLanguage();
  const langRef = useRef(lang);
  langRef.current = lang;

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const dict = translations[langRef.current];
    let value = dict[key];
    if (value === undefined) {
      value = translations.en[key];
    }
    if (value === undefined) {
      return key;
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  }

  function tt(tag: string): string {
    const key = `tag.${tag}` as TranslationKey;
    const dict = translations[langRef.current];
    const value = dict[key];
    if (value !== undefined) return value;
    const enValue = translations.en[key];
    if (enValue !== undefined) return enValue;
    return tag;
  }

  return { t, tt, lang };
}
