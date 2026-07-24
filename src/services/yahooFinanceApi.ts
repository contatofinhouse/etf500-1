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
      return { range: '1mo', interval: '1d' };
    case '6M':
      return { range: '6mo', interval: '1d' };
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

// Helper to slice historical dataset by timeframe relative to the max date available in history
function sliceHistoryByTimeframe(history: HistoricalPrice[], timeframe: TimeFrame): HistoricalPrice[] {
  if (history.length < 2) return history;
  if (timeframe === 'MAX') return history;

  const maxDateStr = history[history.length - 1].date;
  const maxDate = new Date(maxDateStr);

  const cutoff = new Date(maxDate);
  switch (timeframe) {
    case '1M':
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case '6M':
      cutoff.setMonth(cutoff.getMonth() - 6);
      break;
    case '1Y':
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
    case '5Y':
      cutoff.setFullYear(cutoff.getFullYear() - 5);
      break;
  }

  const cutoffStr = cutoff.toISOString().split('T')[0];
  const sliced = history.filter(h => h.date >= cutoffStr);
  return sliced.length >= 2 ? sliced : history;
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
 *   #2 — Supabase REST API (Primary fast data source)
 *   #3 — Yahoo Finance API via CORS Proxy (Secondary fallback if Supabase table is empty)
 */
export async function fetchRealHistory(ticker: string, timeframe: TimeFrame): Promise<HistoricalPrice[]> {
  const cleanTicker = ticker.trim().toUpperCase();

  // SPECIAL CASE: Official Banco Central do Brasil (BCB) Daily CDI Index
  if (cleanTicker === 'CDI') {
    const sliced = sliceHistoryByTimeframe(REAL_CDI_DAILY_HISTORY, timeframe);
    console.log(`[BCB Official] ✅ CDI — ${sliced.length} daily points for ${timeframe}`);
    return sliced;
  }
  const cacheKey = `etf500_hist_v4_${cleanTicker}_${timeframe}`;

  // 1. Check SessionStorage cache first
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage quota errors
  }

  // 2. PRIMARY: Supabase REST API
  try {
    const supabaseUrl = `${SUPABASE_URL}/rest/v1/etf_historical_prices?etf_ticker=eq.${cleanTicker}&order=date.asc&select=date,close_price,volume`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const sbResponse = await fetch(supabaseUrl, {
      headers: supabaseHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (sbResponse.ok) {
      const sbData = await sbResponse.json();
      if (Array.isArray(sbData) && sbData.length >= 2) {
        const fullHistory: HistoricalPrice[] = sbData.map((item: any) => ({
          date: item.date,
          close_price: parseFloat(item.close_price) || 0,
          volume: item.volume || 0
        }));
        
        const sbHistory = sliceHistoryByTimeframe(fullHistory, timeframe);

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

  // 3. SECONDARY FALLBACK: Yahoo Finance via Vite dev proxy or CORS proxies
  console.log(`[Yahoo Fallback] ⚡ Fetching real market prices for ${cleanTicker} (${timeframe})...`);
  const symbol = getYahooSymbol(cleanTicker);
  const { range, interval } = getTimeframeParams(timeframe);

  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
  const urlsToTry = [
    `/api/yahoo/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`, // Local Vite dev proxy
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,                       // Public CORS proxy 1
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,           // Public CORS proxy 2
    targetUrl                                                                       // Direct
  ];

  for (const fetchUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const result = json?.chart?.result?.[0];

        if (result && result.timestamp && result.indicators?.quote?.[0]?.close) {
          const timestamps: number[] = result.timestamp;
          const closes: (number | null)[] = result.indicators.quote[0].close;
          const volumes: (number | null)[] = result.indicators.quote[0].volume || [];

          const rawHistory: HistoricalPrice[] = [];

          for (let i = 0; i < timestamps.length; i++) {
            const closeVal = closes[i];
            if (closeVal !== null && closeVal !== undefined && !isNaN(closeVal)) {
              const dateStr = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
              rawHistory.push({
                date: dateStr,
                close_price: Math.round(closeVal * 100) / 100,
                volume: volumes[i] || 0
              });
            }
          }

          if (rawHistory.length >= 2) {
            console.log(`[Yahoo CORS] ✅ ${cleanTicker} — ${rawHistory.length} data points for ${timeframe}`);
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(rawHistory));
            } catch (e) {}
            return rawHistory;
          }
        }
      }
    } catch (e) {
      // Timeout or network error - try next URL
    }
  }

  console.warn(`[No Data] ⚠️ ${cleanTicker} — sem dados para ${timeframe}`);
  return [];
}
