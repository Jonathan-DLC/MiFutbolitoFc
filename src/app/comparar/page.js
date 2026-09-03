import {
  getAllLeagues,
  getUnifiedTopScorers,
  getUnifiedTopAssists,
} from '@/lib/api-unified';
import CompareClient from './CompareClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Comparar Jugadores — MiFutbolitoFc',
  description: 'Compara estadísticas de goleadores y asistentes de las mejores ligas del mundo.',
};

export default async function ComparePage() {
  const leagues = getAllLeagues();

  // Obtener goleadores y asistentes de todas las ligas en paralelo
  const allData = await Promise.all(
    leagues.map(async (league) => {
      const [scorers, assists] = await Promise.all([
        getUnifiedTopScorers(league.slug).catch(() => []),
        getUnifiedTopAssists(league.slug).catch(() => []),
      ]);
      return { scorers, assists, leagueName: league.name };
    })
  );

  // Combinar todos los jugadores y eliminar duplicados por ID
  const seenIds = new Set();
  const allScorers = allData.flatMap(({ scorers, assists, leagueName }) => {
    const combined = [...scorers, ...assists];
    return combined
      .filter((p) => {
        if (!p.idPlayer || seenIds.has(p.idPlayer)) return false;
        seenIds.add(p.idPlayer);
        return true;
      })
      .map((p) => ({ ...p, leagueName }));
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerGlow} />
        <div className={`container ${styles.headerContent}`}>
          <span className="badge animate-in">⚔️ Herramienta de Análisis</span>
          <h1 className={`${styles.title} animate-in animate-in-delay-1`}>
            Comparar <span className="accent-text">Jugadores</span>
          </h1>
          <p className={`${styles.subtitle} animate-in animate-in-delay-2`}>
            Elige dos goleadores o asistentes de cualquier liga y compara sus estadísticas cara a cara.
          </p>
        </div>
      </section>

      {/* Herramienta */}
      <section className="section">
        <div className="container">
          <CompareClient allScorers={allScorers} />
        </div>
      </section>
    </div>
  );
}
