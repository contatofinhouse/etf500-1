import urllib.request
import json
import re
import sys

# Set stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Load tickers from etfData.ts
with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

tickers = sorted(list(set(re.findall(r"ticker:\s*'([^']+)'", code))))
print(f"Total tickers to fetch from yfinance: {len(tickers)}")

import yfinance as yf

SUPABASE_URL = "https://dfphhwgczizvxsszngrc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcGhod2djeml6dnhzc3puZ3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MzQ2MDAsImV4cCI6MjEwMDIxMDYwMH0.uO1pijYWGFXb9Ci2SsT3oY82F0uRdbV2U-tTpE-Mt0I"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def upsert_to_supabase(table, data):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status
    except Exception as e:
        print(f"Supabase upsert error ({table}):", e)
        return None

us_tickers = {'VOO', 'QQQ', 'SCHD', 'VNQ', 'BND', 'AGG', 'TLT', 'SHY', 'IEF', 'LQD', 'TIP', 'VT', 'VTI', 'VXUS', 'RSP', 'SCHA', 'SCHF'}

total_downloaded = 0
total_records = 0

print("Starting 24-month yfinance sync to Supabase...")

for idx, ticker in enumerate(tickers):
    yf_symbol = ticker if ticker in us_tickers else f"{ticker}.SA"
    try:
        t = yf.Ticker(yf_symbol)
        df = t.history(period="2y")
        if df.empty and not ticker.endswith(".SA") and ticker not in us_tickers:
            yf_symbol = f"{ticker}.SA"
            t = yf.Ticker(yf_symbol)
            df = t.history(period="2y")

        if not df.empty:
            records = []
            for date, row in df.iterrows():
                close_price = round(float(row['Close']), 2)
                volume = int(row['Volume'])
                date_str = date.strftime('%Y-%m-%d')
                records.append({
                    "etf_ticker": ticker,
                    "date": date_str,
                    "close_price": close_price,
                    "volume": volume
                })
            
            if records:
                chunk_size = 500
                for i in range(0, len(records), chunk_size):
                    chunk = records[i:i+chunk_size]
                    upsert_to_supabase("etf_historical_prices", chunk)
                
                total_downloaded += 1
                total_records += len(records)
                last_price = records[-1]['close_price']
                print(f"[{idx+1}/{len(tickers)}] OK: {ticker} ({yf_symbol}) — {len(records)} dias | Último Preço: R$/US$ {last_price}")
        else:
            print(f"[{idx+1}/{len(tickers)}] NO_DATA: {ticker} ({yf_symbol})")
    except Exception as e:
        print(f"[{idx+1}/{len(tickers)}] ERROR: {ticker} -> {e}")

print(f"\nFINISH! Successfully updated {total_downloaded} ETFs with {total_records} total historical daily prices in Supabase.")
