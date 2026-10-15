// Procedural oval engagement ring. Units: millimetres. Ring axis = Z (finger direction), stone table faces +Y.
// Original design (no house motif): ~3 ct oval brilliant, hidden halo, four claws, micro-pavé shank, platinum look.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const RING = {
  version: 'sf-oval-halo-pave-3',
  innerRadius: 8.75, // ~55 mm circumference
  bandThickness: 1.8,
  bandWidth: 2.1,
  // Centre stone: a 3 ct oval is about 11.0 x 7.6 mm with ~62 % depth.
  stoneWidth: 7.6, // X
  stoneLength: 11.0, // Z, along the finger
  girdleHalf: 0.05,
  crownRatio: 0.14,
  pavilionRatio: 0.43,
  tableRatio: 0.56,
  settingGap: 0.9, // culet clearance above the band: room for the hidden halo
  prongRadius: 0.46,
  haloStone: 1.0, // hidden halo melee diameter
  paveStone: 1.25, // shank melee diameter
};

export const bandTop = () => RING.innerRadius + RING.bandThickness;
const pavilionDepth = () => RING.pavilionRatio * RING.stoneWidth;
export const girdleY = () => bandTop() + RING.settingGap + RING.girdleHalf + pavilionDepth();
export const stoneTopY = () => girdleY() + RING.girdleHalf + RING.crownRatio * RING.stoneWidth;

// Comfort-fit band: superellipse cross-section revolved around the ring axis.
export function bandGeometry() {
  const { innerRadius, bandThickness: t, bandWidth: w } = RING;
  const rc = innerRadius + t / 2;
  const pts: THREE.Vector2[] = [];
  const n = 2.8;
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    pts.push(new THREE.Vector2(rc + (t / 2) * Math.sign(c) * Math.abs(c) ** (2 / n), (w / 2) * Math.sign(s) * Math.abs(s) ** (2 / n)));
  }
  const g = new THREE.LatheGeometry(pts, 256);
  g.rotateX(Math.PI / 2); // lathe axis Y -> ring axis Z
  return g;
}

/**
 * Brilliant cut on an ellipse (round when w === l), girdle centred at the origin, table up (+Y).
 * Crown: table, 8 stars, 8 bezels (kites), 16 upper girdle facets. Pavilion: 8 mains, 16 lower girdle facets.
 * Flat-shaded (non-indexed) with outward normals.
 */
export function brilliantGeometry(w: number, l: number, opt = { crown: 0.14, pavilion: 0.43, table: 0.56, girdle: 0.03 }) {
  const hc = opt.crown * w, hp = opt.pavilion * w, g = opt.girdle * w;
  const at = (deg: number, r: number, y: number) => {
    const a = (deg * Math.PI) / 180;
    return new THREE.Vector3((w / 2) * r * Math.cos(a), y, (l / 2) * r * Math.sin(a));
  };
  const top = new THREE.Vector3(0, g + hc, 0);
  const culet = new THREE.Vector3(0, -g - hp, 0);
  const T = (j: number) => at(45 * j + 22.5, opt.table, g + hc); // table corners
  const S = (j: number) => at(45 * j + 45, (opt.table + 1) / 2 + 0.06, g + hc * 0.42); // star tips between kites
  const Gu = (k: number) => at(22.5 * k + 22.5, 1, g); // 16 girdle points, even k under table corners
  const Gd = (k: number) => at(22.5 * k + 22.5, 1, -g);
  const P = (j: number) => at(45 * j + 45, 0.78, -g - hp * 0.2); // lower girdle tips (~78 % length)

  const tris: THREE.Vector3[][] = [];
  for (let j = 0; j < 8; j++) {
    const j1 = (j + 1) % 8;
    tris.push([top, T(j), T(j1)]); // table fan
    tris.push([T(j), S(j), T(j1)]); // star
    tris.push([T(j), S((j + 7) % 8), Gu(2 * j)], [T(j), Gu(2 * j), S(j)]); // bezel kite (two halves)
    tris.push([S(j), Gu(2 * j), Gu(2 * j + 1)], [S(j), Gu(2 * j + 1), Gu((2 * j + 2) % 16)]); // upper girdle pair
    tris.push([Gd(2 * j), P((j + 7) % 8), culet], [Gd(2 * j), culet, P(j)]); // pavilion main
    tris.push([Gd(2 * j), Gd(2 * j + 1), P(j)], [Gd(2 * j + 1), Gd((2 * j + 2) % 16), P(j)]); // lower girdle pair
  }
  for (let k = 0; k < 16; k++) { // faceted girdle band
    const k1 = (k + 1) % 16;
    tris.push([Gu(k), Gd(k), Gd(k1)], [Gu(k), Gd(k1), Gu(k1)]);
  }

  const pos: number[] = [];
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Vector3();
  const centre = new THREE.Vector3(0, (hc - hp) / 2, 0);
  for (const [a, b, d] of tris) {
    n.crossVectors(e1.subVectors(b, a), e2.subVectors(d, a));
    c.copy(a).add(b).add(d).divideScalar(3).sub(centre);
    (n.dot(c) < 0 ? [a, d, b] : [a, b, d]).forEach((v) => pos.push(v.x, v.y, v.z));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

export function stoneGeometry() {
  const { stoneWidth: W, stoneLength: L, crownRatio, pavilionRatio, tableRatio, girdleHalf } = RING;
  const geo = brilliantGeometry(W, L, { crown: crownRatio, pavilion: pavilionRatio, table: tableRatio, girdle: girdleHalf / W });
  geo.translate(0, girdleY(), 0);
  return geo;
}

// Places a small round brilliant with its table facing `normal`, girdle centre at `at`.
const UP = new THREE.Vector3(0, 1, 0);
function placed(base: THREE.BufferGeometry, at: THREE.Vector3, normal: THREE.Vector3) {
  const g = base.clone();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, normal.clone().normalize()));
  g.translate(at.x, at.y, at.z);
  return g;
}

/** Hidden halo and shank pavé: all melee in one geometry (one refraction draw call). */
export function meleeGeometry() {
  const { stoneWidth: W, stoneLength: L, haloStone: h, paveStone: p, innerRadius, bandThickness: t } = RING;
  const parts: THREE.BufferGeometry[] = [];

  // Hidden halo: just under the girdle, following the oval, tables tilted 35 deg outward-up.
  const haloBase = brilliantGeometry(h, h, { crown: 0.16, pavilion: 0.43, table: 0.55, girdle: 0.03 });
  const hy = girdleY() - 1.15;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const at = new THREE.Vector3((W / 2) * 0.86 * Math.cos(a), hy, (L / 2) * 0.86 * Math.sin(a));
    const out = new THREE.Vector3(Math.cos(a) / W, 0, Math.sin(a) / L).normalize();
    parts.push(placed(haloBase, at, out.multiplyScalar(Math.cos(0.61)).add(new THREE.Vector3(0, Math.sin(0.61), 0))));
  }

  // Shank pavé: a single row on the outer surface, both shoulders, from the head down two thirds of the band.
  const paveBase = brilliantGeometry(p, p, { crown: 0.16, pavilion: 0.43, table: 0.55, girdle: 0.03 });
  const R = innerRadius + t - 0.12; // seated slightly into the metal
  const step = (p * 1.1) / R;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 11; i++) {
      const b = 0.42 + i * step; // radians from the top (+Y); 0.42 clears the claws
      const dir = new THREE.Vector3(side * Math.sin(b), Math.cos(b), 0);
      parts.push(placed(paveBase, dir.clone().multiplyScalar(R), dir));
    }
  }
  return mergeGeometries(parts.map((g) => g.toNonIndexed()));
}

// Claw tube that thins from base to tip, like a hand-finished prong (TubeGeometry is uniform).
function taperedTube(curve: THREE.Curve<THREE.Vector3>, r0: number, r1: number, segs = 64, radial = 16) {
  const g = new THREE.TubeGeometry(curve, segs, 1, radial, false);
  const pos = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    curve.getPointAt(i / segs, c);
    const r = r0 + (r1 - r0) * (i / segs);
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  g.computeVertexNormals();
  return g;
}

/** Metal of the head: four claws, two gallery rails, halo seat, pavé beads. */
export function settingGeometries() {
  const { stoneWidth: W, stoneLength: L, prongRadius: r, girdleHalf: g, paveStone: p, innerRadius, bandThickness: t } = RING;
  const gy = girdleY(), by = bandTop();
  const at = (a: number, s: number, y: number) => new THREE.Vector3((W / 2) * s * Math.cos(a), y, (L / 2) * s * Math.sin(a));
  const parts: THREE.BufferGeometry[] = [];

  for (const deg of [45, 135, 225, 315]) { // claws on the diagonals, tapering tip over the crown
    const a = (deg * Math.PI) / 180;
    const curve = new THREE.CatmullRomCurve3([
      at(a, 0.2, by - 0.8), at(a, 0.62, by + 0.6), at(a, 0.98, gy - 1.6), at(a, 1.07, gy), at(a, 0.95, gy + g + 0.55),
    ]);
    parts.push(taperedTube(curve, r * 1.1, r * 0.72));
    const tip = new THREE.SphereGeometry(r * 0.74, 20, 14);
    const e = curve.getPoint(1);
    tip.translate(e.x, e.y, e.z);
    parts.push(tip);
  }
  const rail = (s: number, y: number, rad: number) =>
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 64 }, (_, i) => at((i / 64) * Math.PI * 2, s, y)), true), 200, rad, 12, true);
  parts.push(rail(0.86, gy - 1.75, 0.34)); // halo seat under the melee
  parts.push(rail(0.5, by + 0.25, 0.22)); // lower gallery

  // Pavé beads: tiny claws between shank stones, sunk into the metal so they read as grain, not rivets.
  const R = innerRadius + t;
  const step = (p * 1.1) / R;
  for (const side of [-1, 1]) {
    for (let i = 0; i <= 11; i++) {
      const b = 0.42 + (i - 0.5) * step;
      for (const z of [-0.6, 0.6]) {
        const bead = new THREE.SphereGeometry(0.14, 10, 8);
        bead.translate(side * Math.sin(b) * (R - 0.05), Math.cos(b) * (R - 0.05), z);
        parts.push(bead);
      }
    }
  }
  return mergeGeometries(parts.map((x) => x.toNonIndexed()));
}

/** Ring pillow: two navy velvet halves pressed together; the band stands in the crease. */
export const CUSHION = { top: -4.2, width: 27, depth: 12.5, height: 15, round: 5.6 };

// Camera presets: azimuth from +Z toward +X, elevation, distance scale, target. Shared by hero and capture.
export type Preset = { az: number; el: number; dist: number; target: [number, number, number] };
export const PRESETS: Record<string, Preset> = {
  '01-hero-front': { az: 58, el: 20, dist: 1, target: [0, -0.5, 0] },
  '02-side-profile': { az: 90, el: 8, dist: 1, target: [0, -0.5, 0] },
  '03-top-facets': { az: 50, el: 58, dist: 1, target: [0, 4, 0] },
  '04-setting-macro': { az: 56, el: 22, dist: 0.42, target: [0, girdleY() - 0.6, 0] },
  '05-loop-return': { az: 58, el: 20, dist: 1, target: [0, -0.5, 0] },
};
