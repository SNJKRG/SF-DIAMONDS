import { Link } from 'react-router-dom';
import { links } from '../../content.ts';
import { useLang } from '../../store.ts';
import { Ext, WhatsApp } from '../../components/Ext.tsx';
import { Picture } from '../../components/Picture.tsx';
import { Reveal } from '../../components/Reveal.tsx';
import './Closing.css';

export default function Closing({ n }: { n: number }) {
  const { s, to } = useLang();
  return (
    <section id="contact" className="panel panel-navy closing" data-panel={n} aria-labelledby="close-h">
      <div className="panel-inner">
        <h2 id="close-h" className="shout">{s.closing.h2}</h2>
        <div className="closing-grid">
          <div className="closing-text">
        <div className="closing-cols">
          <p>{s.closing.body}</p>
          <div>
            <h3>{s.viewingTeaser.h2}</h3>
            <p>{s.viewingTeaser.body}</p>
            <Link className="text-link" to={to('/viewing')}>{s.viewingTeaser.cta}</Link>
          </div>
        </div>
        <div className="closing-links">
          <WhatsApp text={s.closing.message} className="big-link"><span aria-hidden>→ </span>WhatsApp</WhatsApp>
          <Ext href={links.telegram} className="big-link"><span aria-hidden>→ </span>Telegram</Ext>
        </div>
          </div>
          <Reveal className="closing-photo wipe">
            <Picture name="sec-closing" alt={s.alts['sec-closing']} sizes="(max-width: 860px) 100vw, 30vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
