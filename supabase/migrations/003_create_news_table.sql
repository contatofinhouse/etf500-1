-- ============================================
-- 8. TABELA DE NOTÍCIAS DE ETFs
-- ============================================
CREATE TABLE IF NOT EXISTS etf_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,                    -- Título da notícia
    summary TEXT,                                   -- Resumo de 2-3 frases
    source_name VARCHAR(100) NOT NULL,              -- Nome da fonte (InfoMoney, Estadão, etc.)
    source_url TEXT NOT NULL UNIQUE,                 -- Link original para a matéria completa
    thumbnail_url TEXT,                             -- URL da imagem de capa (opcional)
    category VARCHAR(50) DEFAULT 'Mercado',         -- Categoria (Mercado, Renda Fixa, Cripto, Internacional, Regulação)
    related_tickers TEXT[],                         -- Array de tickers relacionados
    published_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Data/hora de publicação original
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE etf_news IS 'Notícias de ETFs curadas por scraping de fontes oficiais brasileiras';
COMMENT ON COLUMN etf_news.source_url IS 'URL de deduplicação — cada matéria aparece uma única vez';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_news_published ON etf_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON etf_news(category);

-- RLS: leitura pública
ALTER TABLE etf_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_public_read" ON etf_news
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "news_service_write" ON etf_news
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
