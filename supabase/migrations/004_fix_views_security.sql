-- =============================================================================
-- ETF500 - Ajuste de Segurança para Views (v_top_gainers, v_top_aum, v_top_losers)
-- Executar este script no SQL Editor do Supabase para remover os alertas "Unrestricted View"
-- =============================================================================

-- Recria a view v_top_gainers com security_invoker (respeita RLS da tabela 'etfs')
CREATE OR REPLACE VIEW v_top_gainers WITH (security_invoker = true) AS
SELECT ticker, name, category, close_price, change_percent, aum, expense_ratio, dividend_yield
FROM etfs
WHERE change_percent IS NOT NULL
ORDER BY change_percent DESC
LIMIT 10;

-- Recria a view v_top_aum com security_invoker (respeita RLS da tabela 'etfs')
CREATE OR REPLACE VIEW v_top_aum WITH (security_invoker = true) AS
SELECT ticker, name, category, close_price, change_percent, aum, expense_ratio, dividend_yield
FROM etfs
WHERE aum IS NOT NULL
ORDER BY aum DESC
LIMIT 10;

-- Recria a view v_top_losers com security_invoker (respeita RLS da tabela 'etfs')
CREATE OR REPLACE VIEW v_top_losers WITH (security_invoker = true) AS
SELECT ticker, name, category, close_price, change_percent, aum, expense_ratio, dividend_yield
FROM etfs
WHERE change_percent IS NOT NULL
ORDER BY change_percent ASC
LIMIT 10;

-- Concede permissões explícitas para as roles
GRANT SELECT ON v_top_gainers TO anon, authenticated, service_role;
GRANT SELECT ON v_top_aum TO anon, authenticated, service_role;
GRANT SELECT ON v_top_losers TO anon, authenticated, service_role;
