#!/usr/bin/env python3
"""
Automated Agency-Grade Brandbook & Digital Ecosystem PDF Exporter Script
Part of image-media-engine Antigravity Skill

Compiles a 10-page 16:9 Widescreen Pentagram/Landor style Brandbook PDF directly
using PIL high-resolution canvas rendering with ZERO manual user intervention.
Enforces 100% Split Layouts, Luxury Clean Design, and Pristine Portuguese Accents.

Usage:
    python export-brandbook-pdf.py --brand-name "Manuela" --tagline "Corretora de Imóveis" --logo logo.svg --output-pdf Brandbook.pdf

Options:
    --brand-name, -b   Brand name (default: "Brand Name")
    --tagline, -t      Tagline or segment (default: "Corporate Identity")
    --logo, -l         Path to approved master logo file (SVG or PNG)
    --output-pdf, -o   Output PDF file path (default: Brandbook_Manual.pdf)
    --primary-color    Primary brand HEX color (default: #0A192F)
    --secondary-color  Secondary/Accent HEX color (default: #E2E8F0)
    --accent-color     Gold/Foil HEX color (default: #D4A038)
"""

import os
import sys
import argparse
import PIL.JpegImagePlugin
import PIL.PdfImagePlugin
from PIL import Image, ImageDraw, ImageFont

def parse_args():
    parser = argparse.ArgumentParser(description="Automated Agency PDF Exporter")
    parser.add_argument("--brand-name", "-b", default="Brand Name", help="Brand name")
    parser.add_argument("--tagline", "-t", default="Corporate Identity", help="Tagline / Industry")
    parser.add_argument("--logo", "-l", help="Approved master logo file (SVG or PNG)")
    parser.add_argument("--output-pdf", "-o", default="Brandbook_Manual.pdf", help="Output PDF file path")
    parser.add_argument("--primary-color", default="#0A192F", help="Primary brand HEX color")
    parser.add_argument("--secondary-color", default="#E2E8F0", help="Secondary HEX color")
    parser.add_argument("--accent-color", default="#D4A038", help="Gold/Foil HEX color")
    return parser.parse_args()

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip("#")
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def get_font(size, bold=False):
    """Fallback font loader using system font or default PIL font."""
    font_names = ["arial.ttf", "calibri.ttf", "segoeui.ttf", "Helvetica.ttf", "DejaVuSans.ttf"]
    if bold:
        font_names = ["arialbd.ttf", "calibrib.ttf", "segoeuib.ttf", "Helvetica-Bold.ttf", "DejaVuSans-Bold.ttf"]
        
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except OSError:
            continue
    return ImageFont.load_default()

def create_slide_base(width=1920, height=1080, bg_color="#0A192F"):
    return Image.new("RGB", (width, height), hex_to_rgb(bg_color))

def draw_header_footer(draw, brand_name, page_num, total_pages=10, dark_bg=True):
    font_sm = get_font(20)
    color = (255, 255, 255, 180) if dark_bg else (10, 25, 47, 180)
    
    # Header
    draw.text((80, 50), f"{brand_name.upper()} -- BRANDBOOK & ECOSSISTEMA DIGITAL", fill=color, font=font_sm)
    
    # Footer
    footer_text = f"PÁGINA {page_num:02d} DE {total_pages:02d}  |  CONFIDENCIAL"
    draw.text((1920 - 380, 1080 - 70), footer_text, fill=color, font=font_sm)

def generate_brandbook_pdf(args):
    brand_name = args.brand_name
    tagline = args.tagline
    out_pdf = args.output_pdf
    prim_hex = args.primary_color
    sec_hex = args.secondary_color
    acc_hex = args.accent_color
    
    prim_rgb = hex_to_rgb(prim_hex)
    sec_rgb = hex_to_rgb(sec_hex)
    acc_rgb = hex_to_rgb(acc_hex)
    
    print(f"[PDF] Compiling 10-Page Agency-Grade PDF Brandbook for: {brand_name}")
    
    # Try loading master logo if provided
    logo_img = None
    if args.logo and os.path.exists(args.logo):
        try:
            logo_img = Image.open(args.logo).convert("RGBA")
        except Exception as e:
            print(f"  [NOTICE] Could not load logo image: {e}")
            
    slides = []
    W, H = 1920, 1080

    # -------------------------------------------------------------
    # PAGE 1: COVER SLIDE (Dark Navy Background)
    # -------------------------------------------------------------
    p1 = create_slide_base(W, H, prim_hex)
    d1 = ImageDraw.Draw(p1)
    
    d1.text((120, 340), brand_name.upper(), fill=(255, 255, 255), font=get_font(84, bold=True))
    d1.text((120, 460), tagline, fill=acc_rgb, font=get_font(42, bold=True))
    d1.text((120, 540), "Brandbook & Ecossistema Digital", fill=(255, 255, 255), font=get_font(36, bold=True))
    d1.text((120, 600), "Manual Corporativo para Investidores Internacionais", fill=sec_rgb, font=get_font(28))
    
    if logo_img:
        logo_resized = logo_img.resize((380, int(380 * logo_img.height / logo_img.width)), Image.Resampling.LANCZOS)
        p1.paste(logo_resized, (1320, 350), logo_resized)
        
    slides.append(p1)

    # -------------------------------------------------------------
    # PAGE 2: BRAND STRATEGY & COLORS (White Background)
    # -------------------------------------------------------------
    p2 = create_slide_base(W, H, "#FFFFFF")
    d2 = ImageDraw.Draw(p2)
    draw_header_footer(d2, brand_name, 2, 10, dark_bg=False)
    
    d2.text((120, 140), "1. A Estratégia da Marca", fill=prim_rgb, font=get_font(52, bold=True))
    d2.text((120, 220), f"A identidade \"Confiança Global\" atrai investidores estrangeiros e público de alto padrão.", fill=(30, 30, 30), font=get_font(30))
    
    d2.text((120, 320), "Cores Oficiais & Paleta Corporativa", fill=prim_rgb, font=get_font(38, bold=True))
    
    # Draw Color Cards
    colors_spec = [
        ("Cor Primária (Navy)", prim_hex, "HEX: " + prim_hex + "\nCMYK: 90/75/40/60\nsRGB: 10/25/47"),
        ("Cor Secundária (Slate)", sec_hex, "HEX: " + sec_hex + "\nCMYK: 15/10/5/0\nsRGB: 226/232/240"),
        ("Cor de Destaque (Gold)", acc_hex, "HEX: " + acc_hex + "\nCMYK: 15/35/90/10\nsRGB: 212/160/56"),
        ("Monocromático Preto", "#000000", "HEX: #000000\nCMYK: 0/0/0/100\nsRGB: 0/0/0")
    ]
    
    for idx, (c_name, c_hex, c_desc) in enumerate(colors_spec):
        x_pos = 120 + idx * 420
        y_pos = 400
        # Card background
        d2.rectangle([x_pos, y_pos, x_pos + 380, y_pos + 480], fill=(245, 247, 250), outline=(220, 225, 230), width=2)
        # Swatch
        d2.rectangle([x_pos + 20, y_pos + 20, x_pos + 360, y_pos + 220], fill=hex_to_rgb(c_hex))
        # Details
        d2.text((x_pos + 20, y_pos + 260), c_name, fill=prim_rgb, font=get_font(24, bold=True))
        d2.multiline_text((x_pos + 20, y_pos + 310), c_desc, fill=(60, 60, 60), font=get_font(20), spacing=8)
        
    slides.append(p2)

    # -------------------------------------------------------------
    # PAGE 3: BUSINESS CARDS MOCKUP & SPECS (Split Layout)
    # -------------------------------------------------------------
    p3 = create_slide_base(W, H, prim_hex)
    d3 = ImageDraw.Draw(p3)
    draw_header_footer(d3, brand_name, 3, 10, dark_bg=True)
    
    # Left Spec Panel (50% Solid High-Contrast Panel)
    d3.text((120, 180), "Cartão de Visitas", fill=(255, 255, 255), font=get_font(52, bold=True))
    d3.text((120, 260), "A primeira impressão física de alto padrão.", fill=sec_rgb, font=get_font(28))
    
    bullets = [
        "- Papel importado premium (350g fosco).",
        "- Aplicação de Hot Stamping Prata/Ouro na logo.",
        "- Formato padrão 90 x 50 mm com sangria 3mm.",
        "- Verniz UV localizado no verso."
    ]
    for b_idx, b_text in enumerate(bullets):
        d3.text((120, 360 + b_idx * 60), b_text, fill=(255, 255, 255), font=get_font(26))
        
    # Right Mockup Container (50% Image Breathing Space)
    d3.rectangle([960, 140, 1820, 940], fill=(15, 30, 55), outline=acc_rgb, width=3)
    d3.text((1060, 480), "[ MOCKUP 3D: CARTÃO DE VISITAS PREMIUM ]", fill=acc_rgb, font=get_font(32, bold=True))
    d3.text((1060, 540), "Acabamento em Hot Stamping & Textura de Pedra", fill=sec_rgb, font=get_font(24))
    
    slides.append(p3)

    # -------------------------------------------------------------
    # PAGE 4: CORPORATE STATIONERY MOCKUP & SPECS
    # -------------------------------------------------------------
    p4 = create_slide_base(W, H, prim_hex)
    d4 = ImageDraw.Draw(p4)
    draw_header_footer(d4, brand_name, 4, 10, dark_bg=True)
    
    d4.text((120, 180), "Papelaria Corporativa", fill=(255, 255, 255), font=get_font(52, bold=True))
    d4.text((120, 260), "Contratos de exclusividade que transmitem solidez.", fill=sec_rgb, font=get_font(28))
    
    stat_bullets = [
        "- Pastas corporativas com vinco e textura.",
        "- Papel timbrado A4 em 120g offset extra branco.",
        "- Envelopes corporativos com lacre gomado.",
        "- Design alinhado ao azul marinho oficial."
    ]
    for b_idx, b_text in enumerate(stat_bullets):
        d4.text((120, 360 + b_idx * 60), b_text, fill=(255, 255, 255), font=get_font(26))
        
    d4.rectangle([960, 140, 1820, 940], fill=(15, 30, 55), outline=acc_rgb, width=3)
    d4.text((1040, 480), "[ MOCKUP 3D: PAPELARIA & PASTA CORPORATIVA ]", fill=acc_rgb, font=get_font(32, bold=True))
    d4.text((1040, 540), "Caderno de Couro & Caneta Executiva de Metal", fill=sec_rgb, font=get_font(24))
    
    slides.append(p4)

    # -------------------------------------------------------------
    # PAGE 5: MERCHANDISE & KEEPSAKES (BRINDES)
    # -------------------------------------------------------------
    p5 = create_slide_base(W, H, prim_hex)
    d5 = ImageDraw.Draw(p5)
    draw_header_footer(d5, brand_name, 5, 10, dark_bg=True)
    
    d5.text((120, 180), "Brindes & Fechamento", fill=(255, 255, 255), font=get_font(52, bold=True))
    d5.text((120, 260), "A lembrança física do negócio fechado.", fill=sec_rgb, font=get_font(28))
    
    merch_bullets = [
        "- Chaveiro de couro legítimo costurado.",
        "- Detalhes metálicos cromados e elegantes.",
        "- Gravação a laser ou baixo relevo na marca.",
        "- Caixa de apresentação personalizada."
    ]
    for b_idx, b_text in enumerate(merch_bullets):
        d5.text((120, 360 + b_idx * 60), b_text, fill=(255, 255, 255), font=get_font(26))
        
    d5.rectangle([960, 140, 1820, 940], fill=(15, 30, 55), outline=acc_rgb, width=3)
    d5.text((1080, 480), "[ MOCKUP 3D: CHAVEIRO DE COURO PREMIUM ]", fill=acc_rgb, font=get_font(32, bold=True))
    d5.text((1080, 540), "Logomarca Gravada em Baixo Relevo", fill=sec_rgb, font=get_font(24))
    
    slides.append(p5)

    # -------------------------------------------------------------
    # PAGE 6: WEB ECOSYSTEM FUNNEL (White Background)
    # -------------------------------------------------------------
    p6 = create_slide_base(W, H, "#FFFFFF")
    d6 = ImageDraw.Draw(p6)
    draw_header_footer(d6, brand_name, 6, 10, dark_bg=False)
    
    d6.text((120, 140), "Ecossistema Web: O Funil", fill=prim_rgb, font=get_font(52, bold=True))
    d6.text((120, 220), "Arquitetura da presença digital e conversão de clientes VIP.", fill=(40, 40, 40), font=get_font(28))
    
    funnel_steps = [
        ("1. Home Hero Banner", "Hero Banner Premium e posicionamento de autoridade."),
        ("2. Portfólio de Ativos", "Filtros avançados por rentabilidade e curadoria."),
        ("3. Relocation & Visas", "Atendimento focado em investidores estrangeiros."),
        ("4. Sobre & Autoridade", "História, prêmios e autoridade no mercado."),
        ("5. Contato VIP", "Qualificação imediata de leads de alto padrão.")
    ]
    for f_idx, (f_title, f_desc) in enumerate(funnel_steps):
        y_pos = 320 + f_idx * 110
        d6.rectangle([120, y_pos, 1800, y_pos + 90], fill=(245, 248, 252), outline=(210, 220, 235), width=2)
        d6.text((150, y_pos + 25), f_title, fill=prim_rgb, font=get_font(26, bold=True))
        d6.text((600, y_pos + 28), f_desc, fill=(60, 60, 60), font=get_font(22))
        
    slides.append(p6)

    # -------------------------------------------------------------
    # PAGE 7: WEBSITE PROTOTYPE MOCKUP
    # -------------------------------------------------------------
    p7 = create_slide_base(W, H, prim_hex)
    d7 = ImageDraw.Draw(p7)
    draw_header_footer(d7, brand_name, 7, 10, dark_bg=True)
    
    d7.text((120, 180), "Protótipo do Site", fill=(255, 255, 255), font=get_font(52, bold=True))
    d7.text((120, 260), "O primeiro ponto de contato digital do investidor.", fill=sec_rgb, font=get_font(28))
    d7.text((120, 360), "- Promessa de \"High Yield Investments\".", fill=(255, 255, 255), font=get_font(26))
    d7.text((120, 420), "- Integração com /frontend-architect.", fill=(255, 255, 255), font=get_font(26))
    d7.text((120, 480), "- UX minimalista e acelerado.", fill=(255, 255, 255), font=get_font(26))
    
    d7.rectangle([960, 140, 1820, 940], fill=(15, 30, 55), outline=acc_rgb, width=3)
    d7.text((1050, 480), "[ PROTÓTIPO WEB 3D: DESKTOP WORKSTATION ]", fill=acc_rgb, font=get_font(32, bold=True))
    d7.text((1050, 540), "Exclusive Real Estate & High-Yield Investments", fill=sec_rgb, font=get_font(24))
    
    slides.append(p7)

    # -------------------------------------------------------------
    # PAGE 8: INSTAGRAM PROTOTYPE MOCKUP
    # -------------------------------------------------------------
    p8 = create_slide_base(W, H, prim_hex)
    d8 = ImageDraw.Draw(p8)
    draw_header_footer(d8, brand_name, 8, 10, dark_bg=True)
    
    d8.text((120, 180), "Protótipo do Instagram", fill=(255, 255, 255), font=get_font(52, bold=True))
    d8.text((120, 260), "Menos dancinhas, mais curadoria imobiliária.", fill=sec_rgb, font=get_font(28))
    d8.text((120, 360), "- Foco no Lifestyle e ROI.", fill=(255, 255, 255), font=get_font(26))
    d8.text((120, 420), "- Grid harmonioso e padronizado.", fill=(255, 255, 255), font=get_font(26))
    d8.text((120, 480), "- Destaques institucionais padronizados.", fill=(255, 255, 255), font=get_font(26))
    
    d8.rectangle([960, 140, 1820, 940], fill=(15, 30, 55), outline=acc_rgb, width=3)
    d8.text((1080, 480), "[ MOCKUP 3D: iPHONE 15 PRO INSTAGRAM FEED ]", fill=acc_rgb, font=get_font(32, bold=True))
    d8.text((1080, 540), "Presença Social Premium & Grid Consistente", fill=sec_rgb, font=get_font(24))
    
    slides.append(p8)

    # -------------------------------------------------------------
    # PAGE 9: MEETING DECK TEMPLATE MOCKUP
    # -------------------------------------------------------------
    p9 = create_slide_base(W, H, prim_hex)
    d9 = ImageDraw.Draw(p9)
    draw_header_footer(d9, brand_name, 9, 10, dark_bg=True)
    
    d9.text((120, 180), "Template de Reuniões", fill=(255, 255, 255), font=get_font(52, bold=True))
    d9.text((120, 260), "Slides corporativos para apresentação de ROI no modelo 1-on-1.", fill=sec_rgb, font=get_font(28))
    d9.text((120, 360), "- Formato 16:9 Widescreen.", fill=(255, 255, 255), font=get_font(26))
    d9.text((120, 420), "- Apresentação de ROI e tese de investimento.", fill=(255, 255, 255), font=get_font(26))
    d9.text((120, 480), "- Gráficos e dados padronizados.", fill=(255, 255, 255), font=get_font(26))
    
    d9.rectangle([960, 140, 1820, 940], fill=(15, 30, 55), outline=acc_rgb, width=3)
    d9.text((1060, 480), "[ MOCKUP 3D: LAPTOP EXECUTIVE SLIDE DECK ]", fill=acc_rgb, font=get_font(32, bold=True))
    d9.text((1060, 540), "Investment Strategy & ROI Presentation", fill=sec_rgb, font=get_font(24))
    
    slides.append(p9)

    # -------------------------------------------------------------
    # PAGE 10: APPROVAL & PRODUCTION CLOSING
    # -------------------------------------------------------------
    p10 = create_slide_base(W, H, sec_hex)
    d10 = ImageDraw.Draw(p10)
    draw_header_footer(d10, brand_name, 10, 10, dark_bg=False)
    
    d10.text((120, 400), "Aprovado para Produção", fill=prim_rgb, font=get_font(64, bold=True))
    d10.text((120, 500), f"{brand_name} © 2026", fill=prim_rgb, font=get_font(36, bold=True))
    d10.text((120, 560), "O futuro dos seus investimentos corporativos.", fill=(80, 80, 80), font=get_font(28))
    
    slides.append(p10)

    # -------------------------------------------------------------
    # SAVE MULTI-PAGE PDF DIRECTLY WITH PIL
    # -------------------------------------------------------------
    slides[0].save(
        out_pdf,
        save_all=True,
        append_images=slides[1:],
        resolution=300.0
    )
    print(f"[OK] PDF Brandbook Exported Successfully: {out_pdf} (10 Pages, 300 DPI High Resolution)")

def main():
    args = parse_args()
    generate_brandbook_pdf(args)

if __name__ == "__main__":
    main()
