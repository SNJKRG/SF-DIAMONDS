import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { links } from '../../content.ts';
import { products, useLang } from '../../store.ts';
import { Ext } from '../../components/Ext.tsx';
import ProductCard from '../../components/ProductCard.tsx';
import './Prices.css';

const railTabs = ['all', 'rings', 'earrings', 'bracelets', 'necklaces'] as const;

// Aroz-style rail: tabs, drag/scroll horizontally, arrows on desktop, a thin progress line.
function PriceRail() {
  const { s } = useLang();
  const [tab, setTab] = useState<(typeof railTabs)[number]>('all');
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const list = products.filter((p) => p.offer && (tab === 'all' || p.category === tab)); // this rail shows prices only

  const sync = () => {
    const el = rail.current;
    if (!el || !bar.current) return;
    const max = el.scrollWidth - el.clientWidth;
    const visible = el.clientWidth / el.scrollWidth;
    bar.current.style.width = `${visible * 100}%`;
    bar.current.style.transform = `translateX(${max > 0 ? (el.scrollLeft / max) * ((1 - visible) / visible) * 100 : 0}%)`;
  };
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    el.scrollLeft = 0;
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [tab]);

  const step = (dir: number) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  // Mouse drag only; touch and trackpads scroll natively.
  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !rail.current) return;
    drag.current = { x: e.clientX, left: rail.current.scrollLeft, moved: false };
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !rail.current) return;
    if (Math.abs(e.clientX - d.x) > 5 && !d.moved) { d.moved = true; rail.current.classList.add('is-dragging'); }
    if (d.moved) rail.current.scrollLeft = d.left - (e.clientX - d.x);
  };
  const up = () => {
    rail.current?.classList.remove('is-dragging');
    window.setTimeout(() => { drag.current = null; });
  };

  return (
    <>
      <div className="rail-bar">
        <div className="tabs" role="group" aria-label={s.filter.category}>
          {railTabs.map((t) => (
            <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t === 'all' ? s.filter.all : s.categories.names[t]}
            </button>
          ))}
        </div>
        <div className="arrows">
          <button type="button" onClick={() => step(-1)} aria-label={s.home.prev}>←</button>
          <button type="button" onClick={() => step(1)} aria-label={s.home.next}>→</button>
        </div>
      </div>
      <div ref={rail} className="rail" onScroll={sync} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}>
        {list.map((p, i) => <ProductCard key={`${tab}-${p.id}`} product={p} index={i} />)}
      </div>
      <div className="rail-progress" aria-hidden><span ref={bar} /></div>
    </>
  );
}

export default function Prices({ n }: { n: number }) {
  const { s, to } = useLang();
  return (
    <section className="panel panel-warm prices" data-panel={n} aria-labelledby="prices-h">
      <div className="panel-inner">
        <div className="panel-head">
          <h2 id="prices-h">{s.prices.h2}</h2>
        </div>
        <PriceRail />
        <div className="after-rail">
          <Link className="text-link" to={to('/collection')}>{s.prices.all}</Link>
        </div>
      </div>
    </section>
  );
}
