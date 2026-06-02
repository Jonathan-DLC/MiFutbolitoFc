'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Loguear el error a un servicio de telemetría si fuera necesario
    console.error('Captured application error:', error);
  }, [error]);

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
          fontSize: '5rem',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 0 15px rgba(255, 75, 75, 0.4))',
          animation: 'pulse 2s infinite',
        }}
      >
        🟥
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
        ¡Falta en el Área de Datos!
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
        Hubo un problema temporal al recuperar la información del servidor o al conectar con la base de datos.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => reset()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.75rem',
            borderRadius: '12px',
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#0a0e17',
            background: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 242, 96, 0.25)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔄 Reintentar Jugada
        </button>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.75rem',
            borderRadius: '12px',
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#f0f2f5',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textDecoration: 'none',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          🏠 Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
