/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Newspaper, ExternalLink, Clock, Tag, Filter, ChevronRight, Share2 } from 'lucide-react';
import { NewsArticle } from '../types';
import { fetchNews, fetchNewsByCategory, getRelativeTime } from '../services/newsService';
import { shareNewsOnWhatsApp } from '../utils/shareUtils';

interface NoticiasViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

const CATEGORIES = ['Todos', 'Mercado', 'Renda Fixa', 'Cripto', 'Internacional', 'Regulação', 'Lançamento'];

const CATEGORY_COLORS: Record<string, string> = {
  'Mercado': 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'Renda Fixa': 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'Cripto': 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  'Internacional': 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Regulação': 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Lançamento': 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

export default function NoticiasView({ onNavigate }: NoticiasViewProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const data = fetchNewsByCategory(activeCategory);
    setNews(data);
  }, [activeCategory]);

  // SEO: Dynamic title & meta description
  useEffect(() => {
    document.title = 'Notícias sobre ETFs Hoje | Mercado, B3 e EUA — ETF500';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Acompanhe as últimas notícias sobre ETFs brasileiros e globais. Cobertura diária de mercado, regulação, criptoativos e renda fixa para investidores de fundos de índice.');
    }

    // JSON-LD Schema CollectionPage + ItemList
    const schemaId = 'news-schema-jsonld';
    let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Notícias sobre ETFs — ETF500",
      "url": "https://etf500.com.br/?view=noticias",
      "description": "Feed de notícias curadas sobre ETFs brasileiros e globais.",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": news.slice(0, 10).map((n, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "NewsArticle",
            "headline": n.title,
            "datePublished": n.published_at,
            "publisher": { "@type": "Organization", "name": n.source_name },
            "url": n.source_url
          }
        }))
      }
    };

    scriptEl.textContent = JSON.stringify(schema);

    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [news]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
          Início
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-900 dark:text-white font-bold">Notícias ETFs</span>
      </div>

      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800">
            <Newspaper size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notícias sobre ETFs
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Cobertura diária de mercado, lançamentos e regulação • Fontes: InfoMoney, Estadão, Valor, CNN, Investidor10
            </p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap" id="news-category-filters">
        <Filter size={14} className="text-slate-400" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all space-y-3 flex flex-col"
            id={`news-card-${article.id}`}
          >
            {/* Category Badge + Time */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS['Mercado']}`}>
                {article.category}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                <Clock size={10} />
                {getRelativeTime(article.published_at)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
              {article.title}
            </h3>

            {/* Summary */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              {article.summary}
            </p>

            {/* Related Tickers */}
            {article.related_tickers.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag size={10} className="text-slate-400" />
                {article.related_tickers.map(ticker => (
                  <span
                    key={ticker}
                    className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/60"
                  >
                    {ticker}
                  </span>
                ))}
              </div>
            )}

            {/* Source Footer & WhatsApp share */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                {article.source_name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    shareNewsOnWhatsApp(article.title, article.source_url);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Compartilhar notícia no WhatsApp"
                  id={`btn-share-news-${article.id}`}
                >
                  <Share2 size={13} />
                </button>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:underline">
                  Ler <ExternalLink size={10} />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Empty state */}
      {news.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Newspaper size={40} className="mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nenhuma notícia encontrada para a categoria <strong>{activeCategory}</strong>.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center pb-4">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed">
          As notícias são curadas automaticamente a partir de fontes públicas como InfoMoney, Estadão, Valor Econômico, CNN Brasil e Investidor10.
          O ETF500 não produz conteúdo editorial próprio. Os links redirecionam para as matérias originais em seus respectivos veículos.
        </p>
      </div>
    </div>
  );
}
