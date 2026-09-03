import Image from 'next/image';
import Link from 'next/link';
import styles from './StandingsTable.module.css';

/**
 * Indicadores de zona basados en la descripción de API-Football.
 * Verde = Champions, Azul = Europa, Naranja = Conference, Rojo = Descenso
 */
function getZoneInfo(description) {
  if (!description) return null;
  const d = description.toLowerCase();
  if (d.includes('champions')) return { color: '#00f260', label: 'UCL' };
  if (d.includes('europa league')) return { color: '#0575e6', label: 'UEL' };
  if (d.includes('conference')) return { color: '#f59e0b', label: 'UECL' };
  if (d.includes('relegation') || d.includes('descenso')) return { color: '#ef4444', label: 'DESC' };
  if (d.includes('promotion') || d.includes('playoff')) return { color: '#8b5cf6', label: 'PO' };
  return null;
}

/**
 * Renderiza la forma reciente (WWDLW) como círculos de color
 */
function FormIndicator({ form }) {
  if (!form) return null;
  const chars = form.split('').slice(-5); // Últimos 5 partidos
  return (
    <div className={styles.formRow}>
      {chars.map((c, i) => {
        let bg = 'var(--text-muted)';
        let letter = c;
        if (c === 'W') bg = '#00f260';
        else if (c === 'D') bg = '#f59e0b';
        else if (c === 'L') bg = '#ef4444';
        return (
          <span key={i} className={styles.formDot} style={{ background: bg }} title={c === 'W' ? 'Victoria' : c === 'D' ? 'Empate' : 'Derrota'}>
            {letter}
          </span>
        );
      })}
    </div>
  );
}

export default function StandingsTable({ standings, compact = false }) {
  const rows = compact ? standings.slice(0, 5) : standings;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrap}>
        <table className={styles.table} id="standings-table">
          <thead>
            <tr>
              <th className={styles.thPos}>#</th>
              <th className={styles.thTeam}>Equipo</th>
              {!compact && <th className={styles.thStat}>PJ</th>}
              <th className={styles.thStat}>G</th>
              <th className={styles.thStat}>E</th>
              <th className={styles.thStat}>P</th>
              {!compact && <th className={styles.thStat}>GF</th>}
              {!compact && <th className={styles.thStat}>GC</th>}
              {!compact && <th className={styles.thStat}>DG</th>}
              <th className={styles.thPts}>PTS</th>
              {!compact && <th className={styles.thForm}>Forma</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const pos = parseInt(row.intRank || i + 1);
              const isTop = pos <= 4;
              const isBottom = !compact && pos >= standings.length - 2;
              const zone = getZoneInfo(row.strDescription);

              return (
                <tr
                  key={row.idTeam || i}
                  className={`${styles.row} ${isTop ? styles.rowTop : ''} ${
                    isBottom ? styles.rowBottom : ''
                  } animate-in`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className={styles.pos}>
                    <span
                      className={`${styles.posNum} ${
                        isTop ? styles.posTop : ''
                      } ${isBottom ? styles.posBottom : ''}`}
                      style={zone ? { borderLeft: `3px solid ${zone.color}`, paddingLeft: '6px' } : undefined}
                    >
                      {pos}
                    </span>
                  </td>
                  <td className={styles.teamCell}>
                    <Link
                      href={`/equipo/${row.idTeam}`}
                      className={styles.teamLink}
                    >
                      {row.strTeamBadge && (
                        <Image
                          src={row.strTeamBadge}
                          alt={row.strTeam}
                          width={24}
                          height={24}
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                      <span className={styles.teamName}>{row.strTeam}</span>
                    </Link>
                  </td>
                  {!compact && <td className={styles.stat}>{row.intPlayed}</td>}
                  <td className={styles.stat}>{row.intWin}</td>
                  <td className={styles.stat}>{row.intDraw}</td>
                  <td className={styles.stat}>{row.intLoss}</td>
                  {!compact && (
                    <td className={styles.stat}>{row.intGoalsFor}</td>
                  )}
                  {!compact && (
                    <td className={styles.stat}>{row.intGoalsAgainst}</td>
                  )}
                  {!compact && (
                    <td className={styles.stat}>
                      {row.intGoalDifference}
                    </td>
                  )}
                  <td className={styles.pts}>{row.intPoints}</td>
                  {!compact && (
                    <td className={styles.stat}>
                      <FormIndicator form={row.strForm} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
