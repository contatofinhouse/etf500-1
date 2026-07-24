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
  ytd_change?: number; // YTD percent variation, e.g. +12.40 or -5.10
  current_price: number; // current price in native currency
  manager?: string; // Fundo manager (gestora), e.g. 'BlackRock', 'Itaú'
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

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  thumbnail_url?: string;
  category: 'Mercado' | 'Renda Fixa' | 'Cripto' | 'Internacional' | 'Regulação' | 'Lançamento';
  related_tickers: string[];
  published_at: string;
}
