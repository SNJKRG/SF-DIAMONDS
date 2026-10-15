import { Link } from 'react-router-dom';
import { links } from '../content.ts';
import { useLang } from '../store.ts';
import Logo from './Logo.tsx';
import { Ext } from './Ext.tsx';
import './Footer.css';

export default function Footer() {
  const { s, to } = useLang();
  const pages = [
    [to('/collection'), s.nav.collection], [to('/bespoke'), s.nav.bespoke], [to('/engagement'), s.nav.engagement],
    [to('/materials'), s.nav.materials], [to('/viewing'), s.nav.viewing], [to('/contact'), s.nav.contact],
    [to('/availability'), s.nav.availability], [to('/service'), s.nav.service], [to('/faq'), s.nav.faq], [to('/about'), s.nav.about],
  ];
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p className="footer-line">{s.footer.line}</p>
        </div>
        <nav aria-label={s.nav.footer}>
          <ul className="footer-links">
            {pages.map(([href, label]) => <li key={href}><Link to={href}>{label}</Link></li>)}
          </ul>
        </nav>
        <ul className="footer-links">
          <li><Ext href={links.instagram}>{s.footer.instagram}</Ext></li>
          <li><Ext href={links.channel}>{s.footer.channel}</Ext></li>
          <li><Ext href={links.reviews}>{s.footer.reviews}</Ext></li>
          <li><Ext href={links.whatsapp}>WhatsApp</Ext></li>
          <li><Ext href={links.telegram}>Telegram</Ext></li>
        </ul>
      </div>
      <div className="wrap footer-legal">
      </div>
    </footer>
  );
}
