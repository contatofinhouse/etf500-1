/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ETF } from '../types';

/**
 * Encodes text and opens WhatsApp share URL safely
 */
export function openWhatsAppShare(text: string) {
  const encodedText = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Formats WhatsApp corporate message for a specific ETF detail view
 */
export function shareEtfOnWhatsApp(etf: ETF) {
  const baseUrl = window.location.origin;
  const isRf = etf.sector?.includes('Renda Fixa') || ['LFTS11', 'B5P211', 'IMAB11', 'IRFM11', 'IB5M11', 'DEBB11'].includes(etf.ticker);
  
  const icon = isRf ? '🏦' : '📊';
  const categoryHeader = isRf 
    ? '*Análise de Liquidez & Renda Fixa — Tesouraria Corporativa*' 
    : '*Análise Institucional de ETF — Tesouraria Corporativa*';

  const text = `${icon} ${categoryHeader}

*Ativo:* ${etf.ticker} (${etf.name})
📌 *Categoria:* ${etf.sector}
💵 *Cotação:* ${etf.currency === 'USD' ? 'US$' : 'R$'} ${etf.current_price.toFixed(2)} (${etf.daily_change >= 0 ? '+' : ''}${etf.daily_change.toFixed(2)}% hoje)
📉 *Taxa de Adm:* ${etf.expense_ratio.toFixed(2)}% a.a.${etf.manager ? ` | *Gestora:* ${etf.manager}` : ''}
💡 *Diferencial:* ${isRf ? 'Isenção de come-cotas | IR retido na fonte' : 'Liquidez diária B3 | Diversificação passiva'}

🔗 Confira gráfico histórico e análise completa:
${baseUrl}/?view=etf&ticker=${etf.ticker}`;

  openWhatsAppShare(text);
}

/**
 * Formats WhatsApp corporate message for the ETF comparison tool
 */
export function shareCompareOnWhatsApp(tickerA?: string, tickerB?: string) {
  const baseUrl = window.location.origin;
  const pairInfo = tickerA && tickerB ? ` (${tickerA} vs ${tickerB})` : '';

  const text = `📊 *Matriz de Comparação para Tesouraria & Alocação de Caixa*${pairInfo}

Comparativo em tempo real de ETFs na B3 & Mercado Americano:
🔹 *LFTS11* (Tesouro Selic / Pós-Fixado)
🔹 *B5P211* (IMA-B 5 / IPCA Curto)
🔹 *IMAB11* (IMA-B Geral / Inflação Longa)

⚖️ Avalie rentabilidade líquida acumulada contra a curva do CDI:
${baseUrl}/?view=comparar`;

  openWhatsAppShare(text);
}

/**
 * Formats WhatsApp corporate message for the Raio-X Portfolio diagnostic tool
 */
export function shareRaioXOnWhatsApp() {
  const baseUrl = window.location.origin;

  const text = `💼 *Diagnóstico de Eficiência em Alocação e Taxas de Administração*

Ferramenta gratuita para tesourarias e family offices:
✔️ Mapeamento de sobreposição de taxas em fundos passivos
✔️ Simulação de rentabilidade histórica acumulada contra o CDI
✔️ Análise de liquidez e alocação global

🔗 Faça a simulação de carteira corporativa:
${baseUrl}/?view=raio-x`;

  openWhatsAppShare(text);
}

/**
 * Formats WhatsApp message for a news article
 */
export function shareNewsOnWhatsApp(title: string, newsUrl: string) {
  const text = `📰 *Notícia de ETF | Tesouraria Corporativa:*

"${title}"

🔗 Cobertura e link oficial no ETF500:
${newsUrl}`;

  openWhatsAppShare(text);
}

/**
 * General portal share message for corporate WhatsApp groups
 */
export function shareGeneralOnWhatsApp() {
  const baseUrl = window.location.origin;

  const text = `🏢 *ETF500 — Plataforma Institucional de Monitoramento de ETFs (B3 & EUA)*

Ferramenta 100% gratuita voltada para análise de fundos de índice:
▪️ Cotações em tempo real (B3 e Mercado Americano)
▪️ Comparador de rentabilidade ajustada contra o CDI e Ibovespa
▪️ Filtros de taxa de administração, liquidez diária e AUM

🔗 Acesse agora:
${baseUrl}`;

  openWhatsAppShare(text);
}
