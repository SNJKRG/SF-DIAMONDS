import { Link } from 'react-router-dom';
import { pad, useLang } from '../../store.ts';
import { WhatsApp } from '../../components/Ext.tsx';
import { Picture } from '../../components/Picture.tsx';
import { Reveal } from '../../components/Reveal.tsx';
import './Engagement.css';

export default function Engagement({ n }: { n: number }) {
  const { s, to } = useLang();
  const engagement = s.pages.engagement;
  return (
    <section className="panel panel-ivory engage" data-panel={n} aria-labelledby="eng-h">
      <div className="engage-media">
        <Picture name="sec-engagement" alt={s.alts['sec-engagement']} sizes="(max-width: 860px) 100vw, 45vw" />
      </div>
      <div className="engage-text">
        <h2 id="eng-h">{engagement.h1}</h2>
        <p className="lead">{engagement.lead}</p>
        <ol className="steps">
          {engagement.sections.map(([h, body], i) => (
            <li key={h}>
              <Reveal i={i}><span className="step-n">{pad(i + 1)}</span><h3>{h}</h3><p>{body}</p></Reveal>
            </li>
          ))}
        </ol>
        <div className="actions">
          <WhatsApp text={engagement.message}>{engagement.cta}</WhatsApp>
          <Link className="btn btn-outline" to={to('/collection/rings')}>{engagement.secondary}</Link>
        </div>
      </div>
    </section>
  );
}
