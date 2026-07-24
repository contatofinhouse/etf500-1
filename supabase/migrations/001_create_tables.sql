-- ============================================
-- ETF500 - Database Schema for Supabase
-- ============================================
-- Run this script in the Supabase SQL Editor
-- It creates all tables, indexes, RLS policies,
-- and trigger functions needed for the platform.
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TABELA DE METADADOS DOS ETFs
-- ============================================
CREATE TABLE IF NOT EXISTS etfs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticker VARCHAR(12) UNIQUE NOT NULL,         -- Ex: IVVB11, BOVA11
    name VARCHAR(255) NOT NULL,                 -- Nome completo do fundo
    market VARCHAR(10) NOT NULL DEFAULT 'BR',   -- 'BR' (apenas BR no MVP)
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL', -- 'BRL' (apenas BRL no MVP)
    category VARCHAR(100),                      -- 'Ações', 'Renda Fixa', 'Ações Internacionais', 'Criptoativos', 'Commodities', etc.
    expense_ratio NUMERIC(5,4),                 -- Taxa de administração (ex: 0.0020 = 0.20%)
    dividend_yield NUMERIC(5,2) DEFAULT 0.00,   -- Dividend Yield anual %
    aum NUMERIC(18,2),                          -- Patrimônio Líquido (Assets Under Management) em BRL
    volume_avg BIGINT,                          -- Volume médio diário de negociação
    close_price NUMERIC(12,4),                  -- Último preço de fechamento
    change_percent NUMERIC(8,4),                -- Variação percentual do dia
    description TEXT,                           -- Descrição do ETF
    benchmark VARCHAR(255),                     -- Índice de referência (ex: Ibovespa, S&P 500)
    manager VARCHAR(255),                       -- Gestora (ex: BlackRock, Itaú Asset)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários descritivos
COMMENT ON TABLE etfs IS 'Metadados de todos os ETFs listados na B3';
COMMENT ON COLUMN etfs.ticker IS 'Código de negociação na B3 (ex: BOVA11)';
COMMENT ON COLUMN etfs.expense_ratio IS 'Taxa de administração em decimal (0.0020 = 0.20%)';
COMMENT ON COLUMN etfs.aum IS 'Patrimônio líquido em Reais';

-- ============================================
-- 2. TABELA DE HISTÓRICO DE PREÇOS DIÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS etf_historical_prices (
    id BIGSERIAL PRIMARY KEY,
    etf_ticker VARCHAR(12) NOT NULL REFERENCES etfs(ticker) ON DELETE CASCADE,
    date DATE NOT NULL,
    open_price NUMERIC(12,4),                   -- Preço de abertura
    high_price NUMERIC(12,4),                   -- Preço máximo do dia
    low_price NUMERIC(12,4),                    -- Preço mínimo do dia
    close_price NUMERIC(12,4) NOT NULL,         -- Preço de fechamento
    volume BIGINT,                              -- Volume de negociação
    UNIQUE(etf_ticker, date)
);

COMMENT ON TABLE etf_historical_prices IS 'Histórico de preços diários dos ETFs (OHLCV)';

-- ============================================
-- 3. TABELA DE CAPTURA DE LEADS B2B
-- ============================================
CREATE TABLE IF NOT EXISTS leads_b2b (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    estimated_portfolio VARCHAR(100) NOT NULL,   -- 'Até R$ 50 mil', 'R$ 50-200 mil', 'R$ 200-500 mil', 'Acima de R$ 500 mil'
    message TEXT,                                -- Mensagem opcional do lead
    source VARCHAR(100) DEFAULT 'raio-x',        -- Página de origem do lead
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE leads_b2b IS 'Leads capturados para escritórios de investimentos (B2B)';

-- ============================================
-- 4. ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índice para busca por ticker (mais usado)
CREATE INDEX IF NOT EXISTS idx_etfs_ticker ON etfs(ticker);

-- Índice para filtros do screener por mercado
CREATE INDEX IF NOT EXISTS idx_etfs_market ON etfs(market);

-- Índice para filtros por categoria
CREATE INDEX IF NOT EXISTS idx_etfs_category ON etfs(category);

-- Índice para ordenação por AUM (ranking)
CREATE INDEX IF NOT EXISTS idx_etfs_aum ON etfs(aum DESC NULLS LAST);

-- Índice para ordenação por variação do dia (top movers)
CREATE INDEX IF NOT EXISTS idx_etfs_change ON etfs(change_percent DESC NULLS LAST);

-- Índice composto para consulta de preços históricos (mais usado)
CREATE INDEX IF NOT EXISTS idx_etf_prices_ticker_date ON etf_historical_prices(etf_ticker, date DESC);

-- Índice para leads por data de criação
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads_b2b(created_at DESC);

-- ============================================
-- 5. TRIGGER PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_etfs_updated_at
    BEFORE UPDATE ON etfs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE etfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE etf_historical_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_b2b ENABLE ROW LEVEL SECURITY;

-- ETFs: leitura pública (SELECT para anon)
CREATE POLICY "etfs_public_read" ON etfs
    FOR SELECT
    TO anon
    USING (true);

-- Preços históricos: leitura pública
CREATE POLICY "prices_public_read" ON etf_historical_prices
    FOR SELECT
    TO anon
    USING (true);

-- Leads B2B: apenas INSERT público (ninguém lê dados alheios)
CREATE POLICY "leads_public_insert" ON leads_b2b
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- ETFs: escrita para service_role (pipeline de dados)
CREATE POLICY "etfs_service_write" ON etfs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Preços: escrita para service_role
CREATE POLICY "prices_service_write" ON etf_historical_prices
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Leads: leitura para service_role (dashboard admin)
CREATE POLICY "leads_service_read" ON leads_b2b
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 7. VIEW PARA TOP MOVERS (conveniência)
-- ============================================
CREATE OR REPLACE VIEW v_top_gainers AS
SELECT ticker, name, category, close_price, change_percent, aum, expense_ratio, dividend_yield
FROM etfs
WHERE change_percent IS NOT NULL
ORDER BY change_percent DESC
LIMIT 10;

CREATE OR REPLACE VIEW v_top_aum AS
SELECT ticker, name, category, close_price, change_percent, aum, expense_ratio, dividend_yield
FROM etfs
WHERE aum IS NOT NULL
ORDER BY aum DESC
LIMIT 10;

CREATE OR REPLACE VIEW v_top_losers AS
SELECT ticker, name, category, close_price, change_percent, aum, expense_ratio, dividend_yield
FROM etfs
WHERE change_percent IS NOT NULL
ORDER BY change_percent ASC
LIMIT 10;
