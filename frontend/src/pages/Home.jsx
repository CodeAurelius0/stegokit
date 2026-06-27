import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useScrollReveal() {
  const observed = useRef(false);
  useEffect(() => {
    if (observed.current) return;
    observed.current = true;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
    document.querySelectorAll('.stagger-grid > *').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
    return () => io.disconnect();
  }, []);
}

const STEPS = [
  { num: '01', title: 'Upload Carrier',  desc: 'Drop any PNG/JPG as your cover image.' },
  { num: '02', title: 'Add Payload',     desc: 'Choose a secret image or type your text.' },
  { num: '03', title: 'Encode',          desc: 'Engine embeds data invisibly via LSB.' },
  { num: '04', title: 'Download',        desc: 'Get your encoded image, visually identical.' },
];

const FEATURES = [
  { icon: 'IMG', name: 'Hide Image in Image',    desc: 'Embed a secret PNG inside any carrier image using LSB pixel manipulation across RGB channels.' },
  { icon: 'EXT', name: 'Extract Hidden Image',   desc: 'Recover a hidden image from an encoded carrier with optional AES-256 decryption.' },
  { icon: 'TXT', name: 'Hide Text in Image',     desc: 'Encode any UTF-8 text, including Unicode, invisibly inside a carrier image.' },
  { icon: 'DOC', name: 'Extract Hidden Text',    desc: 'Decode and recover hidden text from any StegoKit-encoded image.' },
  { icon: 'BIT', name: 'Visualize LSB Changes',  desc: 'Inspect pixel-level bit changes and understand exactly how steganography works.' },
  { icon: 'AES', name: 'AES-256 Encryption',     desc: 'Optionally encrypt your payload with AES-256-CBC before embedding for double security.' },
];

export default function Home() {
  useScrollReveal();

  return (
    <div style={{ overflow: 'hidden', paddingBottom: 60 }}>
      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center' }}>
        <div className="container-vsc" style={{ maxWidth: 800 }}>
          
          <div className="animate-on-scroll" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <span className="badge badge-blue">Open Source</span>
            <span className="badge badge-green">AES-256</span>
            <span className="badge badge-amber">LSB Engine</span>
          </div>

          <h1 className="animate-on-scroll" style={{
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            margin: '0 0 24px',
          }}>
            Hide Data Inside<br />Plain Sight
          </h1>

          <p className="animate-on-scroll" style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            fontWeight: 400,
            lineHeight: 1.6,
            margin: '0 auto 40px',
            maxWidth: 600,
          }}>
            StegoKit is a production-grade steganography toolkit. Hide images and text inside carrier images using LSB encoding — with optional AES-256 encryption.
          </p>

          <div className="animate-on-scroll" style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/encode-image" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Hide an Image
            </Link>
            <Link to="/encode-text" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Hide Text
            </Link>
            <Link to="/visualize" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Visualize
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section style={{ padding: '60px 24px' }}>
        <div className="container-vsc">
          <h2 className="animate-on-scroll" style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 48 }}>How It Works</h2>
          
          <div className="stagger-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {STEPS.map(step => (
              <div key={step.num} className="card-glass animate-on-scroll" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 20 }}>{step.num}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section style={{ padding: '60px 24px' }}>
        <div className="container-vsc">
          <h2 className="animate-on-scroll" style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 48 }}>Features</h2>
          
          <div className="stagger-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {FEATURES.map(f => (
              <div key={f.name} className="card-glass animate-on-scroll" style={{ padding: '32px' }}>
                <div style={{ width: 44, height: 44, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'monospace' }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{f.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 10 }}>Built with Node.js · Express · React · Jimp · AES-256</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>StegoKit v1.0.0 — Educational & Production-Ready</div>
      </footer>
    </div>
  );
}
