import Hero from '../sections/home/Hero.tsx';
import Categories from '../sections/home/Categories.tsx';
import Prices from '../sections/home/Prices.tsx';
import Channel from '../sections/home/Channel.tsx';
import Bespoke from '../sections/home/Bespoke.tsx';
import Engagement from '../sections/home/Engagement.tsx';
import About from '../sections/home/About.tsx';
import Closing from '../sections/home/Closing.tsx';
import '../sections/home/Panel.css';

// Full-screen panels, plain native scroll; each section's index matches s.home.panels.
export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Categories n={1} />
      <Prices n={2} />
      <Channel n={3} />
      <Bespoke n={4} />
      <Engagement n={5} />
      <About n={6} />
      <Closing n={7} />
    </div>
  );
}
