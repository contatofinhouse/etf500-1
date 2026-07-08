/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, BarChart3, ArrowRightLeft, PieChart, Sun, Moon, Info, Share2 } from 'lucide-react';
import { ETFS_LIST } from '../data/etfData';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onShowCodes: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
  onShowCodes
}: HeaderProps) {
  // Select 5 tickers to show in top ticker bar
  const highlightEtfs = ETFS_LIST.slice(0, 5);

  const [headerCopied, setHeaderCopied] = useState(false);

  const handleHeaderShare = async () => {
    const shareData = {
      title: 'etf500 - Análise de ETFs',
      text: 'Veja estatísticas completas, cotações em tempo real e compare ETFs de forma gratuita e sem fricção!',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setHeaderCopied(true);
        setTimeout(() => setHeaderCopied(false), 2000);
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setHeaderCopied(true);
        setTimeout(() => setHeaderCopied(false), 2000);
      } catch (clipErr) {
        console.error('Failed to copy', clipErr);
      }
    }
  };

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Ticker Tape */}
      <div className="w-full bg-slate-900 text-white border-b border-slate-950 py-2 px-4 overflow-hidden font-mono text-[11px] shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">COTAS REALTIME</span>
            <span className="hidden md:inline text-slate-500">| B3 & GLOBAL</span>
          </div>
          
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {highlightEtfs.map((etf) => {
              const isPositive = etf.daily_change >= 0;
              return (
                <button
                  key={etf.ticker}
                  onClick={() => onNavigate('etf', { ticker: etf.ticker })}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer text-left text-[11px]"
                  id={`ticker-tape-${etf.ticker.toLowerCase()}`}
                >
                  <span className="font-bold text-slate-200">{etf.ticker}</span>
                  <span className="text-slate-400 font-mono">
                    {etf.currency === 'USD' ? 'US$' : 'R$'} {etf.current_price.toFixed(2)}
                  </span>
                  <span className={`font-bold font-mono ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer text-left"
            id="nav-logo"
          >
            <span className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-500 font-sans">
              etf<span className="text-slate-900 dark:text-white">500</span>
            </span>
            <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/40">
              BR & US
            </span>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'home'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              id="tab-home"
            >
              <Compass size={16} />
              Início
            </button>
            <button
              onClick={() => onNavigate('screener')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'screener'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              id="tab-screener"
            >
              <BarChart3 size={16} />
              Screener
            </button>
            <button
              onClick={() => onNavigate('comparar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'comparar'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              id="tab-compare"
            >
              <ArrowRightLeft size={16} />
              Comparar
            </button>
            <button
              onClick={() => onNavigate('raio-x')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'raio-x'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              id="tab-raio-x"
            >
              <PieChart size={16} />
              Raio-X da Carteira
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Production Code Blueprint Info (Our expert guide button) */}
          <button
            onClick={onShowCodes}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/70 transition-all cursor-pointer"
            title="Ver Códigos da Arquitetura Next.js/Supabase"
            id="btn-architect-codes"
          >
            <Info size={14} />
            <span className="hidden sm:inline">Guia de Implantação B2B</span>
            <span className="inline sm:hidden">Dev</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            id="btn-theme-toggle"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Share Button with Fallback Clipboard Copy */}
          <div className="relative">
            <button
              onClick={handleHeaderShare}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title="Compartilhar análise atual"
              id="btn-header-share"
            >
              <Share2 size={18} />
            </button>
            {headerCopied && (
              <span className="absolute -bottom-10 right-0 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-50 animate-fade-in font-mono border border-slate-800">
                ✓ Link copiado!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Header Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 py-2">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-0.5 text-xs cursor-pointer ${
            currentView === 'home' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-tab-home"
        >
          <Compass size={16} />
          <span>Início</span>
        </button>
        <button
          onClick={() => onNavigate('screener')}
          className={`flex flex-col items-center gap-0.5 text-xs cursor-pointer ${
            currentView === 'screener' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-tab-screener"
        >
          <BarChart3 size={16} />
          <span>Screener</span>
        </button>
        <button
          onClick={() => onNavigate('comparar')}
          className={`flex flex-col items-center gap-0.5 text-xs cursor-pointer ${
            currentView === 'comparar' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-tab-compare"
        >
          <ArrowRightLeft size={16} />
          <span>Comparar</span>
        </button>
        <button
          onClick={() => onNavigate('raio-x')}
          className={`flex flex-col items-center gap-0.5 text-xs cursor-pointer ${
            currentView === 'raio-x' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-tab-raio-x"
        >
          <PieChart size={16} />
          <span>Raio-X</span>
        </button>
      </div>
    </header>
  );
}
