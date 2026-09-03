/**
 * Cliente de API-Football v3 (api-sports.io)
 * 
 * Free tier: 100 requests/día, 10 requests/minuto
 * Temporadas disponibles (free): 2022-2024
 * 
 * Las respuestas se mapean a los nombres de campo de TheSportsDB
 * para compatibilidad directa con los componentes existentes.
 */

const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';

// ─── Mapa de ligas: slug → { apiId, season } ─────────────────────────
// Season es 2024 porque es la última disponible en el plan gratuito
export const LEAGUE_MAP = {
  'betplay':          { apiId: 239, season: 2024, country: 'Colombia',   flag: '🇨🇴' },
  'premier':          { apiId: 39,  season: 2024, country: 'England',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'champions-league': { apiId: 2,   season: 2024, country: 'Europe',     flag: '🇪🇺' },
  'la-liga':          { apiId: 140, season: 2024, country: 'Spain',      flag: '🇪🇸' },
  'serie-a':          { apiId: 135, season: 2024, country: 'Italy',      flag: '🇮🇹' },
  'bundesliga':       { apiId: 78,  season: 2024, country: 'Germany',    flag: '🇩🇪' },
  'ligue-1':          { apiId: 61,  season: 2024, country: 'France',     flag: '🇫🇷' },
};

// ─── Fetch base con autenticación ─────────────────────────────────────
async function fetchAPIFootball(endpoint) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error('[API-Football] API_FOOTBALL_KEY no configurada en .env.local');
  }

  const url = `${API_FOOTBALL_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'x-apisports-key': apiKey },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`[API-Football] Error ${res.status} en ${endpoint}`);
  }

  const json = await res.json();

  // La API retorna errores como objeto con mensajes dentro de `errors`
  if (json.errors && Object.keys(json.errors).length > 0) {
    const errorMsg = Object.values(json.errors).join(', ');
    throw new Error(`[API-Football] ${errorMsg}`);
  }

  return json.response || [];
}

// ─── Standings (Tabla de Posiciones COMPLETA) ─────────────────────────
/**
 * Obtiene la tabla de posiciones completa de una liga.
 * Retorna datos mapeados al formato de TheSportsDB para compatibilidad.
 */
export async function getStandingsFromAPIFootball(leagueSlug) {
  const leagueInfo = LEAGUE_MAP[leagueSlug];
  if (!leagueInfo) return [];

  const response = await fetchAPIFootball(
    `/standings?league=${leagueInfo.apiId}&season=${leagueInfo.season}`
  );

  if (!response[0]?.league?.standings) return [];

  // La API puede retornar múltiples grupos (ej. Champions tiene grupos)
  // Unimos todos los standings en un solo array
  const allStandings = response[0].league.standings.flat();

  return allStandings.map((row) => ({
    // Campos mapeados al formato TheSportsDB
    idTeam: String(row.team?.id || ''),
    strTeam: row.team?.name || '',
    strTeamBadge: row.team?.logo || '',
    intRank: row.rank,
    intPlayed: row.all?.played || 0,
    intWin: row.all?.win || 0,
    intDraw: row.all?.draw || 0,
    intLoss: row.all?.lose || 0,
    intGoalsFor: row.all?.goals?.for || 0,
    intGoalsAgainst: row.all?.goals?.against || 0,
    intGoalDifference: row.goalsDiff || 0,
    intPoints: row.points || 0,
    // Campos nuevos exclusivos de API-Football
    strForm: row.form || '',
    strDescription: row.description || '',
    strGroup: row.group || '',
    // Stats casa/fuera para vista detallada
    homeStats: row.home || null,
    awayStats: row.away || null,
  }));
}

// ─── Top Goleadores ──────────────────────────────────────────────────
export async function getTopScorersFromAPIFootball(leagueSlug) {
  const leagueInfo = LEAGUE_MAP[leagueSlug];
  if (!leagueInfo) return [];

  const response = await fetchAPIFootball(
    `/players/topscorers?league=${leagueInfo.apiId}&season=${leagueInfo.season}`
  );

  return response.map((entry) => {
    const player = entry.player || {};
    const stats = entry.statistics?.[0] || {};
    return {
      idPlayer: String(player.id || ''),
      strPlayer: player.name || '',
      strPhoto: player.photo || '',
      strNationality: player.nationality || '',
      strTeam: stats.team?.name || '',
      strTeamLogo: stats.team?.logo || '',
      intGoals: stats.goals?.total || 0,
      intAssists: stats.goals?.assists || 0,
      intAppearances: stats.games?.appearences || 0,
      strRating: stats.games?.rating || '',
      intYellowCards: stats.cards?.yellow || 0,
      intRedCards: stats.cards?.red || 0,
      strPosition: stats.games?.position || '',
      intPenaltyGoals: stats.penalty?.scored || 0,
      intMinutes: stats.games?.minutes || 0,
    };
  });
}

// ─── Top Asistentes ──────────────────────────────────────────────────
export async function getTopAssistsFromAPIFootball(leagueSlug) {
  const leagueInfo = LEAGUE_MAP[leagueSlug];
  if (!leagueInfo) return [];

  const response = await fetchAPIFootball(
    `/players/topassists?league=${leagueInfo.apiId}&season=${leagueInfo.season}`
  );

  return response.map((entry) => {
    const player = entry.player || {};
    const stats = entry.statistics?.[0] || {};
    return {
      idPlayer: String(player.id || ''),
      strPlayer: player.name || '',
      strPhoto: player.photo || '',
      strNationality: player.nationality || '',
      strTeam: stats.team?.name || '',
      strTeamLogo: stats.team?.logo || '',
      intGoals: stats.goals?.total || 0,
      intAssists: stats.goals?.assists || 0,
      intAppearances: stats.games?.appearences || 0,
      strRating: stats.games?.rating || '',
      strPosition: stats.games?.position || '',
    };
  });
}

// ─── Equipos de una liga ─────────────────────────────────────────────
export async function getTeamsFromAPIFootball(leagueSlug) {
  const leagueInfo = LEAGUE_MAP[leagueSlug];
  if (!leagueInfo) return [];

  const response = await fetchAPIFootball(
    `/teams?league=${leagueInfo.apiId}&season=${leagueInfo.season}`
  );

  return response.map((entry) => {
    const team = entry.team || {};
    const venue = entry.venue || {};
    return {
      idTeam: String(team.id || ''),
      strTeam: team.name || '',
      strBadge: team.logo || '',
      strStadium: venue.name || '',
      intStadiumCapacity: venue.capacity || 0,
      strCountry: team.country || '',
      intFormedYear: team.founded || '',
      strLocation: venue.city || '',
    };
  });
}

// ─── Fixtures (Partidos) ─────────────────────────────────────────────
/**
 * Obtiene partidos de una liga.
 * @param {string} leagueSlug - Slug de la liga
 * @param {object} options - { round: string, next: number, last: number, season: number }
 */
export async function getFixturesFromAPIFootball(leagueSlug, options = {}) {
  const leagueInfo = LEAGUE_MAP[leagueSlug];
  if (!leagueInfo) return [];

  const season = options.season || leagueInfo.season;
  let endpoint = `/fixtures?league=${leagueInfo.apiId}&season=${season}`;

  if (options.round) endpoint += `&round=${encodeURIComponent(options.round)}`;
  if (options.next) endpoint += `&next=${options.next}`;
  // Nota: 'last' NO está disponible en el free tier
  if (options.from) endpoint += `&from=${options.from}`;
  if (options.to) endpoint += `&to=${options.to}`;

  const response = await fetchAPIFootball(endpoint);

  return response.map((entry) => {
    const fixture = entry.fixture || {};
    const teams = entry.teams || {};
    const goals = entry.goals || {};
    const league = entry.league || {};
    const score = entry.score || {};

    // Determinar si el partido terminó
    const isFinished = fixture.status?.short === 'FT' || fixture.status?.short === 'AET' || fixture.status?.short === 'PEN';
    const isLive = ['1H', '2H', 'HT', 'ET', 'BT', 'P'].includes(fixture.status?.short);

    // Parsear fecha UTC
    const fixtureDate = fixture.date ? new Date(fixture.date) : null;
    const dateEvent = fixtureDate ? fixtureDate.toISOString().split('T')[0] : '';
    const strTime = fixtureDate
      ? `${String(fixtureDate.getUTCHours()).padStart(2, '0')}:${String(fixtureDate.getUTCMinutes()).padStart(2, '0')}:00`
      : '';

    return {
      // Campos mapeados al formato TheSportsDB
      idEvent: String(fixture.id || ''),
      strEvent: `${teams.home?.name || ''} vs ${teams.away?.name || ''}`,
      strHomeTeam: teams.home?.name || '',
      strAwayTeam: teams.away?.name || '',
      strHomeTeamBadge: teams.home?.logo || '',
      strAwayTeamBadge: teams.away?.logo || '',
      idHomeTeam: String(teams.home?.id || ''),
      idAwayTeam: String(teams.away?.id || ''),
      intHomeScore: isFinished || isLive ? goals.home : null,
      intAwayScore: isFinished || isLive ? goals.away : null,
      dateEvent,
      strTime,
      intRound: league.round || '',
      idLeague: String(league.id || ''),
      strLeague: league.name || '',
      // Campos nuevos exclusivos
      strStatus: fixture.status?.short || '',
      strStatusLong: fixture.status?.long || '',
      intElapsed: fixture.status?.elapsed || null,
      strReferee: fixture.referee || '',
      strVenue: fixture.venue?.name || '',
      strCity: fixture.venue?.city || '',
      isLive,
      isFinished,
      // Penales si aplica
      intHomePenalty: score.penalty?.home ?? null,
      intAwayPenalty: score.penalty?.away ?? null,
    };
  });
}

// ─── Utilidad: obtener info de liga por slug ──────────────────────────
export function getAPIFootballLeague(slug) {
  return LEAGUE_MAP[slug] || null;
}
