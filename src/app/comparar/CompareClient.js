'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

/**
 * Componente cliente para la herramienta de comparación.
 * Recibe la lista completa de goleadores de todas las ligas.
 */
export default function CompareClient({ allScorers }) {
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');

  const filteredA = searchA.length >= 2
    ? allScorers.filter((p) => p.strPlayer.toLowerCase().includes(searchA.toLowerCase())).slice(0, 8)
    : [];
  const filteredB = searchB.length >= 2
    ? allScorers.filter((p) => p.strPlayer.toLowerCase().includes(searchB.toLowerCase())).slice(0, 8)
    : [];

  const statBars = playerA && playerB ? [
    { label: 'Goles', key: 'intGoals', icon: '⚽' },
    { label: 'Asistencias', key: 'intAssists', icon: '🅰️' },
    { label: 'Apariciones', key: 'intAppearances', icon: '🏟️' },
    { label: 'Minutos', key: 'intMinutes', icon: '⏱️' },
    { label: 'Tarjetas Amarillas', key: 'intYellowCards', icon: '🟡' },
    { label: 'Tarjetas Rojas', key: 'intRedCards', icon: '🔴' },
  ] : [];

  function getBarWidth(a, b) {
    const max = Math.max(a, b, 1);
    return { aWidth: (a / max) * 100, bWidth: (b / max) * 100 };
  }

  return (
    <div className={styles.compareLayout}>
      {/* Panel de selección */}
      <div className={styles.selectRow}>
        {/* Jugador A */}
        <div className={styles.selectPanel}>
          <label className={styles.selectLabel}>Jugador 1</label>
          <div className={styles.searchWrap}>
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={searchA}
              onChange={(e) => { setSearchA(e.target.value); if (e.target.value.length < 2) setPlayerA(null); }}
              className={styles.searchInput}
            />
            {filteredA.length > 0 && !playerA && (
              <ul className={styles.dropdown}>
                {filteredA.map((p) => (
                  <li key={p.idPlayer + '-a'}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => { setPlayerA(p); setSearchA(p.strPlayer); }}
                    >
                      {p.strPhoto && (
                        <Image src={p.strPhoto} alt={p.strPlayer} width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <span className={styles.dropdownName}>{p.strPlayer}</span>
                      <span className={styles.dropdownTeam}>{p.strTeam}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {playerA && (
            <div className={styles.selectedCard}>
              {playerA.strPhoto && (
                <Image src={playerA.strPhoto} alt={playerA.strPlayer} width={64} height={64} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <h3 className={styles.selectedName}>{playerA.strPlayer}</h3>
                <p className={styles.selectedTeam}>{playerA.strTeam} · {playerA.strPosition}</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.vsCenter}>
          <span className={styles.vsBadge}>VS</span>
        </div>

        {/* Jugador B */}
        <div className={styles.selectPanel}>
          <label className={styles.selectLabel}>Jugador 2</label>
          <div className={styles.searchWrap}>
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={searchB}
              onChange={(e) => { setSearchB(e.target.value); if (e.target.value.length < 2) setPlayerB(null); }}
              className={styles.searchInput}
            />
            {filteredB.length > 0 && !playerB && (
              <ul className={styles.dropdown}>
                {filteredB.map((p) => (
                  <li key={p.idPlayer + '-b'}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => { setPlayerB(p); setSearchB(p.strPlayer); }}
                    >
                      {p.strPhoto && (
                        <Image src={p.strPhoto} alt={p.strPlayer} width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <span className={styles.dropdownName}>{p.strPlayer}</span>
                      <span className={styles.dropdownTeam}>{p.strTeam}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {playerB && (
            <div className={styles.selectedCard}>
              {playerB.strPhoto && (
                <Image src={playerB.strPhoto} alt={playerB.strPlayer} width={64} height={64} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div>
                <h3 className={styles.selectedName}>{playerB.strPlayer}</h3>
                <p className={styles.selectedTeam}>{playerB.strTeam} · {playerB.strPosition}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barras de comparación */}
      {playerA && playerB && (
        <div className={styles.barsSection}>
          <h2 className={styles.barsTitle}>Comparación Estadística</h2>
          <div className={styles.barsGrid}>
            {statBars.map((stat) => {
              const valA = playerA[stat.key] || 0;
              const valB = playerB[stat.key] || 0;
              const { aWidth, bWidth } = getBarWidth(valA, valB);
              const winner = valA > valB ? 'a' : valB > valA ? 'b' : 'tie';
              return (
                <div key={stat.key} className={styles.barRow}>
                  <span className={`${styles.barVal} ${winner === 'a' ? styles.barWinner : ''}`}>
                    {valA}
                  </span>
                  <div className={styles.barCenter}>
                    <div className={styles.barTrackLeft}>
                      <div
                        className={`${styles.barFill} ${styles.barFillA}`}
                        style={{ width: `${aWidth}%` }}
                      />
                    </div>
                    <span className={styles.barLabel}>{stat.icon} {stat.label}</span>
                    <div className={styles.barTrackRight}>
                      <div
                        className={`${styles.barFill} ${styles.barFillB}`}
                        style={{ width: `${bWidth}%` }}
                      />
                    </div>
                  </div>
                  <span className={`${styles.barVal} ${winner === 'b' ? styles.barWinner : ''}`}>
                    {valB}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Rating */}
          {(playerA.strRating || playerB.strRating) && (
            <div className={styles.ratingRow}>
              <div className={styles.ratingCard}>
                <span className={styles.ratingNum}>{parseFloat(playerA.strRating || 0).toFixed(1)}</span>
                <span className={styles.ratingLabel}>Rating</span>
              </div>
              <div className={styles.ratingCard}>
                <span className={styles.ratingNum}>{parseFloat(playerB.strRating || 0).toFixed(1)}</span>
                <span className={styles.ratingLabel}>Rating</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {(!playerA || !playerB) && (
        <div className={styles.emptyState}>
          <p>Selecciona dos jugadores de los goleadores y asistentes de todas las ligas para comparar sus estadísticas.</p>
        </div>
      )}
    </div>
  );
}
