import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}
tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))

import yfinance as yf

print(f"Screening {len(tickers)} tickers for quoteType and security category...")

non_etfs = []
verified_etfs = []

for idx, tk in enumerate(tickers):
    sym = tk if tk in us_tickers else f"{tk}.SA"
    try:
        t = yf.Ticker(sym)
        info = t.info or {}
        qtype = info.get('quoteType', 'UNKNOWN')
        name = info.get('shortName') or info.get('longName') or ''
        
        # If Yahoo explicitly marks as EQUITY, MUTUALFUND, BDR or FII (final digit 11 often FII/Unit/BDR)
        if qtype in ['EQUITY', 'FUTURE'] or 'FII' in name.upper() or 'FUNDO DE INVESTIMENTO IMOBILIARIO' in name.upper() or 'BDR' in name.upper() or 'RECIBO' in name.upper():
            non_etfs.append((tk, qtype, name))
            print(f"[{idx+1}/{len(tickers)}] NON-ETF REMOVE: {tk} | Type: {qtype} | Name: {name}")
        else:
            verified_etfs.append(tk)
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] {tk} error checking info: {e}")

print(f"\nFINISH SCREENING!")
print(f"Verified ETFs: {len(verified_etfs)}")
print(f"Non-ETFs flagged for removal: {len(non_etfs)}")
for item in non_etfs:
    print(f" - {item[0]}: {item[1]} ({item[2]})")

with open('scratch/non_etfs.json', 'w', encoding='utf-8') as f:
    json.dump(non_etfs, f, indent=2)
