import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getUnifiedLeagueBySlug,
  getUnifiedStandings,
  getUnifiedLastEvents,
  getUnifiedNextEvents,
  getUnifiedTeamsByLeague,
  getUnifiedKnockoutEvents,
  getUnifiedTopScorers,
  getLeagueDetails,
  translateText,
} from '@/lib/api-unified';
import StandingsTable from '@/components/StandingsTable';
import MatchCard from '@/components/MatchCard';
import TeamCard from '@/components/TeamCard';
import KnockoutBracket from '@/components/KnockoutBracket';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const league = getUnifiedLeagueBySlug(id);
  if (!league) return { title: 'Liga no encontrada' };
  return {
    title: `${league.name} — MiFutbolitoFc`,
    description: `Tabla de posiciones, resultados y equipos de la ${league.name}.`,
  };
}

export default async function LeaguePage({ params }) {
  const { id } = await params;
  const league = getUnifiedLeagueBySlug(id);
  if (!league) notFound();

  const [details, standings, lastEvents, nextEvents, teams, knockoutEvents, topScorers] =
    await Promise.all([
      getLeagueDetails(league.id).catch(() => null),
      getUnifiedStandings(league.slug).catch(() => []),
      getUnifiedLastEvents(league.slug).catch(() => []),
      getUnifiedNextEvents(league.slug).catch(() => []),
      getUnifiedTeamsByLeague(league.slug).catch(() => []),
      getUnifiedKnockoutEvents(league.id, league.season).catch(() => ({})),
      getUnifiedTopScorers(league.slug).catch(() => []),
    ]);

  let descES = details?.strDescriptionES;
  if (!descES && details?.strDescriptionEN) {
    descES = await translateText(details.strDescriptionEN);
  }

  return (
    <>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg}>
          {details?.strFanart1 && (
            <Image
              src={details.strFanart1}
              alt={league.name}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          )}
          <div className={styles.headerOverlay} />
        </div>

        <div className={`container ${styles.headerContent}`}>
          {details?.strBadge && (
            <div className={`${styles.leagueBadge} animate-in`}>
              <Image
                src={details.strBadge}
                alt={league.name}
                width={80}
                height={80}
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
          <h1 className={`${styles.leagueTitle} animate-in animate-in-delay-1`}>
            {league.name}
          </h1>
          {descES && (
            <p className={`${styles.leagueDesc} animate-in animate-in-delay-2`}>
              {descES.substring(0, 250)}...
            </p>
          )}
        </div>
      </section>

      {/* Tabla de Posiciones */}
      {standings.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Tabla de Posiciones</h2>
            </div>
            <StandingsTable standings={standings} />
          </div>
        </section>
      )}

      {/* Últimos Resultados */}
      {lastEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Últimos Resultados</h2>
            </div>
            <div className={styles.matchGrid}>
              {lastEvents.slice(0, 8).map((event, i) => (
                <div key={event.idEvent} style={{ animationDelay: `${i * 60}ms` }}>
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
              {nextEvents.slice(0, 8).map((event, i) => (
                <div key={event.idEvent} style={{ animationDelay: `${i * 60}ms` }}>
                  <MatchCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fase Eliminatoria (Sólo Champions) */}
      {knockoutEvents && Object.keys(knockoutEvents).length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Fase Eliminatoria</h2>
            </div>
            <KnockoutBracket knockoutEvents={knockoutEvents} />
          </div>
        </section>
      )}

      {/* Top Goleadores — NUEVO (datos de API-Football) */}
      {topScorers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>⚽ Top Goleadores</h2>
            </div>
            <div className={styles.matchGrid}>
              {topScorers.slice(0, 10).map((scorer, i) => (
                <article
                  key={scorer.idPlayer || i}
                  className="glass-card animate-in"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: i < 3 ? 'var(--accent-primary)' : 'var(--text-muted)',
                    minWidth: '2rem',
                    textAlign: 'center',
                  }}>
                    {i + 1}
                  </span>
                  {scorer.strPhoto && (
                    <Image
                      src={scorer.strPhoto}
                      alt={scorer.strPlayer}
                      width={48}
                      height={48}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {scorer.strPlayer}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {scorer.strTeam} · {scorer.strNationality}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      color: 'var(--accent-primary)',
                    }}>
                      {scorer.intGoals}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GOLES</div>
                  </div>
                  {scorer.intAssists > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                      }}>
                        {scorer.intAssists}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ASIST</div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Equipos */}
      {teams.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Equipos</h2>
            </div>
            <div className={styles.teamsGrid}>
              {teams.map((team, i) => (
                <div key={team.idTeam} style={{ animationDelay: `${i * 50}ms` }}>
                  <TeamCard team={team} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
