# Guia de Implantação: Robô ETL Python (Automação Diária)

Este documento detalha o processo para rodar o pipeline de dados em Python que atualiza as cotações, variações diárias, dividend yields e AUM no Supabase.

Você pode optar por duas formas de automação:
1. **GitHub Actions (Recomendado - 100% Gratuito, sem necessidade de servidor)**
2. **Cron Job em Servidor Linux VPS (Ubuntu)**

---

## 1. O Código do Robô (`bot_cotacoes.py`)

Crie ou mantenha o arquivo `bot_cotacoes.py` na raiz do repositório:

```python
import os
import yfinance as yf
import pandas as pd
import requests
from datetime import datetime
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env (se existir localmente)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dfphhwgczizvxsszngrc.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# Lista de ETFs para monitoramento diário
ETFS_TO_TRACK = [
    {"ticker": "IVVB11.SA", "db_ticker": "IVVB11", "market": "BR", "currency": "BRL"},
    {"ticker": "BOVA11.SA", "db_ticker": "BOVA11", "market": "BR", "currency": "BRL"},
    {"ticker": "SMAL11.SA", "db_ticker": "SMAL11", "market": "BR", "currency": "BRL"},
    {"ticker": "HASH11.SA", "db_ticker": "HASH11", "market": "BR", "currency": "BRL"},
    {"ticker": "WRLD11.SA", "db_ticker": "WRLD11", "market": "BR", "currency": "BRL"},
    {"ticker": "XINA11.SA", "db_ticker": "XINA11", "market": "BR", "currency": "BRL"},
    {"ticker": "VOO", "db_ticker": "VOO", "market": "US", "currency": "USD"},
    {"ticker": "QQQ", "db_ticker": "QQQ", "market": "US", "currency": "USD"}
]

def run_pipeline():
    if not SUPABASE_SERVICE_KEY:
        print("[ERRO CRÍTICO] SUPABASE_SERVICE_KEY não configurada!")
        return

    print(f"[{datetime.now()}] Iniciando pipeline ETL yfinance...")
    
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    for item in ETFS_TO_TRACK:
        try:
            print(f"-> Processando {item['ticker']}...")
            ticker_obj = yf.Ticker(item["ticker"])
            info = ticker_obj.info or {}
            
            # Histórico dos últimos 10 dias úteis
            history = ticker_obj.history(period="10d")
            if history.empty:
                print(f"   [Aviso] Nenhum histórico retornado para {item['ticker']}")
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

            # 2. Upsert na tabela etf_historical_prices (on_conflict=etf_ticker,date)
            url_hist = f"{SUPABASE_URL}/rest/v1/etf_historical_prices?on_conflict=etf_ticker,date"
            for date, row in history.iterrows():
                price_payload = {
                    "etf_ticker": item["db_ticker"],
                    "date": date.strftime("%Y-%m-%d"),
                    "close_price": round(float(row["Close"]), 4),
                    "open_price": round(float(row["Open"]), 4) if "Open" in row and not pd.isna(row["Open"]) else None,
                    "high_price": round(float(row["High"]), 4) if "High" in row and not pd.isna(row["High"]) else None,
                    "low_price": round(float(row["Low"]), 4) if "Low" in row and not pd.isna(row["Low"]) else None,
                    "volume": int(row["Volume"]) if "Volume" in row and not pd.isna(row["Volume"]) else None
                }
                resp_h = requests.post(url_hist, json=price_payload, headers=headers)
                resp_h.raise_for_status()

            print(f"   [OK] {item['db_ticker']} atualizado! (Preço: R$ {latest_close:.2f} | Var: {change_percent:+.2f}%)")

        except Exception as e:
            print(f"   [ERRO] Falha ao processar {item['ticker']}: {e}")

    print(f"[{datetime.now()}] Pipeline ETL concluído com sucesso!")

if __name__ == "__main__":
    run_pipeline()
```

---

## 🚀 Opção A: GitHub Actions (RECOMENDADO)

O GitHub Actions permite rodar o robô automaticamente na nuvem do próprio GitHub, de forma **100% gratuita**, sem precisar alugar ou manter um servidor Linux.

### Vantagens:
* ✅ Custo zero (gratuito para repositórios públicos e privados).
* ✅ Não precisa pagar nem manter um servidor VPS.
* ✅ Histórico visual de execuções com logs e alertas de falha no GitHub.
* ✅ Permite rodar manualmente com 1 clique a qualquer momento (*workflow_dispatch*).

### Passo 1: Cadastrar os Secrets no GitHub
No repositório do GitHub:
1. Vá em **Settings** > **Secrets and variables** > **Actions**.
2. Clique em **New repository secret**.
3. Adicione:
   * `SUPABASE_URL`: `https://dfphhwgczizvxsszngrc.supabase.co`
   * `SUPABASE_SERVICE_KEY`: `sua_chave_service_role`

### Passo 2: Criar a Workflow no Repositório
Crie o arquivo `.github/workflows/etl_daily.yml` no projeto com o conteúdo:

```yaml
name: ETF500 Daily ETL Pipeline

on:
  schedule:
    # Executa de segunda a sexta-feira às 22:00 BRT (01:00 UTC do dia seguinte)
    - cron: '0 1 * * 2-6'
  workflow_dispatch: # Botão para executar manualmente quando desejar

jobs:
  run-etl:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout do Repositório
        uses: actions/checkout@v4

      - name: Configurar Python 3.10
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Instalar Dependências
        run: |
          python -m pip install --upgrade pip
          pip install yfinance pandas requests python-dotenv

      - name: Executar Robô de Cotações
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: |
          python bot_cotacoes.py
```

> [!NOTE]
> **Fuso Horário no GitHub Actions:** O cron do GitHub roda em horário UTC. Como o Brasil (BRT) está em UTC-3, **22:00 BRT de segunda a sexta** corresponde a **01:00 UTC de terça a sábado** (`0 1 * * 2-6`).

---

## 🖥️ Opção B: Servidor Linux VPS (Cron Job)

Se você já possui um servidor Ubuntu rodando 24/7, pode agendar a execução via `crontab` local.

### Configuração no Servidor:
1. Instale o ambiente virtual:
```bash
sudo apt update && sudo apt install python3 python3-venv -y
cd /home/ubuntu/etf500
python3 -m venv etl_env
./etl_env/bin/pip install yfinance pandas requests python-dotenv
```

2. Crie o arquivo `.env` com as chaves:
```env
SUPABASE_URL=https://dfphhwgczizvxsszngrc.supabase.co
SUPABASE_SERVICE_KEY=sua_chave_service_role
```

3. Abra o crontab (`crontab -e`) e adicione:
```bash
0 22 * * 1-5 cd /home/ubuntu/etf500 && /home/ubuntu/etf500/etl_env/bin/python bot_cotacoes.py >> bot_cotacoes.log 2>&1
```

---

## 📊 Comparativo: GitHub Actions vs Cron VPS

| Critério | GitHub Actions (Opção A) | Cron em VPS (Opção B) |
|---|---|---|
| **Custo** | 100% Gratuito | Requer pagar VPS mensalmente |
| **Manutenção** | Zero manutenção de servidor | Precisa atualizar sistema/Python |
| **Notificação de Erro** | E-mail automático se o robô falhar | Requer checar log manualmente |
| **Gatilho Manual** | Botão no GitHub (*Run Workflow*) | Requer acesso SSH ao servidor |
