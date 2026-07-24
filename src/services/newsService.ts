/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NewsArticle } from '../types';

/// Seed data com URLs DIRETAS e limpas dos portais de notícias (sem intermediário do Google News RSS)
const SEED_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Patrimônio de ETFs no Brasil avança e chega a três dígitos em fevereiro, mostra B3',
    summary: 'O mercado de ETFs no Brasil atingiu marco histórico com patrimônio líquido ultrapassando a casa dos três dígitos em bilhões de reais, segundo dados divulgados pela B3.',
    source_name: 'Estadão',
    source_url: 'https://einvestidor.estadao.com.br/investimentos/patrimonio-etfs-brasil-tres-digitos-b3/',
    category: 'Mercado',
    related_tickers: ['BOVA11', 'IVVB11'],
    published_at: '2026-07-23T03:42:24Z'
  },
  {
    id: 'n2',
    title: 'ETF de tecnologia espacial que investe na SpaceX (SPCX34) chega na B3',
    summary: 'Novo fundo de índice com exposição ao setor de tecnologia espacial, incluindo participação na SpaceX, começa a ser negociado na bolsa brasileira.',
    source_name: 'Investidor10',
    source_url: 'https://investidor10.com.br/noticias/',
    category: 'Lançamento',
    related_tickers: [],
    published_at: '2026-07-22T19:49:22Z'
  },
  {
    id: 'n3',
    title: 'Descubra agora 3 ETFs que pagam dividendos mensais',
    summary: 'Levantamento mostra quais fundos de índice na B3 distribuem proventos com frequência mensal aos cotistas, incluindo opções de renda fixa e ações.',
    source_name: 'Nord Investimentos',
    source_url: 'https://www.nordinvestimentos.com.br/artigos/etfs-que-pagam-dividendos',
    category: 'Mercado',
    related_tickers: ['SPYI11', 'NDIV11'],
    published_at: '2026-07-22T20:23:04Z'
  },
  {
    id: 'n4',
    title: 'A vantagem tributária que ajuda a explicar o avanço dos ETFs de renda fixa no Brasil',
    summary: 'Isenção de come-cotas e alíquota fixa de 15% para prazos longos tornam ETFs de renda fixa cada vez mais competitivos frente a fundos tradicionais de crédito privado.',
    source_name: 'InfoMoney',
    source_url: 'https://www.infomoney.com.br/onde-investir/etfs-de-renda-fixa-vantagem-tributaria/',
    category: 'Renda Fixa',
    related_tickers: ['B5P211', 'LFTS11', 'IMAB11'],
    published_at: '2026-07-21T21:46:55Z'
  },
  {
    id: 'n5',
    title: 'Investo e V8 Capital lançam primeiro ETF de NTN-F da B3 com foco em títulos prefixados',
    summary: 'Novo fundo de índice replica carteira de Notas do Tesouro Nacional série F (NTN-F), oferecendo exposição a títulos prefixados com juros semestrais.',
    source_name: 'Funds Society',
    source_url: 'https://www.fundssociety.com/pt-br/noticias/investimentos/investo-e-v8-capital-lancam-etf-ntn-f/',
    category: 'Lançamento',
    related_tickers: [],
    published_at: '2026-07-21T18:15:03Z'
  },
  {
    id: 'n6',
    title: 'Nu Asset lança 3 ETFs de renda fixa, referenciados a novos índices da B3',
    summary: 'Nubank amplia oferta de fundos de índice com três novos ETFs de renda fixa atrelados a índices recém-criados pela B3 para o segmento de crédito privado e inflação.',
    source_name: 'Bora Investir',
    source_url: 'https://borainvestir.b3.com.br/noticias/renda-fixa/nu-asset-lanca-etfs/',
    category: 'Lançamento',
    related_tickers: ['NB0211', 'NB0511', 'NB1011'],
    published_at: '2026-07-17T13:00:00Z'
  },
  {
    id: 'n7',
    title: 'Investo lança primeiro ETF da B3 focado em bancos brasileiros',
    summary: 'Novo fundo de índice oferece exposição concentrada ao setor bancário brasileiro, incluindo Itaú, Bradesco, Banco do Brasil e Santander.',
    source_name: 'Capital Aberto',
    source_url: 'https://capitalaberto.com.br/',
    category: 'Lançamento',
    related_tickers: ['BNKS11'],
    published_at: '2026-07-13T21:38:00Z'
  },
  {
    id: 'n8',
    title: 'Segundo fundo ligado a terras raras chega à B3 em menos de um mês',
    summary: 'O crescente interesse por commodities estratégicas impulsiona o lançamento de mais um ETF focado em terras raras e minerais críticos na bolsa brasileira.',
    source_name: 'CNN Brasil',
    source_url: 'https://www.cnnbrasil.com.br/economia/investimentos/etf-terras-raras-b3/',
    category: 'Lançamento',
    related_tickers: [],
    published_at: '2026-07-08T07:00:00Z'
  },
  {
    id: 'n9',
    title: 'Anbima vê crescimento estrutural dos ETFs de renda fixa e espera ganho de participação',
    summary: 'Associação de mercado de capitais avalia que o crescimento dos ETFs de renda fixa é uma tendência estrutural e não apenas conjuntural, projetando aumento de market share.',
    source_name: 'Estadão',
    source_url: 'https://einvestidor.estadao.com.br/investimentos/anbima-etfs-renda-fixa/',
    category: 'Regulação',
    related_tickers: [],
    published_at: '2026-07-08T07:00:00Z'
  },
  {
    id: 'n10',
    title: 'HASH11 ETF Profile: Dividends, Returns (BMFBOVESPA:HASH11)',
    summary: 'Análise detalhada de rentabilidade, dividendos e perfil institucional do HASH11, o maior ETF de criptomoedas da B3.',
    source_name: 'TradingView',
    source_url: 'https://br.tradingview.com/symbols/BMFBOVESPA-HASH11/',
    category: 'Cripto',
    related_tickers: ['HASH11'],
    published_at: '2026-07-13T17:29:51Z'
  },
  {
    id: 'n11',
    title: 'Maior ETF cripto local, HASH11 passará a negociar opções e futuros na B3',
    summary: 'B3 expande derivativos para o mercado de criptoativos com autorização de contratos de opções e futuros vinculados ao cotação do HASH11.',
    source_name: 'Valor Econômico',
    source_url: 'https://valor.globo.com/financas/noticia/hash11-opcoes-futuros-b3.ghtml',
    category: 'Cripto',
    related_tickers: ['HASH11'],
    published_at: '2026-04-23T07:00:00Z'
  },
  {
    id: 'n12',
    title: 'BOVA11, o ETF do Ibovespa, está mais popular do que nunca em 2026',
    summary: 'O maior ETF de ações da B3 bate recorde de cotistas e patrimônio líquido, consolidando-se como porta de entrada dos investidores ao mercado de renda variável.',
    source_name: 'Investidor10',
    source_url: 'https://investidor10.com.br/etfs/bova11/',
    category: 'Mercado',
    related_tickers: ['BOVA11'],
    published_at: '2026-05-11T07:00:00Z'
  },
  {
    id: 'n13',
    title: 'ETFs de renda fixa \'bombam\' e puxam crescimento do setor no Brasil: veja os principais',
    summary: 'O volume de recursos aplicados em ETFs de renda fixa na B3 bateu recorde histórico, refletindo a busca por alternativas de baixo custo à poupança e CDBs.',
    source_name: 'InvesTalk',
    source_url: 'https://investalk.bb.com.br/noticias/etfs-renda-fixa-crescimento',
    category: 'Renda Fixa',
    related_tickers: ['LFTS11', 'IMAB11', 'B5P211'],
    published_at: '2026-05-06T07:00:00Z'
  },
  {
    id: 'n14',
    title: 'Investo e V8 Capital lançam 1º ETF ligado a índice da B3 de Tesouro Prefixado com juros semestrais',
    summary: 'Produto inédito permite ao investidor acessar uma carteira diversificada de títulos prefixados com pagamento semestral de cupons diretamente pela bolsa.',
    source_name: 'Estadão',
    source_url: 'https://einvestidor.estadao.com.br/investimentos/investo-v8-etf-tesouro-prefixado/',
    category: 'Renda Fixa',
    related_tickers: [],
    published_at: '2026-07-21T12:07:49Z'
  }
];

/**
 * Fetches the latest ETF news.
 * In production, this will query Supabase.
 * For now, returns curated seed data from real Google News RSS scrape.
 */
export function fetchNews(limit: number = 15): NewsArticle[] {
  return SEED_NEWS.slice(0, limit);
}

/**
 * Fetches news filtered by category
 */
export function fetchNewsByCategory(category: string, limit: number = 20): NewsArticle[] {
  if (category === 'Todos') return SEED_NEWS.slice(0, limit);
  return SEED_NEWS.filter(n => n.category === category).slice(0, limit);
}

/**
 * Returns relative time label (e.g. "há 2 horas", "há 3 dias")
 */
export function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} sem`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
