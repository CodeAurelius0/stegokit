import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import EncodeImage from './pages/EncodeImage';
import DecodeImage from './pages/DecodeImage';
import EncodeText  from './pages/EncodeText';
import DecodeText  from './pages/DecodeText';
import Visualize   from './pages/Visualize';
import Docs        from './pages/Docs';

export default function App() {
  const basename = import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basename}>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/encode-image" element={<EncodeImage />} />
          <Route path="/decode-image" element={<DecodeImage />} />
          <Route path="/encode-text"  element={<EncodeText />} />
          <Route path="/decode-text"  element={<DecodeText />} />
          <Route path="/visualize"    element={<Visualize />} />
          <Route path="/docs"         element={<Docs />} />
          <Route path="*"             element={
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
              <div style={{ color: 'var(--text-secondary)' }}>Page not found.</div>
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
