import { useLang, useShortlist, type Product } from '../store.ts';
import { announce } from './announce.ts';

const Heart = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
    <path d="M12 20.3s-7.6-4.6-7.6-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.6 2.7c0 5.6-7.6 10.2-7.6 10.2z" />
  </svg>
);

export default function SaveButton({ product, size = '', icon = false }: { product: Product; size?: string; icon?: boolean }) {
  const { s } = useLang();
  const { has, toggle } = useShortlist();
  const saved = has(product.id);
  const label = saved ? s.shortlist.remove : s.shortlist.add;
  return (
    <button type="button" className={icon ? 'save-icon' : 'save'} aria-pressed={saved} aria-label={icon ? label : undefined} title={icon ? label : undefined}
      onClick={() => { toggle(product.id, size); if (!saved) announce(s.shortlist.saved); }}>
      {icon ? <Heart /> : label}
    </button>
  );
}
