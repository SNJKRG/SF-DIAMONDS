import type { Lang } from '../content.ts';

export const LANG_KEY = 'sf-lang';

export function preferredLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ru' || saved === 'en') return saved;
  } catch { /* storage blocked */ }
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'ru';
}
