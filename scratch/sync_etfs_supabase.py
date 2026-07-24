import urllib.request
import json
import re

SUPABASE_URL = 'https://dfphhwgczizvxsszngrc.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcGhod2djeml6dnhzc3puZ3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MzQ2MDAsImV4cCI6MjEwMDIxMDYwMH0.uO1pijYWGFXb9Ci2SsT3oY82F0uRdbV2U-tTpE-Mt0I'

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

with open('src/data/etfData.ts', encoding='utf-8') as f:
    code = f.read()

# Extract all ETF objects from etfData.ts
etf_blocks = re.findall(r"\{\s*id:\s*'([^']+)',\s*ticker:\s*'([^']+)'.*?name:\s*'([^']+)'.*?market:\s*'([^']+)'.*?currency:\s*'([^']+)'.*?expense_ratio:\s*([\d\.]+).*?dividend_yield:\s*([\d\.]+).*?aum:\s*([\d\.]+).*?sector:\s*'([^']+)'.*?daily_change:\s*([\-\d\.]+).*?current_price:\s*([\d\.]+).*?manager:\s*'([^']+)'", code, re.DOTALL)

print(f"Parsed {len(etf_blocks)} ETFs from local code.")

etfs_to_upsert = []
for b in etf_blocks:
    etfs_to_upsert.append({
        "ticker": b[1],
        "name": b[2],
        "market": b[3],
        "currency": b[4],
        "expense_ratio": float(b[5]),
        "dividend_yield": float(b[6]),
        "aum": float(b[7]),
        "category": b[8],
        "change_percent": float(b[9]),
        "close_price": float(b[10]),
        "manager": b[11]
    })

# Chunk upsert to etfs table
chunk_size = 50
for i in range(0, len(etfs_to_upsert), chunk_size):
    chunk = etfs_to_upsert[i:i+chunk_size]
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/etfs", data=json.dumps(chunk).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"Upserted etfs batch {i//chunk_size + 1}: status {resp.status}")
    except Exception as e:
        print(f"Error upserting etfs batch:", e)

print("Finished syncing all 211 ETFs to Supabase table!")
