import { useEffect } from 'react';
import { Navigate, Outlet, ScrollRestoration, useLocation, useParams } from 'react-router-dom';
import { useLang } from '../store.ts';
import { preferredLang } from './lang.ts';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

export default function Layout() {
  const { lang } = useParams();
  const { pathname } = useLocation();
  const { s } = useLang();
  useEffect(() => { document.documentElement.lang = lang ?? 'ru'; }, [lang]);
  if (lang !== 'ru' && lang !== 'en') return <Navigate to={`/${preferredLang()}${pathname}`} replace />;
  return (
    <>
      <a className="skip" href="#main">{s.skip}</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <div id="live" className="vh" aria-live="polite" />
      {/* Key by URL: the router's default key is shared by every fresh page load and restores another page's scroll.
          A hash link gets its own entry key, otherwise /ru/#contact restores /ru/'s saved position instead of the anchor. */}
      <ScrollRestoration getKey={(l) => (l.hash ? l.key : l.pathname + l.search)} />
    </>
  );
}
