export default function LigaLoading() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Esqueleto del Header */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '280px',
          borderRadius: 'var(--radius-lg)',
          marginTop: '2rem',
          marginBottom: '3rem',
        }}
      />

      {/* Esqueleto de la Tabla de Posiciones */}
      <div style={{ marginBottom: '4rem' }}>
        <div
          className="skeleton"
          style={{ width: '220px', height: '32px', marginBottom: '1.5rem' }}
        />
        <div
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Fila Cabecera */}
          <div className="skeleton" style={{ width: '100%', height: '24px' }} />
          {/* Filas */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                width: '100%',
                height: '42px',
                opacity: 1 - i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Esqueleto de Últimos Resultados */}
      <div>
        <div
          className="skeleton"
          style={{ width: '200px', height: '32px', marginBottom: '1.5rem' }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: '140px',
                borderRadius: 'var(--radius-md)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
