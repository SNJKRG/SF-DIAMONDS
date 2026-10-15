import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { links, type Category } from '../content.ts';
import { useLang, useShortlist } from '../store.ts';
import LangSwitch from './LangSwitch.tsx';
import { Ext } from './Ext.tsx';
import { Heart } from './SaveButton.tsx';
import { Picture, type ImageName } from './Picture.tsx';
import './Header.css';

const menuCats: [Exclude<Category, 'watches'>, ImageName][] = [
  ['rings', 'tg-ring-oval'], ['earrings', 'tg-earrings'], ['necklaces', 'tg-necklace'], ['bracelets', 'tg-bracelets'],
];

// One row: menu on the left, centred wordmark, language and shortlist on the right.
// Transparent over the navy top band, slim ivory bar below it. Everything else lives in the menu.
export default function Header() {
  const { s, to } = useLang();
  const { list } = useShortlist();
  const location = useLocation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    const band = document.getElementById('top-band');
    if (!band) { setSolid(true); return; }
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' });
    io.observe(band);
    return () => io.disconnect();
  }, [location.pathname]);

  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('menu-open');
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.classList.remove('menu-open'); };
  }, [open]);

  const all = [
    [to('/collection'), s.nav.collection],
    [to('/bespoke'), s.nav.bespoke],
    [to('/engagement'), s.nav.engagement],
    [to('/materials'), s.nav.materials],
    [to('/viewing'), s.nav.viewing],
    [to('/about'), s.nav.about],
    [to('/faq'), s.nav.faq],
    [to('/contact'), s.nav.contact],
  ] as const;

  const cls = ['site-header', solid && 'is-solid', open && 'is-open'].filter(Boolean).join(' ');
  return (
    <header className={cls}>
      <div className="bar">
        <div className="bar-start">
          <button ref={button} type="button" className="menu-button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
            <span className="burger" aria-hidden><i /><i /></span>
            <span className="menu-label">{open ? s.nav.close : s.nav.menu}</span>
          </button>
        </div>

        <Link to={to('/')} className="logo" aria-label={s.nav.home}>
          <span className="monogram" aria-hidden />
          <span className="wordmark" aria-hidden>SF Diamonds</span>
        </Link>

        <div className="bar-end">
          <LangSwitch />
          <Link to={to('/shortlist')} className="shortlist-link" aria-label={`${s.nav.shortlist}: ${list.length}`}>
            <Heart width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" />{list.length > 0 && <span className="count">{list.length}</span>}
          </Link>
        </div>
      </div>

      <nav id={menuId} className="menu-panel" aria-label={s.nav.main} hidden={!open}>
        <ul className="menu-list">
          {all.map(([href, label]) => <li key={href}><NavLink to={href}>{label}</NavLink></li>)}
        </ul>
        <ul className="menu-cats">
          {menuCats.map(([cat, img]) => (
            <li key={cat}>
              <Link to={to(`/collection/${cat}`)}><Picture name={img} alt="" sizes="40vw" /><span>{s.categories.names[cat]}</span></Link>
            </li>
          ))}
        </ul>
        <div className="menu-foot">
          <Ext href={links.whatsapp}>WhatsApp</Ext>
          <Ext href={links.telegram}>Telegram</Ext>
          <Link to={to('/shortlist')}>{s.nav.shortlist}{list.length > 0 && ` ${list.length}`}</Link>
        </div>
      </nav>
    </header>
  );
}
