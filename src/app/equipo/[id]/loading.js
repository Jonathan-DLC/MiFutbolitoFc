export default function EquipoLoading() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Esqueleto Hero Header de Equipo */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '320px',
          borderRadius: 'var(--radius-lg)',
          marginTop: '2rem',
          marginBottom: '3rem',
        }}
      />

      {/* Esqueleto Descripción */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="skeleton" style={{ width: '180px', height: '28px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ width: '95%', height: '16px', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ width: '80%', height: '16px' }} />
      </div>

      {/* Esqueleto Plantilla de Jugadores */}
      <div>
        <div className="skeleton" style={{ width: '160px', height: '28px', marginBottom: '1.5rem' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: '240px',
                borderRadius: 'var(--radius-md)',
                opacity: 1 - i * 0.08,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
