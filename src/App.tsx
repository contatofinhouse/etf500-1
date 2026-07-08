/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ScreenerView from './components/ScreenerView';
import DetailView from './components/DetailView';
import CompareView from './components/CompareView';
import RaioXView from './components/RaioXView';
import StaticCodesGuide from './components/StaticCodesGuide';

export default function App() {
  // Navigation Router state
  const [currentView, setCurrentView] = useState<string>('home');
  const [extraParams, setExtraParams] = useState<Record<string, string>>({});

  // Theme control: Default is LIGHT mode (Fricção Zero) as requested
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('etf500_theme');
    return saved === 'dark'; // returns false by default, enabling light mode
  });

  // Technical guide overlay toggle
  const [showCodes, setShowCodes] = useState<boolean>(false);

  // Footer share feedback
  const [footerCopied, setFooterCopied] = useState<boolean>(false);

  // Sync state with DOM document element to fix theme styling bugs across different systems
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // General share handler for the footer
  const handleShare = async () => {
    const shareData = {
      title: 'etf500 - Rastreador de ETFs',
      text: 'Confira as análises e comparações de ETFs brasileiros e globais no etf500!',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setFooterCopied(true);
        setTimeout(() => setFooterCopied(false), 2000);
      }
    } catch (err) {
      // Fallback in case Web Share sheets are blocked/rejected
      try {
        await navigator.clipboard.writeText(window.location.href);
        setFooterCopied(true);
        setTimeout(() => setFooterCopied(false), 2000);
      } catch (clipErr) {
        console.error('Failed to copy', clipErr);
      }
    }
  };

  // Sync state with browser location/history query params
  useEffect(() => {
    const handleUrlParsing = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const viewParam = searchParams.get('view') || 'home';
      
      const params: Record<string, string> = {};
      searchParams.forEach((val, key) => {
        if (key !== 'view') {
          params[key] = val;
        }
      });

      setCurrentView(viewParam);
      setExtraParams(params);
    };

    handleUrlParsing();
    window.addEventListener('popstate', handleUrlParsing);
    return () => window.removeEventListener('popstate', handleUrlParsing);
  }, []);

  // Custom navigation handler supporting standard back navigation
  const navigate = (view: string, params: Record<string, string> = {}) => {
    setCurrentView(view);
    setExtraParams(params);

    const searchParams = new URLSearchParams();
    searchParams.set('view', view);
    Object.entries(params).forEach(([key, val]) => {
      searchParams.set(key, val);
    });

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ view, params }, '', newUrl);
    
    // Smooth scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const newVal = !prev;
      localStorage.setItem('etf500_theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  };

  return (
    <div className={isDark ? 'dark' : ''} id="app-theme-wrapper">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          onNavigate={navigate}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onShowCodes={() => setShowCodes(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full py-6 pb-20">
          {currentView === 'home' && (
            <HomeView onNavigate={navigate} />
          )}

          {currentView === 'screener' && (
            <ScreenerView
              initialShortcut={extraParams.shortcut}
              onNavigate={navigate}
            />
          )}

          {currentView === 'etf' && (
            <DetailView
              ticker={extraParams.ticker || 'IVVB11'}
              onNavigate={navigate}
            />
          )}

          {currentView === 'comparar' && (
            <CompareView
              initialTickerA={extraParams.shortcut}
              onNavigate={navigate}
            />
          )}

          {currentView === 'raio-x' && (
            <RaioXView />
          )}
        </main>

        {/* Footer section */}
        <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 mt-auto transition-colors duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            
            {/* Logo/Disclaimer col */}
            <div className="space-y-3.5">
              <span className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-500 font-sans">
                etf<span className="text-slate-900 dark:text-white">500</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                etf500 é uma plataforma aberta, 100% gratuita para investidores brasileiros interessados em fundos de índice da B3 e bolsas americanas. Sem cadastros, sem mensalidades.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                © {new Date().getFullYear()} etf500. Todos os direitos reservados.
              </div>
              <div className="pt-2 relative">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded transition-all cursor-pointer"
                  id="btn-footer-share"
                >
                  <Share2 size={13} />
                  <span>Compartilhar Plataforma</span>
                </button>
                {footerCopied && (
                  <span className="absolute -top-7 left-0 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded shadow-md whitespace-nowrap z-50 animate-fade-in font-mono">
                    ✓ Link copiado!
                  </span>
                )}
              </div>
            </div>

            {/* Quick links col */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">
                Recursos da Plataforma
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => navigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer">
                    Página Inicial & Top 10 Altas
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('screener')} className="hover:text-blue-600 transition-colors cursor-pointer">
                    Screener Avançado de Ativos
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('comparar')} className="hover:text-blue-600 transition-colors cursor-pointer">
                    Comparador de Rentabilidade Relativa
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('raio-x')} className="hover:text-blue-600 transition-colors cursor-pointer">
                    Raio-X de Portfólio & Diagnóstico
                  </button>
                </li>
              </ul>
            </div>

            {/* B2B / Legal warning */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">
                Aviso Legal & Monetização
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>Isenção de Responsabilidade:</strong> As cotações apresentadas referem-se ao fechamento do dia útil anterior fornecido de forma estatística. Este portal não realiza recomendações de compra ou venda de valores mobiliários.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Este site é monetizado de forma transparente por injeção de anúncios programáticos B2B e links afiliados com corretoras globais reguladas (Nomad/Avenue).
              </p>
            </div>

          </div>
        </footer>

        {/* Technical Architecture Codes overlay drawer */}
        {showCodes && (
          <StaticCodesGuide onClose={() => setShowCodes(false)} />
        )}

      </div>
    </div>
  );
}
