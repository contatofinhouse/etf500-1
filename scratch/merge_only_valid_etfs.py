import re
import json
import sys
import yfinance as yf

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/etfData.ts', encoding='utf-8') as f:
    base_code = f.read()

with open('scratch/missing_etfs_snippet.ts', encoding='utf-8') as f:
    snippet = f.read()

# Extract all missing ETF blocks
blocks = re.findall(r"\{\s*id:\s*'[^']+',\s*ticker:\s*'([^']+)'.*?\n  \}", snippet, re.DOTALL)
print(f"Total candidate ETFs from snippet: {len(blocks)}")

us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}

valid_blocks = []
invalid_tickers = []

for idx, b in enumerate(blocks):
    m = re.search(r"ticker:\s*'([^']+)'", b)
    if not m:
        continue
    tk = m.group(1)
    
    # Check yfinance info for UNT, FII or Equity like PSVM11
    sym = tk if tk in us_tickers else f"{tk}.SA"
    try:
        t = yf.Ticker(sym)
        info = t.info or {}
        name = (info.get('shortName') or info.get('longName') or '').upper()
        
        # Criteria for non-ETF
        if 'PORTO VM' in name or ' UNT' in name or name.endswith('UNT') or 'FII' in name or 'REAL ESTATE' in name or 'RECIBO' in name:
            invalid_tickers.append((tk, name))
            print(f"[{idx+1}/{len(blocks)}] REJECT (NOT ETF): {tk} ({name})")
        else:
            valid_blocks.append(b)
            print(f"[{idx+1}/{len(blocks)}] ACCEPT (VALID ETF): {tk} ({name})")
    except Exception as e:
        valid_blocks.append(b)
        print(f"[{idx+1}/{len(blocks)}] ACCEPT (FALLBACK): {tk}")

print(f"\nSummary: {len(valid_blocks)} Valid ETFs accepted, {len(invalid_tickers)} Non-ETFs rejected.")

target = "    holdings: [\n      { name: 'Tencent Holdings', percentage: 14.1 },\n      { name: 'Alibaba Group', percentage: 8.5 },\n      { name: 'Meituan Dianping', percentage: 4.2 },\n      { name: 'China Construction Bank', percentage: 3.1 },\n      { name: 'JD.com Inc.', percentage: 2.4 },\n      { name: 'Baidu Inc.', percentage: 1.8 },\n      { name: 'Xiaomi Corp.', percentage: 1.5 },\n      { name: 'Ping An Insurance', percentage: 1.4 },\n    ]\n  }\n];"

replacement = "    holdings: [\n      { name: 'Tencent Holdings', percentage: 14.1 },\n      { name: 'Alibaba Group', percentage: 8.5 },\n      { name: 'Meituan Dianping', percentage: 4.2 },\n      { name: 'China Construction Bank', percentage: 3.1 },\n      { name: 'JD.com Inc.', percentage: 2.4 },\n      { name: 'Baidu Inc.', percentage: 1.8 },\n      { name: 'Xiaomi Corp.', percentage: 1.5 },\n      { name: 'Ping An Insurance', percentage: 1.4 },\n    ]\n  },\n" + ",\n".join(valid_blocks) + "\n];"

new_code = base_code.replace(target, replacement)

with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Successfully merged ONLY valid ETFs into etfData.ts!")
