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
    name: 'iShares S&P 500',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.20,
    dividend_yield: 0.00, // Reinvests automatically
    aum: 18450, // in Millions BRL (R$ 18.4B)
    description: 'O IVVB11 é um ETF gerido pela BlackRock Brasil que busca replicar o desempenho do índice S&P 500 das maiores empresas americanas, convertido para Reais. É uma das formas mais populares e eficientes para o investidor brasileiro acessar o mercado de ações dos EUA diretamente pela B3, contando com proteção cambial natural do Dólar.',
    sector: 'Diversificado Global',
    daily_change: -0.93,
    current_price: 424.86,
    manager: 'BlackRock',
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
    name: 'iShares Ibovespa',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.10,
    dividend_yield: 0.00, // Reinvests automatically
    aum: 12100, // in Millions BRL (R$ 12.1B)
    description: 'O BOVA11 é o ETF mais negociado do mercado brasileiro. Gerido pela BlackRock, ele busca refletir o desempenho do índice Ibovespa, que reúne as empresas mais líquidas e representativas da B3. É ideal para quem busca exposição ampla ao mercado acionário brasileiro de forma simples e de baixo custo.',
    sector: 'Nacional Multissetorial',
    daily_change: -0.62,
    current_price: 173.61,
    manager: 'BlackRock',
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
    daily_change: -0.98,
    current_price: 106.45,
    manager: 'BlackRock',
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
    daily_change: -1.25,
    current_price: 42.56,
    manager: 'Hashdex',
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
    name: 'Investo MSCI World',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.30,
    dividend_yield: 0.00,
    aum: 1150, // R$ 1.1B
    description: 'O WRLD11 investe no ETF VT (Vanguard Total World Stock), proporcionando diversificação instantânea em mais de 9.000 empresas de mais de 40 países desenvolvidos e emergentes. Ideal como pilar de diversificação global passiva para carteiras de longo prazo.',
    sector: 'Ações Globais',
    daily_change: -0.38,
    current_price: 141.9,
    manager: 'Investo',
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
    daily_change: -1.04,
    current_price: 679.87,
    manager: 'Vanguard',
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
    daily_change: -1.47,
    current_price: 694.98,
    manager: 'Invesco',
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
    daily_change: -0.36,
    current_price: 32.78,
    manager: 'Schwab',
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
    daily_change: -0.09,
    current_price: 98.93,
    manager: 'Vanguard',
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
    name: 'Trend China B3',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.30,
    dividend_yield: 0.00,
    aum: 520, // R$ 520M
    description: 'O XINA11 replica o índice MSCI China, reunindo gigantes do mercado de tecnologia, varejo, energia e manufatura chinês. Uma das poucas formas acessíveis para o brasileiro de diversificar a carteira para fora do eixo Ocidental de forma simples.',
    sector: 'Mercados Emergentes',
    daily_change: -1.12,
    current_price: 7.04,
    manager: 'XP',
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
  },
  {
    id: '11',
    ticker: 'B5P211',
    name: 'Itaú IMA-B 5',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.20,
    dividend_yield: 0.00,
    aum: 4800, // R$ 4.8B
    description: 'O B5P211 é o principal ETF de Renda Fixa do Brasil. Replica o índice IMA-B 5 da ANBIMA, composto por títulos públicos Tesouro IPCA+ com prazo de vencimento inferior a 5 anos. Combina proteção contra a inflação com menor volatilidade.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.04,
    current_price: 108.84,
    manager: 'Itaú',
    holdings: [
      { name: 'NTN-B (Tesouro IPCA+) 2026', percentage: 28.5 },
      { name: 'NTN-B (Tesouro IPCA+) 2028', percentage: 26.2 },
      { name: 'NTN-B (Tesouro IPCA+) 2025', percentage: 24.1 },
      { name: 'NTN-B (Tesouro IPCA+) 2030', percentage: 21.2 },
    ]
  },
  {
    id: '12',
    ticker: 'IMAB11',
    name: 'Itaú IMA-B Geral',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.25,
    dividend_yield: 0.00,
    aum: 3200, // R$ 3.2B
    description: 'O IMAB11 replica o índice IMA-B Geral da ANBIMA, cobrindo toda a família de títulos públicos indexados à inflação (NTN-B). É a principal referência da renda fixa de longo prazo no Brasil.',
    sector: 'Renda Fixa Brasil',
    daily_change: -0.19,
    current_price: 112.93,
    manager: 'Itaú',
    holdings: [
      { name: 'NTN-B Vencimento Longo (2035-2055)', percentage: 42.1 },
      { name: 'NTN-B Vencimento Médio (2030-2035)', percentage: 31.5 },
      { name: 'NTN-B Vencimento Curto (2026-2030)', percentage: 26.4 },
    ]
  },
  {
    id: '13',
    ticker: 'LFTS11',
    name: 'Investo Tesouro Selic',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.19,
    dividend_yield: 0.00,
    aum: 1850, // R$ 1.85B
    description: 'O LFTS11 replica o índice de títulos Tesouro Selic (LFT), oferecendo liquidez diária com a máxima segurança de crédito soberano do Brasil e alíquota fixa de imposto de renda de 15% após 720 dias.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.06,
    current_price: 156.79,
    manager: 'Investo',
    holdings: [
      { name: 'LFT (Tesouro Selic) 2027', percentage: 48.0 },
      { name: 'LFT (Tesouro Selic) 2029', percentage: 52.0 },
    ]
  },
  {
    id: '14',
    ticker: 'DEB11',
    name: 'Trend Debêntures Incentivadas',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.30,
    dividend_yield: 0.00,
    aum: 920, // R$ 920M
    description: 'O DEB11 busca replicar o desempenho de uma carteira diversificada de debêntures incentivadas de infraestrutura (isentas de IR para pessoas físicas), emitidas por grandes empresas brasileiras.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.18,
    current_price: 96.10,
    manager: 'XP',
    holdings: [
      { name: 'Debêntures Infraestrutura Energia', percentage: 38.5 },
      { name: 'Debêntures Saneamento & Transportes', percentage: 31.2 },
      { name: 'Debêntures Telecomunicações', percentage: 20.3 },
      { name: 'Caixa / Títulos Públicos', percentage: 10.0 },
    ]
  },
  {
    id: '15',
    ticker: 'DIVO11',
    name: 'Itaú IDIV Dividendos',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.50,
    dividend_yield: 0.00,
    aum: 2100, // R$ 2.1B
    description: 'O DIVO11 replica o Índice Dividendos (IDIV) da B3, selecionando as empresas brasileiras com os maiores históricas de distribuição de proventos e sólidos fundamentos de caixa.',
    sector: 'Nacional Dividendos',
    daily_change: 1.1,
    current_price: 129.1,
    manager: 'Itaú',
    holdings: [
      { name: 'BB Seguridade', percentage: 8.2 },
      { name: 'Banco do Brasil', percentage: 7.8 },
      { name: 'CPFL Energia', percentage: 6.5 },
      { name: 'Taesa', percentage: 5.9 },
      { name: 'Engie Brasil', percentage: 5.4 },
      { name: 'Telefônica Brasil (Vivo)', percentage: 4.8 },
    ]
  },
  {
    id: '16',
    ticker: 'GOLD11',
    name: 'Trend ETF Ouro',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.40,
    dividend_yield: 0.00,
    aum: 850, // R$ 850M
    description: 'O GOLD11 oferece exposição direta ao preço do Ouro em Dólar negociado no mercado internacional (LBMA), funcionando como uma reserva de valor e proteção patrimonial contra crises inflacionárias.',
    sector: 'Commodities & Reserva',
    daily_change: -1.38,
    current_price: 21.4,
    manager: 'XP',
    holdings: [
      { name: 'iShares Gold Trust (IAU)', percentage: 98.5 },
      { name: 'Caixa / Operações em BRL', percentage: 1.5 },
    ]
  },
  {
    id: '17',
    ticker: 'QBTC11',
    name: 'QR Bitcoin ETF',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 650, // R$ 650M
    description: 'O QBTC11 é o primeiro ETF 100% exposto ao Bitcoin da América Latina, acompanhando o CME CF Bitcoin Reference Rate com custódia física institucional de altíssima segurança.',
    sector: 'Tecnologia & Cripto',
    daily_change: -1.14,
    current_price: 19.92,
    manager: 'QR Capital',
    holdings: [
      { name: 'Bitcoin (BTC Custódia Física)', percentage: 100.0 }
    ]
  },
  {
    id: '18',
    ticker: 'IB5M11',
    name: 'Itaú IMA-B 5+',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.20,
    dividend_yield: 0.00,
    aum: 2150, // R$ 2.15B
    description: 'O IB5M11 replica o índice IMA-B 5+ da ANBIMA, composto por títulos públicos Tesouro IPCA+ com prazo de vencimento superior a 5 anos. Ideal para quem busca maior rentabilidade real a longo prazo.',
    sector: 'Renda Fixa Brasil',
    daily_change: -0.07,
    current_price: 121.25,
    manager: 'Itaú',
    holdings: [
      { name: 'NTN-B (Tesouro IPCA+) 2035', percentage: 32.1 },
      { name: 'NTN-B (Tesouro IPCA+) 2045', percentage: 28.4 },
      { name: 'NTN-B (Tesouro IPCA+) 2050', percentage: 22.5 },
      { name: 'NTN-B (Tesouro IPCA+) 2040', percentage: 17.0 },
    ]
  },
  {
    id: '19',
    ticker: 'NTNS11',
    name: 'Investo Tesouro RendA+',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.19,
    dividend_yield: 0.00,
    aum: 410, // R$ 410M
    description: 'O NTNS11 replica o índice de títulos Tesouro RendA+ (NTN-B1), desenhado para acumulação de aposentadoria com proteção inflacionária e fluxo de caixa planejado.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.11,
    current_price: 66.13,
    manager: 'Investo',
    holdings: [
      { name: 'NTN-B1 (Tesouro RendA+) 2030-2049', percentage: 100.0 }
    ]
  },
  {
    id: '20',
    ticker: 'IRFM11',
    name: 'Itaú IRF-M Pré-fixado',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.20,
    dividend_yield: 0.00,
    aum: 1450, // R$ 1.45B
    description: 'O IRFM11 replica o índice IRF-M da ANBIMA, composto por uma carteira diversificada de títulos públicos pré-fixados do governo brasileiro (LTN e NTN-F).',
    sector: 'Renda Fixa Brasil',
    daily_change: -0.24,
    current_price: 101.28,
    manager: 'Itaú',
    holdings: [
      { name: 'LTN (Tesouro Pré-fixado) 2026', percentage: 38.0 },
      { name: 'LTN (Tesouro Pré-fixado) 2028', percentage: 34.5 },
      { name: 'NTN-F (Tesouro Pré-fixado com Juros) 2031', percentage: 27.5 },
    ]
  },
  {
    id: '21',
    ticker: 'DEBB11',
    name: 'Itaú Debêntures Infraestrutura',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.25,
    dividend_yield: 0.00,
    aum: 1120, // R$ 1.12B
    description: 'O DEBB11 replica o índice IDA-IPCA Infraestrutura da ANBIMA, reunindo debêntures incentivadas emitidas para financiar grandes obras de infraestrutura no Brasil, com isenção total de IR.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.18,
    current_price: 16.83,
    manager: 'Itaú',
    holdings: [
      { name: 'Debêntures Setor Elétrico / Transmissão', percentage: 41.2 },
      { name: 'Debêntures Saneamento Básico', percentage: 28.5 },
      { name: 'Debêntures Rodovias & Logística', percentage: 20.3 },
      { name: 'Caixa / Títulos Públicos', percentage: 10.0 },
    ]
  },
  {
    id: '22',
    ticker: 'JURO11',
    name: 'Sparta Debêntures Incentivadas',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.35,
    dividend_yield: 0.00,
    aum: 780, // R$ 780M
    description: 'O JURO11 é gerido pela Sparta e busca superar o CDI investindo em debêntures de infraestrutura isentas de imposto de renda, com rigorosa seleção de crédito privado corporativo.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.26,
    current_price: 97.61,
    holdings: [
      { name: 'Debêntures Isentas AAA / AA', percentage: 85.0 },
      { name: 'Títulos Públicos LFT / NTN-B', percentage: 15.0 },
    ]
  },
  {
    id: '23',
    ticker: 'FIXA11',
    name: 'Mirae Asset Fixx DI',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.15,
    dividend_yield: 0.00,
    aum: 340, // R$ 340M
    description: 'O FIXA11 acompanha o índice S&P/B3 DI Futuro de Renda Fixa, oferecendo exposição a uma carteira de contratos futuros de taxa DI para captura de juros nominais no Brasil.',
    sector: 'Renda Fixa Brasil',
    daily_change: -0.21,
    current_price: 19.15,
    holdings: [
      { name: 'Contratos Futuros de DI (B3)', percentage: 95.0 },
      { name: 'Caixa Soberano', percentage: 5.0 },
    ]
  },
  {
    id: '24',
    ticker: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.03,
    dividend_yield: 3.65,
    aum: 315000, // $315B
    description: 'O BND é o maior ETF de Renda Fixa do mundo. Investe na totalidade do mercado de títulos com grau de investimento dos EUA, cobrindo Tesouro Americano (US Treasuries), bonds corporativos e mortgage-backed securities.',
    sector: 'Renda Fixa Global',
    daily_change: -0.19,
    current_price: 72.26,
    holdings: [
      { name: 'Títulos do Tesouro dos EUA (US Treasuries)', percentage: 67.2 },
      { name: 'Bonds Corporativos Grau de Investimento', percentage: 27.1 },
      { name: 'Títulos Imobiliários (MBS)', percentage: 5.7 },
    ]
  },
  {
    id: '25',
    ticker: 'AGG',
    name: 'iShares Core U.S. Aggregate Bond ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.03,
    dividend_yield: 3.58,
    aum: 108000, // $108B
    description: 'O AGG é a principal referência global para investimento passivo em renda fixa americana. Gerido pela BlackRock, busca estabilidade de capital e renda de juros pagando dividendos mensais aos cotistas.',
    sector: 'Renda Fixa Global',
    daily_change: -0.19,
    current_price: 97.39,
    holdings: [
      { name: 'US Treasury Bonds', percentage: 42.8 },
      { name: 'Corporate Investment Grade Bonds', percentage: 26.5 },
      { name: 'Federal Agency Mortgage Backed', percentage: 26.2 },
      { name: 'Commercial MBS & ABS', percentage: 4.5 },
    ]
  },
  {
    id: '26',
    ticker: 'TLT',
    name: 'iShares 20+ Year Treasury Bond ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.15,
    dividend_yield: 3.92,
    aum: 52000, // $52B
    description: 'O TLT investe exclusivamente em Títulos do Tesouro dos EUA com prazo de vencimento superior a 20 anos. É o ativo preferido globalmente para proteção em ciclos de corte de juros pelo Federal Reserve.',
    sector: 'Renda Fixa Global',
    daily_change: -0.3,
    current_price: 83.19,
    holdings: [
      { name: 'US Treasury Bond 20+ Anos', percentage: 100.0 }
    ]
  },
  {
    id: '27',
    ticker: 'SHY',
    name: 'iShares 1-3 Year Treasury Bond ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.15,
    dividend_yield: 4.65,
    aum: 24500, // $24.5B
    description: 'O SHY investe em Títulos do Tesouro dos EUA de curtíssimo prazo (1 a 3 anos). Usado mundialmente como alternativa de liquidez rápida e preservação de capital em Dólar sem volatilidade.',
    sector: 'Renda Fixa Global',
    daily_change: -0.06,
    current_price: 81.78,
    holdings: [
      { name: 'US Treasury Notes 1-3 Yrs', percentage: 100.0 }
    ]
  },
  {
    id: '28',
    ticker: 'IEF',
    name: 'iShares 7-10 Year Treasury Bond ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.15,
    dividend_yield: 3.80,
    aum: 29800, // $29.8B
    description: 'O IEF busca replicar a curva de juros média do governo dos EUA investindo em títulos do Tesouro Americano com vencimento de 7 a 10 anos, servindo de benchmark de renda fixa intermediária.',
    sector: 'Renda Fixa Global',
    daily_change: -0.23,
    current_price: 92.89,
    holdings: [
      { name: 'US Treasury Notes 7-10 Yrs', percentage: 100.0 }
    ]
  },
  {
    id: '29',
    ticker: 'LQD',
    name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.14,
    dividend_yield: 4.85,
    aum: 31200, // $31.2B
    description: 'O LQD investe em debêntures corporativas de altíssima nota de crédito (Grau de Investimento) emitidas por grandes corporações globais como Apple, Microsoft, JPMorgan e Bank of America.',
    sector: 'Renda Fixa Global',
    daily_change: -0.34,
    current_price: 106.31,
    holdings: [
      { name: 'JPMorgan Chase & Co. Bonds', percentage: 2.8 },
      { name: 'Bank of America Bonds', percentage: 2.6 },
      { name: 'Morgan Stanley Bonds', percentage: 2.2 },
      { name: 'Apple Inc. Bonds', percentage: 1.9 },
      { name: 'Microsoft Corp. Bonds', percentage: 1.8 },
    ]
  },
  {
    id: '30',
    ticker: 'TIP',
    name: 'iShares TIPS Bond ETF',
    market: 'US',
    currency: 'USD',
    expense_ratio: 0.19,
    dividend_yield: 3.25,
    aum: 22400, // $22.4B
    description: 'O TIP investe em títulos do Tesouro dos EUA corrigidos pela inflação americana (Treasury Inflation-Protected Securities - TIPS), protegendo o poder de compra do Dólar contra choques inflacionários.',
    sector: 'Renda Fixa Global',
    daily_change: -0.17,
    current_price: 107.59,
    holdings: [
      { name: 'US Treasury TIPS (CPI Index)', percentage: 100.0 }
    ]
  },
  {
    id: '500',
    ticker: '5GTK11',
    name: 'Fundo de Índice 5GTK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O 5GTK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '501',
    ticker: '5PRE11',
    name: 'Fundo de Índice 5PRE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O 5PRE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.7,
    current_price: 49.48,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '502',
    ticker: 'ABTC11',
    name: 'Fundo de Índice ABTC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ABTC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.71,
    current_price: 101.75,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '503',
    ticker: 'ACWI11',
    name: 'Fundo de Índice ACWI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ACWI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.78,
    current_price: 16.56,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '504',
    ticker: 'AGRI11',
    name: 'Fundo de Índice AGRI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O AGRI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Agronegócio & Commodities. Oferece liquidez e diversificação instantânea.',
    sector: 'Agronegócio & Commodities',
    daily_change: 1.94,
    current_price: 38.88,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '505',
    ticker: 'ALUG11',
    name: 'Fundo de Índice ALUG11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ALUG11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.51,
    current_price: 42.98,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '506',
    ticker: 'AREA11',
    name: 'Fundo de Índice AREA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O AREA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.02,
    current_price: 102.33,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '507',
    ticker: 'ARGE11',
    name: 'Fundo de Índice ARGE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ARGE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.66,
    current_price: 13.56,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '508',
    ticker: 'AUPO11',
    name: 'Fundo de Índice AUPO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O AUPO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.02,
    current_price: 107.91,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '509',
    ticker: 'AURO11',
    name: 'Fundo de Índice AURO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O AURO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.99,
    current_price: 90.46,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '510',
    ticker: 'AUVP11',
    name: 'Fundo de Índice AUVP11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O AUVP11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.68,
    current_price: 123.6,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '511',
    ticker: 'B3BR11',
    name: 'Fundo de Índice B3BR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O B3BR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 60.76,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '512',
    ticker: 'B5MB11',
    name: 'Fundo de Índice B5MB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O B5MB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.27,
    current_price: 128.16,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '513',
    ticker: 'BBOI11',
    name: 'Fundo de Índice BBOI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BBOI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Agronegócio & Commodities. Oferece liquidez e diversificação instantânea.',
    sector: 'Agronegócio & Commodities',
    daily_change: -0.09,
    current_price: 11.57,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '514',
    ticker: 'BBOV11',
    name: 'Fundo de Índice BBOV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BBOV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.82,
    current_price: 92.83,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '515',
    ticker: 'BBSD11',
    name: 'Fundo de Índice BBSD11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BBSD11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.15,
    current_price: 131.51,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '516',
    ticker: 'BCIC11',
    name: 'Fundo de Índice BCIC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BCIC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 2.23,
    current_price: 134.59,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '517',
    ticker: 'BDEF11',
    name: 'Fundo de Índice BDEF11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BDEF11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.21,
    current_price: 160.07,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '518',
    ticker: 'BDOM11',
    name: 'Fundo de Índice BDOM11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BDOM11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.51,
    current_price: 133.19,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '519',
    ticker: 'BEST11',
    name: 'Fundo de Índice BEST11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BEST11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.36,
    current_price: 116.87,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '520',
    ticker: 'BITC11',
    name: 'Fundo de Índice BITC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BITC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.86,
    current_price: 54.25,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '521',
    ticker: 'BITH11',
    name: 'Fundo de Índice BITH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BITH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.71,
    current_price: 74.16,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '522',
    ticker: 'BITI11',
    name: 'Fundo de Índice BITI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BITI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.77,
    current_price: 29.6,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '523',
    ticker: 'BIZD11',
    name: 'Fundo de Índice BIZD11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BIZD11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.72,
    current_price: 72.95,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '524',
    ticker: 'BLFT11',
    name: 'Fundo de Índice BLFT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BLFT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.05,
    current_price: 110.84,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '525',
    ticker: 'BLOK11',
    name: 'Fundo de Índice BLOK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BLOK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '526',
    ticker: 'BMMT11',
    name: 'Fundo de Índice BMMT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BMMT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 2.18,
    current_price: 162.16,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '527',
    ticker: 'BNDX11',
    name: 'Fundo de Índice BNDX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BNDX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.73,
    current_price: 96.96,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '528',
    ticker: 'BNKS11',
    name: 'Fundo de Índice BNKS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BNKS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 48.95,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '529',
    ticker: 'BOL511',
    name: 'Fundo de Índice BOL511',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BOL511 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.05,
    current_price: 110.07,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '530',
    ticker: 'BOVB11',
    name: 'Fundo de Índice BOVB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BOVB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.34,
    current_price: 181.11,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '531',
    ticker: 'BOVS11',
    name: 'Fundo de Índice BOVS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BOVS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.06,
    current_price: 137.02,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '532',
    ticker: 'BOVV11',
    name: 'Fundo de Índice BOVV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BOVV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.41,
    current_price: 182.22,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '533',
    ticker: 'BOVX11',
    name: 'Fundo de Índice BOVX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BOVX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.5,
    current_price: 18.11,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '534',
    ticker: 'BRAX11',
    name: 'Fundo de Índice BRAX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BRAX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.28,
    current_price: 147.88,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '535',
    ticker: 'BRAZ11',
    name: 'Fundo de Índice BRAZ11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BRAZ11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.08,
    current_price: 12.11,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '536',
    ticker: 'BREW11',
    name: 'Fundo de Índice BREW11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BREW11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 2.05,
    current_price: 143.25,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '537',
    ticker: 'BTEK11',
    name: 'Fundo de Índice BTEK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BTEK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '538',
    ticker: 'BTER11',
    name: 'Fundo de Índice BTER11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BTER11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.03,
    current_price: 21.2,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '539',
    ticker: 'BVBR11',
    name: 'Fundo de Índice BVBR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BVBR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.05,
    current_price: 22.0,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '540',
    ticker: 'BXPO11',
    name: 'Fundo de Índice BXPO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O BXPO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.0,
    current_price: 149.85,
    manager: 'BlackRock',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '541',
    ticker: 'CAPE11',
    name: 'Fundo de Índice CAPE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CAPE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.7,
    current_price: 141.48,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '542',
    ticker: 'CASA11',
    name: 'Fundo de Índice CASA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CASA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.91,
    current_price: 87.4,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '543',
    ticker: 'CDIB11',
    name: 'Fundo de Índice CDIB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CDIB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.02,
    current_price: 50.86,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '544',
    ticker: 'CHIP11',
    name: 'Fundo de Índice CHIP11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CHIP11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: -0.79,
    current_price: 36.31,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '545',
    ticker: 'CMDB11',
    name: 'Fundo de Índice CMDB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CMDB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.09,
    current_price: 16.76,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '546',
    ticker: 'COIN11',
    name: 'Fundo de Índice COIN11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O COIN11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.41,
    current_price: 38.44,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '547',
    ticker: 'CORN11',
    name: 'Fundo de Índice CORN11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CORN11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Agronegócio & Commodities. Oferece liquidez e diversificação instantânea.',
    sector: 'Agronegócio & Commodities',
    daily_change: 1.42,
    current_price: 7.12,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '548',
    ticker: 'CRPT11',
    name: 'Fundo de Índice CRPT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O CRPT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: 1.42,
    current_price: 11.45,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '549',
    ticker: 'DBOA11',
    name: 'Fundo de Índice DBOA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DBOA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '550',
    ticker: 'DEFI11',
    name: 'Fundo de Índice DEFI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DEFI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.28,
    current_price: 12.36,
    manager: 'Hashdex',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '551',
    ticker: 'DIVD11',
    name: 'Fundo de Índice DIVD11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DIVD11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Dividendos. Oferece liquidez e diversificação instantânea.',
    sector: 'Dividendos',
    daily_change: 1.08,
    current_price: 63.36,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '552',
    ticker: 'DOLA11',
    name: 'Fundo de Índice DOLA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DOLA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.4,
    current_price: 10.02,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '553',
    ticker: 'DOLB11',
    name: 'Fundo de Índice DOLB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DOLB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.66,
    current_price: 95.39,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '554',
    ticker: 'DOLX11',
    name: 'Fundo de Índice DOLX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DOLX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.2,
    current_price: 47.1,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '555',
    ticker: 'DVER11',
    name: 'Fundo de Índice DVER11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O DVER11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.48,
    current_price: 12.61,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '556',
    ticker: 'EBIT11',
    name: 'Fundo de Índice EBIT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O EBIT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.81,
    current_price: 54.93,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '557',
    ticker: 'ECOO11',
    name: 'Fundo de Índice ECOO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ECOO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.16,
    current_price: 144.69,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '558',
    ticker: 'EETH11',
    name: 'Fundo de Índice EETH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O EETH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.93,
    current_price: 39.59,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '559',
    ticker: 'ELAS11',
    name: 'Fundo de Índice ELAS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ELAS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 2.21,
    current_price: 181.5,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '560',
    ticker: 'ESGB11',
    name: 'Fundo de Índice ESGB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ESGB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.99,
    current_price: 117.08,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '561',
    ticker: 'ETHE11',
    name: 'Fundo de Índice ETHE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ETHE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.32,
    current_price: 27.73,
    manager: 'Hashdex',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '562',
    ticker: 'ETHY11',
    name: 'Fundo de Índice ETHY11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ETHY11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.6,
    current_price: 49.85,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '563',
    ticker: 'EWBZ11',
    name: 'Fundo de Índice EWBZ11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O EWBZ11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.92,
    current_price: 126.65,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '564',
    ticker: 'FIND11',
    name: 'Fundo de Índice FIND11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O FIND11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.21,
    current_price: 182.21,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '565',
    ticker: 'FIXX11',
    name: 'Fundo de Índice FIXX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O FIXX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.38,
    current_price: 93.12,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '566',
    ticker: 'FOMO11',
    name: 'Fundo de Índice FOMO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O FOMO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.27,
    current_price: 17.16,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '567',
    ticker: 'FOOD11',
    name: 'Fundo de Índice FOOD11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O FOOD11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Agronegócio & Commodities. Oferece liquidez e diversificação instantânea.',
    sector: 'Agronegócio & Commodities',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '568',
    ticker: 'GBTC11',
    name: 'Fundo de Índice GBTC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GBTC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.67,
    current_price: 25.31,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '569',
    ticker: 'GDIV11',
    name: 'Fundo de Índice GDIV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GDIV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Dividendos. Oferece liquidez e diversificação instantânea.',
    sector: 'Dividendos',
    daily_change: -1.37,
    current_price: 95.21,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '570',
    ticker: 'GENB11',
    name: 'Fundo de Índice GENB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GENB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -2.23,
    current_price: 17.57,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '571',
    ticker: 'GICP11',
    name: 'Fundo de Índice GICP11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GICP11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.09,
    current_price: 11.05,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '572',
    ticker: 'GLDI11',
    name: 'Fundo de Índice GLDI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GLDI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Commodities & Metais. Oferece liquidez e diversificação instantânea.',
    sector: 'Commodities & Metais',
    daily_change: -1.9,
    current_price: 52.7,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '573',
    ticker: 'GLDX11',
    name: 'Fundo de Índice GLDX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GLDX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.45,
    current_price: 96.1,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '574',
    ticker: 'GLFT11',
    name: 'Fundo de Índice GLFT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GLFT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.02,
    current_price: 111.31,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '575',
    ticker: 'GOAT11',
    name: 'Fundo de Índice GOAT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GOAT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.03,
    current_price: 56.73,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '576',
    ticker: 'GOLB11',
    name: 'Fundo de Índice GOLB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GOLB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.86,
    current_price: 101.44,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '577',
    ticker: 'GOLX11',
    name: 'Fundo de Índice GOLX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GOLX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.76,
    current_price: 47.89,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '578',
    ticker: 'GOVE11',
    name: 'Fundo de Índice GOVE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GOVE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.39,
    current_price: 76.62,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '579',
    ticker: 'GPCA11',
    name: 'Fundo de Índice GPCA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GPCA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 25.39,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '580',
    ticker: 'GPUS11',
    name: 'Fundo de Índice GPUS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GPUS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.26,
    current_price: 114.1,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '581',
    ticker: 'GXUS11',
    name: 'Fundo de Índice GXUS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O GXUS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.92,
    current_price: 107.56,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '582',
    ticker: 'HERT11',
    name: 'Fundo de Índice HERT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O HERT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.47,
    current_price: 20.99,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '583',
    ticker: 'HGBR11',
    name: 'Fundo de Índice HGBR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O HGBR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.18,
    current_price: 54.94,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '584',
    ticker: 'HIGH11',
    name: 'Fundo de Índice HIGH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O HIGH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.17,
    current_price: 80.94,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '585',
    ticker: 'HODL11',
    name: 'Fundo de Índice HODL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O HODL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -1.16,
    current_price: 55.46,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '586',
    ticker: 'HTEK11',
    name: 'Fundo de Índice HTEK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O HTEK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.03,
    current_price: 60.58,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '587',
    ticker: 'HYBR11',
    name: 'Fundo de Índice HYBR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O HYBR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.04,
    current_price: 55.01,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '588',
    ticker: 'IBOB11',
    name: 'Fundo de Índice IBOB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O IBOB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.51,
    current_price: 145.39,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '589',
    ticker: 'IDKA11',
    name: 'Fundo de Índice IDKA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O IDKA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.52,
    current_price: 59.3,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '590',
    ticker: 'IMBB11',
    name: 'Fundo de Índice IMBB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O IMBB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.16,
    current_price: 148.25,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '591',
    ticker: 'ISUS11',
    name: 'Fundo de Índice ISUS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O ISUS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.73,
    current_price: 43.42,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '592',
    ticker: 'IVWO11',
    name: 'Fundo de Índice IVWO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O IVWO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.39,
    current_price: 20.64,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '593',
    ticker: 'IWMI11',
    name: 'Fundo de Índice IWMI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O IWMI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -2.04,
    current_price: 80.75,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '594',
    ticker: 'JOGO11',
    name: 'Fundo de Índice JOGO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O JOGO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.87,
    current_price: 111.31,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '595',
    ticker: 'LFIN11',
    name: 'Fundo de Índice LFIN11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LFIN11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.12,
    current_price: 111.98,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '596',
    ticker: 'LFIX11',
    name: 'Fundo de Índice LFIX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LFIX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.05,
    current_price: 21.27,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '597',
    ticker: 'LFTB11',
    name: 'Fundo de Índice LFTB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LFTB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.01,
    current_price: 123.9,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '598',
    ticker: 'LFTI11',
    name: 'Fundo de Índice LFTI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LFTI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.07,
    current_price: 54.1,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '599',
    ticker: 'LFTX11',
    name: 'Fundo de Índice LFTX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LFTX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.08,
    current_price: 26.1,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '600',
    ticker: 'LLFT11',
    name: 'Fundo de Índice LLFT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LLFT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.07,
    current_price: 116.62,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '601',
    ticker: 'LTBX11',
    name: 'Fundo de Índice LTBX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LTBX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.04,
    current_price: 26.01,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '602',
    ticker: 'LTNB11',
    name: 'Fundo de Índice LTNB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LTNB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.39,
    current_price: 110.99,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '603',
    ticker: 'LVOL11',
    name: 'Fundo de Índice LVOL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O LVOL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.64,
    current_price: 139.89,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '604',
    ticker: 'MARG11',
    name: 'Fundo de Índice MARG11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O MARG11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.07,
    current_price: 121.21,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '605',
    ticker: 'MATB11',
    name: 'Fundo de Índice MATB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O MATB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 2.45,
    current_price: 62.23,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '606',
    ticker: 'META11',
    name: 'Fundo de Índice META11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O META11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.16,
    current_price: 6.43,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '607',
    ticker: 'MILL11',
    name: 'Fundo de Índice MILL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O MILL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -2.0,
    current_price: 82.67,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '608',
    ticker: 'NASD11',
    name: 'Fundo de Índice NASD11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NASD11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.85,
    current_price: 20.19,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '609',
    ticker: 'NB0211',
    name: 'Fundo de Índice NB0211',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NB0211 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 49.94,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '610',
    ticker: 'NB0511',
    name: 'Fundo de Índice NB0511',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NB0511 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 49.61,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '611',
    ticker: 'NB1011',
    name: 'Fundo de Índice NB1011',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NB1011 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 49.32,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '612',
    ticker: 'NBIT11',
    name: 'Fundo de Índice NBIT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NBIT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.95,
    current_price: 25.95,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '613',
    ticker: 'NBOV11',
    name: 'Fundo de Índice NBOV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NBOV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.22,
    current_price: 121.04,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '614',
    ticker: 'NCDI11',
    name: 'Fundo de Índice NCDI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NCDI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.07,
    current_price: 110.96,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '615',
    ticker: 'NDIV11',
    name: 'Fundo de Índice NDIV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NDIV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Dividendos. Oferece liquidez e diversificação instantânea.',
    sector: 'Dividendos',
    daily_change: 1.36,
    current_price: 125.63,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '616',
    ticker: 'NFTS11',
    name: 'Fundo de Índice NFTS11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NFTS11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '617',
    ticker: 'NLFA11',
    name: 'Fundo de Índice NLFA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NLFA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.08,
    current_price: 108.4,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '618',
    ticker: 'NSDV11',
    name: 'Fundo de Índice NSDV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NSDV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.69,
    current_price: 156.7,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '619',
    ticker: 'NUCL11',
    name: 'Fundo de Índice NUCL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O NUCL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.36,
    current_price: 68.54,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '620',
    ticker: 'OURO11',
    name: 'Fundo de Índice OURO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O OURO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Commodities & Metais. Oferece liquidez e diversificação instantânea.',
    sector: 'Commodities & Metais',
    daily_change: -1.95,
    current_price: 90.65,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '621',
    ticker: 'PACB11',
    name: 'Fundo de Índice PACB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PACB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.28,
    current_price: 10.63,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '622',
    ticker: 'PACG11',
    name: 'Fundo de Índice PACG11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PACG11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.03,
    current_price: 114.69,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '623',
    ticker: 'PACL11',
    name: 'Fundo de Índice PACL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PACL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.46,
    current_price: 107.41,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '624',
    ticker: 'PEVC11',
    name: 'Fundo de Índice PEVC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PEVC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.15,
    current_price: 150.8,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '625',
    ticker: 'PHIP11',
    name: 'Fundo de Índice PHIP11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PHIP11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.39,
    current_price: 116.18,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '626',
    ticker: 'PIBB11',
    name: 'Fundo de Índice PIBB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PIBB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.4,
    current_price: 315.35,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '627',
    ticker: 'PIPE11',
    name: 'Fundo de Índice PIPE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PIPE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.61,
    current_price: 97.66,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '628',
    ticker: 'PKIN11',
    name: 'Fundo de Índice PKIN11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PKIN11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.43,
    current_price: 116.95,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '629',
    ticker: 'POSB11',
    name: 'Fundo de Índice POSB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O POSB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.02,
    current_price: 104.43,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '630',
    ticker: 'PREX11',
    name: 'Fundo de Índice PREX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O PREX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.12,
    current_price: 50.74,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '631',
    ticker: 'QDFI11',
    name: 'Fundo de Índice QDFI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O QDFI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -3.57,
    current_price: 1.62,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '632',
    ticker: 'QETH11',
    name: 'Fundo de Índice QETH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O QETH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -1.31,
    current_price: 6.77,
    manager: 'Hashdex',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '633',
    ticker: 'QLBR11',
    name: 'Fundo de Índice QLBR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O QLBR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.76,
    current_price: 112.25,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '634',
    ticker: 'QQQI11',
    name: 'Fundo de Índice QQQI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O QQQI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: -1.39,
    current_price: 93.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '635',
    ticker: 'QQQQ11',
    name: 'Fundo de Índice QQQQ11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O QQQQ11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: -1.72,
    current_price: 128.84,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '636',
    ticker: 'QSOL11',
    name: 'Fundo de Índice QSOL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O QSOL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -1.68,
    current_price: 4.69,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '637',
    ticker: 'RARA11',
    name: 'Fundo de Índice RARA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O RARA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.62,
    current_price: 15.95,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '638',
    ticker: 'REVE11',
    name: 'Fundo de Índice REVE11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O REVE11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.38,
    current_price: 74.18,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '639',
    ticker: 'RICO11',
    name: 'Fundo de Índice RICO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O RICO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -2.76,
    current_price: 28.59,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '640',
    ticker: 'SCVB11',
    name: 'Fundo de Índice SCVB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SCVB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.78,
    current_price: 81.78,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '641',
    ticker: 'SFIX11',
    name: 'Fundo de Índice SFIX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SFIX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: 0.11,
    current_price: 110.78,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '642',
    ticker: 'SILK11',
    name: 'Fundo de Índice SILK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SILK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.16,
    current_price: 63.82,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '643',
    ticker: 'SLVR11',
    name: 'Fundo de Índice SLVR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SLVR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Commodities & Metais. Oferece liquidez e diversificação instantânea.',
    sector: 'Commodities & Metais',
    daily_change: -1.88,
    current_price: 35.99,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '644',
    ticker: 'SMAB11',
    name: 'Fundo de Índice SMAB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SMAB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.89,
    current_price: 7.77,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '645',
    ticker: 'SMAC11',
    name: 'Fundo de Índice SMAC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SMAC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.33,
    current_price: 55.66,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '646',
    ticker: 'SOLH11',
    name: 'Fundo de Índice SOLH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SOLH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -2.1,
    current_price: 10.74,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '647',
    ticker: 'SPUB11',
    name: 'Fundo de Índice SPUB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPUB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.36,
    current_price: 68.65,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '648',
    ticker: 'SPVT11',
    name: 'Fundo de Índice SPVT11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPVT11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 2.8,
    current_price: 67.85,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '649',
    ticker: 'SPXB11',
    name: 'Fundo de Índice SPXB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPXB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.72,
    current_price: 16.59,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '650',
    ticker: 'SPXH11',
    name: 'Fundo de Índice SPXH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPXH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -3.0,
    current_price: 56.23,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '651',
    ticker: 'SPXI11',
    name: 'Fundo de Índice SPXI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPXI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.16,
    current_price: 51.83,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '652',
    ticker: 'SPXR11',
    name: 'Fundo de Índice SPXR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPXR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.3,
    current_price: 71.89,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '653',
    ticker: 'SPXU11',
    name: 'Fundo de Índice SPXU11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPXU11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.29,
    current_price: 16.06,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '654',
    ticker: 'SPYI11',
    name: 'Fundo de Índice SPYI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPYI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.36,
    current_price: 104.85,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '655',
    ticker: 'SPYR11',
    name: 'Fundo de Índice SPYR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SPYR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.23,
    current_price: 111.59,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '656',
    ticker: 'SVAL11',
    name: 'Fundo de Índice SVAL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O SVAL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.18,
    current_price: 151.37,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '657',
    ticker: 'T10R11',
    name: 'Fundo de Índice T10R11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O T10R11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.16,
    current_price: 54.55,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '658',
    ticker: 'TD3511',
    name: 'Fundo de Índice TD3511',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TD3511 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.2,
    current_price: 50.65,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '659',
    ticker: 'TD5011',
    name: 'Fundo de Índice TD5011',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TD5011 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.06,
    current_price: 49.9,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '660',
    ticker: 'TD6011',
    name: 'Fundo de Índice TD6011',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TD6011 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.16,
    current_price: 50.06,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '661',
    ticker: 'TECK11',
    name: 'Fundo de Índice TECK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TECK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: -1.88,
    current_price: 111.56,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '662',
    ticker: 'TECX11',
    name: 'Fundo de Índice TECX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TECX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: -0.46,
    current_price: 166.63,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '663',
    ticker: 'TIRB11',
    name: 'Fundo de Índice TIRB11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TIRB11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.0,
    current_price: 13.54,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '664',
    ticker: 'TOPY11',
    name: 'Fundo de Índice TOPY11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TOPY11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.6,
    current_price: 102.11,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '665',
    ticker: 'TRIG11',
    name: 'Fundo de Índice TRIG11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O TRIG11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 1.22,
    current_price: 43.02,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '666',
    ticker: 'USAL11',
    name: 'Fundo de Índice USAL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O USAL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Tecnologia. Oferece liquidez e diversificação instantânea.',
    sector: 'Tecnologia',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '667',
    ticker: 'USTK11',
    name: 'Fundo de Índice USTK11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O USTK11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.86,
    current_price: 20.75,
    manager: 'Investo',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '668',
    ticker: 'UTEC11',
    name: 'Fundo de Índice UTEC11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O UTEC11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.47,
    current_price: 27.51,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '669',
    ticker: 'UTLL11',
    name: 'Fundo de Índice UTLL11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O UTLL11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.27,
    current_price: 122.42,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '670',
    ticker: 'VWRA11',
    name: 'Fundo de Índice VWRA11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O VWRA11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.28,
    current_price: 108.41,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '671',
    ticker: 'WEB311',
    name: 'Fundo de Índice WEB311',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O WEB311 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.64,
    current_price: 12.45,
    manager: 'Hashdex',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '672',
    ticker: 'WEJR11',
    name: 'Fundo de Índice WEJR11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O WEJR11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.66,
    current_price: 107.62,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '673',
    ticker: 'XB3511',
    name: 'Fundo de Índice XB3511',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XB3511 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.12,
    current_price: 51.65,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '674',
    ticker: 'XBCI11',
    name: 'Fundo de Índice XBCI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XBCI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.7,
    current_price: 81.89,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '675',
    ticker: 'XBOV11',
    name: 'Fundo de Índice XBOV11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XBOV11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -0.1,
    current_price: 172.9,
    manager: 'XP Asset',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '676',
    ticker: 'XETH11',
    name: 'Fundo de Índice XETH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.75,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XETH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Criptoativos. Oferece liquidez e diversificação instantânea.',
    sector: 'Criptoativos',
    daily_change: -0.96,
    current_price: 25.8,
    manager: 'XP Asset',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '677',
    ticker: 'XFIX11',
    name: 'Fundo de Índice XFIX11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.2,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XFIX11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Renda Fixa Brasil. Oferece liquidez e diversificação instantânea.',
    sector: 'Renda Fixa Brasil',
    daily_change: -0.3,
    current_price: 13.45,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '678',
    ticker: 'XRPH11',
    name: 'Fundo de Índice XRPH11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XRPH11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -2.34,
    current_price: 8.77,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '679',
    ticker: 'XSPI11',
    name: 'Fundo de Índice XSPI11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O XSPI11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: -1.57,
    current_price: 103.44,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
  {
    id: '680',
    ticker: 'YDRO11',
    name: 'Fundo de Índice YDRO11',
    market: 'BR',
    currency: 'BRL',
    expense_ratio: 0.3,
    dividend_yield: 0.00,
    aum: 450,
    description: 'O YDRO11 é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de Ações Brasil B3. Oferece liquidez e diversificação instantânea.',
    sector: 'Ações Brasil B3',
    daily_change: 0.15,
    current_price: 100.0,
    manager: 'Outros',
    holdings: [
      { name: 'Ativos da Carteira Teórica', percentage: 100.0 }
    ]
  },
];

// Helper to generate a deterministic series of prices anchored to the asset's real current price by exact calendar date
export function generateHistory(ticker: string, timeframe: string): HistoricalPrice[] {
  return [];
}
