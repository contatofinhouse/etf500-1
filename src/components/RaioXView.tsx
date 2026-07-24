/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PieChart, Plus, Trash2, ShieldAlert, CheckCircle2, DollarSign, Globe, Award, ChevronRight, HelpCircle, Briefcase, Mail, User, Phone, Share2 } from 'lucide-react';
import { ETF, PortfolioItem } from '../types';
import { useEtfData } from '../context/EtfDataContext';
import { shareRaioXOnWhatsApp } from '../utils/shareUtils';

export default function RaioXView() {
  const { etfs: ETFS_LIST } = useEtfData();
  // Initial starting portfolio (e.g., standard standard setup)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { ticker: 'IVVB11', percentage: 40 },
    { ticker: 'BOVA11', percentage: 30 },
    { ticker: 'VOO', percentage: 20 },
    { ticker: 'HASH11', percentage: 10 },
  ]);

  const [selectedAddTicker, setSelectedAddTicker] = useState<string>('QQQ');
  const [addPercentage, setAddPercentage] = useState<number>(10);

  // Lead capture form state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadPortfolioSize, setLeadPortfolioSize] = useState('R$ 50.000 - R$ 200.000');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers for portfolio updates
  const handleRemoveItem = (ticker: string) => {
    setPortfolio(portfolio.filter(item => item.ticker !== ticker));
  };

  const handleUpdatePercentage = (ticker: string, value: number) => {
    const validated = Math.max(0, Math.min(100, value));
    setPortfolio(portfolio.map(item => 
      item.ticker === ticker ? { ...item, percentage: validated } : item
    ));
  };

  const handleAddItem = () => {
    // If already exists, just update or alert
    if (portfolio.some(item => item.ticker === selectedAddTicker)) {
      alert(`${selectedAddTicker} já está adicionado. Ajuste a porcentagem na lista abaixo.`);
      return;
    }
    setPortfolio([...portfolio, { ticker: selectedAddTicker, percentage: addPercentage }]);
    // Find next available ticker to set select
    const remaining = ETFS_LIST.find(e => !portfolio.some(p => p.ticker === e.ticker) && e.ticker !== selectedAddTicker);
    if (remaining) {
      setSelectedAddTicker(remaining.ticker);
    }
  };

  // Compute normalized allocation weights (scaling to sum to exactly 100%)
  const totalRawPercentage = useMemo(() => {
    return portfolio.reduce((sum, item) => sum + item.percentage, 0);
  }, [portfolio]);

  const normalizedPortfolio = useMemo(() => {
    if (portfolio.length === 0) return [];
    const divisor = totalRawPercentage > 0 ? totalRawPercentage : 1;
    return portfolio.map(item => ({
      ...item,
      normalizedWeight: (item.percentage / divisor) * 100,
      etfDetails: ETFS_LIST.find(e => e.ticker === item.ticker)!
    })).sort((a, b) => b.normalizedWeight - a.normalizedWeight);
  }, [portfolio, totalRawPercentage]);

  // Exposure computations
  // 1. Geography: US vs BR
  // 2. Currency: BRL vs USD (based on native trading currency)
  const exposureStats = useMemo(() => {
    let geoBR = 0;
    let geoUS = 0;
    let currBRL = 0;
    let currUSD = 0;
    let weightedAvgExpense = 0;

    normalizedPortfolio.forEach(item => {
      const weight = item.normalizedWeight;
      const etf = item.etfDetails;

      // Expense ratio
      weightedAvgExpense += (etf.expense_ratio * weight) / 100;

      // Currency
      if (etf.currency === 'USD') {
        currUSD += weight;
      } else {
        currBRL += weight;
      }

      // Geography (Asset location exposure)
      // Note: IVVB11 trades in BRL but holds S&P 500 US shares
      if (etf.ticker === 'IVVB11' || etf.ticker === 'WRLD11' || etf.market === 'US') {
        geoUS += weight;
      } else {
        geoBR += weight;
      }
    });

    return {
      geoBR,
      geoUS,
      currBRL,
      currUSD,
      weightedAvgExpense
    };
  }, [normalizedPortfolio]);

  // Lead submission simulation
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!leadName.trim()) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }
    if (!leadEmail.trim() || !leadEmail.includes('@')) {
      setFormError('Por favor, informe um e-mail válido.');
      return;
    }
    if (!leadPhone.trim()) {
      setFormError('Por favor, informe seu número de celular/WhatsApp.');
      return;
    }

    setIsSubmitting(true);

    // Simulate standard Supabase/Express POST payload
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save locally to simulate table storage
      const existingLeads = JSON.parse(localStorage.getItem('etf500_leads') || '[]');
      const newLead = {
        id: crypto.randomUUID(),
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        estimated_portfolio: leadPortfolioSize,
        created_at: new Date().toISOString()
      };
      existingLeads.push(newLead);
      localStorage.setItem('etf500_leads', JSON.stringify(existingLeads));

      setFormSubmitted(true);
    } catch (err) {
      setFormError('Erro ao registrar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate coordinates/dash offsets for a custom SVG Donut Chart
  // Segment: { label, value, color }
  const renderDonutChart = (segments: { label: string, value: number, color: string }[]) => {
    let cumulativePercent = 0;
    const radius = 50;
    const strokeWidth = 12;
    const circ = 2 * Math.PI * radius;

    return (
      <svg viewBox="0 0 140 140" className="w-36 h-36">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          className="dark:stroke-slate-800"
        />
        {segments.map((seg, idx) => {
          if (seg.value <= 0) return null;
          const strokeLength = (seg.value / 100) * circ;
          const strokeOffset = circ - (cumulativePercent / 100) * circ;
          cumulativePercent += seg.value;

          return (
            <circle
              key={idx}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeLength} ${circ - strokeLength}`}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 70 70)"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in overflow-hidden" id="raio-x-view-container">
      {/* Title block & Share */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Ferramenta Institucional
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="text-blue-600 dark:text-blue-400" size={24} />
            Raio-X de Portfólio Global
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Simule sua carteira de ETFs, analise a sobreposição real dos ativos subjacentes, exposição cambial (BRL vs USD) e taxa média de administração ponderada.
          </p>
        </div>

        <button
          onClick={() => shareRaioXOnWhatsApp()}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
          title="Compartilhar ferramenta de Raio-X com grupos de Tesouraria no WhatsApp"
          id="btn-share-whatsapp-raiox"
        >
          <Share2 size={13} className="text-slate-500 dark:text-slate-400" />
          <span>WhatsApp</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column (2/3 width on large): Portfolio Weight Manager */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 overflow-hidden">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Composição da sua Carteira
            </h3>

            {/* Warning indicator if weights are unbalanced */}
            {totalRawPercentage !== 100 && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 rounded-lg text-xs flex gap-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold">Aviso de Pesos Desbalanceados:</span>
                  <p className="break-words">
                    A soma das porcentagens declaradas é de <span className="font-bold">{totalRawPercentage}%</span>. Nós normalizamos automaticamente para <span className="font-bold">100%</span> no diagnóstico ao lado para garantir precisão estatística. Ajuste para fechar em 100% se desejar.
                  </p>
                </div>
              </div>
            )}

            {/* List of items */}
            <div className="space-y-2.5" id="portfolio-items-list">
              {portfolio.map((item) => {
                const details = ETFS_LIST.find(e => e.ticker === item.ticker);
                if (!details) return null;
                return (
                  <div 
                    key={item.ticker}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-slate-200 dark:hover:border-slate-700/80 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2 py-0.5 text-xs font-black font-mono bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                        {item.ticker}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {details.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase block truncate">
                          Taxa: {details.expense_ratio}% • {details.market}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.percentage}
                          onChange={(e) => handleUpdatePercentage(item.ticker, parseInt(e.target.value) || 0)}
                          className="w-14 text-center text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-500 font-mono">%</span>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.ticker)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                        title="Remover ativo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {portfolio.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  Sua carteira está vazia. Adicione ativos abaixo para iniciar a análise.
                </div>
              )}
            </div>

            {/* Add Asset Selector bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1 min-w-0">
                <select
                  value={selectedAddTicker}
                  onChange={(e) => setSelectedAddTicker(e.target.value)}
                  className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none truncate"
                  id="select-add-portfolio-etf"
                >
                  {ETFS_LIST.filter(e => !portfolio.some(p => p.ticker === e.ticker)).map(etf => (
                    <option key={etf.ticker} value={etf.ticker}>
                      {etf.ticker} — {etf.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={addPercentage}
                    onChange={(e) => setAddPercentage(parseInt(e.target.value) || 10)}
                    className="w-14 p-1.5 text-center text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono">%</span>
                </div>

                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 flex-1 sm:flex-none"
                  id="btn-add-portfolio-item"
                >
                  <Plus size={14} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* B2B Capture Lead Form integrated immediately underneath the results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md" id="b2b-lead-panel">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 rounded uppercase font-mono">
                  Assessoria Patrimonial Gratuita
                </span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                  Deseja um diagnóstico profissional gratuito da sua carteira?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nossos especialistas parceiros analisarão duplicidade de ativos, sobreposição de taxas e eficiência cambial para otimizar seus retornos.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/5511955842951?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20profissional%20gratuito%20da%20minha%20carteira%20de%20ETFs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm hover:shadow"
                  id="btn-submit-lead-whatsapp"
                >
                  <Phone size={16} />
                  Solicitar Diagnóstico via WhatsApp
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (1/3 width on large): Analytical Diagnostics & Charts */}
        <div className="space-y-6">
          
          {/* Key Portfolio Diagnostics Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5">
              Diagnósticos do Portfólio
            </h3>

            <div className="space-y-4">
              
              {/* Average Expense Ratio */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Custo Médio de Taxas (Ponderado)
                </span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  {portfolio.length > 0 ? `${exposureStats.weightedAvgExpense.toFixed(3)}% a.a.` : '0.000%'}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Média ponderada do custo de administração anual da sua carteira.
                </p>
              </div>

              {/* Currency Diversification (Donut) */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Distribuição Cambial de Custódia
                </span>

                {portfolio.length > 0 ? (
                  <div className="flex items-center gap-4">
                    {renderDonutChart([
                      { label: 'Real (BRL)', value: exposureStats.currBRL, color: '#16a34a' },
                      { label: 'Dólar (USD)', value: exposureStats.currUSD, color: '#2563eb' }
                    ])}

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>
                        <span className="text-slate-500 font-medium">BRL:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{exposureStats.currBRL.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                        <span className="text-slate-500 font-medium">USD:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{exposureStats.currUSD.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Sem dados</span>
                )}
              </div>

              {/* Geographic Diversification (Donut) */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Exposição Geográfica (Ativos)
                </span>

                {portfolio.length > 0 ? (
                  <div className="flex items-center gap-4">
                    {renderDonutChart([
                      { label: 'Brasil (B3)', value: exposureStats.geoBR, color: '#eab308' },
                      { label: 'EUA (Global)', value: exposureStats.geoUS, color: '#4f46e5' }
                    ])}

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-yellow-500"></span>
                        <span className="text-slate-500 font-medium">Brasil:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{exposureStats.geoBR.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-600"></span>
                        <span className="text-slate-500 font-medium">EUA:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{exposureStats.geoUS.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Sem dados</span>
                )}
              </div>

            </div>
          </div>

          {/* Allocation Weight distribution list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-400">
              Distribuição Relativa (%)
            </h3>

            <div className="space-y-3">
              {normalizedPortfolio.map((item) => (
                <div key={item.ticker} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-300">
                      {item.ticker}
                    </span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">
                      {item.normalizedWeight.toFixed(1)}%
                    </span>
                  </div>
                  {/* Slider bar mockup */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${item.normalizedWeight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
