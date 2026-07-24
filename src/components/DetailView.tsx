/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Star, RefreshCw, Landmark, Globe, Receipt, AlertCircle, ArrowLeft, TrendingUp, TrendingDown, HelpCircle, ArrowRight, Wallet, Percent, Tag, Loader2, BarChart3, Share2 } from 'lucide-react';
import { ETF, HistoricalPrice } from '../types';
import { generateHistory, US_TO_BRL_RATE } from '../data/etfData';
import { fetchRealHistory, TimeFrame } from '../services/yahooFinanceApi';
import { useEtfData } from '../context/EtfDataContext';
import { shareEtfOnWhatsApp } from '../utils/shareUtils';

interface DetailViewProps {
  ticker: string;
  fromView?: string;
  fromManager?: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

export default function DetailView({ ticker, fromView, fromManager, onNavigate }: DetailViewProps) {
  const { etfs: ETFS_LIST } = useEtfData();

  const handleBack = () => {
    if (fromView === 'screener') {
      onNavigate('screener');
    } else if (fromView === 'gestora' && fromManager) {
      onNavigate('gestora', { manager: fromManager });
    } else if (fromView === 'home') {
      onNavigate('home');
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        onNavigate('screener');
      }
    }
  };

  // Find current ETF
  const etf = useMemo(() => {
    return ETFS_LIST.find(e => e.ticker.toUpperCase() === ticker.toUpperCase()) || ETFS_LIST[0];
  }, [ticker, ETFS_LIST]);

  // Favorites state
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('etf500_favorites');
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsFavorite(parsed.includes(etf.ticker));
    }
  }, [etf.ticker]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem('etf500_favorites');
    let current: string[] = saved ? JSON.parse(saved) : [];
    if (current.includes(etf.ticker)) {
      current = current.filter(t => t !== etf.ticker);
      setIsFavorite(false);
    } else {
      current.push(etf.ticker);
      setIsFavorite(true);
    }
    localStorage.setItem('etf500_favorites', JSON.stringify(current));
  };

  // SEO Programático: Injeção de Dados Estruturados JSON-LD (FinancialProduct & BreadcrumbList)
  useEffect(() => {
    const jsonLdId = `json-ld-${etf.ticker.toLowerCase()}`;
    let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;

    const financialProductSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": etf.name,
      "tickerSymbol": etf.ticker,
      "description": etf.description,
      "feesAndCommissionsSpecification": `Taxa de Administração de ${etf.expense_ratio}% a.a.`,
      "currency": etf.currency,
      "offers": {
        "@type": "Offer",
        "price": etf.current_price,
        "priceCurrency": etf.currency
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://etf500.com.br"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Screener",
          "item": "https://etf500.com.br/?view=screener"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": etf.ticker,
          "item": `https://etf500.com.br/?view=etf&ticker=${etf.ticker}`
        }
      ]
    };

    // Dynamic SEO title & description
    document.title = `${etf.ticker} — Cotação, Desempenho e Composição | ETF500`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const summaryText = `O ${etf.ticker} (${etf.name}) é um ETF listado na B3 negociado atualmente em ${etf.currency === 'USD' ? 'US$' : 'R$'} ${etf.current_price.toFixed(2)}, com variação de ${etf.daily_change >= 0 ? '+' : ''}${etf.daily_change.toFixed(2)}% hoje. ${etf.description} Taxa de administração de ${etf.expense_ratio}% a.a.`;
      metaDesc.setAttribute('content', summaryText);
    }

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = jsonLdId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = JSON.stringify([financialProductSchema, breadcrumbSchema]);

    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [etf]);

  // Timeframe selector
  const [timeframe, setTimeframe] = useState<TimeFrame>('1Y');

  // Convert timeline to display label
  const timelineLabel = {
    '1M': 'Último Mês',
    '6M': 'Últimos 6 Meses',
    '1Y': 'Último Ano',
    '5Y': 'Últimos 5 Anos',
    'MAX': 'Histórico Completo'
  }[timeframe];

  // Dynamic Investment Simulator state
  const [simulatedAmountInput, setSimulatedAmountInput] = useState<string>('10000');

  // Benchmark overlay toggles for the chart
  const [showCDI, setShowCDI] = useState<boolean>(false);
  const [showIBOV, setShowIBOV] = useState<boolean>(false);
  const [showSP500, setShowSP500] = useState<boolean>(false);

  // Real Historical Data & Loading state
  const [historyData, setHistoryData] = useState<HistoricalPrice[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingHistory(true);

    fetchRealHistory(etf.ticker, timeframe)
      .then((data) => {
        if (isMounted && data && data.length >= 2) {
          setHistoryData(data);
        }
      })
      .catch((e) => {
        console.warn('Failed to fetch real history:', e);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [etf.ticker, timeframe]);

  // Period performance calculation
  const periodStats = useMemo(() => {
    if (historyData.length < 2) {
      return { returnPct: etf.daily_change, startPrice: etf.current_price, endPrice: etf.current_price };
    }
    const startPrice = historyData[0].close_price;
    const endPrice = historyData[historyData.length - 1].close_price;
    const returnPct = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : etf.daily_change;
    return { returnPct, startPrice, endPrice };
  }, [historyData, etf]);

  // Dynamic simulation values
  const simValue = parseFloat(simulatedAmountInput) || 0;
  const simResult = simValue * (1 + periodStats.returnPct / 100);
  const simProfit = simResult - simValue;

  // Real Benchmark Data states
  const [realIbovHistory, setRealIbovHistory] = useState<HistoricalPrice[]>([]);
  const [realSp500History, setRealSp500History] = useState<HistoricalPrice[]>([]);
  const [realCdiHistory, setRealCdiHistory] = useState<HistoricalPrice[]>([]);

  // Fetch Real Benchmarks from yfinance / Supabase when toggled or timeframe changes
  useEffect(() => {
    let isMounted = true;
    
    // Fetch Real Ibovespa (^BVSP)
    fetchRealHistory('^BVSP', timeframe).then((data) => {
      if (isMounted && data.length > 0) setRealIbovHistory(data);
    });

    // Fetch Real S&P 500 (IVVB11 / ^GSPC)
    fetchRealHistory('IVVB11', timeframe).then((data) => {
      if (isMounted && data.length > 0) setRealSp500History(data);
    });

    // Fetch Official Real CDI (Banco Central do Brasil)
    fetchRealHistory('CDI', timeframe).then((data) => {
      if (isMounted && data.length > 0) setRealCdiHistory(data);
    });

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  // Benchmark Series Generation (Normalized to start at ETF startPrice for 100% accurate visual comparison)
  const benchmarkSeries = useMemo(() => {
    if (historyData.length < 2) return { cdi: [], ibov: [], sp500: [] };

    const startPrice = historyData[0].close_price;
    const totalDays = historyData.length;

    // Helper to align & rebase a real raw price series to the current ETF start price
    const normalizeSeries = (rawSeries: HistoricalPrice[]) => {
      if (!rawSeries || rawSeries.length < 2) return [];
      const basePrice = rawSeries[0].close_price;
      if (basePrice <= 0) return [];

      return historyData.map((etfPoint, idx) => {
        // Find closest date in benchmark series
        const benchMatch = rawSeries[Math.min(idx, rawSeries.length - 1)];
        const benchRatio = benchMatch ? benchMatch.close_price / basePrice : 1;
        return startPrice * benchRatio;
      });
    };

    const cdi = normalizeSeries(realCdiHistory);
    const ibov = normalizeSeries(realIbovHistory);
    const sp500 = normalizeSeries(realSp500History);

    return { cdi, ibov, sp500 };
  }, [historyData, realCdiHistory, realIbovHistory, realSp500History]);

  // SVG Chart Dimensions Tracking using ResizeObserver
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 320 });

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setChartDimensions({
          width: Math.max(width, 300),
          height: 300
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Hover chart tooltip tracking
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Compute stats of historical prices for graphing (including enabled benchmarks)
  const chartStats = useMemo(() => {
    if (historyData.length === 0) return { min: 0, max: 100, range: 100 };
    let prices = historyData.map(h => h.close_price);
    
    if (showCDI && benchmarkSeries.cdi.length > 0) prices = prices.concat(benchmarkSeries.cdi);
    if (showIBOV && benchmarkSeries.ibov.length > 0) prices = prices.concat(benchmarkSeries.ibov);
    if (showSP500 && benchmarkSeries.sp500.length > 0) prices = prices.concat(benchmarkSeries.sp500);

    const min = Math.min(...prices) * 0.98;
    const max = Math.max(...prices) * 1.02;
    const rawRange = max - min;
    const range = rawRange === 0 ? 1 : rawRange;
    return { min, max, range };
  }, [historyData, showCDI, showIBOV, showSP500, benchmarkSeries]);

  // Helper to build SVG Path for any series
  const buildSvgPath = (values: number[]) => {
    if (values.length < 2) return '';
    const { width, height } = chartDimensions;
    const paddingLeft = 10;
    const paddingRight = 60;
    const paddingTop = 20;
    const paddingBottom = 20;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    const points = values.map((val, index) => {
      const x = paddingLeft + (index / (values.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((val - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Main ETF line path
  const svgPath = useMemo(() => {
    return buildSvgPath(historyData.map(h => h.close_price));
  }, [historyData, chartDimensions, chartStats]);

  // Benchmark Paths
  const cdiPath = useMemo(() => buildSvgPath(benchmarkSeries.cdi), [benchmarkSeries.cdi, chartDimensions, chartStats]);
  const ibovPath = useMemo(() => buildSvgPath(benchmarkSeries.ibov), [benchmarkSeries.ibov, chartDimensions, chartStats]);
  const sp500Path = useMemo(() => buildSvgPath(benchmarkSeries.sp500), [benchmarkSeries.sp500, chartDimensions, chartStats]);

  // Area path below line
  const svgAreaPath = useMemo(() => {
    if (historyData.length < 2) return '';
    const { width, height } = chartDimensions;
    const paddingLeft = 10;
    const paddingRight = 60;
    const paddingTop = 20;
    const paddingBottom = 20;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    const points = historyData.map((d, index) => {
      const x = paddingLeft + (index / (historyData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((d.close_price - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const startX = paddingLeft;
    const startY = height - paddingBottom;
    const endX = paddingLeft + graphWidth;
    const endY = height - paddingBottom;

    return `M ${startX},${startY} L ${points.join(' L ')} L ${endX},${endY} Z`;
  }, [historyData, chartDimensions, chartStats]);

  // Handle Chart Hover interaction
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (historyData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const paddingLeft = 10;
    const paddingRight = 60;
    const graphWidth = chartDimensions.width - paddingLeft - paddingRight;

    // find closest index
    const relativeX = x - paddingLeft;
    let index = Math.round((relativeX / graphWidth) * (historyData.length - 1));
    if (index < 0) index = 0;
    if (index >= historyData.length) index = historyData.length - 1;

    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredPoint = hoverIndex !== null ? historyData[hoverIndex] : null;
  const currentPriceDisplay = hoveredPoint ? hoveredPoint.close_price : etf.current_price;
  const isVariationPositive = etf.daily_change >= 0;

  return (
    <div className="w-full space-y-6 animate-fade-in" id={`etf-detail-${etf.ticker.toLowerCase()}`}>
      
      {/* Back button and navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs"
          id="btn-back-to-origin"
        >
          <ArrowLeft size={14} />
          <span>
            {fromView === 'screener'
              ? 'Voltar ao Screener de ETFs'
              : fromView === 'gestora'
              ? 'Voltar à Gestora'
              : fromView === 'home'
              ? 'Voltar à Página Inicial'
              : 'Voltar ao Screener de ETFs'}
          </span>
        </button>
      </div>

      {/* Asset Core Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-lg font-black rounded font-mono border border-slate-200 dark:border-slate-700 shadow-sm">
              {etf.ticker}
            </span>
            
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
              etf.market === 'BR' ? 'bg-green-100 dark:bg-green-950/55 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-950/55 text-blue-700 dark:text-blue-400'
            }`}>
              {etf.market === 'BR' ? 'B3 • Brasil' : 'NASDAQ/NYSE • EUA'}
            </span>

            {/* Link para a gestora */}
            {etf.manager && (
              <button
                onClick={() => onNavigate('gestora', { manager: etf.manager })}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-slate-900 text-white dark:bg-slate-800 rounded-md hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors cursor-pointer"
                title={`Ver todos os ETFs da gestora ${etf.manager}`}
              >
                <span>Gestora: {etf.manager}</span>
              </button>
            )}

            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
              id="btn-favorite-asset"
            >
              <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? 'Favoritado' : 'Salvar Favorito'}
            </button>

            {/* Quick compare shortcut */}
            <button
              onClick={() => onNavigate('comparar', { shortcut: etf.ticker })}
              className="px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-blue-200/40 dark:border-slate-700 text-blue-600 dark:text-blue-400 rounded-md transition-colors cursor-pointer"
            >
              Comparar este ETF
            </button>

            {/* Discret WhatsApp share button aligned with site palette */}
            <button
              onClick={() => shareEtfOnWhatsApp(etf)}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
              title="Compartilhar análise formatada para grupos de Tesouraria no WhatsApp"
              id="btn-share-whatsapp-detail"
            >
              <Share2 size={13} className="text-slate-500 dark:text-slate-400" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {etf.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Categoria: <strong className="text-slate-700 dark:text-slate-300">{etf.sector}</strong></span>
              <span>•</span>
              <span>Moeda: <strong className="text-slate-700 dark:text-slate-300">{etf.currency}</strong></span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold">
                {etf.sector?.includes('Renda Fixa') ? 'Tributação: 15% IR (720+ dias)' : 'Tributação: 15% Venda Lote'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Metrics Card */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">
              {hoveredPoint ? 'Preço Selecionado' : 'Cotação Fechamento'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {etf.currency === 'USD' ? '$' : 'R$'} {currentPriceDisplay.toFixed(2)}
              </span>
              {etf.currency === 'USD' && (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  (~R$ {(currentPriceDisplay * US_TO_BRL_RATE).toFixed(2)})
                </span>
              )}
            </div>
            {hoveredPoint ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Data: {hoveredPoint.date}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold">
                <span className={`font-mono inline-flex items-center gap-0.5 ${
                  isVariationPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {isVariationPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isVariationPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">Hoje</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              setIsLoadingHistory(true);
              fetchRealHistory(etf.ticker, timeframe)
                .then((data) => {
                  if (data && data.length >= 2) setHistoryData(data);
                })
                .finally(() => setIsLoadingHistory(false));
            }}
            className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group"
            title="Atualizar cotações do período"
            id="btn-refresh-quotes"
          >
            <RefreshCw size={18} className={`transition-transform duration-500 ${isLoadingHistory ? 'animate-spin text-blue-500' : 'group-hover:rotate-180'}`} />
          </button>
        </div>
      </section>

      {/* SEO Executive Summary (Featured Snippet Paragraph) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-mono">
              Resumo Executivo • {etf.ticker}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            O <strong>{etf.ticker}</strong> ({etf.name}) é um ETF listado na B3 negociado atualmente em <strong>{etf.currency === 'USD' ? 'US$' : 'R$'} {etf.current_price.toFixed(2)}</strong>, registrando uma variação de <strong className={isVariationPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{isVariationPositive ? '+' : ''}{etf.daily_change.toFixed(2)}%</strong> no dia. {etf.description} Possui taxa de administração de <strong>{etf.expense_ratio}% a.a.</strong>{etf.manager ? <>, gerido pela <button onClick={() => onNavigate('gestora', { manager: etf.manager })} className="font-bold underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer">{etf.manager}</button></> : ''} e tributação aplicada à categoria de <strong>{etf.sector}</strong>.
          </p>
        </div>
      </section>

      {/* Main Content Layout with sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left 3 columns: Interactive Chart and Description */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Interactive Chart Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Gráfico Financeiro Histórico
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    periodStats.returnPct >= 0 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900' 
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                  }`}>
                    {periodStats.returnPct >= 0 ? '+' : ''}{periodStats.returnPct.toFixed(2)}% no período
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {timelineLabel} • Preço Inicial: {etf.currency === 'USD' ? '$' : 'R$'} {periodStats.startPrice.toFixed(2)} ➔ Atual: {etf.currency === 'USD' ? '$' : 'R$'} {periodStats.endPrice.toFixed(2)}
                </p>
              </div>

              {/* Timeframe Selectors */}
              <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                {(['1M', '6M', '1Y', '5Y', 'MAX'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTimeframe(t); setHoverIndex(null); }}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-md transition-all cursor-pointer ${
                      timeframe === t
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Benchmark Overlay Toggles Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-blue-500" />
                Comparar no gráfico:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowCDI(!showCDI)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    showCDI
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${showCDI ? 'bg-white' : 'bg-emerald-500'}`}></span>
                  CDI (Renda Fixa)
                </button>

                <button
                  onClick={() => setShowIBOV(!showIBOV)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    showIBOV
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${showIBOV ? 'bg-white' : 'bg-amber-500'}`}></span>
                  Ibovespa (IBOV)
                </button>

                <button
                  onClick={() => setShowSP500(!showSP500)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    showSP500
                      ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${showSP500 ? 'bg-white' : 'bg-purple-600'}`}></span>
                  S&P 500 (SPX)
                </button>
              </div>
            </div>

            {/* Responsive SVG Chart */}
            <div 
              ref={chartContainerRef}
              className="relative select-none min-h-[300px]"
              id="detail-chart-wrapper"
            >
              {isLoadingHistory && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 space-y-2 rounded-lg">
                  <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={28} />
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                    Carregando cotações reais do período...
                  </span>
                </div>
              )}
              <svg
                width={chartDimensions.width}
                height={chartDimensions.height}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="cursor-crosshair overflow-visible"
              >
                {/* Definitions for Gradients */}
                <defs>
                  <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const y = 20 + p * (chartDimensions.height - 40);
                  const val = chartStats.max - p * chartStats.range;
                  return (
                    <g key={i} className="opacity-40 dark:opacity-20">
                      <line
                        x1={10}
                        y1={y}
                        x2={chartDimensions.width - 60}
                        y2={y}
                        stroke="#94a3b8"
                        strokeWidth={1}
                        strokeDasharray="3,3"
                      />
                      <text
                        x={chartDimensions.width - 55}
                        y={y + 4}
                        fontSize={9}
                        fontFamily="monospace"
                        className="fill-slate-400"
                      >
                        {val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area Below Path */}
                <path
                  d={svgAreaPath}
                  fill="url(#chartAreaGradient)"
                />

                {/* Benchmark Lines (if toggled) */}
                {showCDI && (
                  <path
                    d={cdiPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4,2"
                  />
                )}

                {showIBOV && (
                  <path
                    d={ibovPath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                )}

                {showSP500 && (
                  <path
                    d={sp500Path}
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth={2}
                  />
                )}

                {/* Main line path */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Crosshair & Hover Tooltip */}
                {hoverIndex !== null && hoveredPoint && (
                  <g>
                    {/* Vertical line marker */}
                    <line
                      x1={10 + (hoverIndex / (historyData.length - 1)) * (chartDimensions.width - 70)}
                      y1={10}
                      x2={10 + (hoverIndex / (historyData.length - 1)) * (chartDimensions.width - 70)}
                      y2={chartDimensions.height - 20}
                      stroke="#4f46e5"
                      strokeWidth={1.5}
                      strokeDasharray="2,2"
                    />

                    {/* Circular intersection point */}
                    <circle
                      cx={10 + (hoverIndex / (historyData.length - 1)) * (chartDimensions.width - 70)}
                      cy={20 + (chartDimensions.height - 40) - ((hoveredPoint.close_price - chartStats.min) / chartStats.range) * (chartDimensions.height - 40)}
                      r={5}
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  </g>
                )}
              </svg>

              {/* Floating Tooltip HTML Overlay */}
              {hoverIndex !== null && hoveredPoint && (
                <div 
                  className="absolute top-2 bg-slate-900/95 text-white border border-slate-700/60 rounded p-2.5 shadow-xl text-xs font-mono z-10 pointer-events-none"
                  style={{
                    left: `${Math.min(
                      Math.max(
                        10 + (hoverIndex / (historyData.length - 1)) * (chartDimensions.width - 70) - 60, 
                        10
                      ), 
                      chartDimensions.width - 160
                    )}px`
                  }}
                >
                  <div className="text-slate-400 font-semibold">{hoveredPoint.date}</div>
                  <div className="text-sm font-black mt-0.5 text-blue-400">
                    {etf.currency === 'USD' ? '$' : 'R$'} {hoveredPoint.close_price.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Vol: {(hoveredPoint.volume / 1000).toFixed(0)}K
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Simulador de Rentabilidade Histórica Dinâmico */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Simulador Dinâmico de Retorno Histórico ({timelineLabel})
              </h3>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                Calculado no Período
              </span>
            </div>

            {/* Input de valor, atalhos rápidos e seletores de prazo */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[180px] space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-300 uppercase block">
                    Valor Inicial Aplicado (R$)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="500"
                    value={simulatedAmountInput}
                    onChange={(e) => setSimulatedAmountInput(e.target.value)}
                    className="w-full text-sm font-mono font-bold bg-slate-950/80 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:border-blue-400"
                    placeholder="10000"
                  />
                </div>

                {/* Seletores de valor rápido */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-300 uppercase block">
                    Atalhos de Valor
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1000, 5000, 10000, 50000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setSimulatedAmountInput(preset.toString())}
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded cursor-pointer transition-all ${
                          simValue === preset
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        R$ {(preset / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seletores de prazo dedicados do simulador */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-300 font-bold">
                  Selecione o Prazo da Simulação:
                </span>

                <div className="flex bg-slate-950/80 rounded-md p-1 border border-slate-700 gap-1">
                  {(['1M', '6M', '1Y', '5Y', 'MAX'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTimeframe(t); setHoverIndex(null); }}
                      className={`px-3 py-1 text-xs font-bold font-mono rounded transition-all cursor-pointer ${
                        timeframe === t
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === '1M' ? '1 Mês' : t === '6M' ? '6 Meses' : t === '1Y' ? '12 Meses (1Y)' : t === '5Y' ? '5 Anos' : 'Máximo'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resultados dinâmicos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-[10px] text-slate-300 block uppercase font-mono">Valor Inicial</span>
                <span className="text-base font-black font-mono mt-0.5 block">
                  R$ {simValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-[10px] text-slate-300 block uppercase font-mono">Saldo Final Acumulado</span>
                <span className={`text-base font-black font-mono mt-0.5 block ${
                  periodStats.returnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  R$ {simResult.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-[10px] text-slate-300 block uppercase font-mono">Lucro / Prejuízo Obteve</span>
                <span className={`text-base font-black font-mono mt-0.5 block ${
                  periodStats.returnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {simProfit >= 0 ? '+' : ''}R$ {simProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-normal ml-1 font-sans">
                    ({periodStats.returnPct >= 0 ? '+' : ''}{periodStats.returnPct.toFixed(2)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* ETF Description and Technical details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Perfil e Objetivo de Investimento
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {etf.description}
            </p>
          </div>

          {/* Holdings / Portfolio Composition */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Composição do Portfólio (Principais Ativos)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {etf.holdings.length} Ativos declarados
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="holdings-list">
              {etf.holdings.map((hold, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center font-mono text-slate-600 dark:text-slate-400">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px] sm:max-w-[200px]">
                      {hold.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white bg-blue-50 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                    {hold.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 column: Stats sidebar, Brokerage promo, Calculator, Ad Slot */}
        <div className="space-y-6">
          
          {/* Main Key Statistics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5">
              Especificações Técnicas
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  Taxa de Admin. (Expense Ratio)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {etf.expense_ratio.toFixed(2)}% a.a.
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">
                  Dividend Yield
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {etf.dividend_yield > 0 ? `${etf.dividend_yield.toFixed(2)}% a.a.` : 'Isento (Reinveste)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">
                  Moeda Nativa
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  {etf.currency === 'USD' ? <Globe size={12} className="text-blue-500" /> : <Landmark size={12} className="text-green-600" />}
                  {etf.currency}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">
                  Patrimônio Líquido (AUM)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {etf.currency === 'USD' ? 'US$ ' : 'R$ '}
                  {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                </span>
              </div>
            </div>
          </div>

          {/* ETFs Relacionados / Semelhantes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>ETFs Relacionados</span>
              <Tag size={12} />
            </h3>

            <div className="space-y-2">
              {ETFS_LIST
                .filter(e => e.ticker !== etf.ticker && (e.sector === etf.sector || e.market === etf.market))
                .slice(0, 4)
                .map(rel => (
                  <div
                    key={rel.ticker}
                    onClick={() => onNavigate('etf', { ticker: rel.ticker })}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 group-hover:underline">
                          {rel.ticker}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {rel.currency}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] block">
                        {rel.name}
                      </span>
                    </div>

                    <span className={`text-xs font-mono font-bold ${
                      rel.daily_change >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {rel.daily_change >= 0 ? '+' : ''}{rel.daily_change.toFixed(2)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
