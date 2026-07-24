import urllib.request
import re
import json

tickers_dict = {}
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for page in range(1, 10):
    url = f"https://investidor10.com.br/etfs/?page={page}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8', errors='ignore')
            # Extract links like /etfs/ivvb11/
            matches = re.findall(r'/etfs/([a-zA-Z0-9]+)/', html)
            found_in_page = 0
            for m in matches:
                ticker = m.upper()
                if ticker not in ['FARM', 'PAGE', 'BUSCA', 'FILTROS', 'AZ'] and len(ticker) >= 4 and len(ticker) <= 8:
                    if ticker not in tickers_dict:
                        tickers_dict[ticker] = page
                        found_in_page += 1
            print(f"Page {page}: found {found_in_page} new tickers")
            if found_in_page == 0 and page > 3:
                break
    except Exception as e:
        print(f"Error page {page}: {e}")

print("\n--- TICKERS ENCONTRADOS ---")
sorted_tickers = sorted(list(tickers_dict.keys()))
print(sorted_tickers)
print(f"TOTAL UNICOS: {len(sorted_tickers)}")

with open('investidor10_etfs.json', 'w') as f:
    json.dump(sorted_tickers, f, indent=2)
