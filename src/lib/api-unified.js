/**
 * API Unificada — Capa de abstracción que combina:
 * - API-Football (standings completos, top goleadores, stats detallados)
 * - TheSportsDB (fixtures actuales 2025-2026, media, datos de minijuegos)
 * - Sistema de caché con Neon DB
 *
 * Las páginas y componentes importan desde aquí en vez de api.js directamente.
 */

import {
  getStandingsFromAPIFootball,
  getTopScorersFromAPIFootball,
  getTopAssistsFromAPIFootball,
  getTeamsFromAPIFootball,
  LEAGUE_MAP,
} from './api-football';

import {
  LEAGUES as THESPORTSDB_LEAGUES,
  getLeagueBySlug,
  getStandings as getStandingsTSDB,
  getLastLeagueEvents,
  getNextLeagueEvents,
  getTeamsByLeague,
  getTeamDetails,
  getTeamPlayers,
  getTeamLastEvents,
  getTeamNextEvents,
  getKnockoutEvents,
  getLeagueDetails,
  searchTeams,
  getPlayerDetails,
  translateText,
  // Re-exportamos funciones de minijuegos sin cambios
  getWorldCupTeams,
  getWorldCupPlayers,
} from './api';

import {
  withCache,
  STANDINGS_TTL,
  TOP_SCORERS_TTL,
  FIXTURES_TTL,
  TEAM_DETAILS_TTL,
  PLAYERS_TTL,
} from './cache';

// ─── Catálogo de ligas expandido ─────────────────────────────────────
// Combina la info de TheSportsDB (fixtures actuales) con API-Football (stats)
export const LEAGUES = {
  betplay: {
    ...THESPORTSDB_LEAGUES.betplay,
    apiFootballId: LEAGUE_MAP['betplay']?.apiId,
    apiFootballSeason: LEAGUE_MAP['betplay']?.season,
    country: 'Colombia',
    flag: '🇨🇴',
  },
  premier: {
    ...THESPORTSDB_LEAGUES.premier,
    apiFootballId: LEAGUE_MAP['premier']?.apiId,
    apiFootballSeason: LEAGUE_MAP['premier']?.season,
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },
  champions: {
    ...THESPORTSDB_LEAGUES.champions,
    slug: 'champions-league',
    apiFootballId: LEAGUE_MAP['champions-league']?.apiId,
    apiFootballSeason: LEAGUE_MAP['champions-league']?.season,
    country: 'Europe',
    flag: '🇪🇺',
  },
  'la-liga': {
    id: '4335',
    name: 'La Liga',
    slug: 'la-liga',
    apiName: 'Spanish La Liga',
    season: '2025-2026',
    totalRounds: 38,
    apiFootballId: LEAGUE_MAP['la-liga']?.apiId,
    apiFootballSeason: LEAGUE_MAP['la-liga']?.season,
    country: 'Spain',
    flag: '🇪🇸',
  },
  'serie-a': {
    id: '4332',
    name: 'Serie A',
    slug: 'serie-a',
    apiName: 'Italian Serie A',
    season: '2025-2026',
    totalRounds: 38,
    apiFootballId: LEAGUE_MAP['serie-a']?.apiId,
    apiFootballSeason: LEAGUE_MAP['serie-a']?.season,
    country: 'Italy',
    flag: '🇮🇹',
  },
  bundesliga: {
    id: '4331',
    name: 'Bundesliga',
    slug: 'bundesliga',
    apiName: 'German Bundesliga',
    season: '2025-2026',
    totalRounds: 34,
    apiFootballId: LEAGUE_MAP['bundesliga']?.apiId,
    apiFootballSeason: LEAGUE_MAP['bundesliga']?.season,
    country: 'Germany',
    flag: '🇩🇪',
  },
  'ligue-1': {
    id: '4334',
    name: 'Ligue 1',
    slug: 'ligue-1',
    apiName: 'French Ligue 1',
    season: '2025-2026',
    totalRounds: 34,
    apiFootballId: LEAGUE_MAP['ligue-1']?.apiId,
    apiFootballSeason: LEAGUE_MAP['ligue-1']?.season,
    country: 'France',
    flag: '🇫🇷',
  },
};

// ─── Utilidades de lookup ────────────────────────────────────────────
export function getUnifiedLeagueBySlug(slug) {
  return Object.values(LEAGUES).find((l) => l.slug === slug) || null;
}

export function getAllLeagues() {
  return Object.values(LEAGUES);
}

// ─── Standings (Tabla de Posiciones) ─────────────────────────────────
/**
 * Obtiene standings COMPLETOS usando API-Football (cacheados),
 * con fallback a TheSportsDB si falla.
 */
export async function getUnifiedStandings(slug) {
  const league = getUnifiedLeagueBySlug(slug);
  if (!league) return [];

  const cacheKey = `standings:${slug}`;

  return withCache(cacheKey, STANDINGS_TTL, async () => {
    // Intentar primero con API-Football (tabla completa)
    try {
      const apiFootballStandings = await getStandingsFromAPIFootball(slug);
      if (apiFootballStandings && apiFootballStandings.length > 0) {
        return apiFootballStandings;
      }
    } catch (error) {
      console.warn(`[Unified] API-Football standings falló para ${slug}:`, error.message);
    }

    // Fallback a TheSportsDB
    try {
      const tsdbLeague = getLeagueBySlug(slug);
      if (tsdbLeague) {
        return await getStandingsTSDB(tsdbLeague.id, tsdbLeague.season);
      }
    } catch (error) {
      console.warn(`[Unified] TheSportsDB standings falló para ${slug}:`, error.message);
    }

    return [];
  });
}

// ─── Top Goleadores ──────────────────────────────────────────────────
export async function getUnifiedTopScorers(slug) {
  const cacheKey = `topscorers:${slug}`;

  return withCache(cacheKey, TOP_SCORERS_TTL, async () => {
    try {
      return await getTopScorersFromAPIFootball(slug);
    } catch (error) {
      console.warn(`[Unified] Top scorers falló para ${slug}:`, error.message);
      return [];
    }
  });
}

// ─── Top Asistentes ──────────────────────────────────────────────────
export async function getUnifiedTopAssists(slug) {
  const cacheKey = `topassists:${slug}`;

  return withCache(cacheKey, TOP_SCORERS_TTL, async () => {
    try {
      return await getTopAssistsFromAPIFootball(slug);
    } catch (error) {
      console.warn(`[Unified] Top assists falló para ${slug}:`, error.message);
      return [];
    }
  });
}

// ─── Últimos Resultados ──────────────────────────────────────────────
// Usamos TheSportsDB porque tiene la temporada actual 2025-2026
export async function getUnifiedLastEvents(slug) {
  const cacheKey = `lastevents:${slug}`;

  return withCache(cacheKey, FIXTURES_TTL, async () => {
    try {
      const tsdbLeague = getLeagueBySlug(slug);
      if (tsdbLeague) {
        return await getLastLeagueEvents(tsdbLeague);
      }
    } catch (error) {
      console.warn(`[Unified] Last events falló para ${slug}:`, error.message);
    }
    return [];
  });
}

// ─── Próximos Partidos ───────────────────────────────────────────────
export async function getUnifiedNextEvents(slug) {
  const cacheKey = `nextevents:${slug}`;

  return withCache(cacheKey, FIXTURES_TTL, async () => {
    try {
      const tsdbLeague = getLeagueBySlug(slug);
      if (tsdbLeague) {
        return await getNextLeagueEvents(tsdbLeague);
      }
    } catch (error) {
      console.warn(`[Unified] Next events falló para ${slug}:`, error.message);
    }
    return [];
  });
}

// ─── Detalles de Equipo ──────────────────────────────────────────────
// TheSportsDB tiene media más rica (fanarts, colores, redes sociales)
export async function getUnifiedTeamDetails(teamId) {
  const cacheKey = `team:${teamId}`;

  return withCache(cacheKey, TEAM_DETAILS_TTL, async () => {
    try {
      return await getTeamDetails(teamId);
    } catch (error) {
      console.warn(`[Unified] Team details falló para ${teamId}:`, error.message);
      return null;
    }
  });
}

// ─── Jugadores de un Equipo ──────────────────────────────────────────
export async function getUnifiedTeamPlayers(teamId) {
  const cacheKey = `players:${teamId}`;

  return withCache(cacheKey, PLAYERS_TTL, async () => {
    try {
      return await getTeamPlayers(teamId);
    } catch (error) {
      console.warn(`[Unified] Team players falló para ${teamId}:`, error.message);
      return [];
    }
  });
}

// ─── Últimos Partidos de Equipo ──────────────────────────────────────
export async function getUnifiedTeamLastEvents(teamId, leagueId) {
  return getTeamLastEvents(teamId, leagueId);
}

// ─── Próximos Partidos de Equipo ─────────────────────────────────────
export async function getUnifiedTeamNextEvents(teamId) {
  return getTeamNextEvents(teamId);
}

// ─── Equipos de una Liga ─────────────────────────────────────────────
export async function getUnifiedTeamsByLeague(slug) {
  const cacheKey = `teams:${slug}`;

  return withCache(cacheKey, TEAM_DETAILS_TTL, async () => {
    // Para ligas nuevas sin datos en TheSportsDB, usar API-Football
    const tsdbLeague = getLeagueBySlug(slug);
    if (tsdbLeague) {
      try {
        const teams = await getTeamsByLeague(tsdbLeague.apiName);
        if (teams && teams.length > 0) return teams;
      } catch {}
    }

    // Fallback a API-Football
    try {
      return await getTeamsFromAPIFootball(slug);
    } catch {
      return [];
    }
  });
}

// ─── Fase Eliminatoria (Champions) ───────────────────────────────────
export async function getUnifiedKnockoutEvents(leagueId, season) {
  return getKnockoutEvents(leagueId, season);
}

// ─── Búsqueda ────────────────────────────────────────────────────────
export { searchTeams } from './api';

// ─── Detalles de Jugador ─────────────────────────────────────────────
export { getPlayerDetails, translateText } from './api';

// ─── Detalles de Liga ────────────────────────────────────────────────
export { getLeagueDetails } from './api';

// ─── Re-export funciones de minijuegos (sin cambios) ─────────────────
export { getWorldCupTeams, getWorldCupPlayers } from './api';

// ─── Re-export funciones legacy para compatibilidad ──────────────────
export { getLeagueBySlug } from './api';
