export default function JugadorLoading() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero del Jugador */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '380px',
          borderRadius: 'var(--radius-lg)',
          marginTop: '2rem',
          marginBottom: '3rem',
        }}
      />

      {/* Grid de Estadísticas */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="skeleton" style={{ width: '190px', height: '28px', marginBottom: '1.5rem' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: '80px',
                borderRadius: 'var(--radius-md)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Biografía */}
      <div>
        <div className="skeleton" style={{ width: '150px', height: '28px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '18px', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ width: '98%', height: '18px', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ width: '92%', height: '18px' }} />
      </div>
    </div>
  );
}
