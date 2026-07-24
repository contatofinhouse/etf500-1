import json

# Read scrap result
with open('investidor10_etfs.json') as f:
    investidor_tickers = set(json.load(f))

# Ignore non-etf noise entries if any
invalid = {'ALL2', 'RANKINGS'}
investidor_tickers = {t for t in investidor_tickers if t not in invalid}

# Read current etfData.ts
with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

import re
current_tickers = set(re.findall(r"ticker:\s*'([^']+)'", code))

print(f"Investidor10 Scraped Tickers: {len(investidor_tickers)}")
print(f"Current System Tickers: {len(current_tickers)}")

missing = sorted(list(investidor_tickers - current_tickers))
print(f"Missing Tickers to Add: {len(missing)}")
print("Missing:", missing)

# Helper function to guess manager and sector for missing ETFs
def get_metadata(ticker):
    mgr = 'Outros'
    sec = 'Mercado Local B3'
    market = 'BR'
    curr = 'BRL'
    
    # Manager guessing
    if ticker.startswith('B') or ticker.startswith('IVV') or ticker.startswith('SMAL') or ticker.startswith('BRAX'):
        mgr = 'BlackRock'
    elif ticker.startswith('DIVO') or ticker.startswith('B5P2') or ticker.startswith('BOVV') or ticker.startswith('IT'):
        mgr = 'Itaú It Now'
    elif ticker.startswith('WRLD') or ticker.startswith('LFTS') or ticker.startswith('USTK') or ticker.startswith('B3BR'):
        mgr = 'Investo'
    elif ticker.startswith('HASH') or ticker.startswith('BITC') or ticker.startswith('ETHE') or ticker.startswith('DEFI') or ticker.startswith('WEB3') or ticker.startswith('QBTC') or ticker.startswith('QETH'):
        mgr = 'Hashdex'
    elif ticker.startswith('GOLD') or ticker.startswith('XINA') or ticker.startswith('TREND') or ticker.startswith('XBOV') or ticker.startswith('XETH'):
        mgr = 'XP Asset'
    elif ticker in ['VOO', 'VNQ', 'VT', 'VTI', 'VXUS', 'BND']:
        mgr = 'Vanguard'
        market = 'US'
        curr = 'USD'
        sec = 'Mercado Global EUA'
    elif ticker in ['QQQ', 'RSP']:
        mgr = 'Invesco'
        market = 'US'
        curr = 'USD'
        sec = 'Tecnologia EUA'
    elif ticker in ['SCHD', 'SCHA', 'SCHF']:
        mgr = 'Charles Schwab'
        market = 'US'
        curr = 'USD'
        sec = 'Dividendos EUA'

    # Sector guessing
    if 'BIT' in ticker or 'ETH' in ticker or 'HASH' in ticker or 'CRPT' in ticker or 'WEB3' in ticker or 'SOL' in ticker or 'HODL' in ticker:
        sec = 'Criptoativos'
    elif 'FIX' in ticker or 'B5P' in ticker or 'IMAB' in ticker or 'IRFM' in ticker or 'LFT' in ticker or 'CDI' in ticker or 'DEB' in ticker:
        sec = 'Renda Fixa Brasil'
    elif 'DIV' in ticker or 'SCHD' in ticker or 'NDIV' in ticker or 'DIVO' in ticker:
        sec = 'Dividendos'
    elif 'TECK' in ticker or 'TECX' in ticker or 'QQQ' in ticker or 'CHIP' in ticker or 'BTEK' in ticker or 'USAL' in ticker:
        sec = 'Tecnologia'
    elif 'AGRI' in ticker or 'FOOD' in ticker or 'CORN' in ticker or 'BBOI' in ticker:
        sec = 'Agronegócio & Commodities'
    elif 'GOLD' in ticker or 'OURO' in ticker or 'GLDI' in ticker or 'SLVR' in ticker:
        sec = 'Commodities & Metais'
    elif market == 'US':
        sec = 'Mercado Global EUA'
    else:
        sec = 'Ações Brasil B3'

    return mgr, sec, market, curr

# Generate TypeScript objects for missing ETFs
new_entries = []
start_id = 500

for t in missing:
    mgr, sec, market, curr = get_metadata(t)
    price = 100.0 if curr == 'BRL' else 150.0
    expense = 0.30 if market == 'BR' else 0.10
    if sec == 'Criptoativos':
        expense = 0.75
    elif sec == 'Renda Fixa Brasil':
        expense = 0.20

    entry = f"""  {{
    id: '{start_id}',
    ticker: '{t}',
    name: 'Fundo de Índice {t}',
    market: '{market}',
    currency: '{curr}',
    expense_ratio: {expense},
    dividend_yield: 0.00,
    aum: 450,
    description: 'O {t} é um ETF listado e negociado em bolsa de valores para acompanhamento do índice de referência de {sec}. Oferece liquidez e diversificação instantânea.',
    sector: '{sec}',
    daily_change: 0.15,
    current_price: {price},
    manager: '{mgr}',
    holdings: [
      {{ name: 'Ativos da Carteira Teórica', percentage: 100.0 }}
    ]
  }},"""
    new_entries.append(entry)
    start_id += 1

with open('scratch/missing_etfs_snippet.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_entries))

print("Generated snippet with missing ETFs.")
