/**
 * ResultPanel — shows a successfully encoded/decoded image result.
 * Props:
 *   title        — panel heading
 *   imageDataUrl — base64 data URL
 *   filename     — download filename
 *   meta         — array of { label, value } metadata items
 */
export default function ResultPanel({ title, imageDataUrl, filename = 'result.png', meta = [] }) {
  if (!imageDataUrl) return null;

  const handleDownload = async () => {
    const a = document.createElement('a');
    // blob: URLs work directly; data: URLs also work as-is
    a.href = imageDataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="card fade-up" style={{ borderColor: 'rgba(63,185,80,0.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: 'var(--success)' }}>
          {title}
        </h3>
        <button className="btn btn-accent" onClick={handleDownload} style={{ fontSize: 13, padding: '7px 16px' }}>
          Download
        </button>
      </div>

      <img
        src={imageDataUrl}
        alt={title}
        style={{
          width: '100%', maxHeight: 320,
          objectFit: 'contain', borderRadius: 8,
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
        }}
      />

      {meta.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10, marginTop: 16,
        }}>
          {meta.map(({ label, value }) => (
            <div key={label} style={{
              background: 'var(--bg-base)',
              borderRadius: 8, padding: '10px 12px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
