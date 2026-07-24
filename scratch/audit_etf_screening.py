import re
import json
import sys
import yfinance as yf

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))
us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}

non_etfs = set()

print(f"Auditing {len(tickers)} tickers for Units (UNT), FIIs and Stocks...")

for idx, tk in enumerate(tickers):
    if tk in us_tickers:
        continue
    sym = f"{tk}.SA"
    try:
        t = yf.Ticker(sym)
        info = t.info or {}
        name = (info.get('shortName') or info.get('longName') or '').upper()
        
        # Criteria for non-ETF (Units, FIIs, Companies)
        # B3 Companies ending in 11 have 'UNT' in shortName (e.g. KLBN11, TAEE11, ALUP11, SANB11)
        # FIIs have 'FII', 'FUNDO DE INVESTIMENTO IMOBILIARIO', 'REAL ESTATE'
        # PSVM11 is Porto VM (TPR / Equity)
        if ' UNT' in name or 'UNT ' in name or name.endswith('UNT') or 'FII' in name or 'IMOBILIARIO' in name or 'PORTO VM' in name or 'TPR' in name or 'RECIBO' in name or 'BDR' in name:
            non_etfs.add(tk)
            print(f"[{idx+1}/{len(tickers)}] REMOVE (NOT ETF): {tk} -> {name}")
        else:
            print(f"[{idx+1}/{len(tickers)}] VALID ETF: {tk} -> {name}")
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] {tk} error: {e}")

print(f"\nTotal Non-ETFs identified: {len(non_etfs)}")
print(sorted(list(non_etfs)))

# Replace & remove from etfData.ts
def filter_fn(match):
    block = match.group(0)
    m = re.search(r"ticker:\s*'([^']+)'", block)
    if m and m.group(1) in non_etfs:
        return ""
    return block

pattern = re.compile(r"\s*\{\s*id:\s*'[^']+',\s*ticker:\s*'[^']+'.*?\n  \},?", re.DOTALL)
new_code = pattern.sub(filter_fn, code)
new_code = re.sub(r",\s*,", ",", new_code)

with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("etfData.ts successfully cleaned of all Units, FIIs and non-ETFs!")
