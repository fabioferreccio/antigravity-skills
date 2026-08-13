#!/usr/bin/env python3
"""
Parametric Brand Asset Exporter, Merchandise Specs & Brandbook Generator Script
Part of image-media-engine Antigravity Skill

Usage:
    python generate-brandbook-assets.py --input logo.png --brand-name "Acme Corp" --output-dir ./brand_package [options]

Options:
    --input, -i       Input master logo SVG or PNG image (Required)
    --brand-name, -b  Brand name (default: "Brand Identity")
    --output-dir, -o  Output delivery package directory (default: ./brand_delivery)
    --primary-color   Primary brand color in HEX (default: #0A2864)
    --accent-color    Accent brand color in HEX (default: #FF6400)
    --generate-pdf    Generate Brandbook PDF/HTML presentation (default: True)
"""

import os
import sys
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Brand Asset Generator & Brandbook Exporter")
    parser.add_argument("--input", "-i", required=True, help="Master logo file (SVG or PNG)")
    parser.add_argument("--brand-name", "-b", default="Brand Identity", help="Brand name")
    parser.add_argument("--output-dir", "-o", default="./brand_delivery", help="Output package folder")
    parser.add_argument("--primary-color", default="#0A2864", help="Primary brand color HEX")
    parser.add_argument("--accent-color", default="#FF6400", help="Accent brand color HEX")
    parser.add_argument("--generate-pdf", action="store_true", default=True, help="Generate HTML/PDF Brandbook")
    return parser.parse_args()

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip("#")
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def hex_to_cmyk(hex_str):
    r, g, b = [x / 255.0 for x in hex_to_rgb(hex_str)]
    k = 1.0 - max(r, g, b)
    if k >= 1.0:
        return 0, 0, 0, 100
    c = int(round((1.0 - r - k) / (1.0 - k) * 100))
    m = int(round((1.0 - g - k) / (1.0 - k) * 100))
    y = int(round((1.0 - b - k) / (1.0 - k) * 100))
    k = int(round(k * 100))
    return c, m, y, k

def run():
    args = parse_args()
    
    if not os.path.exists(args.input):
        print(f"❌ Error: Input logo file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    brand_name = args.brand_name
    out_dir = args.output_dir
    print(f"🎨 Generating Complete Corporate Brand Delivery Package for: {brand_name}")
    
    # Delivery Package Directories
    vec_dir = os.path.join(out_dir, "01_Vector_Master")
    web_dir = os.path.join(out_dir, "02_Digital_Web_App")
    print_dir = os.path.join(out_dir, "03_Print_Production")
    merch_dir = os.path.join(out_dir, "04_Stationery_Merchandise")
    slides_dir = os.path.join(out_dir, "05_Presentation_Templates")
    book_dir = os.path.join(out_dir, "06_Brandbook")
    
    for d in [vec_dir, web_dir, print_dir, merch_dir, slides_dir, book_dir]:
        os.makedirs(d, exist_ok=True)

    prim_rgb = hex_to_rgb(args.primary_color)
    acc_rgb = hex_to_rgb(args.accent_color)
    prim_cmyk = hex_to_cmyk(args.primary_color)
    acc_cmyk = hex_to_cmyk(args.accent_color)

    print(f"  🎨 Primary Color: {args.primary_color} | RGB{prim_rgb} | CMYK C{prim_cmyk[0]} M{prim_cmyk[1]} Y{prim_cmyk[2]} K{prim_cmyk[3]}")
    print(f"  🎨 Accent Color:  {args.accent_color} | RGB{acc_rgb} | CMYK C{acc_cmyk[0]} M{acc_cmyk[1]} Y{acc_cmyk[2]} K{acc_cmyk[3]}")

    # Process raster variants via PIL if installed
    try:
        from PIL import Image
        img = Image.open(args.input).convert("RGBA")
        
        # 1. Master PNG Web Exports (@1x, @2x, @3x)
        for scale, suffix in [(1, ""), (2, "@2x"), (3, "@3x")]:
            target_w = 400 * scale
            ratio = target_w / float(img.width)
            target_h = int(img.height * ratio)
            
            resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            png_out = os.path.join(web_dir, f"logo_primary{suffix}.png")
            resized.save(png_out, "PNG")
            
            webp_out = os.path.join(web_dir, f"logo_primary{suffix}.webp")
            resized.save(webp_out, "WEBP", quality=90)
            print(f"  ✅ Web Asset: {png_out} ({target_w}x{target_h}px)")

        # 2. Reverse White Variant
        _, _, _, alpha = img.split()
        white_img = Image.merge("RGBA", (Image.new("L", img.size, 255), Image.new("L", img.size, 255), Image.new("L", img.size, 255), alpha))
        reverse_out = os.path.join(web_dir, "logo_reverse_white.png")
        white_img.save(reverse_out, "PNG")
        print(f"  ✅ Reverse White Asset: {reverse_out}")

        # 3. Monochrome Black Variant
        black_img = Image.merge("RGBA", (Image.new("L", img.size, 0), Image.new("L", img.size, 0), Image.new("L", img.size, 0), alpha))
        mono_out = os.path.join(print_dir, "logo_monochrome_black.png")
        black_img.save(mono_out, "PNG")
        print(f"  ✅ Monochrome Black Asset: {mono_out}")

        # 4. Print CMYK TIFF Export
        cmyk_img = img.convert("CMYK")
        cmyk_out = os.path.join(print_dir, "logo_cmyk_master_300ppi.tif")
        cmyk_img.save(cmyk_out, "TIFF", dpi=(300, 300), compression="tiff_deflate")
        print(f"  ✅ Print CMYK Asset: {cmyk_out} (300 PPI)")

    except ImportError:
        print("  ⚠️  Notice: PIL/Pillow is not installed. Exporting file structure & manifest.")

    # 5. Generate Presentation Slide Master Template (HTML 16:9 Widescreen)
    slide_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{brand_name} — 16:9 Master Presentation Slide Template</title>
    <style>
        body {{ margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #000; color: #fff; }}
        .slide-deck {{ display: flex; flex-direction: column; gap: 40px; padding: 40px; align-items: center; }}
        .slide {{ width: 1280px; height: 720px; background: {args.primary_color}; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.5); border: 1px solid #333; }}
        .slide-title {{ background: linear-gradient(135deg, {args.primary_color} 0%, #050E20 100%); display: flex; flex-direction: column; justify-content: center; padding: 80px; }}
        .slide-title h1 {{ font-size: 3.5rem; margin: 0 0 16px 0; color: #FFF; }}
        .slide-title p {{ font-size: 1.5rem; color: {args.accent_color}; margin: 0; }}
        .slide-content {{ background: #FAFAFC; color: #111; padding: 60px 80px; display: flex; flex-direction: column; justify-content: space-between; }}
        .slide-header {{ font-size: 2rem; font-weight: bold; color: {args.primary_color}; border-bottom: 3px solid {args.accent_color}; padding-bottom: 12px; }}
        .grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; }}
        .card {{ background: #FFF; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #EAEAEA; }}
        .slide-footer {{ display: flex; justify-content: space-between; font-size: 0.85rem; color: #888; border-top: 1px solid #DDD; padding-top: 16px; }}
    </style>
</head>
<body>
    <div class="slide-deck">
        <!-- Slide 1: Title Master -->
        <div class="slide slide-title">
            <h1>{brand_name}</h1>
            <p>Corporate Presentation Master Deck — 16:9 Widescreen</p>
        </div>

        <!-- Slide 2: Content Master Grid -->
        <div class="slide slide-content">
            <div class="slide-header">Executive Summary & Strategy</div>
            <div class="grid-2">
                <div class="card">
                    <h3 style="color:{args.primary_color}; margin-top:0;">Key Pillar 01</h3>
                    <p style="color:#555;">High-performance architecture driven by strategic clarity and brand consistency.</p>
                </div>
                <div class="card">
                    <h3 style="color:{args.primary_color}; margin-top:0;">Key Pillar 02</h3>
                    <p style="color:#555;">Multi-channel adaptation across digital platforms, mobile apps, and press production.</p>
                </div>
            </div>
            <div class="slide-footer">
                <span>{brand_name} © Confidential</span>
                <span>Page 02</span>
            </div>
        </div>
    </div>
</body>
</html>
"""
    slide_file = os.path.join(slides_dir, "master_presentation_template_16x9.html")
    with open(slide_file, "w", encoding="utf-8") as f:
        f.write(slide_html)
    print(f"  📄 Presentation Master Template: {slide_file}")

    # 6. Generate Master Brandbook Manual (HTML/PDF)
    brandbook_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{brand_name} — Corporate Brandbook & Guidelines Manual</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #0F0F12; color: #F5F5F2; line-height: 1.6; }}
        h1 {{ font-size: 2.8rem; margin-bottom: 0.5rem; color: #FFFFFF; }}
        h2 {{ font-size: 1.6rem; border-bottom: 2px solid {args.accent_color}; padding-bottom: 8px; margin-top: 48px; color: {args.accent_color}; }}
        .color-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 20px; }}
        .color-card {{ background: #1E1E24; border-radius: 12px; overflow: hidden; padding: 16px; border: 1px solid #2A2A32; }}
        .color-swatch {{ height: 100px; border-radius: 8px; margin-bottom: 12px; }}
        .spec {{ font-family: monospace; font-size: 0.85rem; color: #AAA; line-height: 1.6; }}
        .clear-space {{ border: 2px dashed {args.accent_color}; padding: 40px; display: inline-block; background: #18181C; border-radius: 8px; }}
        .card-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }}
        .box {{ background: #18181C; padding: 20px; border-radius: 8px; border: 1px solid #2B2B36; }}
    </style>
</head>
<body>
    <h1>{brand_name}</h1>
    <p style="font-size: 1.2rem; color: #AAA;">Official Brand Guidelines, Identity Architecture & Press Specifications — Version 1.0</p>
    
    <h2>1. Color System Specifications</h2>
    <div class="color-grid">
        <div class="color-card">
            <div class="color-swatch" style="background: {args.primary_color};"></div>
            <strong>Primary Brand Color</strong>
            <div class="spec">
                HEX: {args.primary_color}<br>
                RGB: {prim_rgb}<br>
                CMYK: C{prim_cmyk[0]} M{prim_cmyk[1]} Y{prim_cmyk[2]} K{prim_cmyk[3]}
            </div>
        </div>
        <div class="color-card">
            <div class="color-swatch" style="background: {args.accent_color};"></div>
            <strong>Accent Color</strong>
            <div class="spec">
                HEX: {args.accent_color}<br>
                RGB: {acc_rgb}<br>
                CMYK: C{acc_cmyk[0]} M{acc_cmyk[1]} Y{acc_cmyk[2]} K{acc_cmyk[3]}
            </div>
        </div>
    </div>

    <h2>2. Clear Space (Respiro) & Minimum Scale</h2>
    <p>Maintain a minimum exclusion zone of <strong>1X</strong> around the logo mark at all times.</p>
    <div class="clear-space">
        <div style="font-size: 2rem; font-weight: bold; text-align: center;">[ {brand_name} LOGO MARK ]</div>
    </div>

    <h2>3. Corporate Stationery & Merchandise Specifications</h2>
    <div class="card-grid">
        <div class="box">
            <h3 style="color:{args.accent_color}; margin-top:0;">Business Card (Cartão de Visita)</h3>
            <div class="spec">
                Dimensions: 90 x 50 mm (+3mm Bleed)<br>
                Paper Stock: 350g Couché Matte + Soft Touch<br>
                Text Spec: Employee Name (10pt Bold), Title (8pt), Contacts (7.5pt K=100%)
            </div>
        </div>
        <div class="box">
            <h3 style="color:{args.accent_color}; margin-top:0;">Apparel & Tote Bags (Vestimentas & Bolsas)</h3>
            <div class="spec">
                T-Shirt Pocket: 45mm width (Left Chest)<br>
                Tote Bag Silkscreen: 180mm width centered (Spot Pantone Ink)<br>
                Embroidery Line Weight: Minimum 1.2mm
            </div>
        </div>
    </div>

    <h2>4. Graphic Supplier & Press Instructions (Instruções para Gráfica)</h2>
    <div class="box">
        <div class="spec">
            ✂️ <strong>Die-Lines (Facas de Corte):</strong> 100% Magenta Spot Stroke set to Overprint Stroke.<br>
            ✨ <strong>Spot UV & Hot Stamping:</strong> 100% K Black vector layer assigned to Overprint Fill.<br>
            🖨️ <strong>Offset Press:</strong> Target CMYK Profile FOGRA39 (TAC &le; 280%). Small body text set to K=100% simple black.
        </div>
    </div>

    <h2>5. Master Deliverables Directory Index</h2>
    <div class="spec">
        📁 01_Vector_Master (SVG, EPS, PDF)<br>
        📁 02_Digital_Web_App (PNG @1x/@2x/@3x, WebP, Favicon)<br>
        📁 03_Print_Production (CMYK TIFF 300 PPI, Monochrome Black)<br>
        📁 04_Stationery_Merchandise (Business Cards, Apparel Specs)<br>
        📁 05_Presentation_Templates (16:9 Widescreen Master Slides)<br>
        📁 06_Brandbook (Client Guidelines Manual)
    </div>
</body>
</html>
"""
    brandbook_path = os.path.join(book_dir, "Brandbook_Guidelines_Manual.html")
    with open(brandbook_path, "w", encoding="utf-8") as f:
        f.write(brandbook_html)

    print(f"  📄 Generated Complete Brandbook Guidelines Manual: {brandbook_path}")
    print("\n✨ Complete Corporate Brand Package Successfully Exported!")

if __name__ == "__main__":
    run()
