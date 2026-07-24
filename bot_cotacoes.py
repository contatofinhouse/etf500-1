import os
import sys
import yfinance as yf
import pandas as pd
import requests
from datetime import datetime
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env (se existir localmente)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dfphhwgczizvxsszngrc.supabase.co")

def resolve_supabase_key():
    for var_name in [
        "SUPABASE_SERVICE_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "SUPABASE_KEY",
        "SUPABASE_SECRET",
        "SERVICE_ROLE_KEY",
        "SERVICE_ROLE"
    ]:
        val = (os.getenv(var_name) or "").strip()
        if val:
            return val
    return ""

SUPABASE_SERVICE_KEY = resolve_supabase_key()

# =============================================================================
# LISTA COMPLETA DE TODOS OS 30 ETFs DO SITE ETF500
# =============================================================================
ETFS_TO_TRACK = [
    {
        "ticker": "IVVB11.SA",
        "db_ticker": "IVVB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Diversificado Global"
    },
    {
        "ticker": "BOVA11.SA",
        "db_ticker": "BOVA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Nacional Multissetorial"
    },
    {
        "ticker": "SMAL11.SA",
        "db_ticker": "SMAL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Small Caps Brasil"
    },
    {
        "ticker": "HASH11.SA",
        "db_ticker": "HASH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia & Cripto"
    },
    {
        "ticker": "WRLD11.SA",
        "db_ticker": "WRLD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Globais"
    },
    {
        "ticker": "VOO",
        "db_ticker": "VOO",
        "market": "US",
        "currency": "USD",
        "category": "Diversificado EUA"
    },
    {
        "ticker": "QQQ",
        "db_ticker": "QQQ",
        "market": "US",
        "currency": "USD",
        "category": "Tecnologia EUA"
    },
    {
        "ticker": "SCHD",
        "db_ticker": "SCHD",
        "market": "US",
        "currency": "USD",
        "category": "Dividendos EUA"
    },
    {
        "ticker": "VNQ",
        "db_ticker": "VNQ",
        "market": "US",
        "currency": "USD",
        "category": "Imobiliário (REITs)"
    },
    {
        "ticker": "XINA11.SA",
        "db_ticker": "XINA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Mercados Emergentes"
    },
    {
        "ticker": "B5P211.SA",
        "db_ticker": "B5P211",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "IMAB11.SA",
        "db_ticker": "IMAB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "LFTS11.SA",
        "db_ticker": "LFTS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "DEB11.SA",
        "db_ticker": "DEB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "DIVO11.SA",
        "db_ticker": "DIVO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Nacional Dividendos"
    },
    {
        "ticker": "GOLD11.SA",
        "db_ticker": "GOLD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Commodities & Reserva"
    },
    {
        "ticker": "QBTC11.SA",
        "db_ticker": "QBTC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia & Cripto"
    },
    {
        "ticker": "IB5M11.SA",
        "db_ticker": "IB5M11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "NTNS11.SA",
        "db_ticker": "NTNS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "IRFM11.SA",
        "db_ticker": "IRFM11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "DEBB11.SA",
        "db_ticker": "DEBB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "JURO11.SA",
        "db_ticker": "JURO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "FIXA11.SA",
        "db_ticker": "FIXA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "BND",
        "db_ticker": "BND",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "AGG",
        "db_ticker": "AGG",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "TLT",
        "db_ticker": "TLT",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "SHY",
        "db_ticker": "SHY",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "IEF",
        "db_ticker": "IEF",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "LQD",
        "db_ticker": "LQD",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "TIP",
        "db_ticker": "TIP",
        "market": "US",
        "currency": "USD",
        "category": "Renda Fixa Global"
    },
    {
        "ticker": "5GTK11.SA",
        "db_ticker": "5GTK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "5PRE11.SA",
        "db_ticker": "5PRE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "ABTC11.SA",
        "db_ticker": "ABTC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "ACWI11.SA",
        "db_ticker": "ACWI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "AGRI11.SA",
        "db_ticker": "AGRI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Agronegócio & Commodities"
    },
    {
        "ticker": "ALUG11.SA",
        "db_ticker": "ALUG11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "AREA11.SA",
        "db_ticker": "AREA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "ARGE11.SA",
        "db_ticker": "ARGE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "AUPO11.SA",
        "db_ticker": "AUPO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "AURO11.SA",
        "db_ticker": "AURO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "AUVP11.SA",
        "db_ticker": "AUVP11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "B3BR11.SA",
        "db_ticker": "B3BR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "B5MB11.SA",
        "db_ticker": "B5MB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BBOI11.SA",
        "db_ticker": "BBOI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Agronegócio & Commodities"
    },
    {
        "ticker": "BBOV11.SA",
        "db_ticker": "BBOV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BBSD11.SA",
        "db_ticker": "BBSD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BCIC11.SA",
        "db_ticker": "BCIC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BDEF11.SA",
        "db_ticker": "BDEF11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BDOM11.SA",
        "db_ticker": "BDOM11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BEST11.SA",
        "db_ticker": "BEST11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BITC11.SA",
        "db_ticker": "BITC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "BITH11.SA",
        "db_ticker": "BITH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "BITI11.SA",
        "db_ticker": "BITI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "BIZD11.SA",
        "db_ticker": "BIZD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BLFT11.SA",
        "db_ticker": "BLFT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "BLOK11.SA",
        "db_ticker": "BLOK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BMMT11.SA",
        "db_ticker": "BMMT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BNDX11.SA",
        "db_ticker": "BNDX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BNKS11.SA",
        "db_ticker": "BNKS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BOL511.SA",
        "db_ticker": "BOL511",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BOVB11.SA",
        "db_ticker": "BOVB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BOVS11.SA",
        "db_ticker": "BOVS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BOVV11.SA",
        "db_ticker": "BOVV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BOVX11.SA",
        "db_ticker": "BOVX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BRAX11.SA",
        "db_ticker": "BRAX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BRAZ11.SA",
        "db_ticker": "BRAZ11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BREW11.SA",
        "db_ticker": "BREW11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BTEK11.SA",
        "db_ticker": "BTEK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "BTER11.SA",
        "db_ticker": "BTER11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BVBR11.SA",
        "db_ticker": "BVBR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "BXPO11.SA",
        "db_ticker": "BXPO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "CAPE11.SA",
        "db_ticker": "CAPE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "CASA11.SA",
        "db_ticker": "CASA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "CDIB11.SA",
        "db_ticker": "CDIB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "CHIP11.SA",
        "db_ticker": "CHIP11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "CMDB11.SA",
        "db_ticker": "CMDB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "COIN11.SA",
        "db_ticker": "COIN11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "CORN11.SA",
        "db_ticker": "CORN11",
        "market": "BR",
        "currency": "BRL",
        "category": "Agronegócio & Commodities"
    },
    {
        "ticker": "CRPT11.SA",
        "db_ticker": "CRPT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "DBOA11.SA",
        "db_ticker": "DBOA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "DEFI11.SA",
        "db_ticker": "DEFI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "DIVD11.SA",
        "db_ticker": "DIVD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Dividendos"
    },
    {
        "ticker": "DOLA11.SA",
        "db_ticker": "DOLA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "DOLB11.SA",
        "db_ticker": "DOLB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "DOLX11.SA",
        "db_ticker": "DOLX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "DVER11.SA",
        "db_ticker": "DVER11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "EBIT11.SA",
        "db_ticker": "EBIT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "ECOO11.SA",
        "db_ticker": "ECOO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "EETH11.SA",
        "db_ticker": "EETH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "ELAS11.SA",
        "db_ticker": "ELAS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "ESGB11.SA",
        "db_ticker": "ESGB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "ETHE11.SA",
        "db_ticker": "ETHE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "ETHY11.SA",
        "db_ticker": "ETHY11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "EWBZ11.SA",
        "db_ticker": "EWBZ11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "FIND11.SA",
        "db_ticker": "FIND11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "FIXX11.SA",
        "db_ticker": "FIXX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "FOMO11.SA",
        "db_ticker": "FOMO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "FOOD11.SA",
        "db_ticker": "FOOD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Agronegócio & Commodities"
    },
    {
        "ticker": "GBTC11.SA",
        "db_ticker": "GBTC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GDIV11.SA",
        "db_ticker": "GDIV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Dividendos"
    },
    {
        "ticker": "GENB11.SA",
        "db_ticker": "GENB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GICP11.SA",
        "db_ticker": "GICP11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GLDI11.SA",
        "db_ticker": "GLDI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Commodities & Metais"
    },
    {
        "ticker": "GLDX11.SA",
        "db_ticker": "GLDX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GLFT11.SA",
        "db_ticker": "GLFT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "GOAT11.SA",
        "db_ticker": "GOAT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GOLB11.SA",
        "db_ticker": "GOLB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GOLX11.SA",
        "db_ticker": "GOLX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GOVE11.SA",
        "db_ticker": "GOVE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GPCA11.SA",
        "db_ticker": "GPCA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GPUS11.SA",
        "db_ticker": "GPUS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "GXUS11.SA",
        "db_ticker": "GXUS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "HERT11.SA",
        "db_ticker": "HERT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "HGBR11.SA",
        "db_ticker": "HGBR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "HIGH11.SA",
        "db_ticker": "HIGH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "HODL11.SA",
        "db_ticker": "HODL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "HTEK11.SA",
        "db_ticker": "HTEK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "HYBR11.SA",
        "db_ticker": "HYBR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "IBOB11.SA",
        "db_ticker": "IBOB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "IDKA11.SA",
        "db_ticker": "IDKA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "IMBB11.SA",
        "db_ticker": "IMBB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "ISUS11.SA",
        "db_ticker": "ISUS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "IVWO11.SA",
        "db_ticker": "IVWO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "IWMI11.SA",
        "db_ticker": "IWMI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "JOGO11.SA",
        "db_ticker": "JOGO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "LFIN11.SA",
        "db_ticker": "LFIN11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "LFIX11.SA",
        "db_ticker": "LFIX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "LFTB11.SA",
        "db_ticker": "LFTB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "LFTI11.SA",
        "db_ticker": "LFTI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "LFTX11.SA",
        "db_ticker": "LFTX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "LLFT11.SA",
        "db_ticker": "LLFT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "LTBX11.SA",
        "db_ticker": "LTBX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "LTNB11.SA",
        "db_ticker": "LTNB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "LVOL11.SA",
        "db_ticker": "LVOL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "MARG11.SA",
        "db_ticker": "MARG11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "MATB11.SA",
        "db_ticker": "MATB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "META11.SA",
        "db_ticker": "META11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "MILL11.SA",
        "db_ticker": "MILL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NASD11.SA",
        "db_ticker": "NASD11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NB0211.SA",
        "db_ticker": "NB0211",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NB0511.SA",
        "db_ticker": "NB0511",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NB1011.SA",
        "db_ticker": "NB1011",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NBIT11.SA",
        "db_ticker": "NBIT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "NBOV11.SA",
        "db_ticker": "NBOV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NCDI11.SA",
        "db_ticker": "NCDI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "NDIV11.SA",
        "db_ticker": "NDIV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Dividendos"
    },
    {
        "ticker": "NFTS11.SA",
        "db_ticker": "NFTS11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NLFA11.SA",
        "db_ticker": "NLFA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NSDV11.SA",
        "db_ticker": "NSDV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "NUCL11.SA",
        "db_ticker": "NUCL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "OURO11.SA",
        "db_ticker": "OURO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Commodities & Metais"
    },
    {
        "ticker": "PACB11.SA",
        "db_ticker": "PACB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PACG11.SA",
        "db_ticker": "PACG11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PACL11.SA",
        "db_ticker": "PACL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PEVC11.SA",
        "db_ticker": "PEVC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PHIP11.SA",
        "db_ticker": "PHIP11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PIBB11.SA",
        "db_ticker": "PIBB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PIPE11.SA",
        "db_ticker": "PIPE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PKIN11.SA",
        "db_ticker": "PKIN11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "POSB11.SA",
        "db_ticker": "POSB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "PREX11.SA",
        "db_ticker": "PREX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "QDFI11.SA",
        "db_ticker": "QDFI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "QETH11.SA",
        "db_ticker": "QETH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "QLBR11.SA",
        "db_ticker": "QLBR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "QQQI11.SA",
        "db_ticker": "QQQI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "QQQQ11.SA",
        "db_ticker": "QQQQ11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "QSOL11.SA",
        "db_ticker": "QSOL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "RARA11.SA",
        "db_ticker": "RARA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "REVE11.SA",
        "db_ticker": "REVE11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "RICO11.SA",
        "db_ticker": "RICO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SCVB11.SA",
        "db_ticker": "SCVB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SFIX11.SA",
        "db_ticker": "SFIX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "SILK11.SA",
        "db_ticker": "SILK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SLVR11.SA",
        "db_ticker": "SLVR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Commodities & Metais"
    },
    {
        "ticker": "SMAB11.SA",
        "db_ticker": "SMAB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SMAC11.SA",
        "db_ticker": "SMAC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SOLH11.SA",
        "db_ticker": "SOLH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "SPUB11.SA",
        "db_ticker": "SPUB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPVT11.SA",
        "db_ticker": "SPVT11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPXB11.SA",
        "db_ticker": "SPXB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPXH11.SA",
        "db_ticker": "SPXH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPXI11.SA",
        "db_ticker": "SPXI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPXR11.SA",
        "db_ticker": "SPXR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPXU11.SA",
        "db_ticker": "SPXU11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPYI11.SA",
        "db_ticker": "SPYI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SPYR11.SA",
        "db_ticker": "SPYR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "SVAL11.SA",
        "db_ticker": "SVAL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "T10R11.SA",
        "db_ticker": "T10R11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "TD3511.SA",
        "db_ticker": "TD3511",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "TD5011.SA",
        "db_ticker": "TD5011",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "TD6011.SA",
        "db_ticker": "TD6011",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "TECK11.SA",
        "db_ticker": "TECK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "TECX11.SA",
        "db_ticker": "TECX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "TIRB11.SA",
        "db_ticker": "TIRB11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "TOPY11.SA",
        "db_ticker": "TOPY11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "TRIG11.SA",
        "db_ticker": "TRIG11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "USAL11.SA",
        "db_ticker": "USAL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Tecnologia"
    },
    {
        "ticker": "USTK11.SA",
        "db_ticker": "USTK11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "UTEC11.SA",
        "db_ticker": "UTEC11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "UTLL11.SA",
        "db_ticker": "UTLL11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "VWRA11.SA",
        "db_ticker": "VWRA11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "WEB311.SA",
        "db_ticker": "WEB311",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "WEJR11.SA",
        "db_ticker": "WEJR11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "XB3511.SA",
        "db_ticker": "XB3511",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "XBCI11.SA",
        "db_ticker": "XBCI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "XBOV11.SA",
        "db_ticker": "XBOV11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "XETH11.SA",
        "db_ticker": "XETH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Criptoativos"
    },
    {
        "ticker": "XFIX11.SA",
        "db_ticker": "XFIX11",
        "market": "BR",
        "currency": "BRL",
        "category": "Renda Fixa Brasil"
    },
    {
        "ticker": "XRPH11.SA",
        "db_ticker": "XRPH11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "XSPI11.SA",
        "db_ticker": "XSPI11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    },
    {
        "ticker": "YDRO11.SA",
        "db_ticker": "YDRO11",
        "market": "BR",
        "currency": "BRL",
        "category": "Ações Brasil B3"
    }
]

def get_jwt_role(token: str) -> str:
    try:
        parts = token.split('.')
        if len(parts) >= 2:
            padding = '=' * (-len(parts[1]) % 4)
            payload_b64 = parts[1] + padding
            decoded = base64.b64decode(payload_b64).decode('utf-8')
            data = json.loads(decoded)
            return data.get('role', 'unknown')
    except Exception:
        pass
    return 'unknown'

def run_pipeline(full_load=False):
    key = resolve_supabase_key()
    print(f"[DEBUG ENV] SUPABASE_URL: '{SUPABASE_URL}'")
    print(f"[DEBUG ENV] Tamanho da chave encontrada: {len(key)} caracteres")

    if not key:
        print("[ERRO CRÍTICO] Nenhuma chave do Supabase foi encontrada nas variáveis de ambiente!")
        print("Certifique-se de cadastrar SUPABASE_SERVICE_KEY em Settings -> Secrets and variables -> Actions no GitHub.")
        sys.exit(1)

    role = get_jwt_role(key)
    print(f"[AUTH SUPABASE] Role detectada no JWT: '{role}'")
    if role == 'anon':
        print("\n" + "!" * 80)
        print("[ERRO DE CHAVE DO SUPABASE] A secret configurada no GitHub é a chave 'anon' (pública).")
        print("As regras de segurança RLS do Supabase exigem a chave 'service_role' (secreta) para gravação.")
        print("Acesse o painel do Supabase -> Settings -> API -> copie a chave 'service_role' (secret).")
        print("E atualize a Secret SUPABASE_SERVICE_KEY no seu GitHub Repository Secrets.")
        print("!" * 80 + "\n")
        sys.exit(1)

    period = "max" if full_load else "10d"
    mode_label = "FULL LOAD (histórico completo)" if full_load else "INCREMENTAL (últimos 10 dias)"
    
    print(f"[{datetime.now()}] Iniciando pipeline ETL yfinance...")
    print(f"[MODO] {mode_label} | Period: {period}")
    print(f"[TICKERS] {len(ETFS_TO_TRACK)} ETFs para processar")
    print("=" * 60)
    
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    success_count = 0
    error_count = 0

    for idx, item in enumerate(ETFS_TO_TRACK, 1):
        try:
            print(f"\n[{idx}/{len(ETFS_TO_TRACK)}] Processando {item['ticker']}...")
            ticker_obj = yf.Ticker(item["ticker"])
            info = ticker_obj.info or {}
            
            # Histórico conforme o modo
            history = ticker_obj.history(period=period)
            if history.empty:
                print(f"   [Aviso] Nenhum histórico retornado para {item['ticker']}")
                error_count += 1
                continue

            # Último preço e variação do dia
            latest_close = float(history["Close"].iloc[-1])
            prev_close = float(history["Close"].iloc[-2]) if len(history) > 1 else latest_close
            change_percent = ((latest_close - prev_close) / prev_close) * 100.0 if prev_close else 0.0

            aum = (info.get("totalAssets") or 0) / 1000000.0
            expense_ratio = (info.get("feesExpenses") or 0.0020) * 100.0 if info.get("feesExpenses") else 0.20
            div_yield = (info.get("trailingAnnualDividendYield") or 0.0) * 100.0 if info.get("trailingAnnualDividendYield") else 0.0

            etf_payload = {
                "ticker": item["db_ticker"],
                "name": info.get("longName") or info.get("shortName") or item["db_ticker"],
                "market": item["market"],
                "currency": item["currency"],
                "category": item.get("category", "Outros"),
                "close_price": round(latest_close, 4),
                "change_percent": round(change_percent, 4),
                "expense_ratio": float(expense_ratio),
                "dividend_yield": float(div_yield),
                "aum": float(aum) if aum > 0 else None
            }

            # 1. Upsert na tabela etfs (on_conflict=ticker)
            url_etf = f"{SUPABASE_URL}/rest/v1/etfs?on_conflict=ticker"
            resp_etf = requests.post(url_etf, json=etf_payload, headers=headers)
            resp_etf.raise_for_status()

            # 2. Upsert preços históricos EM BATCH (muito mais rápido que individual)
            url_hist = f"{SUPABASE_URL}/rest/v1/etf_historical_prices?on_conflict=etf_ticker,date"
            
            batch = []
            for date, row in history.iterrows():
                close_val = row["Close"]
                if pd.isna(close_val):
                    continue
                    
                price_payload = {
                    "etf_ticker": item["db_ticker"],
                    "date": date.strftime("%Y-%m-%d"),
                    "close_price": round(float(close_val), 4),
                    "open_price": round(float(row["Open"]), 4) if "Open" in row and not pd.isna(row["Open"]) else None,
                    "high_price": round(float(row["High"]), 4) if "High" in row and not pd.isna(row["High"]) else None,
                    "low_price": round(float(row["Low"]), 4) if "Low" in row and not pd.isna(row["Low"]) else None,
                    "volume": int(row["Volume"]) if "Volume" in row and not pd.isna(row["Volume"]) else None
                }
                batch.append(price_payload)
                
                # Send in batches of 500 rows to avoid payload size limits
                if len(batch) >= 500:
                    resp_h = requests.post(url_hist, json=batch, headers=headers)
                    resp_h.raise_for_status()
                    batch = []
            
            # Send remaining batch
            if batch:
                resp_h = requests.post(url_hist, json=batch, headers=headers)
                resp_h.raise_for_status()

            total_days = len(history)
            print(f"   [OK] {item['db_ticker']} atualizado com sucesso! (Preço: {item['currency']} {latest_close:.2f} | Var: {change_percent:+.2f}% | {total_days} registros inseridos)")
            success_count += 1

        except requests.exceptions.HTTPError as http_err:
            resp_body = ""
            if hasattr(http_err, 'response') and http_err.response is not None:
                resp_body = f" | Status {http_err.response.status_code}: {http_err.response.text}"
            print(f"   [ERRO HTTP] Falha ao enviar {item['ticker']} para o Supabase: {http_err}{resp_body}")
            error_count += 1
        except Exception as e:
            print(f"   [ERRO] Falha ao processar {item['ticker']}: {e}")
            error_count += 1

    print("\n" + "=" * 60)
    print(f"[{datetime.now()}] Pipeline ETL concluído!")
    print(f"   ✅ Sucesso: {success_count}/{len(ETFS_TO_TRACK)}")
    print(f"   ❌ Erros: {error_count}/{len(ETFS_TO_TRACK)}")

    if error_count > 0 and success_count == 0:
        print("\n[FALHA] Nenhum ativo foi atualizado no Supabase. Verifique a chave SUPABASE_SERVICE_KEY nas Secrets do GitHub.")
        sys.exit(1)

if __name__ == "__main__":
    full_load = "--full-load" in sys.argv
    run_pipeline(full_load=full_load)
