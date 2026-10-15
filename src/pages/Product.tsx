import { Link, useParams, useSearchParams } from 'react-router-dom';
import { links } from '../content.ts';
import { Ext, WhatsApp } from '../components/Ext.tsx';
import { Reveal } from '../components/Reveal.tsx';
import SaveButton from '../components/SaveButton.tsx';
import Sketch, { sketchKind } from '../components/Sketch.tsx';
import { Picture } from '../components/Picture.tsx';
import './Product.css';
import { fill, formatPrice, priceLabel, productBySlug, useLang, useShortlist } from '../store.ts';
import { NotFound } from './Editorial.tsx';

export default function Product() {
  const { lang, s, to } = useLang();
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const { has, setSize } = useShortlist();
  const p = productBySlug(slug);
  if (!p) return <NotFound />;

  // Size lives in the URL so the language switch and a shared link keep it.
  const unknown = params.get('size') === '?';
  const size = unknown ? '' : params.get('size') ?? '';
  const update = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('size', value); else next.delete('size');
    setParams(next, { replace: true });
    if (has(p.id)) setSize(p.id, value === '?' ? '' : value);
  };

  const name = p.name[lang];
  const price = p.offer ? formatPrice(p.offer, lang) : '';
  const sized = p.category === 'rings' || p.category === 'bracelets';
  const url = `${window.location.origin}${to(`/pieces/${p.slug}`)}`;
  const message = s.product.message({ name, price, url, size: unknown ? '' : size, date: p.post.date });

  return (
    <div className="product wrap">
      <title>{p.image ? `${name.split(',')[0]} SF Diamonds` : fill(s.seo.product, { name: name.split(',')[0] })}</title>
      <nav className="crumbs" aria-label={s.collection.title}>
        <Link to={to('/collection')}>{s.product.back}</Link>
        <span aria-hidden> / </span>
        <Link to={to(`/collection/${p.category}`)}>{s.categories.names[p.category]}</Link>
      </nav>
      <div className="product-grid">
        <Reveal className="product-media">
          {p.image ? <Picture name={p.image} alt={name} sizes="(max-width: 860px) 100vw, 56vw" />
            : <Sketch kind={sketchKind(p)} stones={p.stones} />}
        </Reveal>
        <div className="product-info">
          <h1>{name}</h1>
          <p className="price">{priceLabel(p, lang)}</p>
          {p.regular && <p className="price-regular">{s.prices.regular} {formatPrice(p.regular, lang)}</p>}

          {sized && (
            <fieldset className="size">
              <legend>{s.product.sizeLabel}</legend>
              {p.size && <p className="hint">{fill(s.product.sizeInPost, { size: p.size })}</p>}
              <input type="text" inputMode="decimal" aria-label={s.product.sizeLabel} value={size} disabled={unknown}
                onChange={(e) => update(e.target.value.slice(0, 12))} placeholder={p.size ?? ''} />
              <label className="check">
                <input type="checkbox" checked={unknown} onChange={(e) => update(e.target.checked ? '?' : '')} />
                {s.product.sizeUnknown}
              </label>
              <p className="hint">{s.product.sizeHint}</p>
            </fieldset>
          )}

          <div className="actions">
            <WhatsApp text={message}>{s.cta.enquire}</WhatsApp>
            <SaveButton product={p} size={size} />
          </div>
          <p className="under">{s.product.under}</p>
          {p.image && (
            <p className="hint">
              {p.edited && `${s.product.photoNote} `}
              <Ext className="inline-link" href={`${links.channel}/${p.post.id}`}>{s.product.postLink}</Ext>
            </p>
          )}

          <div className="details">
            <details open>
              <summary>{s.product.specs}</summary>
              {p.specs ? <ul className="specs">{p.specs[lang].map((x) => <li key={x}>{x}</li>)}</ul> : <p>{s.product.specsBody}</p>}
            </details>
            <details>
              <summary>{s.product.fit}</summary>
              <p>{p.size ? fill(s.product.fitSized, { size: p.size }) : s.product.fitUnsized}</p>
            </details>
            <details>
              <summary>{s.product.documents}</summary>
              <p>{p.specs ? s.product.docsAsk : p.stones ? fill(s.product.stonesStated, { stones: p.stones }) : s.product.stonesUnknown}</p>
            </details>
            <details>
              <summary>{s.product.terms}</summary>
              <p>{s.product.termsBody} <Link className="inline-link" to={to('/service')}>{s.product.termsLink}</Link></p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
