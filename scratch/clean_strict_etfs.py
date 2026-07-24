import re
import json
import sys
import yfinance as yf

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}
tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))

print(f"Screening {len(tickers)} tickers in etfData.ts...")

invalid_tickers = set()

for idx, tk in enumerate(tickers):
    sym = tk if tk in us_tickers else f"{tk}.SA"
    try:
        t = yf.Ticker(sym)
        info = t.info or {}
        qtype = info.get('quoteType')
        name = (info.get('shortName') or info.get('longName') or '').upper()
        
        # Flag if explicitly EQUITY, MUTUALFUND or contains FII / BDR
        if (qtype and qtype != 'ETF') or 'FII' in name or 'IMOBILIARIO' in name or 'RECIBO' in name or ' BDR' in name:
            invalid_tickers.add(tk)
            print(f"[{idx+1}/{len(tickers)}] REMOVING NON-ETF: {tk} (quoteType: {qtype}, name: {name})")
        else:
            print(f"[{idx+1}/{len(tickers)}] VALID ETF: {tk}")
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] {tk} check error: {e}")

print(f"\nFound {len(invalid_tickers)} non-ETF tickers to remove: {sorted(list(invalid_tickers))}")

# Now remove these blocks from etfData.ts
def remove_non_etfs(match):
    block = match.group(0)
    tk_match = re.search(r"ticker:\s*'([^']+)'", block)
    if tk_match and tk_match.group(1) in invalid_tickers:
        return ""
    return block

etf_object_regex = re.compile(r"\s*\{\s*id:\s*'[^']+',\s*ticker:\s*'[^']+'.*?\n  \},?", re.DOTALL)
cleaned_code = etf_object_regex.sub(remove_non_etfs, code)

# Clean any double commas or empty array entries
cleaned_code = re.sub(r",\s*,", ",", cleaned_code)

with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
    f.write(cleaned_code)

print("etfData.ts cleaned successfully!")
