

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

export default function Navbar() {
  const location = useLocation();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 200,
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <nav style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        height: 60,
      }}>
        {/* Left slot: logo */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <NavLink to="/" style={{
            textDecoration: 'none',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}>
            <div style={{
              width: 28,
              height: 28,
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <span style={{
              fontWeight: 600,
              fontSize: 17,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Stego<span style={{ color: '#00E5C3' }}>Kit</span>
            </span>
          </NavLink>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
          flexShrink: 1,
          minWidth: 0,
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {NAV_ITEMS.map(({ to, label }) => {
            const active = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                style={{
                  position: 'relative',
                  padding: '0 18px',
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 15,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                  borderBottom: active
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                  marginBottom: -1,
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                }}
              >
                {label}
              </NavLink>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
      </nav>
    </header>
  );
}