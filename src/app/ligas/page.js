import Link from 'next/link';
import Image from 'next/image';
import {
  getAllLeagues,
  getUnifiedStandings,
  getLeagueDetails,
} from '@/lib/api-unified';
import styles from './page.module.css';

export const metadata = {
  title: 'Ligas — MiFutbolitoFc',
  description: 'Explora las 7 ligas más importantes del mundo. Tablas de posiciones, equipos y estadísticas.',
};

export default async function LeaguesPage() {
  const leagues = getAllLeagues();

  // Obtener datos de cada liga en paralelo
  const leagueData = await Promise.all(
    leagues.map(async (league) => {
      const [standings, details] = await Promise.all([
        getUnifiedStandings(league.slug).catch(() => []),
        getLeagueDetails(league.id).catch(() => null),
      ]);
      return { league, standings, details };
    })
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerGlow} />
        <div className={`container ${styles.headerContent}`}>
          <span className="badge animate-in">🌍 Explorador Global</span>
          <h1 className={`${styles.title} animate-in animate-in-delay-1`}>
            Todas las <span className="accent-text">Ligas</span>
          </h1>
          <p className={`${styles.subtitle} animate-in animate-in-delay-2`}>
            Las 7 competiciones más importantes del fútbol mundial en un solo lugar.
          </p>
        </div>
      </section>

      {/* Grid de Ligas */}
      <section className="section">
        <div className="container">
          <div className={styles.leaguesGrid}>
            {leagueData.map(({ league, standings, details }, i) => {
              const top3 = standings.slice(0, 3);
              const badge = details?.strBadge || details?.strLogo || null;

              return (
                <Link
                  href={`/liga/${league.slug}`}
                  key={league.slug}
                  className={`${styles.leagueCard} animate-in`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Fondo gradiente */}
                  <div className={styles.cardGlow} />

                  {/* Cabecera de la tarjeta */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardBadge}>
                      {badge ? (
                        <Image
                          src={badge}
                          alt={league.name}
                          width={56}
                          height={56}
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <span className={styles.cardFlag}>{league.flag}</span>
                      )}
                    </div>
                    <div className={styles.cardInfo}>
                      <h2 className={styles.cardName}>{league.name}</h2>
                      <span className={styles.cardCountry}>
                        {league.flag} {league.country}
                      </span>
                    </div>
                  </div>

                  {/* Mini tabla (top 3) */}
                  {top3.length > 0 && (
                    <div className={styles.miniTable}>
                      {top3.map((team, j) => (
                        <div key={team.idTeam || j} className={styles.miniRow}>
                          <span className={styles.miniPos}>{j + 1}</span>
                          {team.strTeamBadge && (
                            <Image
                              src={team.strTeamBadge}
                              alt={team.strTeam}
                              width={20}
                              height={20}
                              style={{ objectFit: 'contain', flexShrink: 0 }}
                            />
                          )}
                          <span className={styles.miniName}>{team.strTeam}</span>
                          <span className={styles.miniPts}>{team.intPoints} pts</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <span className={styles.cardTeams}>
                      {standings.length > 0 ? `${standings.length} equipos` : 'Ver detalles'}
                    </span>
                    <span className={styles.cardArrow}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
