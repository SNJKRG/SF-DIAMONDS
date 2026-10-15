import { links } from '../../content.ts';
import { useLang } from '../../store.ts';
import { Ext } from '../../components/Ext.tsx';
import { Picture, type ImageName } from '../../components/Picture.tsx';
import { Reveal } from '../../components/Reveal.tsx';
import './Channel.css';

const postUrl = (id: number) => `${links.channel}/${id}`;

// Real photos from public SF Telegram posts: dark studio, hands, daylight. Each frame opens its post.
export default function Channel({ n }: { n: number }) {
  const { s } = useLang();
  const c = s.channel;
  return (
    <section className="panel panel-studio channel" data-panel={n} aria-labelledby="channel-h">
      <div className="panel-inner">
        <div className="channel-top">
          <Reveal className="channel-feature wipe">
            <Ext href={postUrl(c.feature.id)}>
              <Picture name={c.feature.img as ImageName} alt={c.feature.title} sizes="(max-width: 860px) 100vw, 56vw" />
            </Ext>
          </Reveal>
          <div className="channel-text">
            <h2 id="channel-h">{c.h2}</h2>
            <p className="channel-lead">{c.quote}</p>
            <Ext href={links.channel} className="btn btn-glass">{c.open}</Ext>
          </div>
        </div>
        <ul className="channel-strip">
          {c.items.map((post, i) => (
            <li key={post.id}>
              <Reveal i={i}>
                <Ext href={postUrl(post.id)} className="strip-item">
                  <Picture name={post.img as ImageName} alt={post.title} sizes="(max-width: 700px) 60vw, 22vw" />
                  <span className="strip-title" aria-hidden>{post.title}</span>
                </Ext>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
