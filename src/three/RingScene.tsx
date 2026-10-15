import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, MeshRefractionMaterial, RoundedBox } from '@react-three/drei';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { CUSHION, PRESETS, RING, bandGeometry, meleeGeometry, settingGeometries, stoneGeometry } from './ring.ts';

export type Framing = 'auto' | 'landscape' | 'portrait';
type Props = {
  preset?: string;
  animate: boolean;
  intro?: boolean;
  framing?: Framing;
  lift?: number; // 0 = seated in the cushion, 1 = held above it (capture of the video's first frame)
  capture?: boolean;
  onReady?: () => void;
  onError?: () => void;
};

// Motion stays within WCAG 2.2.2 without a pause button: an optional intro turn that ends before 5 s; everything
// else is driven by the visitor (drag with the mouse, horizontal swipe on touch). Reduced motion never mounts this.
const INTRO = 4.5; // seconds
const TURN = 34; // peak degrees of the intro orbit; it starts and ends on the poster's pose, so no jump
const FOV = 30;
const LIFT = 7; // mm the ring rises out of the cushion while it is being turned
const IDLE = 2600; // ms after release before the ring settles back
const PIVOT = 3; // mm above the finger axis: the ring turns around the middle of the head, not the band centre
// Black flags: the camera's own reflection (the dark centre of a real diamond photo), a low wrap behind the camera side and narrow vertical bars, the dark half of the facet pattern.
const FLAGS = [[8.5, 3.6, 5.3, 9, 8], [6, -2, 9, 16, 7], [-9, 5, 3, 2, 10], [3, 6, -9, 2, 10], [-8, -3, 6, 10, 5], [12, 1, -2, 1.6, 14], [-11, 1, -5, 1.6, 14], [0, -4, -11, 16, 5]] as const;
// Small cards on a dome above the ring (golden-angle spiral), radius 11.
const SPARKS = Array.from({ length: 28 }, (_, i) => {
  const y = 0.15 + 0.85 * (i / 27), r = Math.sqrt(1 - y * y), a = i * 2.39996;
  return [11 * r * Math.cos(a), 11 * y, 11 * r * Math.sin(a)] as const;
});

type Spin = { yaw: number; pitch: number; vy: number; vp: number; lift: number; dragging: boolean; last: number };

function Ring({ spin }: { spin: MutableRefObject<Spin> }) {
  const env = useThree((st) => st.scene.environment);
  const group = useRef<THREE.Group>(null);
  const { band, stone, melee, setting, metal } = useMemo(() => ({
    band: bandGeometry(),
    stone: stoneGeometry(),
    melee: meleeGeometry(),
    setting: settingGeometries(),
    // Platinum: slightly warm grey, near-mirror polish so the studio strips stay crisp.
    metal: new THREE.MeshPhysicalMaterial({ color: '#e9e7e3', metalness: 1, roughness: 0.045, envMapIntensity: 1.6 }),
  }), []);
  useFrame(() => {
    const g = group.current, st = spin.current;
    if (!g) return;
    g.position.y = PIVOT + st.lift * LIFT;
    g.rotation.set(st.pitch, st.yaw, 0, 'YXZ');
  });
  return (
    <group ref={group}>
      <group position={[0, -PIVOT, 0]}>
        <group>
          <mesh geometry={band} material={metal} />
          <mesh geometry={setting} material={metal} />
          {/* Diamond approximation: env-map ray bounces inside the facets (drei MeshRefractionMaterial), mild aberration. */}
          {env && (
            <>
              <mesh geometry={stone}>
                <MeshRefractionMaterial envMap={env} bounces={5} ior={2.42} fresnel={1} aberrationStrength={0.004} fastChroma color="#ffffff" toneMapped={false} />
              </mesh>
              <mesh geometry={melee}>
                <MeshRefractionMaterial envMap={env} bounces={3} ior={2.42} fresnel={1} aberrationStrength={0.003} fastChroma color="#ffffff" toneMapped={false} />
              </mesh>
            </>
          )}
        </group>
      </group>
    </group>
  );
}

// Two velvet halves pressed together; the band stands in the crease at z = 0.
function Cushion() {
  const velvet = useMemo(() => {
    // Pile grain: per-texel noise as a bump map, so the surface reads as fibre instead of smooth foam.
    const n = 256, px = new Uint8Array(n * n * 4);
    for (let i = 0; i < n * n; i++) px.fill(((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * 255, i * 4, i * 4 + 3), (px[i * 4 + 3] = 255);
    const grain = new THREE.DataTexture(px, n, n);
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(14, 14);
    grain.needsUpdate = true;
    return new THREE.MeshPhysicalMaterial({
      color: '#121f40', roughness: 1, metalness: 0, sheen: 1, sheenRoughness: 0.32, sheenColor: new THREE.Color('#8ea6dc'),
      bumpMap: grain, bumpScale: 0.12, envMapIntensity: 0.35,
    });
  }, []);
  const { top, width, depth, height, round } = CUSHION;
  return (
    <group position={[0, top - height / 2 + round * 0.35, 0]}>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[width, height, depth]} radius={round} smoothness={6} position={[0, 0, side * (depth / 2 - 0.5)]} material={velvet} />
      ))}
    </group>
  );
}

function Rig({ preset, animate, intro, framing, spin, onFrame }: {
  preset: string; animate: boolean; intro: boolean; framing: Framing; spin: MutableRefObject<Spin>; onFrame: () => boolean;
}) {
  const { camera, size, gl, invalidate } = useThree();
  const strip = useRef<THREE.Mesh>(null);
  const p = PRESETS[preset] ?? PRESETS['01-hero-front'];
  const cam = camera as THREE.PerspectiveCamera;
  const portrait = framing === 'portrait' || (framing === 'auto' && size.width < size.height);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const { width: w, height: h } = size;
    // Lens shift keeps perspective while moving the ring off-centre: right half on landscape, upper part on portrait.
    if (preset === '04-setting-macro') cam.clearViewOffset();
    else if (portrait) cam.setViewOffset(w, h, 0, (w / h < 0.7 ? 0.14 : -0.07) * h, w, h);
    else cam.setViewOffset(w, h, -0.22 * w, 0.1 * h, w, h); // and lifted clear of the hero wordmark
    cam.updateProjectionMatrix();
  }, [cam, size, portrait, preset]);

  // Drag to turn: mouse anywhere on the canvas, touch only for horizontal swipes (vertical keeps scrolling the page).
  useEffect(() => {
    if (!animate) return;
    const el = gl.domElement;
    let x = 0, y = 0, id = -1;
    const down = (e: PointerEvent) => {
      id = e.pointerId; x = e.clientX; y = e.clientY;
      spin.current.dragging = true; spin.current.vy = spin.current.vp = 0;
      el.setPointerCapture(id); invalidate();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id || !spin.current.dragging) return;
      const s = spin.current, dx = e.clientX - x, dy = e.clientY - y;
      x = e.clientX; y = e.clientY;
      s.vy = dx * 0.012; s.vp = e.pointerType === 'mouse' ? dy * 0.012 : 0;
      s.yaw += s.vy; s.pitch += s.vp; s.last = performance.now();
      invalidate();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      spin.current.dragging = false; spin.current.last = performance.now(); id = -1; invalidate();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
    };
  }, [animate, gl, invalidate, spin]);

  useFrame(() => {
    const warming = onFrame(); // first frames compile shaders; the intro starts once the scene is on screen
    if (start.current === null && !warming) start.current = performance.now();
    const u = !animate || !intro ? 1 : start.current === null ? 0 : Math.min((performance.now() - start.current) / 1000 / INTRO, 1);
    const turn = u * u * (3 - 2 * u); // smoothstep: soft start and soft stop

    // Spin: inertia after release, then after a pause the ring settles back into the cushion facing the camera.
    const s = spin.current;
    const idle = !s.dragging && performance.now() - s.last > IDLE;
    if (!s.dragging) { s.yaw += s.vy; s.pitch += s.vp; s.vy *= 0.94; s.vp *= 0.94; }
    if (idle) {
      const home = Math.round(s.yaw / (Math.PI * 2)) * Math.PI * 2;
      s.yaw += (home - s.yaw) * 0.07; s.pitch += (0 - s.pitch) * 0.07;
    }
    const wantLift = s.dragging || !idle || Math.abs(s.pitch) > 0.02 ? 1 : 0;
    s.lift += (wantLift - s.lift) * 0.09;
    // Keep drawing until the ring is back home: through inertia, the idle wait and the settle.
    const away = Math.abs(s.pitch) > 1e-3 || Math.abs(s.yaw - Math.round(s.yaw / (Math.PI * 2)) * Math.PI * 2) > 1e-3;
    const moving = s.dragging || away || Math.abs(s.vy) + Math.abs(s.vp) > 1e-4 || Math.abs(s.lift - wantLift) > 1e-3;

    const aspect = size.width / size.height;
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const fitHeight = 38 / (0.56 * 2 * tan); // ring plus cushion, above the wordmark
    const tall = aspect < 0.7;
    const fitWidth = 30 / ((portrait && !tall ? 0.55 : 0.82) * 2 * tan * aspect);
    const d = Math.max(fitHeight, fitWidth) * p.dist;
    const az = THREE.MathUtils.degToRad(p.az + TURN * Math.sin(Math.PI * turn));
    const el = THREE.MathUtils.degToRad(p.el);
    const [tx, ty, tz] = p.target;
    camera.position.set(tx + d * Math.cos(el) * Math.sin(az), ty + d * Math.sin(el), tz + d * Math.cos(el) * Math.cos(az));
    camera.lookAt(tx, ty, tz);
    // The light strip sweeps across the stone once during the intro.
    if (strip.current) strip.current.position.x = 3 - 9 * Math.sin(Math.PI * turn);
    // Demand mode: draw only while something moves.
    if (warming || (animate && (u < 1 || moving))) invalidate();
  });

  return (
    <Environment resolution={256} frames={animate ? Infinity : 2}>
      <color attach="background" args={['#72757c']} />
      {/* Light tent: a bright grey box with white cards and a few black flags, so metal and facets get hard white/black
          contrast (the look of jewellery photography); no warm fill (it read as copper). */}
      <Lightformer form="rect" intensity={2.2} color="#eef3ff" position={[0, 10, 1]} scale={[16, 6, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.6} color="#e4ebff" position={[-9, 3, 7]} scale={[5, 12, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={3.2} color="#f4f7ff" position={[9, 2, 4]} scale={[1.4, 12, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.8} color="#dfe7ff" position={[0, 3, -10]} scale={[12, 3, 1]} target={[0, 0, 0]} />
      <Lightformer ref={strip} form="rect" intensity={3.5} color="#ffffff" position={[3, 5, 8]} scale={[0.8, 9, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.1} color="#c9d4ea" position={[0, -10, 2]} scale={[14, 10, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.4} color="#eef3ff" position={[10, 6, -4]} scale={[3, 6, 1]} target={[0, 0, 0]} />
      {FLAGS.map(([x, y, z, sx, sy], i) => (
        <Lightformer key={`f${i}`} form="rect" intensity={1} color="#000000" position={[x, y, z]} scale={[sx, sy, 1]} target={[0, 0, 0]} />
      ))}
      {/* Scintillation dome: many small bright cards, so every facet catches its own point of light. */}
      {SPARKS.map(([x, y, z], i) => (
        <Lightformer key={i} form="circle" intensity={5} color="#ffffff" position={[x, y, z]} scale={0.9} target={[0, 0, 0]} />
      ))}
    </Environment>
  );
}

export default function RingScene({ preset = '01-hero-front', animate, intro = true, framing = 'auto', lift = 0, capture, onReady, onError }: Props) {
  const frames = useRef(0);
  const spin = useRef<Spin>({ yaw: 0, pitch: 0, vy: 0, vp: 0, lift, dragging: false, last: lift ? Infinity : -Infinity });
  const onFrame = () => {
    frames.current += 1;
    if (frames.current > 6) return false;
    // A few frames let shaders compile and the environment map settle before the poster is swapped out.
    if (frames.current === 6) {
      onReady?.();
      if (capture) Object.assign(window, { __sceneReady: true, __sceneVersion: RING.version, __scenePresets: PRESETS });
    }
    return true;
  };
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches;
  return (
    <Canvas
      frameloop={capture ? 'always' : 'demand'}
      dpr={capture ? 1 : [1, mobile ? 1.5 : 2]}
      // No scroll tracking: each page scroll moved the canvas offset in the store, which redrew the whole scene (env
      // cube + bloom) mid-glide. Events use offsetX/Y, so the offset is unused.
      resize={{ scroll: false }}
      camera={{ fov: FOV, near: 1, far: 2000 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: !!capture, toneMappingExposure: 1 }}
      onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', () => onError?.())}
      style={{ touchAction: 'pan-y', cursor: animate ? 'grab' : undefined }}
      aria-hidden
    >
      <Rig preset={preset} animate={animate} intro={intro} framing={framing} spin={spin} onFrame={onFrame} />
      <Ring spin={spin} />
      <Cushion />
      {/* Soft glow only on HDR glints (the stones are not tone-mapped, so their sparks run far above 1), then the
          product-render tone curve: whites stay white, no ACES hue shift on platinum. */}
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1.6} luminanceSmoothing={0.2} intensity={0.9} radius={0.55} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
      <ContactShadows position={[0, CUSHION.top - CUSHION.height + CUSHION.round * 0.35 - 0.05, 0]} scale={90} blur={2.8} far={20} opacity={0.65} color="#02060f" resolution={512} frames={1} />
    </Canvas>
  );
}
