/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRightLeft, Info, HelpCircle, Check, Sparkles, TrendingUp, TrendingDown, DollarSign, Loader2, Share2, Award, Zap, BarChart3, Repeat } from 'lucide-react';
import { ETF, HistoricalPrice } from '../types';
import { useEtfData } from '../context/EtfDataContext';
import { US_TO_BRL_RATE } from '../data/etfData';
import { fetchRealHistory, TimeFrame } from '../services/yahooFinanceApi';
import { shareCompareOnWhatsApp } from '../utils/shareUtils';

interface CompareViewProps {
  initialTickerA?: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

export default function CompareView({ initialTickerA, onNavigate }: CompareViewProps) {
  const { etfs: ETFS_LIST } = useEtfData();
  
  // Selectors State
  const [tickerA, setTickerA] = useState<string>('IVVB11');
  const [tickerB, setTickerB] = useState<string>('VOO');

  useEffect(() => {
    if (initialTickerA) {
      setTickerA(initialTickerA);
      if (initialTickerA === 'IVVB11') setTickerB('VOO');
      else if (initialTickerA === 'VOO') setTickerB('IVVB11');
      else if (initialTickerA === 'BOVA11') setTickerB('SMAL11');
      else if (initialTickerA === 'QQQ') setTickerB('VOO');
      else {
        const counter = ETFS_LIST.find(e => e.ticker !== initialTickerA);
        if (counter) setTickerB(counter.ticker);
      }
    }
  }, [initialTickerA, ETFS_LIST]);

  const etfA = useMemo(() => ETFS_LIST.find(e => e.ticker === tickerA) || ETFS_LIST[0], [tickerA, ETFS_LIST]);
  const etfB = useMemo(() => ETFS_LIST.find(e => e.ticker === tickerB) || ETFS_LIST[1], [tickerB, ETFS_LIST]);

  // Programmatic SEO: Dynamic Document Title, Description & JSON-LD Schemas for Comparisons
  useEffect(() => {
    if (!etfA || !etfB) return;
    
    document.title = `${etfA.ticker} vs ${etfB.ticker}: Qual ETF Vale Mais a Pena? Taxas e Retorno | ETF500`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const summaryText = `Comparativo completo entre ${etfA.ticker} (${etfA.name}) e ${etfB.ticker} (${etfB.name}). Veja taxa de administração (${etfA.expense_ratio}% vs ${etfB.expense_ratio}%), rentabilidade histórica, patrimônio líquido e dividend yield.`;
      metaDesc.setAttribute('content', summaryText);
    }

    const jsonLdId = `json-ld-compare-${etfA.ticker.toLowerCase()}-${etfB.ticker.toLowerCase()}`;
    let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Qual a diferença de taxa entre ${etfA.ticker} e ${etfB.ticker}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `O ${etfA.ticker} possui taxa de administração de ${etfA.expense_ratio}% a.a., enquanto o ${etfB.ticker} possui taxa de ${etfB.expense_ratio}% a.a.`
          }
        },
        {
          "@type": "Question",
          "name": `Qual a custódia do ${etfA.ticker} e ${etfB.ticker}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `O ${etfA.ticker} é negociado no mercado ${etfA.market === 'BR' ? 'brasileiro (B3 em Reais)' : 'americano (EUA em Dólar)'}, enquanto o ${etfB.ticker} é negociado no mercado ${etfB.market === 'BR' ? 'brasileiro (B3 em Reais)' : 'americano (EUA em Dólar)'}.`
          }
        }
      ]
    };

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = jsonLdId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = JSON.stringify(faqSchema);

    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [etfA, etfB]);

  // Swap ETFs handler
  const handleSwap = () => {
    setTickerA(tickerB);
    setTickerB(tickerA);
  };

  // Comparison Timeframe
  const [timeframe, setTimeframe] = useState<TimeFrame>('1Y');

  // Real Histories state & Loading
  const [historyA, setHistoryA] = useState<HistoricalPrice[]>([]);
  const [historyB, setHistoryB] = useState<HistoricalPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Benchmarks state for comparison
  const [showCDI, setShowCDI] = useState<boolean>(false);
  const [showIBOV, setShowIBOV] = useState<boolean>(false);
  const [cdiHistory, setCdiHistory] = useState<HistoricalPrice[]>([]);
  const [ibovHistory, setIbovHistory] = useState<HistoricalPrice[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetchRealHistory(etfA.ticker, timeframe),
      fetchRealHistory(etfB.ticker, timeframe),
      fetchRealHistory('CDI', timeframe),
      fetchRealHistory('^BVSP', timeframe)
    ])
      .then(([resA, resB, resCdi, resIbov]) => {
        if (isMounted) {
          if (resA && resA.length > 0) setHistoryA(resA);
          if (resB && resB.length > 0) setHistoryB(resB);
          if (resCdi && resCdi.length > 0) setCdiHistory(resCdi);
          if (resIbov && resIbov.length > 0) setIbovHistory(resIbov);
        }
      })
      .catch((e) => {
        console.warn('Failed to fetch compare histories:', e);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [etfA.ticker, etfB.ticker, timeframe]);

  // Shared interactive dimensions
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 300 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setChartDimensions({
          width: Math.max(width, 300),
          height: 300
        });
      }
    });
    resizeObserver.observe(chartContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Normalize historical prices to % return from day 1 (Base 100%)
  const normalizedData = useMemo(() => {
    if (historyA.length === 0 || historyB.length === 0) return [];
    
    const dataLength = Math.min(historyA.length, historyB.length);
    const syncHistoryA = historyA.slice(historyA.length - dataLength);
    const syncHistoryB = historyB.slice(historyB.length - dataLength);
    
    const startPriceA = syncHistoryA[0]?.close_price || 1;
    const startPriceB = syncHistoryB[0]?.close_price || 1;

    // Optional CDI / IBOV normalization
    const cdiSlice = cdiHistory.length >= dataLength ? cdiHistory.slice(cdiHistory.length - dataLength) : [];
    const cdiStart = cdiSlice[0]?.close_price || 1;
    
    const ibovSlice = ibovHistory.length >= dataLength ? ibovHistory.slice(ibovHistory.length - dataLength) : [];
    const ibovStart = ibovSlice[0]?.close_price || 1;

    return Array.from({ length: dataLength }).map((_, idx) => {
      const ptA = syncHistoryA[idx];
      const ptB = syncHistoryB[idx];
      
      const pctReturnA = ((ptA.close_price / startPriceA) - 1) * 100;
      const pctReturnB = ((ptB.close_price / startPriceB) - 1) * 100;

      const cdiPt = cdiSlice[idx];
      const pctCdi = cdiPt ? ((cdiPt.close_price / cdiStart) - 1) * 100 : 0;

      const ibovPt = ibovSlice[idx];
      const pctIbov = ibovPt ? ((ibovPt.close_price / ibovStart) - 1) * 100 : 0;

      return {
        date: ptA.date,
        priceA: ptA.close_price,
        priceB: ptB.close_price,
        returnA: pctReturnA,
        returnB: pctReturnB,
        returnCdi: pctCdi,
        returnIbov: pctIbov
      };
    });
  }, [historyA, historyB, cdiHistory, ibovHistory]);

  // Return statistics (min, max of comparative percentage return)
  const chartStats = useMemo(() => {
    if (normalizedData.length === 0) return { min: -10, max: 10, range: 20 };
    let returns = normalizedData.flatMap(d => [d.returnA, d.returnB]);
    if (showCDI) returns = returns.concat(normalizedData.map(d => d.returnCdi));
    if (showIBOV) returns = returns.concat(normalizedData.map(d => d.returnIbov));

    const min = Math.min(...returns) - 4;
    const max = Math.max(...returns) + 4;
    return { min, max, range: max - min };
  }, [normalizedData, showCDI, showIBOV]);

  // SVG lines generation
  const svgLines = useMemo(() => {
    if (normalizedData.length < 2) return { lineA: '', lineB: '', lineCdi: '', lineIbov: '' };
    const { width, height } = chartDimensions;
    const paddingLeft = 10;
    const paddingRight = 55;
    const paddingTop = 20;
    const paddingBottom = 20;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    const pointsA = normalizedData.map((d, index) => {
      const x = paddingLeft + (index / (normalizedData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((d.returnA - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pointsB = normalizedData.map((d, index) => {
      const x = paddingLeft + (index / (normalizedData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((d.returnB - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pointsCdi = normalizedData.map((d, index) => {
      const x = paddingLeft + (index / (normalizedData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((d.returnCdi - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pointsIbov = normalizedData.map((d, index) => {
      const x = paddingLeft + (index / (normalizedData.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - ((d.returnIbov - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      lineA: `M ${pointsA.join(' L ')}`,
      lineB: `M ${pointsB.join(' L ')}`,
      lineCdi: `M ${pointsCdi.join(' L ')}`,
      lineIbov: `M ${pointsIbov.join(' L ')}`
    };
  }, [normalizedData, chartDimensions, chartStats]);

  // Handle Chart Touch/Hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (normalizedData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const paddingLeft = 10;
    const paddingRight = 55;
    const graphWidth = chartDimensions.width - paddingLeft - paddingRight;

    const relativeX = x - paddingLeft;
    let index = Math.round((relativeX / graphWidth) * (normalizedData.length - 1));
    if (index < 0) index = 0;
    if (index >= normalizedData.length) index = normalizedData.length - 1;

    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredPoint = hoverIndex !== null ? normalizedData[hoverIndex] : null;

  // Final Accumulated Returns calculation
  const lastPoint = useMemo(() => {
    return normalizedData.length > 0 ? normalizedData[normalizedData.length - 1] : null;
  }, [normalizedData]);

  const returnA = lastPoint ? lastPoint.returnA : etfA.daily_change;
  const returnB = lastPoint ? lastPoint.returnB : etfB.daily_change;

  // Battle Verdict Analysis
  const battleVerdict = useMemo(() => {
    // Fee Winner
    const lowerFeeEtf = etfA.expense_ratio < etfB.expense_ratio ? etfA : (etfB.expense_ratio < etfA.expense_ratio ? etfB : null);
    const feeDiff = lowerFeeEtf ? Math.abs(etfA.expense_ratio - etfB.expense_ratio).toFixed(2) : '0';

    // Performance Winner
    const returnWinner = returnA > returnB ? etfA : (returnB > returnA ? etfB : null);
    const returnDiff = Math.abs(returnA - returnB).toFixed(2);

    // AUM Larger
    const aumA = etfA.currency === 'USD' ? etfA.aum * US_TO_BRL_RATE : etfA.aum;
    const aumB = etfB.currency === 'USD' ? etfB.aum * US_TO_BRL_RATE : etfB.aum;
    const largerAumEtf = aumA > aumB ? etfA : etfB;

    return {
      lowerFeeEtf,
      feeDiff,
      returnWinner,
      returnDiff,
      largerAumEtf
    };
  }, [etfA, etfB, returnA, returnB]);

  // Handy shortcut triggers
  const comparisons = [
    { name: 'IVVB11 vs VOO', label: 'S&P 500 B3 x EUA', tickerA: 'IVVB11', tickerB: 'VOO' },
    { name: 'VOO vs QQQ', label: 'S&P 500 x Nasdaq-100', tickerA: 'VOO', tickerB: 'QQQ' },
    { name: 'BOVA11 vs SMAL11', label: 'Ibovespa x Small Caps', tickerA: 'BOVA11', tickerB: 'SMAL11' },
    { name: 'B5P211 vs LFTS11', label: 'IPCA 5 anos x Tesouro Selic', tickerA: 'B5P211', tickerB: 'LFTS11' },
    { name: 'HASH11 vs QQQ', label: 'Cripto x Tecnologia', tickerA: 'HASH11', tickerB: 'QQQ' },
    { name: 'SCHD vs VOO', label: 'Dividendos EUA x S&P 500', tickerA: 'SCHD', tickerB: 'VOO' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="compare-view-container">
      
      {/* Title & WhatsApp Share Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
            <ArrowRightLeft className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
            <span>Batalha Comparativa de ETFs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confronto direto de taxas, patrimônio e rentabilidade lado a lado.
          </p>
        </div>

        <button
          onClick={() => shareCompareOnWhatsApp(tickerA, tickerB)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          title="Compartilhar análise comparativa no WhatsApp"
          id="btn-share-whatsapp-compare"
        >
          <Share2 size={13} className="text-slate-500 dark:text-slate-400" />
          <span>WhatsApp</span>
        </button>
      </div>

      {/* SELECTORS HEADER (MOBILE VS DESKTOP ADAPTIVE) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* MOBILE SIDE-BY-SIDE VS SELECTOR (< sm) */}
        <div className="sm:hidden space-y-3" id="mobile-vs-selectors">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
            Selecione a Dupla de ETFs
          </div>

          <div className="flex items-center gap-1.5">
            {/* ETF A Mobile Selector */}
            <div className="flex-1 min-w-0">
              <select
                value={tickerA}
                onChange={(e) => setTickerA(e.target.value)}
                className="w-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 p-2 rounded-lg focus:outline-none truncate cursor-pointer"
              >
                {ETFS_LIST.map((etf) => (
                  <option key={etf.ticker} value={etf.ticker} disabled={etf.ticker === tickerB}>
                    {etf.ticker} ({etf.market})
                  </option>
                ))}
              </select>
            </div>

            {/* Instant SWAP Button */}
            <button
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors shadow-xs shrink-0 cursor-pointer"
              title="Inverter lados (Swap)"
            >
              <Repeat size={14} />
            </button>

            {/* ETF B Mobile Selector */}
            <div className="flex-1 min-w-0">
              <select
                value={tickerB}
                onChange={(e) => setTickerB(e.target.value)}
                className="w-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 p-2 rounded-lg focus:outline-none truncate cursor-pointer"
              >
                {ETFS_LIST.map((etf) => (
                  <option key={etf.ticker} value={etf.ticker} disabled={etf.ticker === tickerA}>
                    {etf.ticker} ({etf.market})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DESKTOP SELECTOR GRID (>= sm) */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-3 items-center" id="desktop-selectors-grid">
          {/* ETF A */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-mono">
              ETF Principal (A)
            </label>
            <select
              value={tickerA}
              onChange={(e) => setTickerA(e.target.value)}
              className="w-full text-slate-950 dark:text-white bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 p-2.5 rounded-lg text-sm font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {ETFS_LIST.map((etf) => (
                <option key={etf.ticker} value={etf.ticker} disabled={etf.ticker === tickerB}>
                  {etf.ticker} — {etf.name} ({etf.market})
                </option>
              ))}
            </select>
          </div>

          {/* SWAP Central Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSwap}
              className="inline-flex items-center justify-center p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Inverter ordem dos ETFs"
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* ETF B */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block font-mono">
              Counterpart (B)
            </label>
            <select
              value={tickerB}
              onChange={(e) => setTickerB(e.target.value)}
              className="w-full text-slate-950 dark:text-white bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-lg text-sm font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {ETFS_LIST.map((etf) => (
                <option key={etf.ticker} value={etf.ticker} disabled={etf.ticker === tickerA}>
                  {etf.ticker} — {etf.name} ({etf.market})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SWIPEABLE PRESETS CAROUSEL BAR */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono block">
            Combates Populares:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {comparisons.map((comp, i) => {
              const isActive = (tickerA === comp.tickerA && tickerB === comp.tickerB) || (tickerA === comp.tickerB && tickerB === comp.tickerA);
              return (
                <button
                  key={i}
                  onClick={() => { setTickerA(comp.tickerA); setTickerB(comp.tickerB); }}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {comp.name} <span className="text-[10px] opacity-75">({comp.label})</span>
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* BATTLE VERDICT EXECUTIVE SUMMARY CARD */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white rounded-xl p-5 shadow-sm space-y-3 border border-slate-800">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="text-amber-400 shrink-0" size={16} />
            <h3 className="font-extrabold text-xs sm:text-sm tracking-tight truncate whitespace-nowrap">
              Veredito da Batalha: <span className="text-blue-400">{etfA.ticker}</span> vs <span className="text-emerald-400">{etfB.ticker}</span>
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300 shrink-0 whitespace-nowrap">
            Resumo do Duelo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Fee Verdict */}
          <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Taxa de Administração</span>
            {battleVerdict.lowerFeeEtf ? (
              <p className="leading-snug">
                <strong className="text-emerald-400 font-bold">{battleVerdict.lowerFeeEtf.ticker}</strong> é mais barato em <strong className="font-mono">{battleVerdict.feeDiff}% a.a.</strong> ({battleVerdict.lowerFeeEtf.expense_ratio.toFixed(2)}% vs {battleVerdict.lowerFeeEtf.ticker === etfA.ticker ? etfB.expense_ratio.toFixed(2) : etfA.expense_ratio.toFixed(2)}%).
              </p>
            ) : (
              <p className="text-slate-300">Ambos possuem exatamente a mesma taxa de administração ({etfA.expense_ratio.toFixed(2)}% a.a.).</p>
            )}
          </div>

          {/* Performance Verdict */}
          <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Retorno Acumulado ({timeframe})</span>
            {battleVerdict.returnWinner ? (
              <p className="leading-snug">
                <strong className="text-blue-400 font-bold">{battleVerdict.returnWinner.ticker}</strong> lidera com retorno de <strong className="font-mono text-emerald-400">+{battleVerdict.returnWinner === etfA ? returnA.toFixed(2) : returnB.toFixed(2)}%</strong> (+{battleVerdict.returnDiff}% superior no período).
              </p>
            ) : (
              <p className="text-slate-300">Ambos tiveram rentabilidade idêntica no período analisado.</p>
            )}
          </div>

          {/* Market Custody Verdict */}
          <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Custódia & Moeda</span>
            <p className="leading-snug text-slate-200">
              {etfA.market === etfB.market ? (
                <>Ambos negociados na <strong className="font-bold text-white">{etfA.market === 'BR' ? 'B3 em Reais (BRL)' : 'Bolsa dos EUA em Dólar (USD)'}</strong>.</>
              ) : (
                <><strong className="font-bold text-blue-400">{etfA.ticker}</strong> na B3 (sem remessa) vs <strong className="font-bold text-emerald-400">{etfB.ticker}</strong> nos EUA (Dólar direto).</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* OVERLAY COMPARATIVE RETURN CHART */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              Performance Relativa Acumulada
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rentabilidade percentual rebaseada para 100% no início do período.
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
            {(['1M', '6M', '1Y', '5Y', 'MAX'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTimeframe(t); setHoverIndex(null); }}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold font-mono rounded-md transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Legend Indicators & Benchmark Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <span className="font-bold text-slate-900 dark:text-white">
                {etfA.ticker}: <span className={returnA >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>{returnA >= 0 ? '+' : ''}{returnA.toFixed(2)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="font-bold text-slate-900 dark:text-white">
                {etfB.ticker}: <span className={returnB >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>{returnB >= 0 ? '+' : ''}{returnB.toFixed(2)}%</span>
              </span>
            </div>
          </div>

          {/* Benchmark Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCDI(!showCDI)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                showCDI ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              + CDI
            </button>
            <button
              onClick={() => setShowIBOV(!showIBOV)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                showIBOV ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              + Ibov
            </button>
          </div>
        </div>

        {/* Responsive Dual-Line SVG Graph */}
        <div ref={chartContainerRef} className="relative select-none min-h-[280px] sm:min-h-[300px]" id="compare-chart-wrapper">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center z-20 space-y-2 rounded-lg">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={28} />
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                Sincronizando histórico de {etfA.ticker} vs {etfB.ticker}...
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
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = 20 + p * (chartDimensions.height - 40);
              const val = chartStats.max - p * chartStats.range;
              return (
                <g key={i} className="opacity-40 dark:opacity-20">
                  <line
                    x1={10}
                    y1={y}
                    x2={chartDimensions.width - 55}
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                  <text
                    x={chartDimensions.width - 50}
                    y={y + 4}
                    fontSize={9}
                    fontFamily="monospace"
                    className="fill-slate-400"
                  >
                    {val.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* CDI Benchmark Line */}
            {showCDI && (
              <path
                d={svgLines.lineCdi}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
            )}

            {/* IBOV Benchmark Line */}
            {showIBOV && (
              <path
                d={svgLines.lineIbov}
                fill="none"
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
            )}

            {/* Line for ETF A (Blue) */}
            <path
              d={svgLines.lineA}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line for ETF B (Emerald) */}
            <path
              d={svgLines.lineB}
              fill="none"
              stroke="#10b981"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Vertical marker */}
            {hoverIndex !== null && hoveredPoint && (
              <line
                x1={10 + (hoverIndex / (normalizedData.length - 1)) * (chartDimensions.width - 65)}
                y1={10}
                x2={10 + (hoverIndex / (normalizedData.length - 1)) * (chartDimensions.width - 65)}
                y2={chartDimensions.height - 20}
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="2,2"
              />
            )}
          </svg>

          {/* Hover Tooltip HTML Overlay */}
          {hoverIndex !== null && hoveredPoint && (
            <div 
              className="absolute top-2 bg-slate-950 text-white border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs font-mono z-10 pointer-events-none space-y-1"
              style={{
                left: `${Math.min(
                  Math.max(
                    10 + (hoverIndex / (normalizedData.length - 1)) * (chartDimensions.width - 65) - 75, 
                    10
                  ), 
                  chartDimensions.width - 180
                )}px`
              }}
            >
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">{hoveredPoint.date}</div>
              <div className="flex justify-between gap-3 text-blue-400">
                <span>{etfA.ticker}:</span>
                <span className="font-bold">{hoveredPoint.returnA.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between gap-3 text-emerald-400">
                <span>{etfB.ticker}:</span>
                <span className="font-bold">{hoveredPoint.returnB.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MOBILE ADAPTIVE DUEL CARDS VIEW (< sm) */}
      <div className="sm:hidden space-y-3" id="mobile-duel-cards">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <Award size={16} className="text-amber-500" />
          Confronto Indicador por Indicador
        </h3>

        {/* Card 1: Taxa de Administração */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Taxa de Administração</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              {etfA.expense_ratio < etfB.expense_ratio ? `${etfA.ticker} Vence` : (etfB.expense_ratio < etfA.expense_ratio ? `${etfB.ticker} Vence` : 'Empate')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className={`p-2.5 rounded-lg border ${etfA.expense_ratio <= etfB.expense_ratio ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block font-mono">{etfA.ticker}</span>
              <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{etfA.expense_ratio.toFixed(2)}%</span>
              <span className="text-[10px] text-slate-400 block">ao ano</span>
            </div>

            <div className={`p-2.5 rounded-lg border ${etfB.expense_ratio <= etfA.expense_ratio ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block font-mono">{etfB.ticker}</span>
              <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{etfB.expense_ratio.toFixed(2)}%</span>
              <span className="text-[10px] text-slate-400 block">ao ano</span>
            </div>
          </div>
        </div>

        {/* Card 2: Rentabilidade no Período */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Retorno Acumulado ({timeframe})</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
              {returnA > returnB ? `${etfA.ticker} Vence` : (returnB > returnA ? `${etfB.ticker} Vence` : 'Empate')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className={`p-2.5 rounded-lg border ${returnA >= returnB ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block font-mono">{etfA.ticker}</span>
              <span className={`text-base font-extrabold font-mono ${returnA >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                {returnA >= 0 ? '+' : ''}{returnA.toFixed(2)}%
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border ${returnB >= returnA ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block font-mono">{etfB.ticker}</span>
              <span className={`text-base font-extrabold font-mono ${returnB >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                {returnB >= 0 ? '+' : ''}{returnB.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Patrimônio Líquido (AUM) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Patrimônio Líquido (AUM)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {battleVerdict.largerAumEtf.ticker} Lidera
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block font-mono">{etfA.ticker}</span>
              <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                {etfA.currency === 'USD' ? 'US$' : 'R$'} {etfA.aum >= 1000 ? `${(etfA.aum / 1000).toFixed(1)}B` : `${etfA.aum}M`}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block font-mono">{etfB.ticker}</span>
              <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                {etfB.currency === 'USD' ? 'US$' : 'R$'} {etfB.aum >= 1000 ? `${(etfB.aum / 1000).toFixed(1)}B` : `${etfB.aum}M`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDE-BY-SIDE SPECS TABLE (>= sm) */}
      <section className="hidden sm:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            Comparativo de Ficha Técnica Completa
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3.5 px-6">Indicador de Confronto</th>
                <th className="py-3.5 px-6 text-blue-600 dark:text-blue-400 font-bold bg-blue-50/5">{etfA.ticker}</th>
                <th className="py-3.5 px-6 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/5">{etfB.ticker}</th>
                <th className="py-3.5 px-4 text-center">Vencedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Name */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Razão Social</td>
                <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200 bg-blue-50/5">{etfA.name}</td>
                <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200 bg-emerald-50/5">{etfB.name}</td>
                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">—</td>
              </tr>

              {/* Market */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Mercado / Custódia</td>
                <td className="py-4 px-6 bg-blue-50/5">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800">
                    {etfA.market === 'BR' ? 'B3 (Brasil)' : 'EUA (Global)'}
                  </span>
                </td>
                <td className="py-4 px-6 bg-emerald-50/5">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800">
                    {etfB.market === 'BR' ? 'B3 (Brasil)' : 'EUA (Global)'}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">—</td>
              </tr>

              {/* Expense Ratio */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Taxa de Admin. (a.a.)</td>
                <td className="py-4 px-6 font-extrabold font-mono text-slate-800 dark:text-slate-200 bg-blue-50/5">
                  {etfA.expense_ratio.toFixed(2)}%
                </td>
                <td className="py-4 px-6 font-extrabold font-mono text-slate-800 dark:text-slate-200 bg-emerald-50/5">
                  {etfB.expense_ratio.toFixed(2)}%
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {etfA.expense_ratio < etfB.expense_ratio ? etfA.ticker : (etfB.expense_ratio < etfA.expense_ratio ? etfB.ticker : 'Empate')}
                  </span>
                </td>
              </tr>

              {/* Dividend Yield */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Dividend Yield</td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-blue-50/5">
                  {etfA.dividend_yield > 0 ? `${etfA.dividend_yield.toFixed(2)}%` : 'Isento (Reinveste)'}
                </td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-emerald-50/5">
                  {etfB.dividend_yield > 0 ? `${etfB.dividend_yield.toFixed(2)}%` : 'Isento (Reinveste)'}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {etfA.dividend_yield === etfB.dividend_yield 
                      ? 'Empate' 
                      : (etfA.dividend_yield > etfB.dividend_yield ? etfA.ticker : etfB.ticker)}
                  </span>
                </td>
              </tr>

              {/* AUM */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Tamanho de Patrimônio (AUM)</td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-blue-50/5">
                  {etfA.currency === 'USD' ? 'US$' : 'R$'} {etfA.aum >= 1000 ? `${(etfA.aum / 1000).toFixed(1)}B` : `${etfA.aum}M`}
                </td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-emerald-50/5">
                  {etfB.currency === 'USD' ? 'US$' : 'R$'} {etfB.aum >= 1000 ? `${(etfB.aum / 1000).toFixed(1)}B` : `${etfB.aum}M`}
                </td>
                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">—</td>
              </tr>

              {/* Sector */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Foco de Segmentação</td>
                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 bg-blue-50/5">{etfA.sector}</td>
                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 bg-emerald-50/5">{etfB.sector}</td>
                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">—</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
