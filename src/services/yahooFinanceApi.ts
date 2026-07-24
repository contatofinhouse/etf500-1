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
 * Fetch historical daily closing prices strictly from Supabase.
 * Per architectural directive:
 *   #1 — Official BCB Series for CDI
 *   #2 — Supabase REST API (SOLE DATA SOURCE FOR FRONTEND)
 *   If Supabase has no data for a ticker, returns [] (no client-side fallback/proxy calls).
 */
export async function fetchRealHistory(ticker: string, timeframe: TimeFrame): Promise<HistoricalPrice[]> {
  const cleanTicker = ticker.trim().toUpperCase();

  // SPECIAL CASE: Official Banco Central do Brasil (BCB) Daily CDI Index
  if (cleanTicker === 'CDI') {
    const sliced = sliceHistoryByTimeframe(REAL_CDI_DAILY_HISTORY, timeframe);
    console.log(`[BCB Official] ✅ CDI — ${sliced.length} daily points for ${timeframe}`);
    return sliced;
  }
  const cacheKey = `etf500_hist_v5_${cleanTicker}_${timeframe}`;

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

  // 2. SOLE DATA SOURCE: Supabase REST API
  try {
    const supabaseUrl = `${SUPABASE_URL}/rest/v1/etf_historical_prices?etf_ticker=eq.${cleanTicker}&order=date.desc&limit=1500&select=date,close_price,volume`;
    
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
        const fullHistory: HistoricalPrice[] = sbData
          .map((item: any) => ({
            date: item.date,
            close_price: parseFloat(item.close_price) || 0,
            volume: item.volume || 0
          }))
          .sort((a, b) => a.date.localeCompare(b.date));
        
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

  // NO DATA IN SUPABASE: Return empty array per strict architectural requirement
  console.warn(`[Supabase Empty] ⚠️ ${cleanTicker} — sem dados na tabela etf_historical_prices do Supabase para ${timeframe}`);
  return [];
}
