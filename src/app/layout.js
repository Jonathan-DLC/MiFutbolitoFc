import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata = {
  title: 'MiFutbolitoFc — Fútbol, Estadísticas y Minijuegos',
  description:
    'Tu portal de fútbol con resultados, tablas de posiciones, equipos y jugadores. Incluye modos de juego de la Champions y el Mundial.',
  keywords: ['fútbol', 'estadísticas', 'resultados', 'posiciones', 'minijuegos', 'champions'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main style={{ paddingTop: 'var(--navbar-height)' }}>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
