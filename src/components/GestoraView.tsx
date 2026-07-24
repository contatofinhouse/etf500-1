/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Building2, TrendingUp, ShieldCheck, Globe, Search, DollarSign } from 'lucide-react';
import { US_TO_BRL_RATE } from '../data/etfData';
import { useEtfData } from '../context/EtfDataContext';
import { ETF } from '../types';

interface GestoraViewProps {
  managerId: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

interface ManagerInfo {
  name: string;
  displayName: string;
  country: string;
  description: string;
  website: string;
  badges: string[];
}

const MANAGERS_INFO: Record<string, ManagerInfo> = {
  blackrock: {
    name: 'BlackRock',
    displayName: 'BlackRock (iShares)',
    country: 'EUA / Brasil (B3)',
    description: 'Maior gestora de ativos do mundo. Administra os ETFs da marca iShares, como o IVVB11 (S&P 500), BOVA11 (Ibovespa) e SMAL11 (Small Caps). Padrão global de liquidez e segurança institucional.',
    website: 'https://www.blackrock.com/br',
    badges: ['Líder Global', 'Alta Liquidez B3', 'iShares']
  },
  itau: {
    name: 'Itaú',
    displayName: 'Itaú Asset Management (It Now)',
    country: 'Brasil',
    description: 'Pioneira no mercado de ETFs no Brasil. Gestora dos fundos da marca It Now, oferecendo acesso aos principais índices acionários brasileiros e temáticos com custódia e sólida governança.',
    website: 'https://www.itauassetmanagement.com.br',
    badges: ['Pioneira Brasil', 'B3 Local', 'It Now']
  },
  investo: {
    name: 'Investo',
    displayName: 'Investo Gestão de Recursos',
    country: 'Brasil',
    description: 'Gestora brasileira 100% dedicada a fundos de índice (ETFs). Conhecida por trazer soluções inovadoras de diversificação global passiva para a B3, como o WRLD11 (MSCI World VT) e ALUG11.',
    website: 'https://investo.com.br',
    badges: ['Foco Exclusivo ETF', 'Acesso Global B3', 'Inovação']
  },
  hashdex: {
    name: 'Hashdex',
    displayName: 'Hashdex Asset Management',
    country: 'Brasil / EUA',
    description: 'Gestora global de criptoativos regulada. Lançou o HASH11, primeiro ETF de criptomoedas da B3, oferecendo exposição segura e diversificada ao ecossistema de ativos digitais.',
    website: 'https://hashdex.com',
    badges: ['Líder Cripto', 'Regulado CVM', 'Nasdaq Crypto']
  },
  vanguard: {
    name: 'Vanguard',
    displayName: 'Vanguard Group',
    country: 'EUA',
    description: 'Criadora do primeiro fundo de índice para investidores individuais no mundo. Famosa mundialmente por suas taxas de administração ultra baixas e pela estrutura societária voltada aos cotistas.',
    website: 'https://www.vanguard.com',
    badges: ['Menor Taxa Global', 'Referência Mundial', 'Pioneira']
  },
  invesco: {
    name: 'Invesco',
    displayName: 'Invesco Ltd.',
    country: 'EUA',
    description: 'Uma das maiores gestoras globais de investimentos, administradora do consagrado Invesco QQQ Trust (QQQ), referência global para exposição ao setor de tecnologia e ao Nasdaq-100.',
    website: 'https://www.invesco.com',
    badges: ['Nasdaq-100 QQQ', 'Inovação Tech', 'Global']
  },
  schwab: {
    name: 'Charles Schwab',
    displayName: 'Charles Schwab Investment Management',
    country: 'EUA',
    description: 'Uma das maiores administradoras de investimentos dos EUA. Famosa por ETFs focados em dividendos e renda passiva de alta qualidade, como o consagrado SCHD.',
    website: 'https://www.schwab.com',
    badges: ['Dividendos EUA', 'Baixa Taxa', 'Foco Renda']
  },
  xp: {
    name: 'XP',
    displayName: 'XP Asset Management / Trend',
    country: 'Brasil',
    description: 'Gestora do grupo XP Inc. Oferece a linha de ETFs Trend na B3 com acesso a ouro (GOLD11), China (XINA11) e commodities globais.',
    website: 'https://www.xpasset.com.br',
    badges: ['Grupo XP', 'ETFs Trend', 'B3 Local']
  }
};

export default function GestoraView({ managerId, onNavigate }: GestoraViewProps) {
  const { etfs: ETFS_LIST } = useEtfData();
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'BR' | 'US'>('ALL');

  // Find manager info or create a fallback profile
  const key = managerId.toLowerCase().trim();
  const managerInfo = MANAGERS_INFO[key] || {
    name: managerId || 'Gestora de Ativos',
    displayName: managerId || 'Gestora de Ativos',
    country: 'Brasil / Internacional',
    description: `Visão geral e lista de todos os fundos de índice (ETFs) geridos por ${managerId || 'esta instituição'}.`,
    website: '#',
    badges: ['Fundos de Índice', 'ETFs']
  };

  // Filter ETFs belonging to this manager
  const managerETFs = useMemo(() => {
    return ETFS_LIST.filter(etf => {
      const etfManagerLower = etf.manager?.toLowerCase() || '';
      const etfNameLower = etf.name.toLowerCase();
      
      const matchManager = etfManagerLower.includes(key) ||
                           (key === 'itau' && (etfManagerLower.includes('itaú') || etfManagerLower.includes('itau') || etfNameLower.includes('itaú') || etfNameLower.includes('it now') || ['B5P211', 'IMAB11', 'IB5M11', 'IRFM11', 'DEBB11', 'DIVO11'].includes(etf.ticker))) ||
                           (key === 'blackrock' && (etfManagerLower.includes('blackrock') || etfNameLower.includes('ishares') || ['IVVB11', 'BOVA11', 'SMAL11'].includes(etf.ticker))) ||
                           (key === 'investo' && (etfManagerLower.includes('investo') || ['WRLD11', 'LFTS11', 'NTNS11'].includes(etf.ticker))) ||
                           (key === 'vanguard' && (etfManagerLower.includes('vanguard') || ['VOO', 'VNQ', 'BND'].includes(etf.ticker))) ||
                           (key === 'invesco' && (etfManagerLower.includes('invesco') || ['QQQ'].includes(etf.ticker))) ||
                           (key === 'schwab' && (etfManagerLower.includes('schwab') || ['SCHD'].includes(etf.ticker))) ||
                           (key === 'hashdex' && (etfManagerLower.includes('hashdex') || ['HASH11'].includes(etf.ticker))) ||
                           (key === 'xp' && (etfManagerLower.includes('xp') || etfNameLower.includes('trend') || ['GOLD11', 'XINA11', 'DEB11'].includes(etf.ticker)));

      if (!matchManager && managerId) return false;

      const matchMarket = marketFilter === 'ALL' || etf.market === marketFilter;
      const matchSearch = etf.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          etf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          etf.sector.toLowerCase().includes(searchTerm.toLowerCase());

      return matchMarket && matchSearch;
    });
  }, [key, managerId, marketFilter, searchTerm]);

  // Compute total AUM for manager's tracked ETFs
  const totalAumBrl = useMemo(() => {
    return managerETFs.reduce((acc, item) => {
      const aumBrl = item.market === 'US' ? item.aum * US_TO_BRL_RATE : item.aum;
      return acc + aumBrl;
    }, 0);
  }, [managerETFs]);

  // Helper function to render official SVG logos for each ETF manager
  const renderManagerLogo = (managerKey: string) => {
    switch (managerKey) {
      case 'itau':
        return (
          <div className="w-12 h-12 rounded-xl bg-[#ec7000] flex items-center justify-center text-white font-black text-xs font-sans shadow-sm shrink-0 border border-orange-600">
            <span className="text-center font-extrabold tracking-tighter leading-tight text-white">itaú</span>
          </div>
        );
      case 'blackrock':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-[10px] font-sans shadow-sm shrink-0 border border-slate-700">
            <span className="font-extrabold tracking-tighter text-amber-400">iShares</span>
          </div>
        );
      case 'investo':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-xs font-sans shadow-sm shrink-0">
            <span className="font-black tracking-tight text-white">INV</span>
          </div>
        );
      case 'hashdex':
        return (
          <div className="w-12 h-12 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 font-mono font-black text-sm shadow-sm shrink-0 border border-cyan-800">
            <span>#HDX</span>
          </div>
        );
      case 'vanguard':
        return (
          <div className="w-12 h-12 rounded-xl bg-rose-900 flex items-center justify-center text-white font-serif font-black text-xs shadow-sm shrink-0 border border-rose-800">
            <span className="tracking-tight italic">Vanguard</span>
          </div>
        );
      case 'invesco':
        return (
          <div className="w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center text-indigo-200 font-sans font-black text-xs shadow-sm shrink-0 border border-indigo-700">
            <span>QQQ</span>
          </div>
        );
      case 'schwab':
        return (
          <div className="w-12 h-12 rounded-xl bg-sky-700 flex items-center justify-center text-white font-sans font-extrabold text-[11px] shadow-sm shrink-0 border border-sky-600">
            <span>SCHWAB</span>
          </div>
        );
      case 'xp':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 font-sans font-black text-sm shadow-sm shrink-0 border border-amber-500/40">
            <span>XP</span>
          </div>
        );
      default:
        return (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <Building2 size={28} />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 animate-fade-in">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Voltar para o Início</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              {renderManagerLogo(key)}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {managerInfo.displayName}
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {managerInfo.country}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {managerInfo.description}
            </p>

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {managerInfo.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                >
                  {badge}
                </span>
              ))}

              {managerInfo.website && (
                <a
                  href={managerInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 dark:hover:bg-blue-600 border border-slate-700 dark:border-slate-700 transition-colors shadow-sm cursor-pointer ml-1"
                  title={`Visitar portal oficial da gestora ${managerInfo.name}`}
                >
                  <Globe size={13} className="text-blue-400" />
                  <span>Site Oficial ({managerInfo.name})</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="w-full md:w-auto flex flex-row md:flex-col gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-w-[200px]">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ETFs Listados
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {managerETFs.length}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Patrimônio Monitorado
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                R$ {(totalAumBrl / 1000).toFixed(1)} Bi
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white self-start sm:self-center">
          ETFs Geridos ({managerETFs.length})
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por ticker ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Market filter tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold w-full sm:w-auto justify-center">
            <button
              onClick={() => setMarketFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                marketFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setMarketFilter('BR')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                marketFilter === 'BR'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              B3 (Brasil)
            </button>
            <button
              onClick={() => setMarketFilter('US')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                marketFilter === 'US'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EUA (Global)
            </button>
          </div>
        </div>
      </div>

      {/* ETF Cards Grid */}
      {managerETFs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managerETFs.map((etf) => (
            <div
              key={etf.id}
              onClick={() => onNavigate('etf', { ticker: etf.ticker })}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors">
                      {etf.ticker}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      etf.market === 'BR'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                    }`}>
                      {etf.market} ({etf.currency})
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${
                    etf.daily_change >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {etf.daily_change >= 0 ? '+' : ''}{etf.daily_change.toFixed(2)}%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                  {etf.name}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {etf.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-400 block">Preço</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {etf.currency === 'USD' ? '$' : 'R$'} {etf.current_price.toFixed(2)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block">Taxa Adm.</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {etf.expense_ratio.toFixed(2)}% a.a.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Patrimônio</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {etf.currency === 'USD' ? '$' : 'R$'} {etf.aum >= 1000 ? `${(etf.aum / 1000).toFixed(1)}B` : `${etf.aum}M`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Building2 className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Nenhum ETF encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Tente ajustar o termo da busca ou selecione a opção de todos os mercados.
          </p>
        </div>
      )}

    </div>
  );
}
