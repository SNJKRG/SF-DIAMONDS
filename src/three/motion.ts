// Motion guide for the hero video: gloved hand lowers the ring into an open velvet box on draped silk, releases it, withdraws.
// Plain three.js, deterministic: window.__render(t) draws time t (s). Units: millimetres, ring axis Z, stone up (+Y).
// It only has to be right in geometry and timing; the video model re-renders the look from the photo frames.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { bandGeometry, meleeGeometry, settingGeometries, stoneGeometry } from './ring.ts';

export const DURATION = 4;
const W = 1280, H = 720;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b1024');
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

// Light: soft key from the upper left, faint warm rim from the back right.
const key = new THREE.DirectionalLight('#f2f4ff', 2.4);
key.position.set(-140, 150, 60);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 10, far: 500 });
key.shadow.radius = 6;
scene.add(key, new THREE.HemisphereLight('#26336a', '#03050c', 0.35));
const rim = new THREE.PointLight('#ffcf8a', 2500, 0, 2);
rim.position.set(90, 60, -120);
scene.add(rim);

const mat = {
  metal: new THREE.MeshPhysicalMaterial({ color: '#e9e7e3', metalness: 1, roughness: 0.06 }),
  stone: new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0, transmission: 1, ior: 2.42, thickness: 4, dispersion: 0.04, envMapIntensity: 3 }),
  velvet: new THREE.MeshPhysicalMaterial({ color: '#131b4d', roughness: 1, sheen: 1, sheenColor: new THREE.Color('#5a6bd0'), sheenRoughness: 0.55 }),
  satin: new THREE.MeshPhysicalMaterial({ color: '#0c1230', roughness: 0.38, sheen: 0.5, sheenColor: new THREE.Color('#4a5aa0'), clearcoat: 0.2, clearcoatRoughness: 0.45 }),
  glove: new THREE.MeshPhysicalMaterial({ color: '#f4f4f2', roughness: 0.85, sheen: 0.4, sheenColor: new THREE.Color('#ffffff') }),
  sleeve: new THREE.MeshStandardMaterial({ color: '#121a35', roughness: 0.8 }),
};
const shadowed = (m: THREE.Mesh) => ((m.castShadow = m.receiveShadow = true), m);

// Ring: origin at the band centre. Seated, the band bottom sinks 8 mm into the slot between the rolls.
const ring = new THREE.Group();
ring.add(shadowed(new THREE.Mesh(bandGeometry(), mat.metal)), shadowed(new THREE.Mesh(settingGeometries(), mat.metal)));
ring.add(new THREE.Mesh(stoneGeometry(), mat.stone), new THREE.Mesh(meleeGeometry(), mat.stone));
// Ring, box and hand share one rig, turned three-quarters to the camera like the photo frames.
const rig = new THREE.Group();
rig.rotation.y = -0.12;
scene.add(rig);
rig.add(ring);

// Ring box, ~56 x 52 x 30 mm, open lid hinged at the back. Rim top y = -2, slot (crease) along X at z = 0.
const box = new THREE.Group();
const rounded = (w: number, h: number, d: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d); s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelSize: 2.5, bevelThickness: 2.5, bevelSegments: 6, curveSegments: 16 });
  g.rotateX(-Math.PI / 2); // extrude along +Y
  return g;
};
const base = shadowed(new THREE.Mesh(rounded(54, 17, 50, 9), mat.velvet)); // rim at y = -12.5, rolls stand proud of it
base.position.y = -32;
box.add(base);
for (const z of [-8.6, 8.6]) { // two velvet rolls; their tops at y = -4
  const roll = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(9, 32, 8, 32), mat.velvet));
  roll.rotation.z = Math.PI / 2;
  roll.position.set(0, -13, z);
  box.add(roll);
}
const lid = new THREE.Group();
const lidMesh = shadowed(new THREE.Mesh(rounded(54, 15, 50, 9), mat.velvet));
lidMesh.position.set(0, 0, 25); // hinge line at the lid's back edge
lid.add(lidMesh);
lid.position.set(0, -2, -27);
lid.rotation.x = -(Math.PI / 180) * 100; // open ~100 deg
box.add(lid);
rig.add(box);

// Draped satin: low rolling folds, flattened under the box, rising into a soft drape behind it.
const silkGeo = new THREE.PlaneGeometry(1600, 1600, 320, 320);
silkGeo.rotateX(-Math.PI / 2);
const p = silkGeo.attributes.position as THREE.BufferAttribute;
for (let i = 0; i < p.count; i++) {
  const x = p.getX(i), z = p.getZ(i);
  const calm = THREE.MathUtils.smoothstep(Math.hypot(x, z), 45, 110);
  const folds = 11 * Math.sin(x / 95 + z / 140) + 6 * Math.sin((x - 1.4 * z) / 63 + 0.7) + 2.5 * Math.sin((x + 0.6 * z) / 37 + 1.3);
  const drape = 220 * Math.pow(THREE.MathUtils.clamp((-z - 40) / 420, 0, 1), 1.3);
  p.setY(i, -35 + calm * (folds + drape));
}
silkGeo.computeVertexNormals();
const silk = new THREE.Mesh(silkGeo, mat.satin);
silk.receiveShadow = true;
scene.add(silk);

// Gloved hand from capsules. Pinch: index tip on the band's left side, thumb tip on its right, at ring mid-height.
const limb = (pts: THREE.Vector3[], r: number, m: THREE.Material) => {
  const g = new THREE.Group();
  pts.forEach((a, i) => {
    const s = shadowed(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m));
    s.position.copy(a);
    g.add(s);
    if (i === 0) return;
    const b = pts[i - 1], len = a.distanceTo(b);
    const c = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 24), m));
    c.position.copy(a).add(b).multiplyScalar(0.5);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize());
    g.add(c);
  });
  return g;
};
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const hand = new THREE.Group();
const fingers = new THREE.Group();
hand.add(fingers);
const palm = shadowed(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), mat.glove));
palm.scale.set(24, 12, 25);
palm.position.set(18, 44, -12);
palm.rotation.set(0.15, 0.2, 0.55);
hand.add(palm);
hand.add(limb([v(30, 54, -10), v(70, 82, -6)], 14, mat.glove)); // cuff
hand.add(limb([v(64, 78, -7), v(170, 150, 4)], 17.5, mat.sleeve));
function pose(open: number) { // open 0 = pinching, 1 = released
  fingers.clear();
  const o = 7 * open;
  fingers.add(limb([v(2, 40, 3), v(-12, 27, 3), v(-18 - o * 0.5, 12, 1.5), v(-18.6 - o, 1 + o * 0.6, 0)], 8, mat.glove)); // index
  fingers.add(limb([v(30, 30, 10), v(24, 14, 7), v(18.6 + o, 1 + o * 0.6, 1)], 8.5, mat.glove)); // thumb
  fingers.add(limb([v(4, 44, -14), v(-12, 37, -16), v(-27, 28, -16), v(-35, 20, -15)], 8, mat.glove)); // middle
  fingers.add(limb([v(9, 46, -29), v(-5, 41, -31), v(-18, 34, -31), v(-25, 28, -30)], 7.5, mat.glove)); // ring
  fingers.add(limb([v(15, 47, -42), v(4, 44, -44), v(-6, 39, -44)], 6.5, mat.glove)); // little
}
rig.add(hand);

// Camera: three-quarter front from the left-ish, ~18 deg above, box placed in the right third of a 16:9 frame.
const camera = new THREE.PerspectiveCamera(24, W / H, 5, 3000);
const target = v(0, -8, 0);
const az = THREE.MathUtils.degToRad(24), el = THREE.MathUtils.degToRad(15), dist = 250;
camera.position.set(target.x + dist * Math.cos(el) * Math.sin(az), target.y + dist * Math.sin(el), target.z + dist * Math.cos(el) * Math.cos(az));
camera.lookAt(target);
camera.setViewOffset(W, H, -W * 0.22, -H * 0.04, W, H); // shift the subject right, leave the left half calm

const ease = (a: number, b: number, t: number) => THREE.MathUtils.smootherstep(t, a, b);
const easeIn = (a: number, b: number, t: number) => Math.pow(THREE.MathUtils.clamp((t - a) / (b - a), 0, 1), 2.2);

// Timeline (s): 0-0.3 hold, 0.3-1.9 lower 9 mm into the slot, 2.0-2.5 fingers open, 2.6-3.5 hand lifts away up-right, then still.
function render(t: number) {
  const ringY = 9 * (1 - ease(0.3, 1.9, t));
  ring.position.y = ringY;
  pose(ease(2.0, 2.5, t));
  const away = easeIn(2.6, 3.5, t);
  hand.position.set(away * 150 + ease(2.0, 2.5, t) * 2, ringY + away * 190 + ease(2.0, 2.5, t) * 3, away * 20);
  hand.visible = away < 1;
  renderer.render(scene, camera);
}

Object.assign(window, { __render: render, __duration: DURATION, __ready: true });
render(0);
