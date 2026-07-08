/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ETF {
  id: string;
  ticker: string;
  name: string;
  market: 'BR' | 'US';
  currency: 'BRL' | 'USD';
  expense_ratio: number; // e.g. 0.20%
  dividend_yield: number; // e.g. 1.35%
  aum: number; // Assets Under Management in millions of respective currency
  description: string;
  sector: string;
  daily_change: number; // daily percent variation, e.g. +1.45 or -0.80
  current_price: number; // current price in native currency
  holdings: { name: string; percentage: number }[];
}

export interface HistoricalPrice {
  date: string;
  close_price: number;
  volume: number;
}

export interface PortfolioItem {
  ticker: string;
  percentage: number;
}

export interface LeadB2B {
  id: string;
  name: string;
  email: string;
  phone: string;
  estimated_portfolio: string;
  created_at: string;
}
