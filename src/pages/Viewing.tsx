import { useEffect, useRef, useState, type FormEvent } from 'react';
import { announce } from '../components/announce.ts';
import { WhatsApp } from '../components/Ext.tsx';
import PageIntro from '../components/PageIntro.tsx';
import { useLang } from '../store.ts';

// Demo mode: no server. The form validates, then shows the exact message before WhatsApp opens.
// It never claims the enquiry was sent (ui-copy-matrix: form.no.server).
type Fields = { name: string; channel: string; contact: string; message: string; city: string; budget: string; date: string; reference: string };
const empty: Fields = { name: '', channel: 'WhatsApp', contact: '', message: '', city: '', budget: '', date: '', reference: '' };

export default function Viewing() {
  const { s } = useLang();
  const c = s.pages.viewing;
  const f = s.form;
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [preview, setPreview] = useState('');
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const shown = !!preview;
  // Move focus to the prepared text so keyboard and screen-reader users land on what changed.
  useEffect(() => { if (shown) previewRef.current?.focus(); }, [shown]);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!v.name.trim()) next.name = f.required;
    if (!v.message.trim()) next.message = f.required;
    if (v.contact.replace(/[^\p{L}\p{N}]/gu, '').length < 3) next.contact = f.contactError;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }
    const lines = [
      f.intro,
      `${f.name}: ${v.name}`,
      `${f.channel}: ${v.channel}, ${v.contact}`,
      `${f.message} ${v.message}`,
      v.city && `${f.city}: ${v.city}`,
      v.budget && `${f.budget.split(',')[0]}: ${v.budget}`,
      v.date && `${f.date.split(',')[0]}: ${v.date}`,
      v.reference && `${f.reference.split(',')[0]}: ${v.reference}`,
    ].filter(Boolean);
    setPreview(lines.join('\n'));
    announce(f.noServer);
  };

  const field = (k: keyof Fields, label: string, props: Record<string, unknown> = {}) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined} {...props} />
      {errors[k] && <p id={`e-${k}`} className="error">{errors[k]}</p>}
    </div>
  );

  return (
    <>
      <PageIntro title={s.seo.viewing} h1={c.h1} lead={c.lead} />
      <div className="section wrap form-grid">
        <div>
          <h2>{c.h2}</h2>
          <p>{c.body}</p>
        </div>
        {preview ? (
          <div className="compose">
            <label htmlFor="preview">{s.shortlist.preview}</label>
            <textarea ref={previewRef} id="preview" rows={9} value={preview} onChange={(e) => setPreview(e.target.value)} />
            <p className="hint">{f.noServer}</p>
            <div className="actions">
              <WhatsApp text={preview}>{f.open}</WhatsApp>
              <button type="button" className="btn btn-outline" onClick={() => setPreview('')}>{f.edit}</button>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={submit} noValidate>
            {field('name', f.name, { autoComplete: 'name', required: true })}
            <div className="field-row">
              <div className="field">
                <label htmlFor="f-channel">{f.channel}</label>
                <select id="f-channel" value={v.channel} onChange={set('channel')}>
                  {f.channels.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              {field('contact', f.contact, { autoComplete: 'tel', required: true })}
            </div>
            <div className="field">
              <label htmlFor="f-message">{f.message}</label>
              <textarea id="f-message" rows={4} value={v.message} onChange={set('message')} aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'e-message' : undefined} required />
              {errors.message && <p id="e-message" className="error">{errors.message}</p>}
            </div>
            <div className="field-row">
              {field('city', f.city, { autoComplete: 'address-level2' })}
              {field('budget', f.budget)}
            </div>
            <div className="field-row">
              {field('date', f.date, { type: 'date' })}
              {field('reference', f.reference, { type: 'url', inputMode: 'url' })}
            </div>
            <button type="submit" className="btn btn-solid">{f.prepare}</button>
            <p className="hint">{f.note}</p>
          </form>
        )}
      </div>
    </>
  );
}
