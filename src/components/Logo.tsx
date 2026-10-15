import { Link } from 'react-router-dom';
import { useLang } from '../store.ts';

export default function Logo() {
  const { s, to } = useLang();
  return (
    <Link to={to('/')} className="logo" aria-label={s.nav.home}>
      <img src="/img/logo-ivory.webp" alt="" width="36" height="40" />
      <span className="wordmark" aria-hidden>SF Diamonds</span>
    </Link>
  );
}
