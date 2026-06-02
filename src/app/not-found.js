import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        width: '100%',
        backgroundColor: '#0a0e17',
        color: '#f0f2f5',
        fontFamily: 'var(--font-body), sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '6rem',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 0 15px rgba(255, 242, 0, 0.4))',
          animation: 'pulse 2s infinite',
        }}
      >
        🚩
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          letterSpacing: '0.02em',
        }}
      >
        ¡Fuera de Juego!
      </h1>

      <p
        style={{
          color: '#8892a4',
          fontSize: '1rem',
          maxWidth: '500px',
          lineHeight: '1.6',
          marginBottom: '2.5rem',
        }}
      >
        El árbitro ha marcado posición adelantada. La página o el recurso de fútbol que buscas no se encuentra en nuestro campo de juego.
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 2rem',
          borderRadius: '12px',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#0a0e17',
          background: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0, 242, 96, 0.25)',
          transition: 'transform 0.2s',
        }}
      >
        🏠 Volver a la Cancha (Inicio)
      </Link>
    </div>
  );
}
