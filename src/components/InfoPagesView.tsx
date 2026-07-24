/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, FileText, Mail, HelpCircle, Info, ArrowLeft, Phone, MapPin, Building2, ExternalLink } from 'lucide-react';

interface InfoPagesViewProps {
  page: 'privacidade' | 'termos' | 'contato' | 'suporte' | 'quem-somos' | string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export default function InfoPagesView({ page, onNavigate }: InfoPagesViewProps) {
  
  const renderContent = () => {
    switch (page) {
      case 'privacidade':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Política de Privacidade
                </h1>
                <p className="text-xs text-slate-500 font-mono">Última atualização: Julho de 2026</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>
                A sua privacidade e a proteção dos seus dados pessoais são prioridades absolutas para o portal <strong>ETF500</strong> (operado sob CNPJ 60.806.192.0001/50). Esta Política de Privacidade foi elaborada em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong> e explica com total transparência como coletamos, tratamos, armazenamos e protegemos suas informações.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">1. Princípio da Fricção Zero & Coleta Mínima</h3>
              <p>
                O portal ETF500 opera sob o princípio de <strong>Coleta Mínima de Dados</strong>. Nossas ferramentas públicas de consulta (Screener de ETFs, Comparador de Ativos e Visualizador de Cotações) são 100% abertas. Você navega livremente <strong>sem necessidade de cadastro, criação de conta, login ou fornecimento de CPF, senhas ou dados bancários</strong>.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Informações Coletadas e Suas Finalidades</h3>
              <p>Tratamos informações exclusivamente nas seguintes situações específicas:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Dados de Uso e Preferências do Navegador (Locais)</strong>: O site utiliza o <code>localStorage</code> do seu navegador para guardar sua escolha de tema (Escuro/Claro) e seus tickers favoritados. Esses dados <strong>permanecem 100% no seu dispositivo</strong> e não são transmitidos para nossos servidores.
                </li>
                <li>
                  <strong>Solicitação de Diagnóstico Patrimonial / Contato B2B</strong>: Ao optar voluntariamente por preencher o formulário de Raio-X ou clicar para atendimento via WhatsApp, coletamos os dados fornecidos por você (Nome, E-mail, Telefone/WhatsApp e Faixa Estimada de Investimento).
                </li>
                <li>
                  <strong>Base Legal (LGPD Art. 7º, I e V)</strong>: O tratamento desses dados ocorre mediante o seu <strong>consentimento expresso</strong> e para o atendimento de procedimentos preliminares a pedido do titular.
                </li>
              </ul>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Compartilhamento e Proteção de Dados</h3>
              <p>
                O ETF500 <strong>jamais vende, aluga ou comercializa</strong> seus dados pessoais com terceiros para fins de spam. O compartilhamento ocorre única e exclusivamente com escritórios parceiros de assessoria de investimentos credenciados à CVM quando você solicita expressamente um diagnóstico patrimonial.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">4. Direitos do Titular de Dados (LGPD Art. 18)</h3>
              <p>Como titular dos dados, a LGPD garante a você os seguintes direitos a qualquer momento:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800">
                  ✔️ <strong>Confirmação e Acesso</strong> à existência de tratamento.
                </div>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800">
                  ✔️ <strong>Correção</strong> de dados incompletos ou desatualizados.
                </div>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800">
                  ✔️ <strong>Eliminação / Exclusão</strong> dos dados pessoais tratados.
                </div>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800">
                  ✔️ <strong>Revogação do Consentimento</strong> de forma simples e gratuita.
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-3">5. Encarregado pelo Tratamento de Dados (DPO / Contato)</h3>
              <p>
                Para exercer seus direitos de titular ou esclarecer qualquer dúvida sobre como seus dados são tratados, entre em contato diretamente com o nosso Encarregado de Proteção de Dados (DPO) através dos canais oficiais:
              </p>
              <div className="p-4 bg-blue-50/60 dark:bg-slate-900 border border-blue-200/60 dark:border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                <div>🏢 <strong>Razão Social / Operador:</strong> ETF500 (CNPJ 60.806.192.0001/50)</div>
                <div>💬 <strong>Atendimento / DPO no WhatsApp:</strong> <a href="https://wa.me/5511955842951" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 dark:text-emerald-400 underline">+55 11 95584-2951</a></div>
                <div>📍 <strong>Endereço Institucional:</strong> São Paulo - SP, Brasil</div>
              </div>
            </div>
          </div>
        );

      case 'termos':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Termos de Uso
                </h1>
                <p className="text-xs text-slate-500 font-mono">Regras e Condições da Plataforma</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Natureza Informativa e Não Recomendação</h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-medium">
                <strong>AVISO IMPORTANTE:</strong> Todas as informações, dados de cotações históricas, simulações de retorno e calculadoras do ETF500 têm caráter exclusivamente educativo e informativo. O site <strong>NÃO realiza recomendações</strong> diretas de compra, venda ou alocação de valores mobiliários.
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Origem das Cotações e Precisão</h3>
              <p>
                As cotações dos ETFs são obtidas através de APIs estatísticas oficiais da B3 e das bolsas americanas. Embora nos empenhemos para manter a máxima acurácia dos dados, o ETF500 não se responsabiliza por eventuais atrasos ou divergências causadas por provedores externos de cotação.
              </p>

              <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Direitos Autorais e Propriedade Intelectual</h3>
              <p>
                O design, os algoritmos do screener e as marcas do ETF500 são protegidos por direitos de propriedade intelectual. É proibida a reprodução automática de dados (web scraping) sem prévia autorização.
              </p>
            </div>
          </div>
        );

      case 'contato':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Mail size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Fale Conosco
                </h1>
                <p className="text-xs text-slate-500 font-mono">Canais Diretos de Atendimento e Parcerias</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Phone className="text-emerald-600 dark:text-emerald-400" size={18} />
                  Atendimento via WhatsApp
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tire dúvidas, envie sugestões de novos ETFs ou solicite um diagnóstico da sua carteira.
                </p>
                <a
                  href="https://wa.me/5511955842951?text=Ol%C3%A1!%20Vim%20pelo%20site%20etf500%20e%20gostaria%20de%20falar%20com%20a%20equipe."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Iniciar Conversa no WhatsApp
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Building2 className="text-blue-600 dark:text-blue-400" size={18} />
                  Dados Institucionais
                </h3>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <p><strong>Razão Social:</strong> FINHOUSE SISTEMAS E SERVICOS DE INFORMACAO LTDA</p>
                  <p><strong>CNPJ:</strong> 60.806.192/0001-50</p>
                  <p><strong>Canal Oficial:</strong> WhatsApp +55 11 95584-2951</p>
                  <p><strong>Localização:</strong> São Paulo / SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'suporte':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                <HelpCircle size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Central de Suporte & FAQ
                </h1>
                <p className="text-xs text-slate-500 font-mono">Perguntas Frequentes e Ajuda</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  1. O uso da plataforma ETF500 é pago?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Não. O ETF500 é 100% gratuito e aberto para todos os investidores. Você pode consultar cotações, simular retornos e realizar screener de ativos sem pagar nada e sem precisar criar cadastro.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Com qual frequência as cotações são atualizadas?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Nossa base de dados sincroniza automaticamente os preços de fechamento diários da B3 e das bolsas norte-americanas (NYSE/Nasdaq) via rotinas automatizadas no Supabase.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  3. Como funciona a comparação de benchmarks (CDI, IBOV e S&P 500)?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Os benchmarks são indexados ao preço inicial do ETF no período selecionado (1M, 6M, 1Y, 5Y, MAX). Isso permite visualizar exatamente a rentabilidade relativa entre o ativo e o mercado.
                </p>
              </div>
            </div>
          </div>
        );

      case 'quem-somos':
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl">
                <Info size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Quem Somos
                </h1>
                <p className="text-xs text-slate-500 font-mono">A Plataforma de Inteligência em ETFs</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>
                O <strong>ETF500</strong> nasceu com uma missão clara: democratizar e descomplicar o acesso a dados de qualidade sobre fundos de índice (ETFs) para investidores brasileiros.
              </p>
              <p>
                Acreditamos que a gestão passiva e a alocação de ativos em ETFs — tanto de renda fixa quanto de ações no Brasil e no exterior — é a estratégia comprovadamente mais eficiente para a construção de patrimônio a longo prazo.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Transparência</h4>
                  <p className="text-xs text-slate-500">Dados abertos e sem conflito de interesses.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Tecnologia</h4>
                  <p className="text-xs text-slate-500">APIs ultrarrápidas com renderização em tempo real.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Independência</h4>
                  <p className="text-xs text-slate-500">Foco exclusivo na melhor experiência do investidor.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Voltar para o Início</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
}
