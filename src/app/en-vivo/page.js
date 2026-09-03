import {
  getAllLeagues,
  getUnifiedLastEvents,
  getUnifiedNextEvents,
} from '@/lib/api-unified';
import MatchCard from '@/components/MatchCard';
import styles from './page.module.css';

export const metadata = {
  title: 'En Vivo — MiFutbolitoFc',
  description: 'Sigue los resultados y próximos partidos de todas las ligas en tiempo real.',
};

export const revalidate = 60; // Revalidar cada minuto

export default async function EnVivoPage() {
  const leagues = getAllLeagues();

  // Obtener últimos y próximos eventos de todas las ligas
  const allData = await Promise.all(
    leagues.map(async (league) => {
      const [lastEvents, nextEvents] = await Promise.all([
        getUnifiedLastEvents(league.slug).catch(() => []),
        getUnifiedNextEvents(league.slug).catch(() => []),
      ]);
      return { league, lastEvents, nextEvents };
    })
  );

  // Separar partidos recientes y próximos
  const recentMatches = allData
    .flatMap(({ league, lastEvents }) =>
      lastEvents.slice(0, 4).map((e) => ({ ...e, leagueName: league.name, leagueFlag: league.flag }))
    )
    .sort((a, b) => {
      // Ordenar por fecha descendente (más recientes primero)
      if (a.dateEvent && b.dateEvent) return b.dateEvent.localeCompare(a.dateEvent);
      return 0;
    });

  const upcomingMatches = allData
    .flatMap(({ league, nextEvents }) =>
      nextEvents.slice(0, 4).map((e) => ({ ...e, leagueName: league.name, leagueFlag: league.flag }))
    )
    .sort((a, b) => {
      // Ordenar por fecha ascendente (más próximos primero)
      if (a.dateEvent && b.dateEvent) return a.dateEvent.localeCompare(b.dateEvent);
      return 0;
    });

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerGlow} />
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span className={styles.liveText}>Resultados en Tiempo Real</span>
          </div>
          <h1 className={`${styles.title} animate-in`}>
            Centro de <span className="accent-text">Partidos</span>
          </h1>
          <p className={`${styles.subtitle} animate-in animate-in-delay-1`}>
            Todos los resultados y próximos encuentros de las 7 ligas que seguimos.
          </p>
        </div>
      </section>

      {/* Próximos Partidos */}
      {upcomingMatches.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>📅 Próximos Partidos</h2>
            </div>
            <div className={styles.matchGrid}>
              {upcomingMatches.slice(0, 12).map((event, i) => (
                <div key={event.idEvent || i} className={styles.matchWrap} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={styles.matchLeague}>
                    {event.leagueFlag} {event.leagueName}
                  </div>
                  <MatchCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Últimos Resultados */}
      {recentMatches.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div className="section-title">
              <h2>✅ Últimos Resultados</h2>
            </div>
            <div className={styles.matchGrid}>
              {recentMatches.slice(0, 16).map((event, i) => (
                <div key={event.idEvent || i} className={styles.matchWrap} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={styles.matchLeague}>
                    {event.leagueFlag} {event.leagueName}
                  </div>
                  <MatchCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Estado vacío */}
      {recentMatches.length === 0 && upcomingMatches.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              No hay partidos disponibles en este momento. Vuelve pronto.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
