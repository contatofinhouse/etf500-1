import os
import re
from PIL import Image, ImageDraw, ImageFont

# -------------------------------------------------------------
# 1. GENERATE public/og-image.png (1200x630 Institutional Dark)
# -------------------------------------------------------------
def create_og_image(output_path):
    width, height = 1200, 630
    
    # Base dark image (#090D16)
    img = Image.new('RGBA', (width, height), (9, 13, 22, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw background gradient circles / glow effects
    # Top-right blue glow
    for r in range(400, 0, -2):
        alpha = int(25 * (1 - r / 400))
        draw.ellipse([900 - r, -100 - r, 900 + r, -100 + r], fill=(37, 99, 235, alpha))
        
    # Bottom-left cyan glow
    for r in range(350, 0, -2):
        alpha = int(20 * (1 - r / 350))
        draw.ellipse([100 - r, 550 - r, 100 + r, 550 + r], fill=(6, 182, 212, alpha))
        
    # Grid lines (subtle dark pattern)
    grid_color = (255, 255, 255, 6)
    for x in range(0, width, 60):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, 60):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # Top border accent bar
    draw.rectangle([(0, 0), (width, 6)], fill=(37, 99, 235, 255))

    # Try loading default fonts or PIL default font
    try:
        font_title_large = ImageFont.truetype("arial.ttf", 72)
        font_title_sub = ImageFont.truetype("arial.ttf", 32)
        font_tagline = ImageFont.truetype("arial.ttf", 24)
        font_badge = ImageFont.truetype("arial.ttf", 18)
        font_footer = ImageFont.truetype("arial.ttf", 20)
    except Exception:
        font_title_large = ImageFont.load_default()
        font_title_sub = ImageFont.load_default()
        font_tagline = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        font_footer = ImageFont.load_default()

    # Brand Title: etf (Blue #3B82F6) 500 (White #FFFFFF)
    margin_left = 100
    top_pos = 130
    
    draw.text((margin_left, top_pos), "etf", fill=(59, 130, 246, 255), font=font_title_large)
    # Calculate offset for "500"
    bbox_etf = font_title_large.getbbox("etf") if hasattr(font_title_large, "getbbox") else (0,0,100,70)
    etf_width = bbox_etf[2] - bbox_etf[0]
    draw.text((margin_left + etf_width, top_pos), "500", fill=(255, 255, 255, 255), font=font_title_large)
    draw.text((margin_left + etf_width + 140, top_pos + 35), ".com.br", fill=(148, 163, 184, 255), font=font_title_sub)

    # Headline
    headline_top = top_pos + 100
    draw.text((margin_left, headline_top), "O Maior Portal & Rastreador de ETFs do Brasil e EUA", fill=(241, 245, 249, 255), font=font_title_sub)
    
    # Sub-headline description
    sub_top = headline_top + 55
    draw.text((margin_left, sub_top), "Acompanhe cotações em tempo real, rentabilidade histórica, taxas e simulador de carteira.", fill=(148, 163, 184, 255), font=font_tagline)

    # Key Feature Pills / Badges
    badges = [
        "⚡ Ativos B3 & Bolsas EUA (NYSE/Nasdaq)",
        "📊 Screener & Comparador de Rentabilidade",
        "🔍 Raio-X de Portfólio Global",
        "🛡️ 100% Gratuito & Fricção Zero"
    ]
    
    badge_y = sub_top + 75
    badge_x = margin_left
    
    for badge in badges:
        bbox = font_badge.getbbox(badge) if hasattr(font_badge, "getbbox") else (0,0,150,20)
        bw = bbox[2] - bbox[0] + 30
        bh = 38
        
        # Draw pill container
        draw.rounded_rectangle([(badge_x, badge_y), (badge_x + bw, badge_y + bh)], radius=8, fill=(30, 41, 59, 220), outline=(51, 65, 85, 255), width=1)
        draw.text((badge_x + 15, badge_y + 9), badge, fill=(226, 232, 240, 255), font=font_badge)
        
        badge_x += bw + 16
        if badge_x > width - 250:
            badge_x = margin_left
            badge_y += bh + 14

    # Footer section with glowing accent line
    draw.line([(margin_left, height - 90), (width - margin_left, height - 90)], fill=(51, 65, 85, 255), width=1)
    draw.text((margin_left, height - 65), "etf500.com.br — Dados de cotações, patrimônio e análise independente de ETFs", fill=(100, 116, 139, 255), font=font_footer)

    # Save as RGB PNG
    final_img = img.convert('RGB')
    final_img.save(output_path, 'PNG', optimize=True)
    print(f"✅ Generated og-image.png at {output_path}")

# -------------------------------------------------------------
# 2. GENERATE public/sitemap.xml WITH ALL ETFS AND VIEWS
# -------------------------------------------------------------
def create_sitemap(workspace_dir, output_path):
    etf_file = os.path.join(workspace_dir, "src", "data", "etfData.ts")

    tickers = set()
    if os.path.exists(etf_file):
        with open(etf_file, 'r', encoding='utf-8') as f:
            content = f.read()
            found = re.findall(r"ticker:\s*['\"]([A-Z0-9]+)['\"]", content)
            tickers.update(found)

    # Fallback/standard tickers if regex misses any
    default_tickers = [
        "IVVB11", "BOVA11", "SMAL11", "HASH11", "WRLD11", "VOO", "QQQ", "SCHD", "VNQ", "XINA11",
        "B5P211", "IMAB11", "LFTS11", "DEB11", "DIVO11", "GOLD11", "QBTC11", "IB5M11", "NTNS11",
        "IRFM11", "DEBB11", "JURO11", "FIXA11", "BND", "AGG", "TLT", "SHY", "IEF", "LQD", "TIP"
    ]
    tickers.update(default_tickers)
    sorted_tickers = sorted(list(tickers))

    managers = ["blackrock", "itau", "investo", "vanguard", "hashdex", "xp", "invesco", "schwab", "qr-capital", "sparta", "mirae"]
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <!-- Home Page -->',
        '  <url>',
        '    <loc>https://etf500.com.br/</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '',
        '  <!-- Main Platform Views -->',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=screener</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=comparar</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=raio-x</loc>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=noticias</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
        '',
        '  <!-- Gestoras -->'
    ]

    for m in managers:
        xml_lines.extend([
            '  <url>',
            f'    <loc>https://etf500.com.br/?view=gestora&amp;manager={m}</loc>',
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>'
        ])

    xml_lines.append('')
    xml_lines.append('  <!-- ETFs B3 & EUA -->')

    for t in sorted_tickers:
        xml_lines.extend([
            '  <url>',
            f'    <loc>https://etf500.com.br/?view=etf&amp;ticker={t}</loc>',
            '    <changefreq>daily</changefreq>',
            '    <priority>0.9</priority>',
            '  </url>'
        ])

    xml_lines.extend([
        '',
        '  <!-- Institutional Pages -->',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=quem-somos</loc>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.5</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=contato</loc>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.5</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=suporte</loc>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.5</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=privacidade</loc>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.3</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://etf500.com.br/?view=termos</loc>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.3</priority>',
        '  </url>',
        '</urlset>'
    ])

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(xml_lines))
    print(f"✅ Generated sitemap.xml with {len(sorted_tickers)} ETFs at {output_path}")

if __name__ == '__main__':
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    root_dir = r"c:\Users\rafae\Documents\FINHOUSE\SITES\etf500"
    og_out = os.path.join(root_dir, "public", "og-image.png")
    sitemap_out = os.path.join(root_dir, "public", "sitemap.xml")
    
    create_og_image(og_out)
    create_sitemap(root_dir, sitemap_out)

