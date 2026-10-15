import { useSearchParams } from 'react-router-dom';
import RingScene, { type Framing } from '../three/RingScene.tsx';
import './Capture.css';

// Capture route for Gemini reference frames: /capture?shot=01-hero-front&framing=landscape&lift=1 (ring held above the cushion)
// No UI or text; qa/capture.mjs screenshots it at 2560x1440 once window.__sceneReady is set.
export default function Capture() {
  const [params] = useSearchParams();
  const shot = params.get('shot') ?? '01-hero-front';
  const framing = (params.get('framing') ?? 'landscape') as Framing;
  const lift = Number(params.get('lift') ?? 0);
  return (
    <div className="capture">
      <RingScene preset={shot} animate={false} framing={framing} lift={lift} capture />
    </div>
  );
}
