/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRightLeft, Info, HelpCircle, Check, Sparkles, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ETF, HistoricalPrice } from '../types';
import { ETFS_LIST, generateHistory } from '../data/etfData';

interface CompareViewProps {
  initialTickerA?: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

export default function CompareView({ initialTickerA, onNavigate }: CompareViewProps) {
  // Selectors State
  const [tickerA, setTickerA] = useState<string>('IVVB11');
  const [tickerB, setTickerB] = useState<string>('VOO');

  useEffect(() => {
    if (initialTickerA) {
      setTickerA(initialTickerA);
      // Select another standard counterpart for comparison
      if (initialTickerA === 'IVVB11') setTickerB('VOO');
      else if (initialTickerA === 'VOO') setTickerB('IVVB11');
      else if (initialTickerA === 'BOVA11') setTickerB('SMAL11');
      else if (initialTickerA === 'QQQ') setTickerB('VOO');
      else {
        const counter = ETFS_LIST.find(e => e.ticker !== initialTickerA);
        if (counter) setTickerB(counter.ticker);
      }
    }
  }, [initialTickerA]);

  const etfA = useMemo(() => ETFS_LIST.find(e => e.ticker === tickerA) || ETFS_LIST[0], [tickerA]);
  const etfB = useMemo(() => ETFS_LIST.find(e => e.ticker === tickerB) || ETFS_LIST[1], [tickerB]);

  // Comparison Timeframe
  const [timeframe, setTimeframe] = useState<'1M' | '6M' | '1Y' | '5Y'>('1Y');

  // Fetch histories
  const historyA = useMemo(() => generateHistory(etfA.ticker, timeframe), [etfA.ticker, timeframe]);
  const historyB = useMemo(() => generateHistory(etfB.ticker, timeframe), [etfB.ticker, timeframe]);

  // Shared interactive dimensions
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 320 });
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
  // This is the correct, professional standard for financial comparative charts.
  const normalizedData = useMemo(() => {
    if (historyA.length === 0 || historyB.length === 0) return [];
    
    // We synchronize the lengths to match index-by-index
    const dataLength = Math.min(historyA.length, historyB.length);
    const syncHistoryA = historyA.slice(historyA.length - dataLength);
    const syncHistoryB = historyB.slice(historyB.length - dataLength);
    
    const startPriceA = syncHistoryA[0]?.close_price || 1;
    const startPriceB = syncHistoryB[0]?.close_price || 1;

    return Array.from({ length: dataLength }).map((_, idx) => {
      const ptA = syncHistoryA[idx];
      const ptB = syncHistoryB[idx];
      
      const pctReturnA = ((ptA.close_price / startPriceA) - 1) * 100;
      const pctReturnB = ((ptB.close_price / startPriceB) - 1) * 100;

      return {
        date: ptA.date,
        priceA: ptA.close_price,
        priceB: ptB.close_price,
        returnA: pctReturnA,
        returnB: pctReturnB
      };
    });
  }, [historyA, historyB]);

  // Return statistics (min, max of comparative percentage return)
  const chartStats = useMemo(() => {
    if (normalizedData.length === 0) return { min: -10, max: 10, range: 20 };
    const returns = normalizedData.flatMap(d => [d.returnA, d.returnB]);
    const min = Math.min(...returns) - 5; // 5% extra spacing
    const max = Math.max(...returns) + 5; // 5% extra spacing
    return { min, max, range: max - min };
  }, [normalizedData]);

  // SVG lines generation
  const svgLines = useMemo(() => {
    if (normalizedData.length < 2) return { lineA: '', lineB: '' };
    const { width, height } = chartDimensions;
    const paddingLeft = 10;
    const paddingRight = 60;
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

    return {
      lineA: `M ${pointsA.join(' L ')}`,
      lineB: `M ${pointsB.join(' L ')}`
    };
  }, [normalizedData, chartDimensions, chartStats]);

  // Handle Chart Hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (normalizedData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const paddingLeft = 10;
    const paddingRight = 60;
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

  // Handy shortcut triggers
  const comparisons = [
    { name: 'IVVB11 vs VOO (S&P 500 Cambial)', tickerA: 'IVVB11', tickerB: 'VOO' },
    { name: 'VOO vs QQQ (S&P 500 vs Nasdaq)', tickerA: 'VOO', tickerB: 'QQQ' },
    { name: 'BOVA11 vs SMAL11 (Foco Brasil)', tickerA: 'BOVA11', tickerB: 'SMAL11' },
    { name: 'HASH11 vs QQQ (Tecnologia & Cripto)', tickerA: 'HASH11', tickerB: 'QQQ' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="compare-view-container">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowRightLeft className="text-blue-600 dark:text-blue-400" size={24} />
          Batalha Comparativa de ETFs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compare custos de administração, dividendos, composições de carteira e retornos históricos indexados lado a lado.
        </p>
      </div>

      {/* Selectors Panel */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          Selecione dois Ativos para confrontar:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* ETF A Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              ETF Principal (A)
            </label>
            <select
              value={tickerA}
              onChange={(e) => setTickerA(e.target.value)}
              className="w-full text-slate-950 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              id="select-compare-a"
            >
              {ETFS_LIST.map((etf) => (
                <option key={etf.ticker} value={etf.ticker} disabled={etf.ticker === tickerB}>
                  {etf.ticker} — {etf.name} ({etf.market})
                </option>
              ))}
            </select>
          </div>

          {/* ETF B Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Counterpart (B)
            </label>
            <select
              value={tickerB}
              onChange={(e) => setTickerB(e.target.value)}
              className="w-full text-slate-950 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              id="select-compare-b"
            >
              {ETFS_LIST.map((etf) => (
                <option key={etf.ticker} value={etf.ticker} disabled={etf.ticker === tickerA}>
                  {etf.ticker} — {etf.name} ({etf.market})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick presets tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono mr-1">
            Combates Frequentes:
          </span>
          {comparisons.map((comp, i) => (
            <button
              key={i}
              onClick={() => { setTickerA(comp.tickerA); setTickerB(comp.tickerB); }}
              className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-md transition-all cursor-pointer"
              id={`preset-compare-${i}`}
            >
              {comp.name}
            </button>
          ))}
        </div>
      </section>

      {/* Overlay Comparative Return Chart */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Análise Histórica de Performance Relativa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Retorno percentual acumulado partindo do valor inicial (100% base).
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
            {(['1M', '6M', '1Y', '5Y'] as const).map((t) => (
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

        {/* Chart Lines Legend Indicators */}
        <div className="flex gap-6 text-xs font-mono py-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {etfA.ticker}: {hoveredPoint ? `${hoveredPoint.returnA.toFixed(2)}%` : `${etfA.daily_change >= 0 ? '+' : ''}${etfA.daily_change}% (Hoje)`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {etfB.ticker}: {hoveredPoint ? `${hoveredPoint.returnB.toFixed(2)}%` : `${etfB.daily_change >= 0 ? '+' : ''}${etfB.daily_change}% (Hoje)`}
            </span>
          </div>
        </div>

        {/* Responsive Dual-Line SVG Graph */}
        <div ref={chartContainerRef} className="relative select-none" id="compare-chart-wrapper">
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
                    {val.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Line for ETF A */}
            <path
              d={svgLines.lineA}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line for ETF B */}
            <path
              d={svgLines.lineB}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Vertical marker crosshair */}
            {hoverIndex !== null && hoveredPoint && (
              <line
                x1={10 + (hoverIndex / (normalizedData.length - 1)) * (chartDimensions.width - 70)}
                y1={10}
                x2={10 + (hoverIndex / (normalizedData.length - 1)) * (chartDimensions.width - 70)}
                y2={chartDimensions.height - 20}
                stroke="#64748b"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
            )}
          </svg>

          {/* Float Tooltip */}
          {hoverIndex !== null && hoveredPoint && (
            <div 
              className="absolute top-2 bg-slate-950 text-white border border-slate-800 rounded p-3 shadow-xl text-xs font-mono z-10 pointer-events-none"
              style={{
                left: `${Math.min(
                  Math.max(
                    10 + (hoverIndex / (normalizedData.length - 1)) * (chartDimensions.width - 70) - 75, 
                    10
                  ), 
                  chartDimensions.width - 190
                )}px`
              }}
            >
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1.5">{hoveredPoint.date}</div>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-blue-400 font-bold">{etfA.ticker}:</span>
                  <span className="font-bold text-right">{hoveredPoint.returnA.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-emerald-400 font-bold">{etfB.ticker}:</span>
                  <span className="font-bold text-right">{hoveredPoint.returnB.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Side-by-Side Specs Grid Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Comparativo de Ficha Técnica
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-6">Indicador de Confronto</th>
                <th className="py-3 px-6 text-blue-600 dark:text-blue-400 font-bold bg-blue-50/5">{etfA.ticker}</th>
                <th className="py-3 px-6 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/5">{etfB.ticker}</th>
                <th className="py-3 px-4 text-center">Vencedor (Custo)</th>
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
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800">
                    {etfA.market === 'BR' ? 'B3 (Brasil)' : 'EUA'}
                  </span>
                </td>
                <td className="py-4 px-6 bg-emerald-50/5">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800">
                    {etfB.market === 'BR' ? 'B3 (Brasil)' : 'EUA'}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">—</td>
              </tr>

              {/* Expense Ratio (Lower is winner) */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Taxa de Admin. (a.a.)</td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-blue-50/5">
                  {etfA.expense_ratio.toFixed(2)}%
                </td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-emerald-50/5">
                  {etfB.expense_ratio.toFixed(2)}%
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {etfA.expense_ratio < etfB.expense_ratio ? etfA.ticker : etfB.ticker}
                  </span>
                </td>
              </tr>

              {/* Dividend Yield (Higher is better for cashflow) */}
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-500">Dividend Yield</td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-blue-50/5">
                  {etfA.dividend_yield > 0 ? `${etfA.dividend_yield.toFixed(2)}%` : 'Isento (Reinveste)'}
                </td>
                <td className="py-4 px-6 font-bold font-mono text-slate-800 dark:text-slate-200 bg-emerald-50/5">
                  {etfB.dividend_yield > 0 ? `${etfB.dividend_yield.toFixed(2)}%` : 'Isento (Reinveste)'}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
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
