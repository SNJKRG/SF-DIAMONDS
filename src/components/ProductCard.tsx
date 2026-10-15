import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { fill, formatPrice, priceLabel, useLang, type Product } from '../store.ts';
import { useReveal } from './Reveal.tsx';
import Sketch, { sketchKind } from './Sketch.tsx';
import { Picture } from './Picture.tsx';
import SaveButton from './SaveButton.tsx';
import './ProductCard.css';

// Catalogue card (home rail and collection grid). Hover turns the card to navy and lists what the post states.
export default function ProductCard({ product, index = 0, headingLevel = 3 }: { product: Product; index?: number; headingLevel?: 2 | 3 }) {
  const { lang, s, to } = useLang();
  const ref = useReveal<HTMLElement>();
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const kind = sketchKind(product);
  const facts = [
    s.categories.names[product.category],
    product.size && fill(s.product.sizeInPost, { size: product.size }),
    product.stones && fill(s.home.stones, { count: product.stones }),
    ...(product.specs?.[lang].slice(0, 2) ?? []),
  ].filter(Boolean);
  return (
    <article ref={ref} className="card" data-reveal style={{ '--i': index } as CSSProperties}>
      <div className={`card-media${product.image ? ' has-photo' : ''}`}>
        <div className="card-face">
          {product.image ? <Picture name={product.image} alt="" sizes="(max-width: 700px) 70vw, 20vw" />
            : <Sketch kind={kind} stones={product.stones} />}
        </div>
        <div className="card-alt" aria-hidden>
          {!product.image && <Sketch kind={kind} stones={product.stones} />}
          <ul>{facts.map((f) => <li key={f as string}>{f}</li>)}</ul>
        </div>
      </div>
      <SaveButton product={product} icon />
      <div className="card-body">
        <H className="card-name"><Link to={to(`/pieces/${product.slug}`)}>{product.name[lang]}</Link></H>
        <p className={`card-price${product.offer ? '' : ' is-request'}`}>{priceLabel(product, lang)}</p>
        {product.regular && <p className="card-regular">{s.prices.regular} {formatPrice(product.regular, lang)}</p>}
      </div>
    </article>
  );
}
