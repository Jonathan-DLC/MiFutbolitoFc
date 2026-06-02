'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Leaderboard from './Leaderboard';
import { getGameMode, getModeLeaderboardId } from '@/lib/data/gameModes';
import { HIDDEN_CAREERS } from '@/lib/data/hiddenCareers';
import styles from './HiddenCareerGame.module.css';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRankLabel(pct) {
  if (pct >= 90) return '👑 Scout Experto';
  if (pct >= 70) return '🥇 Agente de Jugadores';
  if (pct >= 50) return '🥈 Analista';
  return '🥉 Aficionado';
}

export default function HiddenCareerGame({ mode = 'champions' }) {
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Teams revealing logic
  const [visibleTeamsCount, setVisibleTeamsCount] = useState(1);
  const revealTimerRef = useRef(null);

  const modeConfig = getGameMode(mode);
  const gameId = getModeLeaderboardId('hiddenCareer', mode);

  const startGame = useCallback(() => {
    // Tomamos 10 jugadores aleatorios
    const shuffled = shuffle(HIDDEN_CAREERS).slice(0, 10);
    // Para cada jugador, mezclamos las opciones
    const withShuffledOptions = shuffled.map(q => ({
      ...q,
      options: shuffle(q.options)
    }));
    
    setQuestions(withShuffledOptions);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setStreak(0);
    setBestStreak(0);
    setVisibleTeamsCount(1);
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && !showAnswer) {
      const q = questions[currentQ];
      if (q && visibleTeamsCount < q.teams.length) {
        revealTimerRef.current = setTimeout(() => {
          setVisibleTeamsCount(c => c + 1);
        }, 2000); // Revela un equipo nuevo cada 2 segundos
      }
    }
    return () => clearTimeout(revealTimerRef.current);
  }, [gameState, currentQ, visibleTeamsCount, showAnswer, questions]);

  const handleAnswer = (optName) => {
    if (showAnswer) return;
    clearTimeout(revealTimerRef.current);
    
    setSelected(optName);
    setShowAnswer(true);
    
    const q = questions[currentQ];
    // Se muestran todos los equipos
    setVisibleTeamsCount(q.teams.length);

    const correct = optName === q.answer;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setGameState('finished');
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowAnswer(false);
      setVisibleTeamsCount(1);
    }
  };

  if (gameState === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <div className={styles.trophy}>🕵️</div>
          <h2 className={styles.title}>{modeConfig.games.hiddenCareer.title}</h2>
          <p className={styles.subtitle}>{modeConfig.games.hiddenCareer.description}</p>
          <button className={styles.startBtn} onClick={startGame}>
            ¡Empezar a Adivinar!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const pct = Math.round((score / questions.length) * 100);
    const rank = getRankLabel(pct);

    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.resultEmoji}>{pct >= 70 ? '🎉' : '💪'}</div>
          <h2 className={styles.title}>¡Juego Terminado!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreBig}>{score}</span>
            <span className={styles.scoreOf}>/ {questions.length}</span>
          </div>
          <div className={styles.rank}>{rank}</div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{pct}%</span>
              <span className={styles.statLabel}>Aciertos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>🔥 {bestStreak}</span>
              <span className={styles.statLabel}>Mejor Racha</span>
            </div>
          </div>
          <button className={styles.startBtn} onClick={startGame}>
            Jugar de Nuevo
          </button>

          <Leaderboard
            gameId={gameId}
            currentScore={score}
            currentStats={{
              rounds: questions.length,
              correct: score,
              wrong: Math.max(0, questions.length - score),
              bestStreak,
            }}
          />
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const visibleTeams = q.teams.slice(0, visibleTeamsCount);

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className={styles.headerInfo}>
          <span className={styles.qCount}>
            Jugador {currentQ + 1} de {questions.length}
          </span>
          <span className={styles.scoreSmall}>
            ⭐ {score} {streak > 1 && <span className={styles.streakBadge}>🔥 x{streak}</span>}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.teamsList}>
          {visibleTeams.map((team, idx) => (
            <div key={idx} className={styles.teamItem}>
              <span className={styles.teamArrow}>{idx > 0 ? '⬇️' : '⚽'}</span>
              <span className={styles.teamName}>{team}</span>
            </div>
          ))}
          {!showAnswer && visibleTeamsCount < q.teams.length && (
            <div className={styles.teamItem} style={{ opacity: 0.5, borderStyle: 'dashed' }}>
              <span className={styles.teamArrow}>...</span>
              <span className={styles.teamName}>Siguiente equipo cargando...</span>
            </div>
          )}
        </div>

        <div className={styles.options}>
          {q.options.map((opt, idx) => {
            let cls = styles.option;
            if (showAnswer) {
              if (opt === q.answer) cls += ` ${styles.correct}`;
              else if (opt === selected && opt !== q.answer) cls += ` ${styles.wrong}`;
              else cls += ` ${styles.dimmed}`;
            }
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(opt)} disabled={showAnswer}>
                <span className={styles.optText}>{opt}</span>
              </button>
            );
          })}
        </div>

        {showAnswer && (
          <div className={styles.feedback}>
            <p className={selected === q.answer ? styles.feedbackCorrect : styles.feedbackWrong}>
              {selected === q.answer ? '✅ ¡Correcto!' : `❌ Era ${q.answer}`}
            </p>
            <button className={styles.nextBtn} onClick={nextQuestion}>
              {currentQ + 1 >= questions.length ? 'Ver Resultados' : 'Siguiente →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
