import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',             label: 'Home' },
  { to: '/encode-image', label: 'Hide Image' },
  { to: '/decode-image', label: 'Extract Image' },
  { to: '/encode-text',  label: 'Hide Text' },
  { to: '/decode-text',  label: 'Extract Text' },
  { to: '/visualize',    label: 'Visualize' },
  { to: '/docs',         label: 'Docs' },
];

const css = `
/* ---------- Header shell ---------- */
.sk-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background-color: rgba(10, 10, 10, 0.72);
  background-image: radial-gradient(520px 90px at 50% 0, rgba(0,229,195,0.08), transparent 70%);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background-color .3s ease, box-shadow .3s ease, border-color .3s ease;
  animation: sk-drop .7s cubic-bezier(.22,1,.36,1) backwards;
}
.sk-header.is-scrolled {
  background-color: rgba(8, 8, 8, 0.9);
  border-bottom-color: rgba(255,255,255,0.09);
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
}
.sk-nav {
  max-width: 1280px;
  margin: 0 auto;
  height: 60px;
  padding: 0 28px;
  display: flex;
  align-items: center;
}
.sk-slot { flex: 1; min-width: 0; display: flex; align-items: center; }

/* ---------- Bottom edge: light sweep + scroll progress ---------- */
.sk-edge {
  position: absolute;
  left: 0; right: 0; bottom: -1px;
  height: 2px;
  overflow: hidden;
  pointer-events: none;
}
.sk-sweep {
  position: absolute;
  left: 0; bottom: 0;
  width: 28%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,229,195,0.9), transparent);
  animation: sk-sweep 5s ease-in-out infinite;
}
.sk-progress {
  position: absolute;
  left: 0; bottom: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, rgba(0,229,195,0.25), #00E5C3);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

/* ---------- Logo ---------- */
.sk-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; flex-shrink: 0;
}
.sk-mark {
  position: relative;
  width: 32px; height: 32px;
  border-radius: 9px;
  overflow: hidden;
  display: grid; place-items: center;
  box-shadow: 0 0 18px rgba(0,229,195,0.14);
  transition: box-shadow .3s ease, transform .35s cubic-bezier(.34,1.56,.64,1);
}
.sk-mark::before {            /* spinning light ring */
  content: '';
  position: absolute; inset: -60%;
  background: conic-gradient(from 0deg, transparent 0 55%, rgba(0,229,195,0.95) 85%, transparent 100%);
  animation: sk-spin 3.2s linear infinite;
}
.sk-mark::after {             /* inner plate that leaves a 1px ring visible */
  content: '';
  position: absolute; inset: 1px;
  border-radius: 8px;
  background: linear-gradient(145deg, #0f1a19, #0a0c0c);
}
.sk-mark svg {
  position: relative; z-index: 1;
  transition: transform .4s cubic-bezier(.34,1.56,.64,1);
}
.sk-logo:hover .sk-mark { box-shadow: 0 0 26px rgba(0,229,195,0.38); transform: translateY(-1px) rotate(-4deg); }
.sk-logo:hover .sk-mark svg { transform: scale(1.12); }

.sk-word {
  display: inline-flex; align-items: baseline;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700; font-size: 17px; letter-spacing: -0.02em;
  color: #fff;
}
.sk-kit { color: #00E5C3; }
.sk-logo:hover .sk-kit {
  background: linear-gradient(90deg, #00E5C3 0%, #b6fff2 50%, #00E5C3 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: sk-shimmer 1.4s linear infinite;
}
.sk-caret {                   /* terminal-style blinking underscore */
  align-self: flex-end;
  width: 9px; height: 2px;
  margin: 0 0 3px 3px;
  background: #00E5C3;
  opacity: 0;
}
.sk-logo:hover .sk-caret { animation: sk-blink 1s steps(1) infinite; }

/* ---------- Links ---------- */
.sk-links {
  position: relative;
  display: flex;
  justify-content: center;
  justify-content: safe center;
  height: 60px;
  min-width: 0; flex-shrink: 1;
  overflow-x: auto; overflow-y: hidden;
  scrollbar-width: none; -ms-overflow-style: none;
}
.sk-links::-webkit-scrollbar { display: none; }

.sk-pill {                    /* hover highlight that slides between links */
  position: absolute; top: 12px; left: 0;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  pointer-events: none;
  opacity: 0;
  transition: transform .35s cubic-bezier(.22,1,.36,1), width .35s cubic-bezier(.22,1,.36,1), opacity .2s ease;
  will-change: transform, width;
}
.sk-pill.is-on { opacity: 1; }

.sk-underline {               /* active-page indicator that glides on route change */
  position: absolute; bottom: 0; left: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: #00E5C3;
  box-shadow: 0 -3px 12px rgba(0,229,195,0.7), 0 0 6px rgba(0,229,195,0.6);
  transition: transform .5s cubic-bezier(.34,1.4,.5,1), width .5s cubic-bezier(.34,1.4,.5,1), opacity .2s ease;
  will-change: transform, width;
}

.sk-link {
  position: relative; z-index: 1;
  height: 60px;
  padding: 0 16px;
  display: flex; align-items: center;
  font: 500 14px/1 'Inter', -apple-system, 'Segoe UI', sans-serif;
  letter-spacing: 0.01em;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease, transform .15s ease;
  animation: sk-rise .6s cubic-bezier(.22,1,.36,1) backwards;
  animation-delay: calc(var(--i) * 55ms + 250ms);
}
.sk-link:hover { color: #fff; }
.sk-link:active { transform: scale(0.96); }
.sk-link.is-active { color: #fff; text-shadow: 0 0 18px rgba(0,229,195,0.45); }
.sk-link:focus-visible { outline: 2px solid #00E5C3; outline-offset: -10px; border-radius: 12px; }

/* ---------- Keyframes ---------- */
@keyframes sk-drop    { from { transform: translateY(-100%); opacity: 0; } }
@keyframes sk-rise    { from { opacity: 0; transform: translateY(-8px); } }
@keyframes sk-spin    { to   { transform: rotate(360deg); } }
@keyframes sk-sweep   { 0% { transform: translateX(-100%); } 100% { transform: translateX(360%); } }
@keyframes sk-shimmer { to { background-position: -200% center; } }
@keyframes sk-blink   { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .sk-header, .sk-link, .sk-mark::before, .sk-sweep,
  .sk-logo:hover .sk-kit, .sk-logo:hover .sk-caret { animation: none !important; }
  .sk-pill, .sk-underline { transition: none !important; }
}
`;

export default function Navbar() {
  const location = useLocation();

  const linkRefs = useRef([]);
  const progressRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);       // false until first measurement is done
  const [activeRect, setActiveRect] = useState(null);
  const [hoverRect, setHoverRect] = useState(null);

  const activeIdx = NAV_ITEMS.findIndex(({ to }) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  );

  // Measure the active link so the underline knows where to sit
  const measure = useCallback(() => {
    const el = linkRefs.current[activeIdx];
    setActiveRect(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [activeIdx]);

  useLayoutEffect(() => {
    measure();
    const raf = requestAnimationFrame(() => setReady(true));
    window.addEventListener('resize', measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure); // re-measure once fonts load
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Scrolled state + scroll progress line
  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 8);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        }
        ticking = false;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [location.pathname]);

  const hoverTo = (i) => {
    const el = linkRefs.current[i];
    if (el) setHoverRect({ left: el.offsetLeft, width: el.offsetWidth });
  };

  const pillRect = hoverRect ?? activeRect;

  return (
    <header className={`sk-header${scrolled ? ' is-scrolled' : ''}`}>
      <style>{css}</style>

      <nav className="sk-nav">
        {/* Left slot: logo */}
        <div className="sk-slot">
          <NavLink to="/" className="sk-logo" aria-label="StegoKit home">
            <div className="sk-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5C3" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <span className="sk-word">
              Stego<span className="sk-kit">Kit</span>
              <span className="sk-caret" aria-hidden="true" />
            </span>
          </NavLink>
        </div>

        {/* Center slot: nav links */}
        <div
          className="sk-links"
          onMouseLeave={() => setHoverRect(null)}
          onBlur={() => setHoverRect(null)}
        >
          <span
            aria-hidden="true"
            className={`sk-pill${hoverRect ? ' is-on' : ''}`}
            style={{
              transform: `translateX(${(pillRect?.left ?? 0) + 4}px)`,
              width: Math.max((pillRect?.width ?? 0) - 8, 0),
            }}
          />
          <span
            aria-hidden="true"
            className="sk-underline"
            style={{
              opacity: activeRect ? 1 : 0,
              transform: `translateX(${(activeRect?.left ?? 0) + 16}px)`,
              width: Math.max((activeRect?.width ?? 0) - 32, 0),
              transition: ready ? undefined : 'none',   // no slide-in on first paint
            }}
          />

          {NAV_ITEMS.map(({ to, label }, i) => (
            <NavLink
              key={to}
              to={to}
              ref={(el) => (linkRefs.current[i] = el)}
              className={`sk-link${i === activeIdx ? ' is-active' : ''}`}
              style={{ '--i': i }}
              onMouseEnter={() => hoverTo(i)}
              onFocus={() => hoverTo(i)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right slot: spacer that balances the logo */}
        <div className="sk-slot" />
      </nav>

      {/* Bottom edge: moving light + scroll progress */}
      <div className="sk-edge" aria-hidden="true">
        <span className="sk-sweep" />
        <span ref={progressRef} className="sk-progress" />
      </div>
    </header>
  );
}