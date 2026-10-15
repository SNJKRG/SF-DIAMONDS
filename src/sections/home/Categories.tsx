import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../content.ts';
import { fill, useLang } from '../../store.ts';
import { Picture, type ImageName } from '../../components/Picture.tsx';
import { Reveal } from '../../components/Reveal.tsx';
import './Categories.css';

// Real photos from the SF channel; the ring tile switches between four engagement-ring cuts from one post.
const ringViews: ImageName[] = ['tg-ring-oval', 'tg-ring-radiant', 'tg-ring-pear', 'tg-ring-round'];
const tilePhoto: Record<Exclude<Category, 'rings' | 'watches'>, ImageName> = {
  earrings: 'tg-earrings', necklaces: 'tg-necklace', bracelets: 'tg-bracelets',
};

// Eden-style collection tile: title on top, the piece in the middle, thumbnails switch the view.
function CategoryTile({ cat, tone, i }: { cat: Exclude<Category, 'watches'>; tone: 'dark' | 'light'; i: number }) {
  const { s, to } = useLang();
  const [view, setView] = useState(0);
  const views = cat === 'rings' ? ringViews : [tilePhoto[cat]];
  return (
    <Reveal className={`tile tile-${tone} tile-photo`} i={i}>
      <h3 className="tile-title"><Link to={to(`/collection/${cat}`)}>{s.categories.names[cat]}</Link></h3>
      <div className="tile-media">
        {views.map((v, k) => (
          <Picture key={v} name={v} alt="" sizes="(max-width: 700px) 80vw, 25vw" className={k === view ? 'is-shown' : ''} />
        ))}
      </div>
      {views.length > 1 && (
        <div className="thumbs" role="group" aria-label={s.home.renders}>
          {views.map((v, k) => (
            <button key={v} type="button" aria-pressed={k === view} aria-label={fill(s.home.render, { n: s.home.cuts[k] })}
              onClick={() => setView(k)} onMouseEnter={() => setView(k)}>
              <Picture name={v} alt="" sizes="48px" />
            </button>
          ))}
        </div>
      )}
      <div className="tile-foot">
        <span className="pill" aria-hidden>{s.home.open}</span>
      </div>
    </Reveal>
  );
}

export default function Categories({ n }: { n: number }) {
  const { s, to } = useLang();
  return (
    <section className="panel panel-ivory cats" data-panel={n} aria-labelledby="cat-h">
      <div className="panel-inner">
        <div className="panel-head">
          <h2 id="cat-h">{s.categories.h2}</h2>
          <p>{s.categories.body} <Link className="inline-link" to={to('/collection/watches')}>{s.categories.watches}</Link></p>
        </div>
        <div className="tiles">
          <CategoryTile cat="rings" tone="dark" i={0} />
          <CategoryTile cat="earrings" tone="light" i={1} />
          <CategoryTile cat="necklaces" tone="dark" i={2} />
          <CategoryTile cat="bracelets" tone="light" i={3} />
        </div>
      </div>
    </section>
  );
}
