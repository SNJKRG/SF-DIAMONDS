import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../store.ts';
import { LANG_KEY } from './lang.ts';

export default function LangSwitch() {
  const { lang, s } = useLang();
  const { pathname, search, hash } = useLocation();
  const rest = pathname.replace(/^\/(ru|en)/, '');
  return (
    <div className="lang" role="group" aria-label={s.nav.language}>
      {(['ru', 'en'] as const).map((l) =>
        l === lang ? (
          <span key={l} aria-current="true" title={s.localeName[l]}>{l.toUpperCase()}</span>
        ) : (
          <Link key={l} to={`/${l}${rest}${search}${hash}`} hrefLang={l} lang={l} title={s.localeName[l]}
            onClick={() => { try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ } }}>
            {l.toUpperCase()}
          </Link>
        ),
      )}
    </div>
  );
}
