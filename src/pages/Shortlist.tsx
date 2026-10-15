import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { links } from '../content.ts';
import { announce } from '../components/announce.ts';
import { Ext, WhatsApp } from '../components/Ext.tsx';
import PageIntro from '../components/PageIntro.tsx';
import { priceLabel, productById, useLang, useShortlist } from '../store.ts';

export default function Shortlist() {
  const { lang, s, to } = useLang();
  const { list, remove, setSize } = useShortlist();

  const generated = [
    s.shortlist.preamble,
    ...list.map((item, i) => {
      const p = productById(item.id);
      if (!p) return `${i + 1}. ${item.id} (${s.shortlist.unavailable})`;
      const size = item.size ? `, ${s.product.sizeLabel.toLowerCase()}: ${item.size}` : '';
      return `${i + 1}. ${p.name[lang]}, ${priceLabel(p, lang)}${size}: ${window.location.origin}${to(`/pieces/${p.slug}`)}`;
    }),
  ].join('\n');

  // The visitor may edit the text; a change in the list regenerates it.
  const [text, setText] = useState(generated);
  useEffect(() => setText(generated), [generated]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); announce(s.cta.copied); }
    catch { announce(s.copyFailed); }
  };

  return (
    <>
      <PageIntro title={s.seo.shortlist} h1={s.shortlist.h1} lead={s.shortlist.lead} />
      <div className="section wrap">
        {list.length === 0 ? (
          <div className="empty">
            <p>{s.shortlist.empty}</p>
            <Link className="btn btn-solid" to={to('/collection')}>{s.cta.collection}</Link>
          </div>
        ) : (
          <div className="shortlist-grid">
            <ul className="shortlist">
              {list.map((item) => {
                const p = productById(item.id);
                return (
                  <li key={item.id}>
                    {p ? (
                      <>
                        <Link to={to(`/pieces/${p.slug}`)} className="shortlist-name">{p.name[lang]}</Link>
                        <p className="price">{priceLabel(p, lang)}</p>
                        <label className="inline-field">
                          <span>{s.product.sizeLabel}</span>
                          <input type="text" value={item.size} placeholder={s.product.sizeUnknown}
                            onChange={(e) => setSize(item.id, e.target.value.slice(0, 12))} />
                        </label>
                      </>
                    ) : (
                      <p className="shortlist-name">{s.shortlist.unavailable}</p>
                    )}
                    <button type="button" className="save" onClick={() => remove(item.id)}>{s.shortlist.remove}</button>
                  </li>
                );
              })}
            </ul>
            <div className="compose">
              <label htmlFor="msg">{s.shortlist.preview}</label>
              <textarea id="msg" rows={9} value={text} onChange={(e) => setText(e.target.value)} />
              <p className="hint">{s.form.noServer}</p>
              <div className="actions">
                <WhatsApp text={text}>{s.shortlist.send}</WhatsApp>
                <button type="button" className="btn btn-outline" onClick={copy}>{s.cta.copy}</button>
              </div>
              <p className="hint">{s.shortlist.tgNote} <Ext href={links.telegram} className="inline-link">{s.cta.telegram}</Ext></p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
