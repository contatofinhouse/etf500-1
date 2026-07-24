/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, TrendingUp, DollarSign, ArrowRight, ShieldCheck, Cpu, Coins, Percent, Award, ArrowUpRight, PlusCircle, Star, Landmark, Building2, Newspaper, ExternalLink, Clock } from 'lucide-react';
import { ETF } from '../types';
import { useEtfData } from '../context/EtfDataContext';
import { fetchNews, getRelativeTime } from '../services/newsService';

interface HomeViewProps {
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const { etfs: ETFS_LIST } = useEtfData();
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('etf500_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (ticker: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(ticker)) {
      updated = favorites.filter(t => t !== ticker);
    } else {
      updated = [...favorites, ticker];
    }
    setFavorites(updated);
    localStorage.setItem('etf500_favorites', JSON.stringify(updated));
  };

  // Instant Client Search Filtration
  const filteredEtfs = searchQuery.trim() === ''
    ? []
    : ETFS_LIST.filter(etf =>
        etf.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Sorting for Top 10 Maiores Altas no Ano (YTD / Maiores Altas)
  const topGainers = [...ETFS_LIST]
    .sort((a, b) => b.daily_change - a.daily_change)
    .slice(0, 10);

  // Sorting for Top 10 AUM (Patrimônio Líquido)
  const getBrlConvertedAum = (etf: ETF) => {
    return etf.currency === 'USD' ? etf.aum * 5.65 : etf.aum;
  };

  const topAum = [...ETFS_LIST]
    .sort((a, b) => getBrlConvertedAum(b) - getBrlConvertedAum(a))
    .slice(0, 10);

  // Lista de Gestoras de ETFs para a seção dedicada
  const managersList = [
    { id: 'blackrock', name: 'BlackRock', brand: 'iShares', tag: 'Global & B3', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50', desc: 'Líder mundial (IVVB11, BOVA11, SMAL11)' },
    { id: 'itau', name: 'Itaú It Now', brand: 'It Now', tag: 'Pioneira B3', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/50 dark:hover:border-orange-500/50', desc: 'ETFs locais de ações e renda fixa (B5P211, DIVO11)' },
    { id: 'investo', name: 'Investo', brand: 'Investo', tag: 'Acesso Global', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50', desc: 'Diversificação mundial passiva (WRLD11, LFTS11)' },
    { id: 'hashdex', name: 'Hashdex', brand: 'Hashdex', tag: 'Cripto Regulado', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50', desc: 'Pioneira em criptoativos na B3 (HASH11)' },
    { id: 'vanguard', name: 'Vanguard', brand: 'Vanguard', tag: 'Menores Taxas', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50', desc: 'Referência global de custo baixo (VOO, VNQ, VT)' },
    { id: 'invesco', name: 'Invesco', brand: 'Invesco', tag: 'Tecnologia EUA', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50', desc: 'Líder em inovação e Nasdaq-100 (QQQ)' },
    { id: 'schwab', name: 'Charles Schwab', brand: 'Schwab', tag: 'Renda & Dividendos', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50', desc: 'Foco em dividendos crescentes (SCHD)' },
    { id: 'xp', name: 'XP Asset', brand: 'Trend', tag: 'Trend ETFs B3', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50', desc: 'Ouro, China e Commodities (GOLD11, XINA11)' }
  ];

  // Categories definitions
  const categories = [
    { name: 'Renda Fixa Brasil', icon: Landmark, filter: 'Renda Fixa Brasil', desc: 'Tesouro IPCA+, Selic e Debêntures via B3', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50' },
    { name: 'Gestoras de ETFs', icon: Building2, filter: 'gestoras', desc: 'BlackRock, Itaú, Investo, Hashdex, Vanguard, etc.', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-blue-500/50' },
    { name: 'S&P 500', icon: ShieldCheck, filter: 'sp500', desc: 'Ações das 500 maiores empresas dos EUA', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-blue-500/50' },
    { name: 'Tecnologia', icon: Cpu, filter: 'tecnologia', desc: 'Semicondutores, Software e Inovação', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-purple-500/50' },
    { name: 'Dividendos', icon: Percent, filter: 'dividendos', desc: 'Foco em renda passiva recorrente e Dividend Yield', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50' },
    { name: 'Mercado EUA', icon: DollarSign, filter: 'US', desc: 'ETFs nativos de bolsas americanas (USD)', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-amber-500/50' },
    { name: 'Criptoativos', icon: Coins, filter: 'cripto', desc: 'Bitcoin, Ethereum e índices Web3', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50' },
    { name: 'Mercado Brasil', icon: Award, filter: 'BR', desc: 'ETFs locais negociados em Reais na B3', color: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50' },
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in" id="home-view-container">
      {/* Hero Banner Section */}
      <section className="text-center py-10 px-4 max-w-4xl mx-auto space-y-6">
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          A forma mais inteligente de rastrear e comparar <span className="text-blue-600 dark:text-blue-400">ETFs do Brasil e EUA</span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Dados históricos de fechamento, taxas de administração, dividend yield e simulações de portfólio. 100% gratuito, sem fricção, sem cadastro.
        </p>

        {/* Live Search Box */}
        <div className="relative max-w-2xl mx-auto" id="search-container">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Pesquise por ticker ou nome (ex: IVVB11, VOO, QQQ, BOVA11)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-slate-950 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 focus:outline-none rounded-lg shadow-sm transition-all text-sm font-medium"
            id="main-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
              id="clear-search-btn"
            >
              LIMPAR
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {searchQuery.trim() !== '' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden text-left z-20 relative divide-y divide-slate-100 dark:divide-slate-800" id="search-results">
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span>Resultados para "{searchQuery}"</span>
              <span>{filteredEtfs.length} encontrados</span>
            </div>
            {filteredEtfs.length > 0 ? (
              filteredEtfs.map((etf) => {
                const isFav = favorites.includes(etf.ticker);
                return (
                  <div
                    key={etf.id}
                    onClick={() => onNavigate('etf', { ticker: etf.ticker, from: 'home' })}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between cursor-pointer"
                    id={`search-result-${etf.ticker.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-mono border border-slate-200/50 dark:border-slate-700">
                        {etf.ticker}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-950 dark:text-white leading-none">
                          {etf.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                          Mercado: {etf.market === 'BR' ? 'B3 (Brasil)' : 'NYSE/NASDAQ (EUA)'} • Taxa: {etf.expense_ratio}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                          {etf.currency === 'USD' ? '$' : 'R$'} {etf.current_price.toFixed(2)}
                        </div>
                        <div className={`text-xs font-semibold font-mono ${
                          etf.daily_change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {etf.daily_change >= 0 ? '+' : ''}{etf.daily_change.toFixed(2)}%
                        </div>
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(etf.ticker, e)}
                        className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          isFav ? 'text-amber-500' : 'text-slate-400'
                        }`}
                        id={`fav-${etf.ticker}`}
                      >
                        <Star size={16} fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                Nenhum ETF encontrado com o termo "{searchQuery}". Tente usar o ticker (ex: BOVA11) ou nome.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-4">
          Atalhos de Categorias Recomendadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="category-grid">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => cat.filter === 'gestoras' ? onNavigate('gestora', { manager: '' }) : onNavigate('screener', { shortcut: cat.filter })}
                className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md rounded-xl transition-all text-left flex gap-4 cursor-pointer"
                id={`cat-shortcut-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              >
                <div className={`p-3 rounded-lg ${cat.color} shrink-0 flex items-center justify-center`}>
                  <IconComponent size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                    {cat.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Two side-by-side Top Tables (Fintech Bloomberg Terminal style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top 10 Gainers Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col" id="panel-top-gainers">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white font-sans text-sm sm:text-base">
                Top 10 Maiores Altas do Dia
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase hidden sm:inline">
              Variação Hoje %
            </span>
          </div>

          {/* MOBILE HORIZONTAL CAROUSEL (< sm) */}
          <div className="sm:hidden p-3 flex gap-3 overflow-x-auto no-scrollbar">
            {topGainers.map((etf) => {
              const isPositive = etf.daily_change >= 0;
              return (
                <div
                  key={etf.id}
                  onClick={() => onNavigate('etf', { ticker: etf.ticker, from: 'home' })}
                  className="min-w-[170px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 cursor-pointer shrink-0 space-y-1.5 active:scale-95 transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{etf.ticker}</span>
                    <span className={`text-xs font-mono font-extrabold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{etf.name}</div>
                  <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {etf.currency === 'USD' ? '$' : 'R$'} {etf.current_price.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-2.5 px-4 font-semibold">Ticker</th>
                  <th className="py-2.5 px-4 font-semibold">Nome do ETF</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Preço</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Variação Hoje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {topGainers.map((etf) => {
                  const isPositive = etf.daily_change >= 0;
                  return (
                    <tr
                      key={etf.id}
                      onClick={() => onNavigate('etf', { ticker: etf.ticker, from: 'home' })}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {etf.ticker}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[180px] sm:max-w-[240px]">
                        {etf.name}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                        {etf.currency === 'USD' ? '$' : 'R$'} {etf.current_price.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/30 dark:bg-slate-950/10">
            <button
              onClick={() => onNavigate('screener')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Ver todos no Screener <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Top 10 Maiores por AUM Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col" id="panel-top-aum">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="text-blue-600 dark:text-blue-400" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white font-sans text-sm sm:text-base">
                Top 10 Maiores por Patrimônio
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase hidden sm:inline">
              Patrimônio Líquido
            </span>
          </div>

          {/* MOBILE HORIZONTAL CAROUSEL (< sm) */}
          <div className="sm:hidden p-3 flex gap-3 overflow-x-auto no-scrollbar">
            {topAum.map((etf) => {
              return (
                <div
                  key={etf.id}
                  onClick={() => onNavigate('etf', { ticker: etf.ticker, from: 'home' })}
                  className="min-w-[170px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 cursor-pointer shrink-0 space-y-1.5 active:scale-95 transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{etf.ticker}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">{etf.market}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{etf.name}</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {etf.currency === 'USD' ? 'US$' : 'R$'} {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-2.5 px-4 font-semibold">Ticker</th>
                  <th className="py-2.5 px-4 font-semibold">Nome do ETF</th>
                  <th className="py-2.5 px-4 font-semibold text-center">País</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Patrimônio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {topAum.map((etf) => {
                  return (
                    <tr
                      key={etf.id}
                      onClick={() => onNavigate('etf', { ticker: etf.ticker, from: 'home' })}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {etf.ticker}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[180px] sm:max-w-[240px]">
                        {etf.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          etf.market === 'BR' ? 'bg-green-100 dark:bg-green-950/55 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-950/55 text-blue-700 dark:text-blue-400'
                        }`}>
                          {etf.market}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {etf.currency === 'USD' ? 'US$' : 'R$'} {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/30 dark:bg-slate-950/10">
            <button
              onClick={() => onNavigate('screener')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Filtrar e Explorar no Screener <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </section>

      {/* Gestoras de ETFs Section (Abaixo do Top 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4" id="section-gestoras">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="text-blue-600 dark:text-blue-400" size={20} />
              Gestoras de ETFs (Página Dedicada & Filtro)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clique numa gestora para acessar sua página com descritivo, patrimônio e lista completa de ETFs
            </p>
          </div>
          <button
            onClick={() => onNavigate('gestora', { manager: '' })}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver Todas <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {managersList.map((mgr) => (
            <div
              key={mgr.id}
              onClick={() => onNavigate('gestora', { manager: mgr.id })}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${mgr.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Visual Brand Badge */}
                    <div className="w-7 h-7 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center font-black text-[10px] shrink-0">
                      {mgr.id === 'itau' ? 'IT' : mgr.id === 'blackrock' ? 'BLK' : mgr.id === 'vanguard' ? 'VG' : mgr.id === 'investo' ? 'INV' : mgr.id === 'hashdex' ? 'HDX' : mgr.id === 'invesco' ? 'QQQ' : mgr.id === 'schwab' ? 'SCH' : 'XP'}
                    </div>
                    <span className="font-black text-base tracking-tight">{mgr.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 dark:bg-black/20 font-mono">
                    {mgr.tag}
                  </span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed font-sans">
                  {mgr.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-current/10 flex items-center justify-between text-xs font-bold">
                <span>Ver ETFs {mgr.brand}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 1: Guia Definitivo - O que é ETF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              Guia do Investidor
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              O que é um ETF (Exchange Traded Fund) e como funciona na B3?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Um <strong className="font-bold text-slate-900 dark:text-white">ETF (Fundo de Índice)</strong> é um condomínio de investimento cujas cotas são negociadas em bolsa de valores da mesma forma que uma ação individual. Seu objetivo principal é replicar a rentabilidade de um índice de referência (benchmark) do mercado de renda variável ou renda fixa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold font-mono text-xs border border-slate-200 dark:border-slate-700">
                01
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Diversificação Instantânea</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ao comprar uma única cota de <strong className="font-semibold text-slate-800 dark:text-slate-200">IVVB11</strong> ou <strong className="font-semibold text-slate-800 dark:text-slate-200">VOO</strong>, você passa a deter fração das 500 maiores empresas dos EUA, reduzindo o risco de ruína de ações individuais.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold font-mono text-xs border border-slate-200 dark:border-slate-700">
                02
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Baixas Taxas de Administração</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Diferente de fundos tradicionais com taxas de 2% ao ano + 20% de performance, ETFs como <strong className="font-semibold text-slate-800 dark:text-slate-200">B5P211</strong> ou <strong className="font-semibold text-slate-800 dark:text-slate-200">VOO</strong> cobram a partir de apenas <strong className="font-semibold text-slate-800 dark:text-slate-200">0,03% a.a.</strong>
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold font-mono text-xs border border-slate-200 dark:border-slate-700">
                03
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Gestão Passiva Transparente</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                A carteira é 100% pública e alinhada às regras do índice. Não há surpresas com escolhas individuais de gestores ativistas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 2: Mapeamento dos Principais Índices Financeiros */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              Índices e Benchmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Principais Índices do Mercado Global e seus ETFs na B3
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Confira os maiores índices de referência do mercado financeiro e os ETFs negociados em Reais ou Dólar para acompanhá-los:
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-4 font-bold">Índice Global</th>
                    <th className="py-3 px-4 font-bold">Classe de Ativo</th>
                    <th className="py-3 px-4 font-bold">ETFs Correspondentes (B3 & EUA)</th>
                    <th className="py-3 px-4 font-bold text-right">Taxa Média</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white">S&P 500</td>
                    <td className="py-3.5 px-4">Ações Large Cap EUA</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      IVVB11 (B3) • VOO (EUA)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">0.03% ~ 0.20%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white">Nasdaq-100</td>
                    <td className="py-3.5 px-4">Tecnologia & Inovação</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      QQQ (EUA)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">0.20%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white">Ibovespa / SMLL</td>
                    <td className="py-3.5 px-4">Ações Brasil (Blue Chips / Small Caps)</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      BOVA11 • SMAL11 (B3)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">0.30% ~ 0.50%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white">IMA-B 5 / IRF-M</td>
                    <td className="py-3.5 px-4">Renda Fixa Tesouro IPCA+ / Pré-fixado</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      B5P211 • IMAB11 • IRFM11 (B3)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">0.20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 3: Guia de Tributação e Imposto de Renda */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              Legislação Fiscal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tributação e Imposto de Renda em ETFs no Brasil (Regras Atualizadas & Lei 14.754)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              A tributação dos ETFs varia de acordo com a classe de ativos (Ações, Renda Fixa ou Cripto) e a jurisdição do fundo. Diferente dos fundos de investimento tradicionais, <strong>nenhum ETF na B3 possui come-cotas (antecipação semestral de IR)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 block truncate" title="Ações & Cripto B3 • IVVB11 / BOVA11 / HASH11">
                Ações & Cripto B3 • IVVB11 / BOVA11 / HASH11
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Alíquota Fixa de 15% (Swing Trade)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Incide exclusivamente sobre o ganho de capital (lucro) na alienação das cotas. O recolhimento é via DARF pelo próprio investidor até o último dia útil do mês subsequente. <strong className="font-semibold text-slate-800 dark:text-slate-200">Importante</strong>: Não há isenção de IR para vendas de até R$ 20 mil/mês como ocorre nas ações individuais. Operações Day Trade são tributadas em 20%.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 block truncate" title="Renda Fixa B3 • B5P211 / LFTS11 / IMAB11">
                Renda Fixa B3 • B5P211 / LFTS11 / IMAB11
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">IR Retido na Fonte (15% a 25%)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                O imposto é <strong className="font-semibold text-slate-800 dark:text-slate-200">retido automaticamente pela corretora</strong> no momento do resgate/venda. A alíquota é determinada pelo prazo médio de repactuação dos títulos mantidos pelo fundo: <strong className="font-semibold text-slate-800 dark:text-slate-200">15%</strong> para prazo médio superior a 720 dias (como B5P211 e IMAB11), crescendo até 25% para prazos mais curtos.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 block truncate" title="ETFs EUA • VOO / QQQ / SCHD">
                ETFs EUA • VOO / QQQ / SCHD
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lei das Offshores & Dividendos IRS (30%)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dividendos pagos nos EUA sofrem retenção na fonte pelo Fisco Americano (IRS) de <strong className="font-semibold text-slate-800 dark:text-slate-200">30%</strong> (devido ao acordo de não bi-tributação com o Brasil). Conforme a Lei 14.754/2023 (Lei dos Ativos no Exterior), os ganhos de capital em vendas são tributados à alíquota anual unificada de <strong className="font-semibold text-slate-800 dark:text-slate-200">15%</strong> na Declaração de Ajuste Anual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 4: Confronto ETF vs Ações vs Fundos Tradicionais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              Análise Comparativa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ETF vs Ações Individuais vs Fundos de Investimento Tradicionais
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Critério</th>
                    <th className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">ETFs (Fundos de Índice)</th>
                    <th className="py-3.5 px-4 font-bold">Ações Individuais</th>
                    <th className="py-3.5 px-4 font-bold">Fundos Tradicionais (Ativos)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold">Taxa de Administração</td>
                    <td className="py-3.5 px-4 font-bold font-mono">Muitíssimo Baixa (0.03% - 0.30%)</td>
                    <td className="py-3.5 px-4 font-mono">0.00% (Isento)</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">Elevada (1.5% - 2.5% a.a.)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold">Taxa de Performance</td>
                    <td className="py-3.5 px-4 font-bold">Não possui</td>
                    <td className="py-3.5 px-4">Não possui</td>
                    <td className="py-3.5 px-4 text-slate-500">20% sobre o que exceder benchmark</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold">Composições de Carteira</td>
                    <td className="py-3.5 px-4 font-bold">100% Transparente & Pública</td>
                    <td className="py-3.5 px-4">Ativo Único</td>
                    <td className="py-3.5 px-4 text-slate-400">Divulgação diferida em até 90 dias</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold">Come-Cotas (Semestral)</td>
                    <td className="py-3.5 px-4 font-bold">Isento em ETFs de Ações</td>
                    <td className="py-3.5 px-4">Isento</td>
                    <td className="py-3.5 px-4 text-slate-500">Incide em maio e novembro (RF/Multimercado)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 5: FAQ Accordion Interativo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-200 dark:border-slate-800/80" id="section-faq">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              Tire suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Perguntas Frequentes sobre ETFs (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all [&_summary::-webkit-details-marker]:none cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>1. Qual é a vantagem de investir em IVVB11 em Reais em vez de VOO em Dólar?</span>
                <span className="text-slate-400 transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                O <strong className="font-semibold text-slate-800 dark:text-slate-200">IVVB11</strong> permite ao investidor brasileiro acessar o índice S&P 500 diretamente pela B3 em Reais sem a necessidade de realizar remessa cambial internacional nem abrir conta em corretora estrangeira. Já o <strong className="font-semibold text-slate-800 dark:text-slate-200">VOO</strong> exige conta no exterior em Dólar, mas conta com taxa de administração ligeiramente menor (0,03% a.a. contra 0,20% a.a. do IVVB11).
              </p>
            </details>

            <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all [&_summary::-webkit-details-marker]:none cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>2. O que é o reinvestimento automático de proventos em ETFs brasileiros?</span>
                <span className="text-slate-400 transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                A maioria dos ETFs listados na B3 (como BOVA11 e IVVB11) <strong className="font-semibold text-slate-800 dark:text-slate-200">não paga dividendos diretamente na conta corrente do investidor</strong>. Em vez disso, os proventos pagos pelas empresas da carteira são reinvestidos automaticamente pelo administrador na compra de mais ações do índice, gerando efeito de juros compostos no valor patrimonial da cota.
              </p>
            </details>

            <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all [&_summary::-webkit-details-marker]:none cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>3. Qual é o valor mínimo para começar a investir em ETFs?</span>
                <span className="text-slate-400 transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                Na B3, você pode comprar a partir de <strong className="font-semibold text-slate-800 dark:text-slate-200">1 única cota</strong> de qualquer ETF (por exemplo, cotas na faixa de R$ 10 a R$ 150). Não há lote mínimo de 100 cotas como ocorria no passado.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* SEO Section 6: Glossário Técnico */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-200 dark:border-slate-800/80">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">
              Vocabulário de Mercado
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Glossário Rápido do Investidor de ETFs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">AUM (Assets Under Management)</span>
              <p className="text-xs text-slate-500 leading-relaxed">O valor total do patrimônio líquido acumulado sob custódia do fundo de índice.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">Expense Ratio</span>
              <p className="text-xs text-slate-500 leading-relaxed">Taxa percentual cobrada anualmente pelo administrador para gestão do ETF.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">Tracking Error</span>
              <p className="text-xs text-slate-500 leading-relaxed">A métrica que mede a precisão com que o ETF acompanha a variação do seu índice.</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">Market Maker</span>
              <p className="text-xs text-slate-500 leading-relaxed">Instituição contratada para garantir liquidez e ofertas de compra/venda no livro da B3.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section: Últimas Notícias sobre ETFs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
                Feed de Notícias
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Últimas Notícias sobre ETFs
              </h2>
            </div>
            <button
              onClick={() => onNavigate('noticias')}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              id="btn-ver-todas-noticias"
            >
              Ver Todas <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fetchNews(4).map((article) => (
              <a
                key={article.id}
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all space-y-2.5 flex flex-col"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {article.category}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-0.5">
                    <Clock size={9} />
                    {getRelativeTime(article.published_at)}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1 line-clamp-3">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {article.source_name}
                  </span>
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:underline">
                    Ler <ExternalLink size={9} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Capture Banner preview inside Home page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-10 shadow-md">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-2xl space-y-4">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold font-mono tracking-wider uppercase rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">
              Diagnóstico Patrimonial Global
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Tem mais de R$ 50.000 investidos em ETFs?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Consolide sua carteira local no nosso painel de diagnósticos, identifique sobreposições de taxas de administração e receba uma análise profissional gratuita de alocação global.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511955842951?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20profissional%20gratuito%20da%20minha%20carteira%20de%20ETFs."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                id="btn-cta-whatsapp-home"
              >
                Solicitar Diagnóstico via WhatsApp <ArrowRight size={14} />
              </a>
              <button
                onClick={() => onNavigate('raio-x')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-bold text-xs rounded-lg border border-slate-700/65 transition-colors cursor-pointer"
                id="btn-cta-raio-x"
              >
                Simular Raio-X de Portfólio
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
