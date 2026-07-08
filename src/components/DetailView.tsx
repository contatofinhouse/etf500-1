/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Star, RefreshCw, Landmark, Globe, Receipt, AlertCircle, ArrowLeft, TrendingUp, TrendingDown, HelpCircle, ArrowRight, Wallet, Percent, Tag } from 'lucide-react';
import { ETF, HistoricalPrice } from '../types';
import { ETFS_LIST, generateHistory, US_TO_BRL_RATE } from '../data/etfData';

interface DetailViewProps {
  ticker: string;
  onNavigate: (view: string, extraParams?: Record<string, string>) => void;
}

export default function DetailView({ ticker, onNavigate }: DetailViewProps) {
  // Find current ETF
  const etf = useMemo(() => {
    return ETFS_LIST.find(e => e.ticker.toUpperCase() === ticker.toUpperCase()) || ETFS_LIST[0];
  }, [ticker]);

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

  // Timeframe selector
  const [timeframe, setTimeframe] = useState<'1M' | '6M' | '1Y' | '5Y' | 'MAX'>('1Y');

  // Convert timeline to display label
  const timelineLabel = {
    '1M': 'Último Mês',
    '6M': 'Últimos 6 Meses',
    '1Y': 'Último Ano',
    '5Y': 'Últimos 5 Anos',
    'MAX': 'Histórico Completo'
  }[timeframe];

  // Dynamic currency calculator
  const [calcInput, setCalcInput] = useState<string>('10'); // defaults to 10 shares
  const [calcMode, setCalcMode] = useState<'SHARES_TO_CURRENCY' | 'CURRENCY_TO_SHARES'>('SHARES_TO_CURRENCY');

  // Generate historical data
  const historyData = useMemo(() => {
    return generateHistory(etf.ticker, timeframe);
  }, [etf.ticker, timeframe]);

  // SVG Chart Dimensions Tracking using ResizeObserver
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 320 });

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // set dimensions (leave some padding)
        setChartDimensions({
          width: Math.max(width, 300),
          height: 300 // fixed height is fine, width is fluid
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

  // Compute stats of historical prices for graphing
  const chartStats = useMemo(() => {
    if (historyData.length === 0) return { min: 0, max: 100, range: 100 };
    const prices = historyData.map(h => h.close_price);
    const min = Math.min(...prices) * 0.98; // 2% room below
    const max = Math.max(...prices) * 1.02; // 2% room above
    return { min, max, range: max - min };
  }, [historyData]);

  // SVG path generation
  const svgPath = useMemo(() => {
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
      // invert Y coordinate for screen
      const y = paddingTop + graphHeight - ((d.close_price - chartStats.min) / chartStats.range) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  }, [historyData, chartDimensions, chartStats]);

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

    // close the polygon
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

  // Currency Converter math
  const calculatedOutput = useMemo(() => {
    const numericInput = parseFloat(calcInput) || 0;
    if (calcMode === 'SHARES_TO_CURRENCY') {
      // Qty of shares to money
      const nativeTotal = numericInput * etf.current_price;
      const brlTotal = etf.currency === 'USD' ? nativeTotal * US_TO_BRL_RATE : nativeTotal;
      return {
        native: nativeTotal,
        brl: brlTotal,
      };
    } else {
      // Amount of BRL to shares
      const convertedInputToNative = etf.currency === 'USD' ? numericInput / US_TO_BRL_RATE : numericInput;
      const shares = convertedInputToNative / etf.current_price;
      return {
        shares: shares,
        native: convertedInputToNative,
      };
    }
  }, [calcInput, calcMode, etf.current_price, etf.currency]);

  return (
    <div className="w-full space-y-6 animate-fade-in" id={`etf-detail-${etf.ticker.toLowerCase()}`}>
      
      {/* Back button and navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          id="btn-back-to-home"
        >
          <ArrowLeft size={14} />
          Voltar para o Início
        </button>
      </div>

      {/* Programmatic Horizontal Premium Ad Container (Monetização) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-24 w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Espaço Publicitário Reservado (Google Ad Exchange - Leaderboard 728x90)
          </span>
          <span className="text-xs text-slate-300 dark:text-slate-700 font-medium mt-1">
            Anúncio contextualizado com base no interesse do investidor em {etf.ticker}
          </span>
        </div>
      </section>

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
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {etf.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              Categoria: {etf.sector} • Padrão de Moeda: {etf.currency}
            </p>
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
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400">
            <RefreshCw size={18} className="animate-spin-slow" />
          </div>
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
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Gráfico Financeiro Histórico
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {timelineLabel} (Intervalo Diário)
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

            {/* Responsive SVG Chart */}
            <div 
              ref={chartContainerRef}
              className="relative select-none"
              id="detail-chart-wrapper"
            >
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

          {/* Nomad International Affiliate Account Promo (Monetização) */}
          {etf.market === 'US' && (
            <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden" id="brokerage-affiliate-promo">
              <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 p-3 bg-white/5 rounded-full">
                <Wallet size={40} className="text-blue-500/10" />
              </div>
              
              <div className="space-y-3.5 relative">
                <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500 text-white rounded uppercase font-mono">
                  Cupom Exclusivo
                </span>
                <h4 className="font-extrabold text-sm tracking-tight leading-tight">
                  Invista em {etf.ticker} com Menos Taxas!
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Abra sua conta global na **Nomad** ou **Avenue** usando o link afiliado do *etf500* e ganhe até **$20 de cashback** na primeira remessa com taxa de câmbio reduzida!
                </p>

                <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between text-xs font-mono">
                  <span>Código:</span>
                  <span className="font-black text-amber-300">ETF500</span>
                </div>

                <a
                  href="https://www.nomadglobal.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors block cursor-pointer"
                >
                  Abra Sua Conta Global
                </a>
              </div>
            </div>
          )}

          {/* Dynamic Currency Converter Calculator */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1">
              <Percent size={14} className="text-blue-600" />
              Calculadora de Conversão
            </h3>

            <div className="space-y-3">
              <div className="flex bg-white dark:bg-slate-900 rounded-md p-0.5 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => { setCalcMode('SHARES_TO_CURRENCY'); setCalcInput('10'); }}
                  className={`w-1/2 text-center py-1 text-[10px] font-bold rounded cursor-pointer ${
                    calcMode === 'SHARES_TO_CURRENCY' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'text-slate-400'
                  }`}
                >
                  Cotas para Valor
                </button>
                <button
                  onClick={() => { setCalcMode('CURRENCY_TO_SHARES'); setCalcInput('1000'); }}
                  className={`w-1/2 text-center py-1 text-[10px] font-bold rounded cursor-pointer ${
                    calcMode === 'CURRENCY_TO_SHARES' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'text-slate-400'
                  }`}
                >
                  Valor para Cotas
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">
                  {calcMode === 'SHARES_TO_CURRENCY' ? 'Quantidade de Cotas' : 'Montante Financeiro (R$)'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  className="w-full text-slate-950 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Conversion Outputs */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-lg space-y-2">
                {calcMode === 'SHARES_TO_CURRENCY' ? (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Moeda Nativa:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {etf.currency === 'USD' ? '$' : 'R$'} {calculatedOutput.native ? calculatedOutput.native.toFixed(2) : '0.00'}
                      </span>
                    </div>
                    {etf.currency === 'USD' && (
                      <div className="flex justify-between text-xs border-t border-slate-50 dark:border-slate-800/50 pt-2 font-bold text-blue-600 dark:text-blue-400">
                        <span>Convertido em Reais:</span>
                        <span className="font-mono">
                          R$ {calculatedOutput.brl ? calculatedOutput.brl.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Cotas Adquiridas:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-blue-50 dark:bg-blue-950/20 px-1.5 py-0.5 rounded text-blue-600">
                        {calculatedOutput.shares ? calculatedOutput.shares.toFixed(4) : '0.0000'} cotas
                      </span>
                    </div>
                    {etf.currency === 'USD' && (
                      <div className="flex justify-between text-xs border-t border-slate-50 dark:border-slate-800/50 pt-2 font-mono text-slate-400">
                        <span>Valor em Dólares:</span>
                        <span>
                          $ {calculatedOutput.native ? calculatedOutput.native.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Programmatic Sidebar Premium Ad Box (Monetização) */}
          <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Ad Banner (300x250 Medium Rectangle)
            </span>
            <span className="text-[11px] text-slate-300 dark:text-slate-700 mt-1 font-semibold block">
              Espaço de publicidade reservada B2B
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
