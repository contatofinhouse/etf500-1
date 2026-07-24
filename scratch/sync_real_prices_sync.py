import re
import json
import yfinance as yf

with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}
tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))

updated = {}
print(f"Fetching real prices for {len(tickers)} ETFs...")

for idx, tk in enumerate(tickers):
    sym = tk if tk in us_tickers else f"{tk}.SA"
    try:
        df = yf.Ticker(sym).history(period='5d')
        if df.empty and not tk.endswith('.SA') and tk not in us_tickers:
            df = yf.Ticker(f"{tk}.SA").history(period='5d')
        if not df.empty:
            c_price = round(float(df['Close'].iloc[-1]), 2)
            p_price = float(df['Close'].iloc[-2]) if len(df) >= 2 else c_price
            chg = round(((c_price - p_price) / p_price) * 100, 2) if p_price else 0.0
            updated[tk] = (c_price, chg)
            print(f"[{idx+1}/{len(tickers)}] {tk} ({sym}) -> R$/US$ {c_price} ({chg}%)")
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] {tk} error: {e}")

print(f"\nDownloaded real prices for {len(updated)} tickers!")

def replace_fn(m):
    block = m.group(0)
    tk_m = re.search(r"ticker:\s*'([^']+)'", block)
    if tk_m and tk_m.group(1) in updated:
        cp, chg = updated[tk_m.group(1)]
        block = re.sub(r"current_price:\s*[\d\.]+", f"current_price: {cp}", block)
        block = re.sub(r"daily_change:\s*[\-\d\.]+", f"daily_change: {chg}", block)
    return block

pattern = re.compile(r"\{\s*id:\s*'[^']+',\s*ticker:\s*'[^']+'.*?\n  \}", re.DOTALL)
new_code = pattern.sub(replace_fn, code)

with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Updated etfData.ts with real market prices successfully!")
