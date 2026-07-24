/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Filter, RotateCcw, ArrowUpDown, ChevronRight, Check, Search, TrendingUp, DollarSign, X, SlidersHorizontal } from 'lucide-react';
import { ETF } from '../types';
import { useEtfData } from '../context/EtfDataContext';

interface ScreenerViewProps {
  initialShortcut?: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

type SortField = 'ticker' | 'name' | 'sector' | 'expense_ratio' | 'aum' | 'daily_change' | 'ytd_change' | 'current_price';
type SortOrder = 'asc' | 'desc';

export default function ScreenerView({ initialShortcut, onNavigate }: ScreenerViewProps) {
  const { etfs: ETFS_LIST } = useEtfData();
  // Filters State
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'BR' | 'US'>('ALL');
  const [maxExpenseRatio, setMaxExpenseRatio] = useState<number>(1.50);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('aum');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Available unique sectors
  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    ETFS_LIST.forEach(etf => sectors.add(etf.sector));
    return Array.from(sectors);
  }, [ETFS_LIST]);

  // Active advanced filters counter
  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;
    if (maxExpenseRatio < 1.50) count++;
    count += selectedSectors.length;
    return count;
  }, [maxExpenseRatio, selectedSectors]);

  // Handle shortcuts from other pages
  useEffect(() => {
    if (initialShortcut) {
      if (initialShortcut === 'BR' || initialShortcut === 'US') {
        setMarketFilter(initialShortcut);
      } else if (initialShortcut === 'sp500') {
        setSearchQuery('S&P 500');
        setMarketFilter('ALL');
      } else if (initialShortcut === 'Renda Fixa Brasil') {
        setSelectedSectors(['Renda Fixa Brasil']);
        setMarketFilter('BR');
      } else if (initialShortcut === 'tecnologia') {
        setSelectedSectors(['Tecnologia EUA', 'Tecnologia & Cripto']);
        setMarketFilter('ALL');
      } else if (initialShortcut === 'dividendos') {
        setSelectedSectors(['Dividendos EUA', 'Nacional Dividendos']);
        setMarketFilter('ALL');
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
      setSortOrder('desc');
    }
  };

  // Filtered and Sorted ETFs list
  const filteredEtfs = useMemo(() => {
    return ETFS_LIST.filter(etf => {
      // 1. Market Filter
      if (marketFilter !== 'ALL' && etf.market !== marketFilter) return false;

      // 2. Max Expense Ratio Filter
      if (etf.expense_ratio > maxExpenseRatio) return false;

      // 3. Sector Filter
      if (selectedSectors.length > 0 && !selectedSectors.includes(etf.sector)) return false;

      // 5. Search Text Filter
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
      let aVal = a[sortField] ?? 0;
      let bVal = b[sortField] ?? 0;

      if (sortField === 'aum') {
        aVal = a.currency === 'USD' ? a.aum * 5.65 : a.aum;
        bVal = b.currency === 'USD' ? b.aum * 5.65 : b.aum;
      } else if (sortField === 'ytd_change') {
        aVal = a.ytd_change ?? (a.daily_change * 8.5);
        bVal = b.ytd_change ?? (b.daily_change * 8.5);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [ETFS_LIST, marketFilter, maxExpenseRatio, selectedSectors, searchQuery, sortField, sortOrder]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="screener-view-container">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="text-blue-600 dark:text-blue-400" size={24} />
          Screener de ETFs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Filtre por mercado, taxa de administração e setores em tempo real.
        </p>
      </div>

      {/* MOBILE COMPACT FILTER HEADER (< lg) */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3 shadow-sm" id="screener-mobile-filter-bar">
        {/* Market Quick Tabs + Advanced Filter Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg text-xs font-bold">
            <button
              onClick={() => setMarketFilter('ALL')}
              className={`py-1.5 rounded-md transition-all cursor-pointer text-center ${
                marketFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setMarketFilter('BR')}
              className={`py-1.5 rounded-md transition-all cursor-pointer text-center ${
                marketFilter === 'BR'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              B3 (BR)
            </button>
            <button
              onClick={() => setMarketFilter('US')}
              className={`py-1.5 rounded-md transition-all cursor-pointer text-center ${
                marketFilter === 'US'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              EUA (US)
            </button>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-lg shrink-0 cursor-pointer"
            id="btn-open-mobile-filters"
          >
            <SlidersHorizontal size={14} />
            <span>Filtros</span>
            {activeAdvancedFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {activeAdvancedFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Pesquisar por ticker ou nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET DRAWER (MODAL) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Content */}
          <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-2xl max-h-[85vh] flex flex-col z-50 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <SlidersHorizontal size={16} className="text-blue-600 dark:text-blue-400" />
                Filtros Avançados
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Limpar
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Filters Body */}
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
              
              {/* Max Expense Ratio Slider */}
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
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.03%</span>
                  <span>1.50%</span>
                </div>
              </div>

              {/* Sectors Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Setores de Atuação
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {availableSectors.map((sector) => {
                    const isSelected = selectedSectors.includes(sector);
                    return (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-slate-700 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <span>{sector}</span>
                        {isSelected && <Check size={14} className="shrink-0 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver {filteredEtfs.length} ETFs Encontrados</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN GRID: SIDEBAR (DESKTOP) + RESULTS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* DESKTOP SIDEBAR PANEL (hidden on mobile, visible lg:block) */}
        <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6" id="screener-sidebar-filters">
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

          {/* Filter 2: Max Expense Ratio */}
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

          {/* Filter 3: Sector Selector */}
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

        {/* RESULTS SECTION (3 cols on desktop, 4 on mobile) */}
        <section className="lg:col-span-3 space-y-4">
          
          {/* Desktop Search Toolbar (hidden on mobile, visible sm:flex) */}
          <div className="hidden sm:flex flex-row items-center gap-3 justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
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
            
            <div className="text-xs text-slate-500 font-mono">
              Exibindo <span className="font-bold text-slate-800 dark:text-slate-200">{filteredEtfs.length}</span> de <span className="font-bold">{ETFS_LIST.length}</span> ETFs
            </div>
          </div>

          {/* Results Counter Label (Mobile only) */}
          <div className="sm:hidden flex items-center justify-between text-xs text-slate-500 font-mono px-1">
            <span>Resultados</span>
            <span><strong className="text-slate-900 dark:text-white">{filteredEtfs.length}</strong> de {ETFS_LIST.length} ETFs</span>
          </div>

          {/* MOBILE ADAPTIVE CARDS VIEW (< sm) */}
          <div className="sm:hidden space-y-3" id="screener-mobile-cards-list">
            {filteredEtfs.length > 0 ? (
              filteredEtfs.map((etf) => {
                const isPositive = etf.daily_change >= 0;
                const ytdVal = etf.ytd_change ?? (etf.daily_change * 8.5);
                const isYtdPositive = ytdVal >= 0;

                return (
                  <div
                    key={etf.id}
                    onClick={() => onNavigate('etf', { ticker: etf.ticker })}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer space-y-3"
                  >
                    {/* Header: Ticker + Market Badge + Daily Change */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                          {etf.ticker}
                        </span>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {etf.currency === 'USD' ? 'US (USD)' : 'B3 (BRL)'}
                        </span>
                      </div>
                      <div className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        isPositive 
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
                      }`}>
                        {isPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                      </div>
                    </div>

                    {/* Name + Sector */}
                    <div>
                      <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">
                        {etf.name}
                      </h4>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                          {etf.sector}
                        </span>
                      </div>
                    </div>

                    {/* Stats Footer Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-400 text-[10px] block font-mono uppercase">Taxa Admin</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {etf.expense_ratio.toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-mono uppercase">AUM (Patrimônio)</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {etf.currency === 'USD' ? '$' : 'R$'} {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block font-mono uppercase">Ano (YTD)</span>
                        <span className={`font-mono font-bold ${isYtdPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isYtdPositive ? '+' : ''}{ytdVal.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400">
                Nenhum ETF encontrado.
                <button onClick={resetFilters} className="mt-2 block mx-auto text-xs text-blue-600 dark:text-blue-400 font-bold">
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP TABLE VIEW (hidden on mobile, visible sm:block) */}
          <div className="hidden sm:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" id="screener-table-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/25">
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
                    <th 
                      onClick={() => requestSort('sector')} 
                      className="py-3.5 px-3 font-bold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-sector"
                    >
                      <span className="flex items-center gap-1 select-none">
                        Setor de Atuação
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
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
                      className="py-3.5 px-3 font-bold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-var-dia"
                    >
                      <span className="flex items-center justify-end gap-1 select-none">
                        Var. Dia
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th 
                      onClick={() => requestSort('ytd_change')} 
                      className="py-3.5 px-4 font-bold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      id="col-header-var-ano"
                    >
                      <span className="flex items-center justify-end gap-1 select-none">
                        Var. Ano (YTD)
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredEtfs.length > 0 ? (
                    filteredEtfs.map((etf) => {
                      const isPositive = etf.daily_change >= 0;
                      const ytdVal = etf.ytd_change ?? (etf.daily_change * 8.5);
                      const isYtdPositive = ytdVal >= 0;
                      return (
                        <tr
                          key={etf.id}
                          onClick={() => onNavigate('etf', { ticker: etf.ticker })}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group"
                          id={`screener-row-${etf.ticker.toLowerCase()}`}
                        >
                          <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {etf.ticker}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{etf.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{etf.sector}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                              {etf.sector}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                            {etf.expense_ratio.toFixed(2)}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                            {etf.currency === 'USD' ? 'US$ ' : 'R$ '}
                            {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                          </td>
                          <td className={`py-3.5 px-3 text-right font-mono font-bold ${
                            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {isPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                          </td>
                          <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                            isYtdPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {isYtdPositive ? '+' : ''}{ytdVal.toFixed(2)}%
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
