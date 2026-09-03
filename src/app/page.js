import Link from 'next/link';
import {
  LEAGUES,
  getUnifiedStandings,
  getUnifiedLastEvents,
  getUnifiedNextEvents,
} from '@/lib/api-unified';
import MatchCard from '@/components/MatchCard';
import StandingsTable from '@/components/StandingsTable';
import styles from './page.module.css';

export default async function HomePage() {
  const [
    betplayStandings,
    premierStandings,
    championsStandings,
    betplayLastEvents,
    premierLastEvents,
    championsLastEvents,
    betplayNextEvents,
    premierNextEvents,
    championsNextEvents,
  ] = await Promise.all([
    getUnifiedStandings('betplay').catch(() => []),
    getUnifiedStandings('premier').catch(() => []),
    getUnifiedStandings('champions-league').catch(() => []),
    getUnifiedLastEvents('betplay').catch(() => []),
    getUnifiedLastEvents('premier').catch(() => []),
    getUnifiedLastEvents('champions-league').catch(() => []),
    getUnifiedNextEvents('betplay').catch(() => []),
    getUnifiedNextEvents('premier').catch(() => []),
    getUnifiedNextEvents('champions-league').catch(() => []),
  ]);

  const lastEvents = [
    ...betplayLastEvents.slice(0, 3),
    ...premierLastEvents.slice(0, 3),
    ...championsLastEvents.slice(0, 3),
  ];

  const nextEvents = [
    ...betplayNextEvents.slice(0, 3),
    ...premierNextEvents.slice(0, 3),
    ...championsNextEvents.slice(0, 3),
  ];

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className="badge">⚽ Diversión y Estadísticas en Vivo</span>
          </div>
          <h1 className={`${styles.heroTitle} animate-in`}>
            Mi<span className="accent-text">Futbolito</span>Fc
          </h1>
          <p className={`${styles.heroSub} animate-in animate-in-delay-1`}>
            Tu centro de entretenimiento y estadísticas de fútbol. Diviértete con trivias y minijuegos del Mundial y Champions, y sigue los resultados en tiempo real.
          </p>
          <div className={`${styles.heroActions} animate-in animate-in-delay-2`}>
            <Link href="/juegos" className={styles.btnPrimary} id="hero-btn-jugar">
              🎮 Jugar Ahora
            </Link>
            <a href="#resultados-seccion" className={styles.btnSecondary} id="hero-btn-resultados">
              📊 Ver Resultados
            </a>
          </div>
        </div>
      </section>

      {/* Zona de Juegos */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Zona de Minijuegos</h2>
          </div>
          <div className={styles.gamesPromoGrid}>
            {/* Tarjeta Modo Mundial */}
            <div className={`${styles.gamePromoCard} ${styles.worldCupCard} animate-in`}>
              <div className={styles.gamePromoHeader}>
                <span className={styles.promoEmoji}>🌍</span>
                <span className={styles.promoBadge}>Edición Especial</span>
              </div>
              <h3 className={styles.promoTitle}>Modo Mundial 2026</h3>
              <p className={styles.promoDesc}>
                Pon a prueba tus conocimientos rumbo a la cita mundialista del 2026. Adivina banderas, fotos de figuras, sprint de verdadero o falso y trivias históricas.
              </p>
              <div className={styles.promoMiniGamesList}>
                <span>🚩 Banderazo</span>
                <span>⚡ Sprint V/F</span>
                <span>📸 Adivina Figura</span>
                <span>🧠 Pistas</span>
              </div>
              <Link href="/juegos" className={styles.promoBtn}>
                ¡Entrar a Jugar! →
              </Link>
            </div>

            {/* Tarjeta Modo Champions */}
            <div className={`${styles.gamePromoCard} ${styles.championsCard} animate-in animate-in-delay-1`}>
              <div className={styles.gamePromoHeader}>
                <span className={styles.promoEmoji}>🏆</span>
                <span className={styles.promoBadge}>Clásico Europeo</span>
              </div>
              <h3 className={styles.promoTitle}>Modo Champions</h3>
              <p className={styles.promoDesc}>
                Demuestra que eres una leyenda de la UEFA Champions League. Adivina escudos de clubes en sombras, responde trivias legendarias y encuentra jugadores por pistas.
              </p>
              <div className={styles.promoMiniGamesList}>
                <span>🛡️ Escudos</span>
                <span>🧠 Trivia</span>
                <span>🧩 Pistas Pro</span>
              </div>
              <Link href="/juegos" className={styles.promoBtn} style={{ background: 'linear-gradient(135deg, #0575e6 0%, #00f260 100%)' }}>
                ¡Entrar a Jugar! →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Punto de anclaje para Resultados */}
      <div id="resultados-seccion" style={{ scrollMarginTop: 'var(--navbar-height)' }} />


      {/* Últimos Resultados */}
      {lastEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Últimos Resultados</h2>
            </div>
            <div className={styles.matchGrid}>
              {lastEvents.map((event, i) => (
                <div
                  key={event.idEvent}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <MatchCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Próximos Partidos */}
      {nextEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Próximos Partidos</h2>
            </div>
            <div className={styles.matchGrid}>
              {nextEvents.map((event, i) => (
                <div
                  key={event.idEvent}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <MatchCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tablas de Posiciones */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Tablas de Posiciones</h2>
          </div>
          <div className={styles.standingsGrid}>
            {/* BetPlay */}
            <div className={`${styles.standingsBlock} animate-in`}>
              <div className={styles.standingsHeader}>
                <h3>🇨🇴 Liga BetPlay</h3>
                <Link href="/liga/betplay" className={styles.viewAll}>
                  Ver completa →
                </Link>
              </div>
              {betplayStandings.length > 0 ? (
                <StandingsTable standings={betplayStandings} compact />
              ) : (
                <p className={styles.noData}>
                  Tabla no disponible en este momento.
                </p>
              )}
            </div>

            {/* Premier League */}
            <div
              className={`${styles.standingsBlock} animate-in animate-in-delay-2`}
            >
              <div className={styles.standingsHeader}>
                <h3>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</h3>
                <Link href="/liga/premier" className={styles.viewAll}>
                  Ver completa →
                </Link>
              </div>
              {premierStandings.length > 0 ? (
                <StandingsTable standings={premierStandings} compact />
              ) : (
                <p className={styles.noData}>
                  Tabla no disponible en este momento.
                </p>
              )}
            </div>

            {/* Champions League */}
            <div
              className={`${styles.standingsBlock} animate-in animate-in-delay-3`}
            >
              <div className={styles.standingsHeader}>
                <h3>🇪🇺 Champions League</h3>
                <Link href="/liga/champions-league" className={styles.viewAll}>
                  Ver completa →
                </Link>
              </div>
              {championsStandings.length > 0 ? (
                <StandingsTable standings={championsStandings} compact />
              ) : (
                <p className={styles.noData}>
                  Tabla no disponible (Fase de grupos/Liguilla).
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
