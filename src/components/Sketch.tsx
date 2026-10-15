import type { Product } from '../store.ts';

// Single-line drawings stand in for the missing photographs of the six post records (demo-prices.md: no AI piece
// may pass for them). Geometry is generic: a shape of the category, never a likeness of a branded model.
type SketchKind = 'rings' | 'earrings' | 'necklaces' | 'chain' | 'bangle';
export const sketchKind = (p: Product): SketchKind =>
  p.category === 'bracelets' ? (p.stones ? 'bangle' : 'chain') : (p.category as SketchKind);

export default function Sketch({ kind, stones = 0 }: { kind: SketchKind; stones?: number }) {
  const line = { className: 'sk', pathLength: 1, vectorEffect: 'non-scaling-stroke' } as const;
  const loop = (n: number, from: number, to: number) =>
    Array.from({ length: n }, (_, k) => (from + ((to - from) * (k + 0.5)) / n) * (Math.PI / 180));
  return (
    <svg className="sketch" viewBox="0 0 200 250" fill="none" stroke="currentColor" aria-hidden>
      {kind === 'rings' && (
        <>
          <ellipse {...line} cx="100" cy="160" rx="66" ry="70" />
          <ellipse {...line} cx="100" cy="160" rx="57" ry="61" />
          <path {...line} d="M64 92 L136 92 L122 70 L78 70 Z M64 92 L100 124 L136 92 M92 70 L100 92 L108 70" />
          <path {...line} d="M72 92 L77 104 M128 92 L123 104" />
        </>
      )}
      {kind === 'earrings' && [58, 142].map((x) => (
        <g key={x}>
          <circle {...line} cx={x} cy="44" r="11" />
          <path {...line} d={`M${x} 55 L${x} 92`} />
          <ellipse {...line} cx={x} cy="148" rx="26" ry="54" />
          <ellipse {...line} cx={x} cy="148" rx="13" ry="30" />
          <path {...line} d={`M${x - 26} 148 L${x + 26} 148`} />
        </g>
      ))}
      {kind === 'necklaces' && (
        <>
          <path {...line} d="M14 6 Q100 176 186 6" />
          <circle {...line} cx="100" cy="98" r="7" />
          <ellipse {...line} cx="100" cy="158" rx="32" ry="52" />
          <ellipse {...line} cx="100" cy="158" rx="16" ry="28" />
          <path {...line} d="M100 106 L100 210 M68 158 L132 158" />
        </>
      )}
      {kind === 'chain' && (
        <>
          {loop(26, 0, 360).map((a) => {
            const x = 100 + 72 * Math.cos(a), y = 136 + 36 * Math.sin(a);
            const deg = (Math.atan2(36 * Math.cos(a), -72 * Math.sin(a)) * 180) / Math.PI;
            return <ellipse key={a} {...line} cx={x.toFixed(1)} cy={y.toFixed(1)} rx="7" ry="3.6" transform={`rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`} />;
          })}
          <circle {...line} cx="172" cy="136" r="6" />
        </>
      )}
      {kind === 'bangle' && (
        <>
          <ellipse {...line} cx="100" cy="132" rx="74" ry="38" />
          <ellipse {...line} cx="100" cy="132" rx="64" ry="30" />
          {loop(stones, 35, 145).map((a) => (
            <circle key={a} {...line} cx={(100 + 69 * Math.cos(a)).toFixed(1)} cy={(132 + 34 * Math.sin(a)).toFixed(1)} r="4.5" />
          ))}
        </>
      )}
    </svg>
  );
}
