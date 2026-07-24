#!/usr/bin/env python3
"""
ETF500 — Robô de Curadoria de Notícias de ETFs
Scrapes Google News RSS para notícias sobre ETFs brasileiros e globais.
Faz upsert na tabela etf_news do Supabase (deduplicação por source_url).

Execução: python bot_noticias.py
Automação: GitHub Actions (etl_daily.yml) ou crontab
"""

import os
import re
import urllib.request
import xml.etree.ElementTree as ET
import json
import hashlib
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dfphhwgczizvxsszngrc.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# Google News RSS queries focused on Brazilian ETFs
QUERIES = [
    "ETF+B3+Brasil",
    "ETF+IVVB11+OR+BOVA11+OR+HASH11",
    "ETF+renda+fixa+Brasil+LFTS11+OR+B5P211",
    "ETF+criptomoedas+Bitcoin+B3",
    "fundos+indice+bolsa+brasileira",
    "Vanguard+OR+BlackRock+ETF+Brasil",
]

# Known ETF tickers for auto-tagging
KNOWN_TICKERS = [
    "IVVB11", "BOVA11", "SMAL11", "HASH11", "WRLD11", "XINA11",
    "VOO", "QQQ", "SCHD", "VNQ", "BND", "SPY",
    "B5P211", "LFTS11", "IMAB11", "DIVO11", "SPYI11",
    "BOVA11", "BOVV11", "GOLD11", "ETHE11", "QBTC11",
    "NASD11", "SPXB11", "NDIV11", "BNKS11",
    "NB0211", "NB0511", "NB1011", "NCDI11",
]

# Category detection keywords
CATEGORY_RULES = {
    "Cripto": ["cripto", "bitcoin", "btc", "ethereum", "hash11", "ethe11", "qbtc11", "solana", "defi"],
    "Renda Fixa": ["renda fixa", "tesouro", "selic", "ipca", "ntn", "lfts", "b5p2", "imab", "prefixado", "cdi"],
    "Internacional": ["s&p 500", "sp500", "nasdaq", "vanguard", "eua", "americano", "dólar", "global"],
    "Regulação": ["cvm", "anbima", "regulação", "tributação", "imposto", "legislação", "reforma"],
    "Lançamento": ["lança", "lançam", "novo etf", "chega à b3", "estreia", "primeiro etf", "inédito"],
}


def detect_category(title: str, summary: str = "") -> str:
    """Auto-detect news category based on title + summary keywords."""
    text = (title + " " + summary).lower()
    for category, keywords in CATEGORY_RULES.items():
        if any(kw in text for kw in keywords):
            return category
    return "Mercado"


def detect_tickers(title: str, summary: str = "") -> list:
    """Auto-detect mentioned ETF tickers in the title/summary."""
    text = (title + " " + summary).upper()
    found = []
    for ticker in KNOWN_TICKERS:
        if ticker in text and ticker not in found:
            found.append(ticker)
    return found


def fetch_google_news_rss(query: str, max_items: int = 8) -> list:
    """Fetch articles from Google News RSS for a given query."""
    url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 ETF500-Bot/1.0"})
    
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        data = resp.read().decode("utf-8")
        root = ET.fromstring(data)
    except Exception as e:
        print(f"  [AVISO] Falha ao buscar RSS para query '{query}': {e}")
        return []

    articles = []
    for item in root.findall(".//item")[:max_items]:
        title = (item.find("title").text or "").strip() if item.find("title") is not None else ""
        link = (item.find("link").text or "").strip() if item.find("link") is not None else ""
        source = (item.find("source").text or "").strip() if item.find("source") is not None else ""
        pub_date_str = (item.find("pubDate").text or "").strip() if item.find("pubDate") is not None else ""

        if not title or not link:
            continue

        # Parse RFC 2822 date
        try:
            pub_date = parsedate_to_datetime(pub_date_str)
        except Exception:
            pub_date = datetime.utcnow()

        # Skip articles older than 30 days
        if (datetime.utcnow() - pub_date.replace(tzinfo=None)).days > 30:
            continue

        articles.append({
            "title": title,
            "source_name": source,
            "source_url": link,
            "published_at": pub_date.isoformat(),
            "category": detect_category(title),
            "related_tickers": detect_tickers(title),
        })

    return articles


def deduplicate(articles: list) -> list:
    """Remove duplicate articles by normalized source_url."""
    seen_urls = set()
    seen_titles = set()
    unique = []
    for a in articles:
        url_key = a["source_url"].split("?")[0].lower()
        title_key = re.sub(r"[^a-záéíóúâêôãõçà]", "", a["title"].lower())[:80]
        if url_key not in seen_urls and title_key not in seen_titles:
            seen_urls.add(url_key)
            seen_titles.add(title_key)
            unique.append(a)
    return unique


def upsert_to_supabase(articles: list):
    """Upsert articles to Supabase etf_news table."""
    if not SUPABASE_SERVICE_KEY:
        print("[AVISO] SUPABASE_SERVICE_KEY não configurada. Apenas exibindo resultados.")
        for i, a in enumerate(articles[:15], 1):
            tickers = ", ".join(a["related_tickers"]) if a["related_tickers"] else "-"
            print(f"  [{i:02d}] [{a['category']:14s}] {a['title']}")
            print(f"       Fonte: {a['source_name']} | Tickers: {tickers}")
        return

    url = f"{SUPABASE_URL}/rest/v1/etf_news?on_conflict=source_url"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    success_count = 0
    for a in articles:
        payload = {
            "title": a["title"],
            "summary": a.get("summary", ""),
            "source_name": a["source_name"],
            "source_url": a["source_url"],
            "category": a["category"],
            "related_tickers": a["related_tickers"],
            "published_at": a["published_at"],
        }

        try:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            resp = urllib.request.urlopen(req, timeout=10)
            success_count += 1
        except Exception as e:
            print(f"  [ERRO] Falha ao upsert '{a['title'][:60]}...': {e}")

    print(f"  [OK] {success_count}/{len(articles)} notícias inseridas/atualizadas no Supabase.")


def run():
    print(f"[{datetime.now():%Y-%m-%d %H:%M}] Iniciando curadoria de notícias de ETFs...")
    
    all_articles = []
    for query in QUERIES:
        print(f"  -> Buscando: {query}")
        articles = fetch_google_news_rss(query)
        all_articles.extend(articles)
        print(f"     {len(articles)} resultados")

    unique = deduplicate(all_articles)
    print(f"\n  Total bruto: {len(all_articles)} | Após deduplicação: {len(unique)}")

    # Sort by publication date (most recent first)
    unique.sort(key=lambda x: x["published_at"], reverse=True)

    upsert_to_supabase(unique)
    print(f"\n[{datetime.now():%Y-%m-%d %H:%M}] Curadoria de notícias concluída!")


if __name__ == "__main__":
    run()
