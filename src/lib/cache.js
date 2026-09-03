import { sql } from '@/lib/db';

// ─── TTLs en segundos ───────────────────────────────────────────────
// Ajustados para optimizar el free tier de API-Football (100 req/día)
export const STANDINGS_TTL = 3600;       // 1 hora — las tablas cambian poco
export const FIXTURES_TTL = 300;         // 5 min — para partidos actuales
export const TEAM_DETAILS_TTL = 86400;   // 24 horas — datos estáticos
export const TOP_SCORERS_TTL = 21600;    // 6 horas — stats se actualizan pocas veces al día
export const PLAYERS_TTL = 21600;        // 6 horas
export const MEDIA_TTL = 604800;         // 7 días — logos y fotos no cambian

// ─── Inicialización de tabla ─────────────────────────────────────────
let cacheTableReady = false;

async function ensureCacheTable() {
  if (!sql || cacheTableReady) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS api_cache (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        data JSONB NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    cacheTableReady = true;
  } catch (error) {
    console.error('[Cache] Error creando tabla api_cache:', error);
  }
}

// ─── Obtener dato del caché ──────────────────────────────────────────
export async function getCached(key) {
  if (!sql) return null;
  try {
    await ensureCacheTable();
    const rows = await sql`
      SELECT data FROM api_cache
      WHERE cache_key = ${key} AND expires_at > NOW()
      LIMIT 1;
    `;
    return rows.length > 0 ? rows[0].data : null;
  } catch (error) {
    console.error('[Cache] Error leyendo caché para', key, ':', error);
    return null;
  }
}

// ─── Guardar dato en caché ───────────────────────────────────────────
export async function setCache(key, data, ttlSeconds) {
  if (!sql) return;
  try {
    await ensureCacheTable();
    await sql`
      INSERT INTO api_cache (cache_key, data, expires_at)
      VALUES (${key}, ${JSON.stringify(data)}::jsonb, NOW() + INTERVAL '1 second' * ${ttlSeconds})
      ON CONFLICT (cache_key) DO UPDATE
        SET data = ${JSON.stringify(data)}::jsonb,
            expires_at = NOW() + INTERVAL '1 second' * ${ttlSeconds},
            created_at = NOW();
    `;
  } catch (error) {
    console.error('[Cache] Error guardando caché para', key, ':', error);
  }
}

// ─── Wrapper de alto nivel: caché → fetch → guardar ──────────────────
/**
 * Intenta leer del caché; si no hay dato vigente, ejecuta fetchFn,
 * guarda el resultado y lo retorna.
 * @param {string} key - Clave única para este dato
 * @param {number} ttlSeconds - Tiempo de vida en segundos
 * @param {() => Promise<any>} fetchFn - Función asíncrona que obtiene el dato fresco
 * @returns {Promise<any>}
 */
export async function withCache(key, ttlSeconds, fetchFn) {
  // Intentar leer del caché
  const cached = await getCached(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss — obtener dato fresco
  try {
    const freshData = await fetchFn();
    // Guardar en caché sin bloquear el retorno
    setCache(key, freshData, ttlSeconds).catch(() => {});
    return freshData;
  } catch (error) {
    console.error('[Cache] Error en fetchFn para', key, ':', error);
    throw error;
  }
}
