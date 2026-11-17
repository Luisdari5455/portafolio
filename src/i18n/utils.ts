import type { Language } from './translations';
import { translations } from './translations';

export function getLanguageFromUrl(url: URL): Language {
  const pathname = url.pathname;
  if (pathname.startsWith('/en')) return 'en';
  return 'es';
}

export function getLocalizedPath(path: string, lang: Language): string {
  if (lang === 'en') {
    return `/en${path}`;
  }
  return path;
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'en' || savedLang === 'es') {
      return savedLang;
    }
  }
  return 'es';
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

export function getTranslations(lang: Language) {
  return translations[lang];
}
