/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Filter, RotateCcw, ArrowUpDown, ChevronRight, Check, Search, TrendingUp, DollarSign } from 'lucide-react';
import { ETF } from '../types';
import { ETFS_LIST } from '../data/etfData';

interface ScreenerViewProps {
  initialShortcut?: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

type SortField = 'ticker' | 'name' | 'expense_ratio' | 'dividend_yield' | 'aum' | 'daily_change' | 'current_price';
type SortOrder = 'asc' | 'desc';

export default function ScreenerView({ initialShortcut, onNavigate }: ScreenerViewProps) {
  // Filters State
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'BR' | 'US'>('ALL');
  const [maxExpenseRatio, setMaxExpenseRatio] = useState<number>(1.50);
  const [minDividendYield, setMinDividendYield] = useState<number>(0.0);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('aum');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Available unique sectors
  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    ETFS_LIST.forEach(etf => sectors.add(etf.sector));
    return Array.from(sectors);
  }, []);

  // Handle shortcuts from other pages
  useEffect(() => {
    if (initialShortcut) {
      if (initialShortcut === 'BR' || initialShortcut === 'US') {
        setMarketFilter(initialShortcut);
      } else if (initialShortcut === 'sp500') {
        setSearchQuery('S&P 500');
        setMarketFilter('ALL');
      } else if (initialShortcut === 'tecnologia') {
        setSelectedSectors(['Tecnologia EUA', 'Tecnologia & Cripto']);
        setMarketFilter('ALL');
      } else if (initialShortcut === 'dividendos') {
        setMinDividendYield(1.0);
        setSelectedSectors(['Dividendos EUA']);
        setMarketFilter('US');
      } else if (initialShortcut === 'cripto') {
        setSelectedSectors(['Tecnologia & Cripto']);
        setMarketFilter('ALL');
      }
    }
  }, [initialShortcut]);

  // Handle sector selection toggle
  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setMarketFilter('ALL');
    setMaxExpenseRatio(1.50);
    setMinDividendYield(0.0);
    setSelectedSectors([]);
    setSearchQuery('');
    setSortField('aum');
    setSortOrder('desc');
  };

  // Toggle Sorting column
  const requestSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending for numbers
    }
  };

  // Filtered and Sorted ETFs list
  const filteredEtfs = useMemo(() => {
    return ETFS_LIST.filter(etf => {
      // 1. Market Filter
      if (marketFilter !== 'ALL' && etf.market !== marketFilter) return false;

      // 2. Max Expense Ratio Filter
      if (etf.expense_ratio > maxExpenseRatio) return false;

      // 3. Min Dividend Yield Filter
      if (etf.dividend_yield < minDividendYield) return false;

      // 4. Sector Filter
      if (selectedSectors.length > 0 && !selectedSectors.includes(etf.sector)) return false;

      // 5. Search Text Filter (Ticker or Name or Sector)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTicker = etf.ticker.toLowerCase().includes(query);
        const matchesName = etf.name.toLowerCase().includes(query);
        const matchesSector = etf.sector.toLowerCase().includes(query);
        const matchesDesc = etf.description.toLowerCase().includes(query);
        if (!matchesTicker && !matchesName && !matchesSector && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Special conversion for relative scaling if we sort by AUM (scale USD to BRL)
      if (sortField === 'aum') {
        aVal = a.currency === 'USD' ? a.aum * 5.65 : a.aum;
        bVal = b.currency === 'USD' ? b.aum * 5.65 : b.aum;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [marketFilter, maxExpenseRatio, minDividendYield, selectedSectors, searchQuery, sortField, sortOrder]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="screener-view-container">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="text-blue-600 dark:text-blue-400" size={24} />
          Screener de ETFs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Aplique filtros de mercado, taxa de administração, dividendos e setores em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Filter Sidebar Panel */}
        <aside className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6" id="screener-sidebar-filters">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              Filtros Avançados
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              title="Resetar filtros"
              id="btn-reset-filters"
            >
              <RotateCcw size={12} />
              Limpar
            </button>
          </div>

          {/* Filter 1: Market (BR or US) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Mercado / Custódia
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg">
              <button
                onClick={() => setMarketFilter('ALL')}
                className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  marketFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                id="filter-market-all"
              >
                Todos
              </button>
              <button
                onClick={() => setMarketFilter('BR')}
                className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  marketFilter === 'BR'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                id="filter-market-br"
              >
                B3 (BR)
              </button>
              <button
                onClick={() => setMarketFilter('US')}
                className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  marketFilter === 'US'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                id="filter-market-us"
              >
                EUA (US)
              </button>
            </div>
          </div>

          {/* Filter 2: Max Expense Ratio (Taxa de Admin) */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Taxa de Admin Máxima
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {maxExpenseRatio.toFixed(2)}% a.a.
              </span>
            </div>
            <input
              type="range"
              min="0.03"
              max="1.50"
              step="0.05"
              value={maxExpenseRatio}
              onChange={(e) => setMaxExpenseRatio(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
              id="slider-max-expense"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.03%</span>
              <span>1.50%</span>
            </div>
          </div>

          {/* Filter 3: Min Dividend Yield */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Dividend Yield Mínimo
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {minDividendYield.toFixed(2)}% a.a.
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.1"
              value={minDividendYield}
              onChange={(e) => setMinDividendYield(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
              id="slider-min-dividend"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0%</span>
              <span>4.0%</span>
            </div>
          </div>

          {/* Filter 4: Sector Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Setores de Atuação
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableSectors.map((sector) => {
                const isSelected = selectedSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                    id={`filter-sector-${sector.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  >
                    <span>{sector}</span>
                    {isSelected && <Check size={12} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Side: Results summary + Table */}
        <section className="lg:col-span-3 space-y-4">
          
          {/* Table Toolbar Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Filtro rápido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm text-slate-950 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:border-blue-500 focus:outline-none"
                id="screener-search-bar"
              />
            </div>
            
            <div className="text-xs text-slate-500 font-mono self-end sm:self-center">
              Exibindo <span className="font-bold text-slate-800 dark:text-slate-200">{filteredEtfs.length}</span> de <span className="font-bold">{ETFS_LIST.length}</span> ETFs
            </div>
          </div>

          {/* Main Results Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" id="screener-table-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/25">
                    {/* Columns header */}
                    <th 
                      onClick={() => requestSort('ticker')} 
                      className="py-3.5 px-4 font-bold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-ticker"
                    >
                      <span className="flex items-center gap-1 select-none">
                        Ticker
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th 
                      onClick={() => requestSort('name')} 
                      className="py-3.5 px-4 font-bold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-name"
                    >
                      <span className="flex items-center gap-1 select-none">
                        Nome do ETF
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th className="py-3.5 px-3 font-bold text-center">Mercado</th>
                    <th 
                      onClick={() => requestSort('expense_ratio')} 
                      className="py-3.5 px-3 font-bold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-taxa"
                    >
                      <span className="flex items-center justify-end gap-1 select-none">
                        Taxa Admin
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th 
                      onClick={() => requestSort('dividend_yield')} 
                      className="py-3.5 px-3 font-bold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-div"
                    >
                      <span className="flex items-center justify-end gap-1 select-none">
                        Div. Yield
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th 
                      onClick={() => requestSort('aum')} 
                      className="py-3.5 px-3 font-bold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-patrimonio"
                    >
                      <span className="flex items-center justify-end gap-1 select-none">
                        AUM
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th 
                      onClick={() => requestSort('daily_change')} 
                      className="py-3.5 px-4 font-bold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-var"
                    >
                      <span className="flex items-center justify-end gap-1 select-none">
                        Var. Dia
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredEtfs.length > 0 ? (
                    filteredEtfs.map((etf) => {
                      const isPositive = etf.daily_change >= 0;
                      return (
                        <tr
                          key={etf.id}
                          onClick={() => onNavigate('etf', { ticker: etf.ticker })}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group"
                          id={`screener-row-${etf.ticker.toLowerCase()}`}
                        >
                          {/* Ticker */}
                          <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {etf.ticker}
                          </td>
                          {/* Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{etf.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{etf.sector}</div>
                          </td>
                          {/* Market */}
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              etf.market === 'BR' ? 'bg-green-100 dark:bg-green-950/55 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-950/55 text-blue-700 dark:text-blue-400'
                            }`}>
                              {etf.market}
                            </span>
                          </td>
                          {/* Expense Ratio */}
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                            {etf.expense_ratio.toFixed(2)}%
                          </td>
                          {/* Dividend Yield */}
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                            {etf.dividend_yield > 0 ? `${etf.dividend_yield.toFixed(2)}%` : '—'}
                          </td>
                          {/* AUM */}
                          <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                            {etf.currency === 'USD' ? 'US$ ' : 'R$ '}
                            {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                          </td>
                          {/* Daily Variation */}
                          <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {isPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        Nenhum ETF atendeu aos critérios de filtragem selecionados.
                        <button
                          onClick={resetFilters}
                          className="mt-3 block mx-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Limpar Filtros e Tentar Novamente
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
