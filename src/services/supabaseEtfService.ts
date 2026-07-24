/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ETF } from '../types';
import { SUPABASE_URL, supabaseHeaders } from './supabaseConfig';
import { ETFS_LIST } from '../data/etfData';

interface SupabaseEtfRow {
  ticker: string;
  name: string;
  market: string;
  currency: string;
  category: string | null;
  expense_ratio: number | null;
  dividend_yield: number | null;
  aum: number | null;
  close_price: number | null;
  change_percent: number | null;
  description: string | null;
  manager: string | null;
}

/**
 * Fetch all ETFs from Supabase and merge with local static data (holdings, description, sector).
 * Supabase provides live prices; etfData.ts provides rich metadata that yfinance doesn't have.
 */
export async function fetchEtfListFromSupabase(): Promise<ETF[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/etfs?select=ticker,name,market,currency,category,expense_ratio,dividend_yield,aum,close_price,change_percent,description,manager&order=ticker.asc`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: supabaseHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Supabase ETF List] HTTP ${response.status}`);
      return ETFS_LIST;
    }

    const rows: SupabaseEtfRow[] = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn('[Supabase ETF List] Empty response, using local data');
      return ETFS_LIST;
    }

    // Merge: Supabase live prices + local static metadata (holdings, sector, description)
    const merged: ETF[] = ETFS_LIST.map(localEtf => {
      const sbRow = rows.find(r => r.ticker.toUpperCase() === localEtf.ticker.toUpperCase());
      if (sbRow) {
        return {
          ...localEtf,
          current_price: sbRow.close_price ?? localEtf.current_price,
          daily_change: sbRow.change_percent ?? localEtf.daily_change,
          aum: sbRow.aum ?? localEtf.aum,
          expense_ratio: sbRow.expense_ratio ?? localEtf.expense_ratio,
          dividend_yield: sbRow.dividend_yield ?? localEtf.dividend_yield,
          name: sbRow.name || localEtf.name,
        };
      }
      return localEtf;
    });

    // Add any ETFs in Supabase that aren't in the local list
    for (const sbRow of rows) {
      const exists = merged.some(e => e.ticker.toUpperCase() === sbRow.ticker.toUpperCase());
      if (!exists) {
        merged.push({
          id: sbRow.ticker,
          ticker: sbRow.ticker,
          name: sbRow.name,
          market: (sbRow.market as 'BR' | 'US') || 'BR',
          currency: (sbRow.currency as 'BRL' | 'USD') || 'BRL',
          expense_ratio: sbRow.expense_ratio ?? 0,
          dividend_yield: sbRow.dividend_yield ?? 0,
          aum: sbRow.aum ?? 0,
          description: sbRow.description || `ETF ${sbRow.ticker} listado na ${sbRow.market === 'US' ? 'NYSE/Nasdaq' : 'B3'}.`,
          sector: sbRow.category || 'Outros',
          daily_change: sbRow.change_percent ?? 0,
          ytd_change: 0,
          current_price: sbRow.close_price ?? 0,
          manager: sbRow.manager || '',
          holdings: [],
        });
      }
    }

    console.log(`[Supabase ETF List] Loaded ${rows.length} ETFs from Supabase, merged total: ${merged.length}`);
    return merged;

  } catch (e) {
    console.warn('[Supabase ETF List] Failed, using local fallback:', e);
    return ETFS_LIST;
  }
}
