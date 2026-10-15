import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { links } from '../content.ts';
import { Ext, WhatsApp } from '../components/Ext.tsx';
import PageIntro from '../components/PageIntro.tsx';
import { Picture, type ImageName } from '../components/Picture.tsx';
import { Reveal } from '../components/Reveal.tsx';
import './Editorial.css';
import { pad, useLang } from '../store.ts';

type EditorialPage = 'bespoke' | 'engagement' | 'materials' | 'about' | 'service';
// Pages told as numbered steps, photo and text alternating (Messika "Our services" layout).
const BESPOKE_STEP_PHOTOS = ['ig-hands-rings', 'ig-coffee', 'ig-neckline'] as const;

export function Editorial({ page, image }: { page: EditorialPage; image?: Extract<ImageName, 'page-bespoke' | 'page-engagement'> }) {
  const { s, to } = useLang();
  const c = s.pages[page];
  const message = 'message' in c ? c.message : s.closing.message;
  const photos = page === 'bespoke' ? BESPOKE_STEP_PHOTOS : undefined;
  return (
    <>
      <PageIntro title={s.seo[page]} h1={c.h1} lead={c.lead}>
        {'cta' in c && <WhatsApp text={message} className="btn btn-glass btn-primary">{c.cta}</WhatsApp>}
        {'secondary' in c && <Link className="btn btn-glass" to={to('/collection/rings')}>{c.secondary}</Link>}
        {page === 'about' && (
          <>
            <Link className="btn btn-glass btn-primary" to={to('/collection')}>{s.cta.collection}</Link>
            <Link className="btn btn-glass" to={to('/contact')}>{s.cta.contact}</Link>
          </>
        )}
      </PageIntro>
      <div className="section wrap">
        {image && <Reveal className="wipe"><figure className="concept"><Picture name={image} alt={s.alts[image]} sizes="(max-width: 1440px) 100vw, 1440px" /></figure></Reveal>}
        {photos ? (
          <ol className="ed-steps">
            {c.sections.map(([h, body], i) => (
              <li key={i} className="ed-step">
                <Reveal className="ed-step-photo wipe"><Picture name={photos[i]} alt={s.alts[photos[i]]} sizes="(max-width: 860px) 100vw, 40vw" /></Reveal>
                <Reveal className="ed-step-text" i={1}>
                  <span className="ed-step-no" aria-hidden>{pad(i + 1)}</span>
                  <h2>{h}</h2>
                  <p>{body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        ) : (
          <div className="prose-sections">
            {c.sections.map(([h, body], i) => (
              <section key={i} className="prose-row">
                {h ? <h2>{h}</h2> : <span />}
                <p>{body}</p>
              </section>
            ))}
          </div>
        )}
        {'finalCta' in c && (
          <div className="after-grid">
            <WhatsApp text={message}>{c.finalCta}</WhatsApp>
          </div>
        )}
      </div>
    </>
  );
}

export function Availability() {
  const { s } = useLang();
  const c = s.pages.availability;
  return (
    <PageIntro title={s.seo.availability} h1={c.h1} lead={c.lead}>
      <WhatsApp text={c.message} className="btn btn-glass btn-primary">{c.cta}</WhatsApp>
    </PageIntro>
  );
}

// Topics in a sticky side list with the active one marked (Graff, Messika FAQ), questions grouped under topic headings
// (Repossi), then a concierge card (Messika) with the ways to reach SF (Mejuri "Still need help?").
export function Faq() {
  const { s } = useLang();
  const c = s.pages.faq;
  const groups = (c.groups as [string, number][]).reduce<{ title: string; items: (typeof c.items)[number][] }[]>((acc, [title, n]) => {
    const from = acc.reduce((sum, g) => sum + g.items.length, 0);
    return [...acc, { title, items: c.items.slice(from, from + n) }];
  }, []);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = groups.map((_, i) => document.getElementById(`faq-${i}`)!);
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(els.indexOf(hit.target as HTMLElement));
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups.length]);
  return (
    <>
      <PageIntro title={s.seo.faq} h1={c.h1} />
      <div className="section wrap faq-layout">
        <aside className="faq-side">
          <nav aria-label={c.topics}>
            <ol className="faq-topics">
              {groups.map((g, i) => (
                <li key={g.title}>
                  <a href={`#faq-${i}`} aria-current={active === i ? 'true' : undefined}>
                    {g.title}<span>{String(g.items.length).padStart(2, '0')}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="faq">
          {groups.map((g, i) => (
            <section key={g.title} id={`faq-${i}`} className="faq-group">
              <h2 className="faq-topic">{g.title}</h2>
              {g.items.map(([q, a]) => (
                <details key={q}>
                  <summary><h3>{q}</h3></summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
          ))}
          <Reveal className="faq-help">
            <Picture name="ig-blazer" alt={s.alts['ig-blazer']} sizes="(max-width: 700px) 40vw, 220px" />
            <div>
              <h2>{c.help.h2}</h2>
              <p>{c.help.body}</p>
              <div className="actions">
                <WhatsApp text={s.closing.message}>WhatsApp</WhatsApp>
                <Ext href={links.telegram} className="btn btn-outline">Telegram</Ext>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}

// A large photo beside channel cards: title, one line, one button each (Messika and Mejuri contact pages),
// plus a card that sends to the FAQ (Messika "Our FAQ").
export function Contact() {
  const { s, to } = useLang();
  const c = s.pages.contact;
  return (
    <>
      <PageIntro title={s.seo.contact} h1={c.h1} lead={c.lead}>
        <WhatsApp text={s.closing.message} className="btn btn-glass btn-primary">WhatsApp</WhatsApp>
        <Ext href={links.telegram} className="btn btn-glass">Telegram</Ext>
      </PageIntro>
      <div className="section wrap contact-layout">
        <Reveal className="contact-photo wipe">
          <Picture name="ig-trench" alt={s.alts['ig-trench']} sizes="(max-width: 860px) 100vw, 40vw" />
        </Reveal>
        <ul className="contact-cards">
          {c.cards.map(([title, text, cta, key], i) => (
            <li key={key}>
              <Reveal className="contact-card" i={i % 2}>
                <h2>{title}</h2>
                <p>{text}</p>
                {key === 'whatsapp'
                  ? <WhatsApp text={s.closing.message} className="text-link">{cta}</WhatsApp>
                  : <Ext href={links[key as keyof typeof links]} className="text-link">{cta}</Ext>}
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal className="contact-card contact-card-dark" i={1}>
              <h2>{c.faqCard[0]}</h2>
              <p>{c.faqCard[1]}</p>
              <Link className="text-link" to={to('/faq')}>{c.faqCard[2]}</Link>
            </Reveal>
          </li>
        </ul>
      </div>
    </>
  );
}

export function NotFound() {
  const { s, to } = useLang();
  const c = s.pages.notFound;
  return (
    <PageIntro title={s.seo.notFound} h1={c.h1}>
      <Link className="btn btn-glass btn-primary" to={to('/collection')}>{c.back}</Link>
    </PageIntro>
  );
}
