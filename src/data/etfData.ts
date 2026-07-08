/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ETF, HistoricalPrice } from '../types';

export const US_TO_BRL_RATE = 5.65;

export const ETFS_LIST: ETF[] = [
  {
    id: '1',
    ticker: 'IVVB11',
    name: 'iShares S&P 500 Fundo de Índice',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.20,
    dividend_yield: 0.00, // Reinvests automatically
    aum: 18450, // in Millions BRL (R$ 18.4B)
    description: 'O IVVB11 é um ETF gerido pela BlackRock Brasil que busca replicar o desempenho do índice S&P 500 das maiores empresas americanas, convertido para Reais. É uma das formas mais populares e eficientes para o investidor brasileiro acessar o mercado de ações dos EUA diretamente pela B3, contando com proteção cambial natural do Dólar.',
    sector: 'Diversificado Global',
    daily_change: 1.32,
    current_price: 312.45,
    holdings: [
      { name: 'Microsoft Corp.', percentage: 7.1 },
      { name: 'Apple Inc.', percentage: 6.8 },
      { name: 'NVIDIA Corp.', percentage: 6.5 },
      { name: 'Amazon.com Inc.', percentage: 3.7 },
      { name: 'Alphabet Inc. (Google)', percentage: 3.2 },
      { name: 'Meta Platforms (Facebook)', percentage: 2.4 },
      { name: 'Berkshire Hathaway', percentage: 1.7 },
      { name: 'Eli Lilly & Co.', percentage: 1.5 },
    ]
  },
  {
    id: '2',
    ticker: 'BOVA11',
    name: 'iShares Ibovespa Fundo de Índice',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.30,
    dividend_yield: 0.00, // Reinvests automatically
    aum: 12100, // in Millions BRL (R$ 12.1B)
    description: 'O BOVA11 é o ETF mais negociado do mercado brasileiro. Gerido pela BlackRock, ele busca refletir o desempenho do índice Ibovespa, que reúne as empresas mais líquidas e representativas da B3. É ideal para quem busca exposição ampla ao mercado acionário brasileiro de forma simples e de baixo custo.',
    sector: 'Nacional Multissetorial',
    daily_change: -0.45,
    current_price: 124.80,
    holdings: [
      { name: 'Vale S.A.', percentage: 11.2 },
      { name: 'Petrobras (PETR4)', percentage: 8.5 },
      { name: 'Itaú Unibanco', percentage: 7.2 },
      { name: 'Petrobras (PETR3)', percentage: 4.8 },
      { name: 'Bradesco', percentage: 4.1 },
      { name: 'B3 S.A.', percentage: 3.5 },
      { name: 'Ambev S.A.', percentage: 3.1 },
      { name: 'WEG S.A.', percentage: 2.8 },
    ]
  },
  {
    id: '3',
    ticker: 'SMAL11',
    name: 'iShares BM&FBOVESPA Small Cap',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.50,
    dividend_yield: 0.00,
    aum: 5900, // R$ 5.9B
    description: 'O SMAL11 replica o índice SMLL da B3, focado em empresas brasileiras de menor capitalização de mercado (Small Caps). Estas empresas possuem maior potencial de crescimento a longo prazo, porém com volatilidade significativamente maior do que as blue chips do Ibovespa.',
    sector: 'Small Caps Brasil',
    daily_change: -1.15,
    current_price: 98.20,
    holdings: [
      { name: 'Embraer S.A.', percentage: 3.5 },
      { name: 'Localiza Rent a Car', percentage: 3.2 },
      { name: '3R Petroleum', percentage: 2.9 },
      { name: 'Cury Construtora', percentage: 2.4 },
      { name: 'São Martinho S.A.', percentage: 2.1 },
      { name: 'Arezo&Co', percentage: 2.0 },
      { name: 'Minerva Foods', percentage: 1.8 },
      { name: 'Grupo Soma', percentage: 1.7 },
    ]
  },
  {
    id: '4',
    ticker: 'HASH11',
    name: 'Hashdex Nasdaq Crypto Index',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 1.30,
    dividend_yield: 0.00,
    aum: 2450, // R$ 2.4B
    description: 'O HASH11 é pioneiro na B3, replicando o Nasdaq Crypto Index (NCI). Ele oferece exposição diversificada e regulada ao mercado de criptoativos globais, com custódia institucional de altíssima segurança. Seu portfólio inclui as principais criptomoedas do mundo de forma ponderada.',
    sector: 'Tecnologia & Cripto',
    daily_change: 4.85,
    current_price: 52.30,
    holdings: [
      { name: 'Bitcoin (BTC)', percentage: 67.5 },
      { name: 'Ethereum (ETH)', percentage: 24.2 },
      { name: 'Solana (SOL)', percentage: 3.8 },
      { name: 'Chainlink (LINK)', percentage: 1.2 },
      { name: 'Uniswap (UNI)', percentage: 1.1 },
      { name: 'Outros Criptoativos', percentage: 2.2 },
    ]
  },
  {
    id: '5',
    ticker: 'WRLD11',
    name: 'Investo MSCI World Fundo de Índice',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.30,
    dividend_yield: 0.00,
    aum: 1150, // R$ 1.1B
    description: 'O WRLD11 investe no ETF VT (Vanguard Total World Stock), proporcionando diversificação instantânea em mais de 9.000 empresas de mais de 40 países desenvolvidos e emergentes. Ideal como pilar de diversificação global passiva para carteiras de longo prazo.',
    sector: 'Ações Globais',
    daily_change: 1.10,
    current_price: 104.90,
    holdings: [
      { name: 'Mercado de Ações dos EUA', percentage: 62.4 },
      { name: 'Mercados Europeus', percentage: 16.1 },
      { name: 'Mercados Asiáticos', percentage: 11.5 },
      { name: 'Mercados Emergentes', percentage: 8.2 },
      { name: 'Outras Regiões', percentage: 1.8 },
    ]
  },
  {
    id: '6',
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.03,
    dividend_yield: 1.35,
    aum: 485000, // $485B
    description: 'O Vanguard S&P 500 ETF (VOO) investe nas 500 maiores empresas de capital aberto dos EUA. Com uma das menores taxas de administração do mercado global (apenas 0,03% ao ano), o VOO é o padrão-ouro de investimentos passivos de longo prazo do mundo inteiro.',
    sector: 'Diversificado EUA',
    daily_change: 1.28,
    current_price: 504.80,
    holdings: [
      { name: 'Microsoft Corp.', percentage: 7.2 },
      { name: 'Apple Inc.', percentage: 6.9 },
      { name: 'NVIDIA Corp.', percentage: 6.6 },
      { name: 'Amazon.com Inc.', percentage: 3.8 },
      { name: 'Alphabet Inc.', percentage: 3.2 },
      { name: 'Meta Platforms', percentage: 2.4 },
      { name: 'Berkshire Hathaway', percentage: 1.7 },
      { name: 'Eli Lilly & Co.', percentage: 1.5 },
    ]
  },
  {
    id: '7',
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust Series 1',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.20,
    dividend_yield: 0.58,
    aum: 232000, // $232B
    description: 'O Invesco QQQ acompanha o índice Nasdaq-100, composto pelas 100 maiores empresas não financeiras listadas na Nasdaq. É o ETF de referência mundial para investidores focados em inovação, tecnologia de ponta, internet, inteligência artificial e biotecnologia.',
    sector: 'Tecnologia EUA',
    daily_change: 1.95,
    current_price: 442.30,
    holdings: [
      { name: 'Microsoft Corp.', percentage: 8.8 },
      { name: 'Apple Inc.', percentage: 8.2 },
      { name: 'NVIDIA Corp.', percentage: 7.9 },
      { name: 'Amazon.com Inc.', percentage: 5.1 },
      { name: 'Meta Platforms', percentage: 4.6 },
      { name: 'Broadcom Inc.', percentage: 4.1 },
      { name: 'Alphabet Inc. (Class A)', percentage: 2.8 },
      { name: 'Tesla Inc.', percentage: 2.5 },
    ]
  },
  {
    id: '8',
    ticker: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.06,
    dividend_yield: 3.42,
    aum: 52400, // $52.4B
    description: 'O SCHD replica o índice Dow Jones U.S. Dividend 100, focado em empresas americanas de alta qualidade, com histórico de dividendos consistentes, balanços sólidos e fundamentos robustos de rentabilidade. Excelente para investidores focados em renda passiva recorrente.',
    sector: 'Dividendos EUA',
    daily_change: 0.15,
    current_price: 78.60,
    holdings: [
      { name: 'Broadcom Inc.', percentage: 4.5 },
      { name: 'AbbVie Inc.', percentage: 4.3 },
      { name: 'Merck & Co.', percentage: 4.1 },
      { name: 'Home Depot Inc.', percentage: 4.0 },
      { name: 'Texas Instruments', percentage: 3.9 },
      { name: 'Chevron Corp.', percentage: 3.8 },
      { name: 'Amgen Inc.', percentage: 3.6 },
      { name: 'Coca-Cola Co.', percentage: 3.5 },
    ]
  },
  {
    id: '9',
    ticker: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.12,
    dividend_yield: 3.82,
    aum: 31800, // $31.8B
    description: 'O VNQ investe em fundos de investimento imobiliário americanos (REITs) que adquirem edifícios de escritórios, hotéis, shopping centers, galpões logísticos e residências nos EUA. É o ETF ideal para expor a sua carteira ao imobiliário global de forma líquida e com altos dividendos mensais.',
    sector: 'Imobiliário (REITs)',
    daily_change: -0.85,
    current_price: 84.15,
    holdings: [
      { name: 'Prologis Inc. (Galpões)', percentage: 7.8 },
      { name: 'American Tower Corp. (Antenas)', percentage: 6.9 },
      { name: 'Equinix Inc. (Data Centers)', percentage: 5.5 },
      { name: 'Simon Property Group (Shoppings)', percentage: 3.8 },
      { name: 'Welltower Inc. (Hospitais/Sênior)', percentage: 3.5 },
      { name: 'Digital Realty Trust', percentage: 3.1 },
      { name: 'Public Storage', percentage: 2.9 },
      { name: 'Realty Income Corp.', percentage: 2.7 },
    ]
  },
  {
    id: '10',
    ticker: 'XINA11',
    name: 'Trend China Fundo de Índice B3',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.30,
    dividend_yield: 0.00,
    aum: 520, // R$ 520M
    description: 'O XINA11 replica o índice MSCI China, reunindo gigantes do mercado de tecnologia, varejo, energia e manufatura chinês. Uma das poucas formas acessíveis para o brasileiro de diversificar a carteira para fora do eixo Ocidental de forma simples.',
    sector: 'Mercados Emergentes',
    daily_change: -1.82,
    current_price: 6.85,
    holdings: [
      { name: 'Tencent Holdings', percentage: 14.1 },
      { name: 'Alibaba Group', percentage: 8.5 },
      { name: 'Meituan Dianping', percentage: 4.2 },
      { name: 'China Construction Bank', percentage: 3.1 },
      { name: 'JD.com Inc.', percentage: 2.4 },
      { name: 'Baidu Inc.', percentage: 1.8 },
      { name: 'Xiaomi Corp.', percentage: 1.5 },
      { name: 'Ping An Insurance', percentage: 1.4 },
    ]
  }
];

// Helper to generate a deterministic series of prices
export function generateHistory(ticker: string, timeframe: string): HistoricalPrice[] {
  const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Define base parameters based on ticker characteristics
  let basePrice = 100;
  let drift = 0.0005; // general upward trend
  let volatility = 0.015;
  
  if (ticker === 'IVVB11' || ticker === 'VOO') {
    basePrice = ticker === 'VOO' ? 500 : 310;
    drift = 0.0006;
    volatility = 0.011;
  } else if (ticker === 'BOVA11') {
    basePrice = 125;
    drift = 0.0002;
    volatility = 0.014;
  } else if (ticker === 'SMAL11') {
    basePrice = 98;
    drift = 0.0001;
    volatility = 0.019;
  } else if (ticker === 'HASH11') {
    basePrice = 52;
    drift = 0.0012; // super volatile but fast growing
    volatility = 0.038;
  } else if (ticker === 'QQQ') {
    basePrice = 440;
    drift = 0.0009;
    volatility = 0.015;
  } else if (ticker === 'SCHD') {
    basePrice = 78;
    drift = 0.0004;
    volatility = 0.009;
  } else if (ticker === 'VNQ') {
    basePrice = 84;
    drift = 0.0002;
    volatility = 0.013;
  } else if (ticker === 'WRLD11') {
    basePrice = 105;
    drift = 0.0005;
    volatility = 0.010;
  } else if (ticker === 'XINA11') {
    basePrice = 7;
    drift = -0.0001; // sluggish
    volatility = 0.022;
  } else {
    basePrice = (seed % 200) + 20;
    drift = ((seed % 10) - 4) * 0.0001;
    volatility = 0.01 + (seed % 20) * 0.001;
  }

  // Determine number of days
  let days = 30; // 1M
  if (timeframe === '6M') days = 180;
  else if (timeframe === '1Y') days = 365;
  else if (timeframe === '5Y') days = 365 * 5;
  else if (timeframe === 'MAX') days = 365 * 10;

  const result: HistoricalPrice[] = [];
  const today = new Date();
  
  let currentPrice = basePrice;
  
  // We generate back from today
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    // Deterministic random walk using sine values based on seed + day count
    const randFactor = Math.sin(seed + i * 0.73) * Math.cos(seed * 0.41 + i * 0.29);
    const noise = randFactor * volatility;
    
    currentPrice = currentPrice * (1 + drift + noise);
    if (currentPrice < 1) currentPrice = 1; // can't go to zero

    // Only add weekdays
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      result.push({
        date: d.toISOString().split('T')[0],
        close_price: Math.round(currentPrice * 100) / 100,
        volume: Math.round((Math.sin(seed + i) + 2) * 500000 + 100000)
      });
    }
  }
  
  return result;
}
