import { Link } from 'react-router-dom';
import { useLang } from '../../store.ts';
import { Picture } from '../../components/Picture.tsx';
import { Reveal } from '../../components/Reveal.tsx';
import './About.css';

export default function About({ n }: { n: number }) {
  const { s, to } = useLang();
  const about = s.pages.about;
  return (
    <section className="panel panel-white about" data-panel={n} aria-labelledby="about-h">
      <div className="about-a">
        <div className="about-text">
          <h2 id="about-h">{about.sections[1][0]}</h2>
          <p>{about.sections[0][1]}</p>
          <p>{about.sections[1][1]}</p>
          <Link className="text-link" to={to('/about')}>{about.title}</Link>
        </div>
        <div className="collage">
          <Picture name="about-emerald" alt={s.alts['about-emerald']} sizes="(max-width: 860px) 70vw, 34vw" className="collage-tall" />
          <Reveal className="collage-inset wipe" i={2}><Picture name="about-studs" alt={s.alts['about-studs']} sizes="(max-width: 860px) 46vw, 22vw" /></Reveal>
        </div>
      </div>
      <div className="about-b">
        <p className="caps">{about.lead}</p>
        <Reveal className="big-line">
          <svg className="scribble" viewBox="0 0 600 420" fill="none" aria-hidden>
            <path className="sk" pathLength={1} d="M250 20 C130 60 170 160 210 190 C150 160 60 170 40 260 C20 360 130 400 220 360 C300 320 300 250 250 240 C200 230 160 280 230 300 C330 330 420 380 500 330 C590 270 560 120 470 70 C380 20 310 10 250 20 Z" />
          </svg>
          <p className="big">{s.hero.slogans[0].join(' ')}</p>
        </Reveal>
      </div>
    </section>
  );
}
