import re
import json
import yfinance as yf

# Load etfData.ts
with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

# List of US native tickers
us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF', 'SPYI'}

# Extract all tickers from code
tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))
print(f"Total ETFs in database: {len(tickers)}")

updated_prices = {}

print("Downloading real current prices from Yahoo Finance...")

for idx, ticker in enumerate(tickers):
    yf_symbol = ticker if ticker in us_tickers else f"{ticker}.SA"
    try:
        t = yf.Ticker(yf_symbol)
        df = t.history(period="5d")
        if df.empty and not ticker.endswith(".SA") and ticker not in us_tickers:
            yf_symbol = f"{ticker}.SA"
            t = yf.Ticker(yf_symbol)
            df = t.history(period="5d")

        if not df.empty:
            last_close = round(float(df['Close'].iloc[-1]), 2)
            prev_close = float(df['Close'].iloc[-2]) if len(df) >= 2 else last_close
            change_pct = round(((last_close - prev_close) / prev_close) * 100, 2) if prev_close else 0.0
            
            updated_prices[ticker] = {
                'current_price': last_close,
                'daily_change': change_pct
            }
            print(f"[{idx+1}/{len(tickers)}] {ticker} -> Price: {last_close} | Change: {change_pct}%")
        else:
            print(f"[{idx+1}/{len(tickers)}] NO DATA: {ticker}")
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] ERROR: {ticker} -> {e}")

# Now update etfData.ts for all matched tickers
def update_etf_block(match):
    block = match.group(0)
    ticker_match = re.search(r"ticker:\s*'([^']+)'", block)
    if ticker_match:
        tk = ticker_match.group(1)
        if tk in updated_prices:
            data = updated_prices[tk]
            # Replace current_price and daily_change inside this specific ETF object
            block = re.sub(r"current_price:\s*[\d\.]+", f"current_price: {data['current_price']}", block)
            block = re.sub(r"daily_change:\s*[\-\d\.]+", f"daily_change: {data['daily_change']}", block)
    return block

# Replace within the ETFS_LIST array
etf_object_regex = re.compile(r"\{\s*id:\s*'[^']+',\s*ticker:\s*'[^']+'.*?\n  \}", re.DOTALL)
new_code = etf_object_regex.sub(update_etf_block, code)

with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("\nSuccessfully updated all real prices and daily changes in etfData.ts!")
