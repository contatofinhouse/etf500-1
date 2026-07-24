import re
import json
import yfinance as yf

with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}
tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))

print(f"Auditing {len(tickers)} tickers in etfData.ts for Non-ETFs...")

to_remove = set()

for idx, tk in enumerate(tickers):
    if tk in us_tickers:
        continue
    try:
        t = yf.Ticker(f"{tk}.SA")
        info = t.info or {}
        name = (info.get('shortName') or info.get('longName') or '').upper()
        
        # Check if B3 stock Unit (UNT) or FII or Company (like PSVM11)
        if 'UNT' in name or 'UNIT' in name or 'PORTO VM' in name or 'FII' in name or 'IMOBILIARIO' in name or 'RECEITA' in name:
            to_remove.add(tk)
            print(f"[{idx+1}/{len(tickers)}] REMOVE NON-ETF: {tk} ({name})")
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] {tk} error: {e}")

print(f"\nFound {len(to_remove)} Non-ETF tickers: {sorted(list(to_remove))}")

if to_remove:
    def filter_fn(match):
        block = match.group(0)
        m = re.search(r"ticker:\s*'([^']+)'", block)
        if m and m.group(1) in to_remove:
            return ""
        return block

    pattern = re.compile(r"\s*\{\s*id:\s*'[^']+',\s*ticker:\s*'[^']+'.*?\n  \},?", re.DOTALL)
    cleaned_code = pattern.sub(filter_fn, code)
    cleaned_code = re.sub(r",\s*,", ",", cleaned_code)

    with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
        f.write(cleaned_code)

    print("etfData.ts updated and cleaned successfully!")
else:
    print("Database is already 100% clean of Non-ETFs!")
