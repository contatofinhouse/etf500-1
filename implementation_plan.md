# Plano de Go-Live Oficial: ETF500.com.br
## Arquitetura: Registro.br ➔ Cloudflare ➔ Vercel (Frontend SPA) ➔ Supabase + GitHub Actions (Robô ETL)

---

## 🎯 FASE 1: Auditoria de Maturidade, Segurança, SEO e Velocidade

Antes de conectar o domínio oficial `etf500.com.br`, aplicaremos ajustes essenciais de prontidão para produção:

### 1.1 Segurança (Security & Protection)
- [x] **Variáveis de Ambiente**: Garantir que nenhuma chave privada do Supabase (`SUPABASE_SERVICE_KEY`) esteja exposta no frontend. O frontend deve utilizar exclusivamente a `SUPABASE_ANON_KEY`.
- [x] **Row Level Security (RLS)**: Confirmar que a política de leitura pública das tabelas `etfs`, `etf_historical_prices` e `etf_news` permite apenas `SELECT`, enquanto a tabela `leads_b2b` permite apenas `INSERT`.
- [x] **Headers de Segurança HTTP (Vercel)**: Criar arquivo `vercel.json` configurando Security Headers:
  - `X-Frame-Options: DENY` (evita clickjacking)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 1.2 Velocidade & Desempenho (Performance)
- [x] **Vercel Rewrite / SPA Fallback**: Configurar `vercel.json` com `rewrites` para garantir que rotas diretas (ex: `etf500.com.br/?view=etf&ticker=IVVB11`) e futuros permalinks funcionem com cache HTTP agressivo para assets estáticos (`Cache-Control: public, max-age=31536000, immutable`).
- [x] **Otimização de Fontes**: Utilizar `font-display: swap` nos links do Google Fonts (`Inter` e `JetBrains Mono`) já adicionados no `index.html`.
- [x] **Code Splitting / Chunking**: Otimizar a criação de bundles para que a carga inicial seja inferior a 150kB.

### 1.3 SEO Técnico & Indutores de Indexação
- [x] **Criar `public/sitemap.xml`**: Sitemap XML completo mapeando a Home, Screener, Comparador, Raio-X, Notícias, Perfis de Gestoras e URLs de ETFs.
- [x] **Criar `public/robots.txt`**: Permitindo o Googlebot, Bingbot e apontando para o `sitemap.xml`.
- [x] **Gerar `public/og-image.png`**: Imagem de compartilhamento social (1200x630px) com a identidade institucional dark do ETF500.
- [x] **WebSite & FAQ Schema (JSON-LD)**: Validar schemas já injetados nas páginas.

---

## 🚀 FASE 2: Plano de Implantação e Configuração de DNS (Go-Live)

### 2.1 Passo a Passo no Registro.br
1. Acesse o painel do **Registro.br** no domínio `etf500.com.br`.
2. Em **DNS / Servidores de Nome**, selecione **Alterar Servidores DNS**.
3. Insira os dois Nameservers da Cloudflare (ex: `ns1.cloudflare.com` e `ns2.cloudflare.com` — fornecidos na etapa 2.2).

### 2.2 Passo a Passo na Cloudflare (Proxy + SSL/TLS + WAF)
1. Crie uma conta na Cloudflare e adicione o site `etf500.com.br`.
2. **Configuração de SSL/TLS**: Altere para o modo **Full (Strict)** para criptografia de ponta a ponta.
3. **DNS Records (Apontamento para a Vercel)**:
   - **Tipo A**: `@` (Apex) ➔ `76.76.21.21` (Proxy Status: 🟠 Proxied - Laranja)
   - **Tipo CNAME**: `www` ➔ `cname.vercel-dns.com` (Proxy Status: 🟠 Proxied)
4. **Regras de Page Rules / Cache**:
   - Ativar *Always Use HTTPS*.
   - Ativar *Auto Minify* (HTML, CSS, JS) e *Brotli*.

### 2.3 Passo a Passo na Vercel
1. No projeto na Vercel, acesse **Settings > Domains**.
2. Adicione `etf500.com.br` e `www.etf500.com.br`.
3. Marque a opção de **Redirect `www.etf500.com.br` para `etf500.com.br`** (ou vice-versa) para evitar conteúdo duplicado no Google.

### 2.4 Passo a Passo no GitHub Actions + Supabase (Robô ETL Automático)
1. No repositório do GitHub em **Settings > Secrets and variables > Actions**:
   - `SUPABASE_URL`: `https://dfphhwgczizvxsszngrc.supabase.co`
   - `SUPABASE_SERVICE_KEY`: *(Chave Service Role do Supabase para escrita)*
2. O workflow `.github/workflows/etl_daily.yml` executará automaticamente de segunda a sexta-feira às 22h BRT para atualizar cotações e notícias no banco.

---

## 🧪 Plano de Verificação Pós-Implantação

1. **Testes de DNS e SSL**:
   - `ping etf500.com.br` / `curl -I https://etf500.com.br`
2. **Auditoria de Performance**:
   - Rodar Google PageSpeed Insights (meta: 90+ Mobile e Desktop).
3. **Google Search Console**:
   - Enviar a propriedade `https://etf500.com.br` e submeter o `sitemap.xml`.
