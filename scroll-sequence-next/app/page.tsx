import ScrollSequence from '../components/ScrollSequence';
import '../styles/globals.css';

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Cinematic Scroll Sequence</h1>
          <p className="hero-sub">A premium scroll-driven PNG sequence animation.</p>
          <a className="btn-primary cta" href="#sequence">View Experience</a>
        </div>
      </section>

      <section id="sequence" className="sequence-section">
        <ScrollSequence
          sequencePath="/sequence"
          framePrefix="frame_"
          frameCount={300}
        />
      </section>

      <section className="content about">
        <h2>About</h2>
        <p>High fidelity scroll-driven storytelling built with Next.js, GSAP and Canvas.</p>
      </section>

      <section className="content features">
        <h2>Features</h2>
        <ul>
          <li>Smooth scrub controlled by scroll</li>
          <li>Preloader with progress</li>
          <li>Optimized canvas rendering</li>
          <li>Retina support and lazy loading</li>
        </ul>
      </section>

      <section className="content gallery">
        <h2>Gallery</h2>
        <p>Drop your PNG frames into /public/sequence/</p>
      </section>

      <section className="content contact">
        <h2>Contact</h2>
        <p>Get in touch to build your cinematic experience.</p>
      </section>
    </main>
  );
}
