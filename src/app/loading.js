export default function GlobalLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        width: '100%',
        backgroundColor: '#0a0e17',
        color: '#f0f2f5',
        fontFamily: 'var(--font-body), sans-serif',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Anillo exterior rotatorio */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '4px solid rgba(0, 242, 96, 0.1)',
            borderTop: '4px solid #00f260',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        {/* Balón emoji */}
        <span
          style={{
            fontSize: '2.5rem',
            animation: 'pulse 1.5s ease-in-out infinite',
            filter: 'drop-shadow(0 0 10px rgba(0, 242, 96, 0.4))',
          }}
        >
          ⚽
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Cargando Vestuarios
        </h3>
        <p style={{ color: '#8892a4', fontSize: '0.875rem' }}>
          Preparando la alineación...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
