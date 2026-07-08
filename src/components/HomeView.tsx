/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, TrendingUp, DollarSign, ArrowRight, ShieldCheck, Cpu, Coins, Percent, Award, ArrowUpRight, PlusCircle, Star } from 'lucide-react';
import { ETF } from '../types';
import { ETFS_LIST } from '../data/etfData';

interface HomeViewProps {
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
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

  // Sorting for Top 10 Maiores Altas
  const topGainers = [...ETFS_LIST]
    .sort((a, b) => b.daily_change - a.daily_change)
    .slice(0, 10);

  // Sorting for Top 10 AUM (Patrimônio Líquido)
  // Convert US AUM to BRL roughly for a fair scale comparison or list them separately?
  // Let's do BRL and USD but sort on their native absolute value or convert USD AUM to BRL (since 1M USD is 5.65M BRL) for ranking.
  // Actually, let's sort by their approximate BRL-converted AUM to find the global "heavyweights", or just sort by aum (which is relative to size).
  // Standard AUM in native is fine, but to be fair, we can rank by:
  const getBrlConvertedAum = (etf: ETF) => {
    return etf.currency === 'USD' ? etf.aum * 5.65 : etf.aum;
  };

  const topAum = [...ETFS_LIST]
    .sort((a, b) => getBrlConvertedAum(b) - getBrlConvertedAum(a))
    .slice(0, 10);

  // Categories definitions
  // Categories definitions
  const categories = [
    { name: 'S&P 500', icon: ShieldCheck, filter: 'sp500', desc: 'Ações das 500 maiores empresas dos EUA', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40' },
    { name: 'Tecnologia', icon: Cpu, filter: 'tecnologia', desc: 'Semicondutores, Software e Inovação', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40' },
    { name: 'Dividendos', icon: Percent, filter: 'dividendos', desc: 'Foco em renda passiva recorrente e Dividend Yield', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40' },
    { name: 'Mercado EUA', icon: DollarSign, filter: 'US', desc: 'ETFs nativos de bolsas americanas (USD)', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40' },
    { name: 'Criptoativos', icon: Coins, filter: 'cripto', desc: 'Bitcoin, Ethereum e índices Web3', color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40' },
    { name: 'Mercado Brasil', icon: Award, filter: 'BR', desc: 'ETFs locais negociados em Reais na B3', color: 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40' },
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in" id="home-view-container">
      {/* Hero Banner Section */}
      <section className="text-center py-10 px-4 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono uppercase font-bold rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40">
          <span>⚡ Novo: Comparador Avançado Lançado</span>
          <ArrowRight size={12} />
        </div>
        
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
                    onClick={() => onNavigate('etf', { ticker: etf.ticker })}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="category-grid">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate('screener', { shortcut: cat.filter })}
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
        
        {/* Top 10 Gainers Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col" id="panel-top-gainers">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white font-sans">
                Top 10 Maiores Altas do Dia
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase">
              Variação %
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-2.5 px-4 font-semibold">Ticker</th>
                  <th className="py-2.5 px-4 font-semibold">Nome do ETF</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Preço</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Variação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {topGainers.map((etf) => {
                  const isPositive = etf.daily_change >= 0;
                  return (
                    <tr
                      key={etf.id}
                      onClick={() => onNavigate('etf', { ticker: etf.ticker })}
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

        {/* Top 10 Maiores por AUM Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col" id="panel-top-aum">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="text-blue-600 dark:text-blue-400" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white font-sans">
                Top 10 Maiores ETFs por Patrimônio (AUM)
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase">
              Patrimônio Líquido
            </span>
          </div>

          <div className="overflow-x-auto">
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
                      onClick={() => onNavigate('etf', { ticker: etf.ticker })}
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
              <button
                onClick={() => onNavigate('raio-x')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                id="btn-cta-raio-x"
              >
                Simular Carteira Grátis <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigate('comparar')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-bold text-xs rounded-lg border border-slate-700/65 transition-colors cursor-pointer"
                id="btn-cta-compare"
              >
                Comparar Dois Ativos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
