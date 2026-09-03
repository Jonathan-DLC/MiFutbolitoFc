import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata = {
  title: {
    default: 'MiFutbolitoFc — Fútbol, Estadísticas y Minijuegos',
    template: '%s | MiFutbolitoFc'
  },
  description: 'Tu portal de fútbol con resultados en vivo, tablas de posiciones, equipos y jugadores. Compara estadísticas y diviértete con minijuegos.',
  keywords: ['fútbol', 'estadísticas', 'resultados', 'posiciones', 'minijuegos', 'champions league', 'premier league', 'la liga'],
  authors: [{ name: 'Jonathan Lozano' }],
  creator: 'Jonathan Lozano',
  openGraph: {
    title: 'MiFutbolitoFc — Fútbol, Estadísticas y Minijuegos',
    description: 'Resultados en vivo, posiciones y estadísticas detalladas de las 7 mejores ligas del mundo.',
    url: 'https://mifutbolitofc.vercel.app', // Update with actual domain if different
    siteName: 'MiFutbolitoFc',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiFutbolitoFc — El Centro del Fútbol',
    description: 'Sigue a tu equipo favorito, compara jugadores y no te pierdas un solo resultado.',
  },
  robots: {
    index: true,
    follow: true,
  }
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
