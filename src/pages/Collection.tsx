import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { categories, type Category } from '../content.ts';
import { WhatsApp } from '../components/Ext.tsx';
import PageIntro from '../components/PageIntro.tsx';
import { Picture } from '../components/Picture.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { Reveal } from '../components/Reveal.tsx';
import Sketch from '../components/Sketch.tsx';
import './Collection.css';
import { fill, products, useLang } from '../store.ts';
import { NotFound } from './Editorial.tsx';

const sorts = ['default', 'asc', 'desc'] as const;
type Sort = (typeof sorts)[number];
// Damas-style budget shortcuts over the historical offer price (no currency until the owner confirms it).
const budgets = [
  { id: 'lt100', test: (n: number) => n < 100_000 },
  { id: '100-200', test: (n: number) => n >= 100_000 && n <= 200_000 },
  { id: 'gt200', test: (n: number) => n > 200_000 },
] as const;

const CategorySketch = ({ cat }: { cat: Category }) => <Sketch kind={cat === 'bracelets' ? 'bangle' : cat} stones={cat === 'bracelets' ? 4 : 0} />;

export default function Collection() {
  const { s, to } = useLang();
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  if (category && !categories.includes(category as Category)) return <NotFound />;
  const cat = category as Category | undefined;
  const sort: Sort = sorts.includes(params.get('sort') as Sort) ? (params.get('sort') as Sort) : 'default';
  const budget = budgets.find((b) => b.id === params.get('budget'));

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  // "Price on request" pieces never pass a budget filter and always sort after the priced ones.
  const list = products
    .filter((p) => (!cat || p.category === cat) && (!budget || (p.offer !== undefined && budget.test(p.offer))))
    .sort((a, b) => (sort === 'asc' ? (a.offer ?? Infinity) - (b.offer ?? Infinity) : sort === 'desc' ? (b.offer ?? -Infinity) - (a.offer ?? -Infinity) : 0));

  const title = cat ? s.seo[cat] : s.seo.collection;
  const query = params.toString() ? `?${params}` : '';

  return (
    <>
      <PageIntro title={title} h1={cat ? s.categories.names[cat] : s.collection.h1} lead={cat ? s.collection.intros[cat] : s.collection.lead} />
      <div className="section wrap catalog">
        <nav className="chips" aria-label={s.filter.category}>
          <NavLink end to={to(`/collection${query}`)}>{s.filter.all}</NavLink>
          {categories.map((c) => <NavLink key={c} to={to(`/collection/${c}${query}`)}><span className="chip-ico" aria-hidden><CategorySketch cat={c} /></span>{s.categories.names[c]}</NavLink>)}
        </nav>
        <div className="toolbar">
          <div className="budget" role="group" aria-label={s.filter.budget}>
            <span>{s.filter.budget}</span>
            <button type="button" aria-pressed={!budget} onClick={() => setParam('budget')}>{s.filter.anyBudget}</button>
            {budgets.map((b, i) => (
              <button key={b.id} type="button" aria-pressed={budget?.id === b.id} onClick={() => setParam('budget', b.id)}>{s.filter.budgets[i]}</button>
            ))}
          </div>
          <div className="toolbar-end">
            <p className="count" aria-live="polite">{fill(s.filter.count, { count: list.length })}</p>
            <label className="sort">
              <span>{s.filter.sort}</span>
              <select value={sort} onChange={(e) => setParam('sort', e.target.value === 'default' ? undefined : e.target.value)}>
                <option value="default">{s.filter.default}</option>
                <option value="asc">{s.filter.asc}</option>
                <option value="desc">{s.filter.desc}</option>
              </select>
            </label>
          </div>
        </div>

        {list.length ? (
          <div className="grid">
            {list.map((p, i) => <ProductCard key={p.id} product={p} index={i % 4} headingLevel={2} />)}
            {/* All pieces: the photo; a category: its own line drawing, so each category's closing card differs. */}
            <Reveal className={`grid-feature${cat ? ' is-sketch' : ''}`} i={list.length % 4}>
              {cat ? <CategorySketch cat={cat} />
                : <Picture name="sec-collection" alt={s.alts['sec-collection']} sizes="(max-width: 700px) 100vw, 25vw" />}
              <div>
                <p className="grid-feature-h">{s.collection.after}</p>
                <WhatsApp text={s.collection.referenceMessage} className="btn btn-ivory btn-small">{s.cta.reference}</WhatsApp>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="empty">
            <h2>{s.filter.emptyTitle}</h2>
            <p>{cat === 'watches' ? s.filter.emptyCategory : s.filter.emptyBody}</p>
            <NavLink className="text-link" to={to('/collection')}>{s.filter.all}</NavLink>
          </div>
        )}
      </div>
    </>
  );
}
