/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoricalPrice } from '../types';
import { ETFS_LIST, generateHistory } from '../data/etfData';
import { SUPABASE_URL, supabaseHeaders } from './supabaseConfig';

import { REAL_CDI_DAILY_HISTORY } from '../data/cdiData';

export type TimeFrame = '1M' | '6M' | '1Y' | '5Y' | 'MAX';

// Timeframe mapping to Yahoo Finance range & interval parameters
// ALWAYS use interval='1d' (daily close) to guarantee identical price per specific date
function getTimeframeParams(timeframe: TimeFrame): { range: string; interval: string } {
  switch (timeframe) {
    case '1M':
      return { range: '1m', interval: '1d' };
    case '6M':
      return { range: '6m', interval: '1d' };
    case '1Y':
      return { range: '1y', interval: '1d' };
    case '5Y':
      return { range: '5y', interval: '1d' };
    case 'MAX':
      return { range: 'max', interval: '1d' };
    default:
      return { range: '1y', interval: '1d' };
  }
}

// Compute the start date for Supabase query based on timeframe
function getStartDate(timeframe: TimeFrame): string {
  const now = new Date();
  switch (timeframe) {
    case '1M':
      now.setMonth(now.getMonth() - 1);
      break;
    case '6M':
      now.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      now.setFullYear(now.getFullYear() - 1);
      break;
    case '5Y':
      now.setFullYear(now.getFullYear() - 5);
      break;
    case 'MAX':
      return '2000-01-01'; // Earliest possible
  }
  return now.toISOString().split('T')[0];
}

// Map ticker symbol to Yahoo Finance convention
export function getYahooSymbol(ticker: string): string {
  const clean = ticker.trim().toUpperCase();
  if (clean.endsWith('.SA') || clean.startsWith('^')) return clean;
  
  // US Tickers & Indexes stay native
  const usTickers = ['VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'SPY', '^BVSP', '^GSPC'];
  if (usTickers.includes(clean)) {
    return clean;
  }
  
  // B3 tickers require .SA extension
  return `${clean}.SA`;
}

/**
 * Fetch real historical daily closing prices.
 * Priority order:
 *   #1 — Official BCB Series for CDI
 *   #2 — Supabase REST API
 *   #3 — Yahoo Finance via Vite dev proxy
 */
export async function fetchRealHistory(ticker: string, timeframe: TimeFrame): Promise<HistoricalPrice[]> {
  const cleanTicker = ticker.trim().toUpperCase();

  // SPECIAL CASE: Official Banco Central do Brasil (BCB) Daily CDI Index
  if (cleanTicker === 'CDI') {
    const startDate = getStartDate(timeframe);
    const filteredCDI = REAL_CDI_DAILY_HISTORY.filter(h => h.date >= startDate);
    console.log(`[BCB Official] ✅ CDI — ${filteredCDI.length} daily points for ${timeframe}`);
    return filteredCDI;
  }
  const cacheKey = `etf500_hist_${cleanTicker}_${timeframe}`;

  // 1. Check SessionStorage cache first
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage quota errors
  }

  // 2. PRIMARY: Supabase REST API (authenticated, no CORS issues)
  try {
    const startDate = getStartDate(timeframe);
    const supabaseUrl = `${SUPABASE_URL}/rest/v1/etf_historical_prices?etf_ticker=eq.${cleanTicker}&date=gte.${startDate}&order=date.asc&select=date,close_price,volume`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const sbResponse = await fetch(supabaseUrl, {
      headers: supabaseHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (sbResponse.ok) {
      const sbData = await sbResponse.json();
      if (Array.isArray(sbData) && sbData.length >= 2) {
        const sbHistory: HistoricalPrice[] = sbData.map((item: any) => ({
          date: item.date,
          close_price: parseFloat(item.close_price) || 0,
          volume: item.volume || 0
        }));
        
        console.log(`[Supabase] ✅ ${cleanTicker} — ${sbHistory.length} data points for ${timeframe}`);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(sbHistory));
        } catch (e) {}

        return sbHistory;
      }
    }
  } catch (e) {
    console.warn(`[Supabase] Failed for ${cleanTicker}:`, e);
  }

  // 3. FALLBACK: Yahoo Finance via Vite dev proxy (only works in dev mode)
  const symbol = getYahooSymbol(cleanTicker);
  const { range, interval } = getTimeframeParams(timeframe);

  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
  const urlsToTry = [
    `/api/yahoo/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`, // Local Vite dev proxy (CORS-free)
    targetUrl                                                                     // Direct (may fail due to CORS in production)
  ];

  for (const fetchUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const result = json?.chart?.result?.[0];

        if (result && result.timestamp && result.indicators?.quote?.[0]?.close) {
          const timestamps: number[] = result.timestamp;
          const closes: (number | null)[] = result.indicators.quote[0].close;
          const volumes: (number | null)[] = result.indicators.quote[0].volume || [];

          const history: HistoricalPrice[] = [];

          for (let i = 0; i < timestamps.length; i++) {
            const closeVal = closes[i];
            if (closeVal !== null && closeVal !== undefined && !isNaN(closeVal)) {
              const dateStr = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
              history.push({
                date: dateStr,
                close_price: Math.round(closeVal * 100) / 100,
                volume: volumes[i] || 0
              });
            }
          }

          if (history.length > 0) {
            console.log(`[Yahoo] ✅ ${cleanTicker} — ${history.length} data points for ${timeframe}`);
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(history));
            } catch (e) {}
            return history;
          }
        }
      }
    } catch (e) {
      // Timeout or network error - continue trying next URL
    }
  }

  // 4. NO DATA FOUND: Return empty array (no synthetic mockups)
  console.warn(`[No Data] ⚠️ ${cleanTicker} — sem dados reais disponíveis para ${timeframe}`);
  return [];
}
