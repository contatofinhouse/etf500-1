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
import GestoraView from './components/GestoraView';
import InfoPagesView from './components/InfoPagesView';
import NoticiasView from './components/NoticiasView';
import { EtfDataProvider } from './context/EtfDataContext';
import { shareGeneralOnWhatsApp } from './utils/shareUtils';

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
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // General share handler for the footer and global actions
  const handleShare = () => {
    shareGeneralOnWhatsApp();
    setFooterCopied(true);
    setTimeout(() => setFooterCopied(false), 2500);
  };

  // Sync state with browser location/history query params and SEO titles
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

      // Canonicalize manager url param on initial page load / direct access
      if (params.manager) {
        const canonicalManager = params.manager
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim();
        
        if (canonicalManager !== params.manager) {
          params.manager = canonicalManager;
          searchParams.set('manager', canonicalManager);
          const cleanUrl = `${window.location.pathname}?${searchParams.toString()}`;
          window.history.replaceState({ view: viewParam, params }, '', cleanUrl);
        }
      }

      setCurrentView(viewParam);
      setExtraParams(params);

      // Route SEO titles & Global Schemas
      if (viewParam === 'home') {
        document.title = 'ETF500 | O Maior Portal e Rastreador de ETFs do Brasil e EUA';

        // Inject Home FAQ & WebSite JSON-LD Schema
        const schemaId = 'home-faq-schema';
        let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
        if (!scriptEl) {
          scriptEl = document.createElement('script');
          scriptEl.id = schemaId;
          scriptEl.type = 'application/ld+json';
          document.head.appendChild(scriptEl);
        }

        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "O que é um ETF e como funciona?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Um ETF (Exchange Traded Fund) é um fundo de índice negociado em bolsa como uma ação. Ele permite investir em uma carteira diversificada de ativos (como as 500 maiores empresas dos EUA via IVVB11/VOO) com baixas taxas de administração."
              }
            },
            {
              "@type": "Question",
              "name": "Como funciona o Imposto de Renda em ETFs no Brasil?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "ETFs de Ações têm alíquota fixa de 15% sobre o ganho de capital na venda. ETFs de Renda Fixa na B3 seguem a tabela regressiva ou alíquota fixa de 15% para prazos acima de 720 dias (como B5P211 e LFTS11)."
              }
            },
            {
              "@type": "Question",
              "name": "Qual a diferença entre IVVB11 (B3) e VOO (EUA)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O IVVB11 é negociado na B3 em Reais pela BlackRock Brasil. O VOO é negociado diretamente nas bolsas americanas em Dólar pela Vanguard. Ambos replicam o índice S&P 500."
              }
            }
          ]
        };

        scriptEl.textContent = JSON.stringify(faqSchema);
      } else if (viewParam === 'screener') {
        document.title = 'Screener de ETFs | Filtre e Compare Ativos da B3 e EUA — ETF500';
      } else if (viewParam === 'comparar') {
        document.title = 'Comparador de ETFs | Compare Rentabilidade e Taxas — ETF500';
      } else if (viewParam === 'raio-x') {
        document.title = 'Raio-X de Portfólio Global | Análise de Diversificação — ETF500';
      } else if (viewParam === 'gestora') {
        document.title = `${params.manager ? params.manager.toUpperCase() : 'Gestora'} | ETFs Geridos e Patrimônio — ETF500`;
      } else if (viewParam === 'noticias') {
        document.title = 'Notícias sobre ETFs Hoje | Mercado, B3 e EUA — ETF500';
      }

      // Track GA4 SPA pageview
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', 'G-SE4NLVX5D7', {
          page_path: window.location.pathname + window.location.search,
          page_title: document.title,
        });
      }
    };

    handleUrlParsing();
    window.addEventListener('popstate', handleUrlParsing);
    return () => window.removeEventListener('popstate', handleUrlParsing);
  }, []);

  // Custom navigation handler supporting standard back navigation
  const navigate = (view: string, params: Record<string, string> = {}) => {
    // Canonicalize manager params (e.g. 'itaú' -> 'itau') to prevent duplicate URL pages
    const cleanedParams: Record<string, string> = { ...params };
    if (cleanedParams.manager) {
      cleanedParams.manager = cleanedParams.manager
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip accents (itaú -> itau)
        .toLowerCase()
        .trim();
    }

    setCurrentView(view);
    setExtraParams(cleanedParams);

    const searchParams = new URLSearchParams();
    searchParams.set('view', view);
    Object.entries(cleanedParams).forEach(([key, val]) => {
      searchParams.set(key, val);
    });

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ view, params: cleanedParams }, '', newUrl);
    
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
    <EtfDataProvider>
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
              fromView={extraParams.from}
              fromManager={extraParams.manager}
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

          {currentView === 'gestora' && (
            <GestoraView
              managerId={extraParams.manager || ''}
              onNavigate={navigate}
            />
          )}

          {currentView === 'noticias' && (
            <NoticiasView onNavigate={navigate} />
          )}

          {['privacidade', 'termos', 'contato', 'suporte', 'quem-somos'].includes(currentView) && (
            <InfoPagesView
              page={currentView}
              onNavigate={navigate}
            />
          )}
        </main>

        {/* Footer section */}
        <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 mt-auto transition-colors duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            
            {/* Logo/Disclaimer col */}
            <div className="space-y-3.5 md:col-span-1">
              <span className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-500 font-sans">
                etf<span className="text-slate-900 dark:text-white">500</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                etf500 é uma plataforma aberta, 100% gratuita para investidores brasileiros interessados em fundos de índice da B3 e bolsas americanas. Sem cadastros, sem mensalidades.
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans font-medium">
                Built proudly by ETF500.com.br 60.806.192.0001/50. Todos os Direitos Reservados.
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

            {/* Institutional & Legal links col */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">
                Institucional & Legal
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => navigate('quem-somos')} className="hover:text-blue-600 transition-colors cursor-pointer" id="footer-link-quem-somos">
                    Quem somos
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('contato')} className="hover:text-blue-600 transition-colors cursor-pointer" id="footer-link-contato">
                    Contato
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('suporte')} className="hover:text-blue-600 transition-colors cursor-pointer" id="footer-link-suporte">
                    Suporte & FAQ
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('privacidade')} className="hover:text-blue-600 transition-colors cursor-pointer" id="footer-link-privacidade">
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('termos')} className="hover:text-blue-600 transition-colors cursor-pointer" id="footer-link-termos">
                    Termos de Uso
                  </button>
                </li>
              </ul>
            </div>

            {/* B2B / Legal warning */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">
                Isenção de Responsabilidade
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                As cotações apresentadas referem-se ao fechamento estatístico do dia útil anterior. Este portal não realiza recomendações de compra ou venda de valores mobiliários.
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
    </EtfDataProvider>
  );
}
