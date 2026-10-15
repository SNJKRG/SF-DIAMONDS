import { useLang } from '../../store.ts';
import { WhatsApp } from '../../components/Ext.tsx';
import { Picture } from '../../components/Picture.tsx';
import { Reveal } from '../../components/Reveal.tsx';
import './Bespoke.css';

export default function Bespoke({ n }: { n: number }) {
  const { s } = useLang();
  const bespoke = s.pages.bespoke;
  return (
    <section className="panel panel-cognac bespoke" data-panel={n} aria-labelledby="bespoke-h">
      <div className="bespoke-media">
        <Reveal className="bespoke-a wipe"><Picture name="sec-bespoke-wide" alt={s.alts['sec-bespoke-wide']} sizes="(max-width: 700px) 100vw, 64vw" /></Reveal>
        <Reveal className="bespoke-b wipe" i={2}><Picture name="sec-bespoke-emerald" alt={s.alts['sec-bespoke-emerald']} sizes="(max-width: 700px) 50vw, 36vw" /></Reveal>
      </div>
      <div className="panel-inner bespoke-text">
        <ul className="micro-cols">
          {bespoke.sections.map(([h, body]) => (
            <li key={h}><strong>{h}</strong> {body}</li>
          ))}
        </ul>
        <Reveal className="statement">
          <h2 id="bespoke-h"><span>{bespoke.title}.</span> <span>{bespoke.h1}.</span></h2>
        </Reveal>
        <div className="bespoke-cta">
          <p>{s.bespokeTeaser.body}</p>
          <WhatsApp text={bespoke.message} className="btn btn-ivory">{s.bespokeTeaser.cta}</WhatsApp>
        </div>
      </div>
    </section>
  );
}
