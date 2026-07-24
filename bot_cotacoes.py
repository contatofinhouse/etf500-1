import os
import sys
import yfinance as yf
import pandas as pd
import requests
from datetime import datetime
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env (se existir localmente)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dfphhwgczizvxsszngrc.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# =============================================================================
# LISTA COMPLETA DE TODOS OS 30 ETFs DO SITE ETF500
# =============================================================================
ETFS_TO_TRACK = [
    # ── Ações & Globais B3 ──
    {"ticker": "IVVB11.SA", "db_ticker": "IVVB11", "market": "BR", "currency": "BRL", "category": "Diversificado Global"},
    {"ticker": "BOVA11.SA", "db_ticker": "BOVA11", "market": "BR", "currency": "BRL", "category": "Nacional Multissetorial"},
    {"ticker": "SMAL11.SA", "db_ticker": "SMAL11", "market": "BR", "currency": "BRL", "category": "Small Caps Brasil"},
    {"ticker": "HASH11.SA", "db_ticker": "HASH11", "market": "BR", "currency": "BRL", "category": "Tecnologia & Cripto"},
    {"ticker": "WRLD11.SA", "db_ticker": "WRLD11", "market": "BR", "currency": "BRL", "category": "Ações Globais"},
    {"ticker": "XINA11.SA", "db_ticker": "XINA11", "market": "BR", "currency": "BRL", "category": "Mercados Emergentes"},
    {"ticker": "DIVO11.SA", "db_ticker": "DIVO11", "market": "BR", "currency": "BRL", "category": "Nacional Dividendos"},
    {"ticker": "GOLD11.SA", "db_ticker": "GOLD11", "market": "BR", "currency": "BRL", "category": "Commodities & Reserva"},
    {"ticker": "QBTC11.SA", "db_ticker": "QBTC11", "market": "BR", "currency": "BRL", "category": "Tecnologia & Cripto"},

    # ── Renda Fixa B3 (Brasil) ──
    {"ticker": "B5P211.SA", "db_ticker": "B5P211", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "IMAB11.SA", "db_ticker": "IMAB11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "IB5M11.SA", "db_ticker": "IB5M11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "LFTS11.SA", "db_ticker": "LFTS11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "DEB11.SA",  "db_ticker": "DEB11",  "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "DEBB11.SA", "db_ticker": "DEBB11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "NTNS11.SA", "db_ticker": "NTNS11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "IRFM11.SA", "db_ticker": "IRFM11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "JURO11.SA", "db_ticker": "JURO11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},
    {"ticker": "FIXA11.SA", "db_ticker": "FIXA11", "market": "BR", "currency": "BRL", "category": "Renda Fixa Brasil"},

    # ── Ações EUA (USD) ──
    {"ticker": "VOO", "db_ticker": "VOO", "market": "US", "currency": "USD", "category": "Diversificado EUA"},
    {"ticker": "QQQ", "db_ticker": "QQQ", "market": "US", "currency": "USD", "category": "Tecnologia EUA"},
    {"ticker": "SCHD", "db_ticker": "SCHD", "market": "US", "currency": "USD", "category": "Dividendos EUA"},
    {"ticker": "VNQ", "db_ticker": "VNQ", "market": "US", "currency": "USD", "category": "Imobiliário (REITs)"},

    # ── Renda Fixa EUA (USD) ──
    {"ticker": "BND", "db_ticker": "BND", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
    {"ticker": "AGG", "db_ticker": "AGG", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
    {"ticker": "TLT", "db_ticker": "TLT", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
    {"ticker": "SHY", "db_ticker": "SHY", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
    {"ticker": "IEF", "db_ticker": "IEF", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
    {"ticker": "LQD", "db_ticker": "LQD", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
    {"ticker": "TIP", "db_ticker": "TIP", "market": "US", "currency": "USD", "category": "Renda Fixa Global"},
]

def run_pipeline(full_load=False):
    if not SUPABASE_SERVICE_KEY:
        print("[ERRO CRÍTICO] SUPABASE_SERVICE_KEY não configurada! Configure a variável no .env ou nos Secrets do GitHub.")
        return

    period = "max" if full_load else "10d"
    mode_label = "FULL LOAD (histórico completo)" if full_load else "INCREMENTAL (últimos 10 dias)"
    
    print(f"[{datetime.now()}] Iniciando pipeline ETL yfinance...")
    print(f"[MODO] {mode_label} | Period: {period}")
    print(f"[TICKERS] {len(ETFS_TO_TRACK)} ETFs para processar")
    print("=" * 60)
    
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    success_count = 0
    error_count = 0

    for idx, item in enumerate(ETFS_TO_TRACK, 1):
        try:
            print(f"\n[{idx}/{len(ETFS_TO_TRACK)}] Processando {item['ticker']}...")
            ticker_obj = yf.Ticker(item["ticker"])
            info = ticker_obj.info or {}
            
            # Histórico conforme o modo
            history = ticker_obj.history(period=period)
            if history.empty:
                print(f"   [Aviso] Nenhum histórico retornado para {item['ticker']}")
                error_count += 1
                continue

            # Último preço e variação do dia
            latest_close = float(history["Close"].iloc[-1])
            prev_close = float(history["Close"].iloc[-2]) if len(history) > 1 else latest_close
            change_percent = ((latest_close - prev_close) / prev_close) * 100.0 if prev_close else 0.0

            aum = (info.get("totalAssets") or 0) / 1000000.0
            expense_ratio = (info.get("feesExpenses") or 0.0020) * 100.0 if info.get("feesExpenses") else 0.20
            div_yield = (info.get("trailingAnnualDividendYield") or 0.0) * 100.0 if info.get("trailingAnnualDividendYield") else 0.0

            etf_payload = {
                "ticker": item["db_ticker"],
                "name": info.get("longName") or info.get("shortName") or item["db_ticker"],
                "market": item["market"],
                "currency": item["currency"],
                "category": item.get("category", "Outros"),
                "close_price": round(latest_close, 4),
                "change_percent": round(change_percent, 4),
                "expense_ratio": float(expense_ratio),
                "dividend_yield": float(div_yield),
                "aum": float(aum) if aum > 0 else None
            }

            # 1. Upsert na tabela etfs (on_conflict=ticker)
            url_etf = f"{SUPABASE_URL}/rest/v1/etfs?on_conflict=ticker"
            resp_etf = requests.post(url_etf, json=etf_payload, headers=headers)
            resp_etf.raise_for_status()

            # 2. Upsert preços históricos EM BATCH (muito mais rápido que individual)
            url_hist = f"{SUPABASE_URL}/rest/v1/etf_historical_prices?on_conflict=etf_ticker,date"
            
            batch = []
            for date, row in history.iterrows():
                close_val = row["Close"]
                if pd.isna(close_val):
                    continue
                    
                price_payload = {
                    "etf_ticker": item["db_ticker"],
                    "date": date.strftime("%Y-%m-%d"),
                    "close_price": round(float(close_val), 4),
                    "open_price": round(float(row["Open"]), 4) if "Open" in row and not pd.isna(row["Open"]) else None,
                    "high_price": round(float(row["High"]), 4) if "High" in row and not pd.isna(row["High"]) else None,
                    "low_price": round(float(row["Low"]), 4) if "Low" in row and not pd.isna(row["Low"]) else None,
                    "volume": int(row["Volume"]) if "Volume" in row and not pd.isna(row["Volume"]) else None
                }
                batch.append(price_payload)
                
                # Send in batches of 500 rows to avoid payload size limits
                if len(batch) >= 500:
                    resp_h = requests.post(url_hist, json=batch, headers=headers)
                    resp_h.raise_for_status()
                    batch = []
            
            # Send remaining batch
            if batch:
                resp_h = requests.post(url_hist, json=batch, headers=headers)
                resp_h.raise_for_status()

            total_days = len(history)
            print(f"   [OK] {item['db_ticker']} atualizado! (Preço: {item['currency']} {latest_close:.2f} | Var: {change_percent:+.2f}% | {total_days} dias)")
            success_count += 1

        except Exception as e:
            print(f"   [ERRO] Falha ao processar {item['ticker']}: {e}")
            error_count += 1

    print("\n" + "=" * 60)
    print(f"[{datetime.now()}] Pipeline ETL concluído!")
    print(f"   ✅ Sucesso: {success_count}/{len(ETFS_TO_TRACK)}")
    print(f"   ❌ Erros: {error_count}/{len(ETFS_TO_TRACK)}")

if __name__ == "__main__":
    full_load = "--full-load" in sys.argv
    run_pipeline(full_load=full_load)
