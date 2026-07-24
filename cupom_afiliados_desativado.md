# Componente Desativado: Cupom Exclusivo Afiliados (Nomad/Avenue)

Este banner de afiliados de corretoras globais foi desativado temporariamente do site (`DetailView.tsx`).

```tsx
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
```
