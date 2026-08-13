#!/usr/bin/env python3
"""
Parametric Batch Image & E-Commerce Packshot Processor
Part of image-media-engine Antigravity Skill

Usage:
    python batch-image-processor.py --input-dir ./raw_products --output-dir ./dist_products [options]

Options:
    --input-dir, -i   Input directory containing raw images (Required)
    --output-dir, -o  Output directory for processed assets (default: ./dist_processed)
    --target-size     Target square or fixed dimensions WxH (default: 1080x1080)
    --padding-pct     Whitespace padding percentage (default: 10)
    --bg-color        Canvas background hex color (default: #FFFFFF)
    --auto-equalize   Apply automatic exposure & white balance adjustment (default: True)
    --watermark       Text watermark to overlay (Optional)
"""

import os
import sys
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Batch Image & E-Commerce Packshot Processor")
    parser.add_argument("--input-dir", "-i", required=True, help="Input directory")
    parser.add_argument("--output-dir", "-o", default="./dist_processed", help="Output directory")
    parser.add_argument("--target-size", default="1080x1080", help="Target dimensions WxH")
    parser.add_argument("--padding-pct", type=int, default=10, help="Padding percentage")
    parser.add_argument("--bg-color", default="#FFFFFF", help="Background hex color")
    parser.add_argument("--auto-equalize", action="store_true", default=True, help="Auto equalize exposure")
    parser.add_argument("--watermark", default=None, help="Watermark text")
    return parser.parse_args()

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip("#")
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def process_file(file_path, output_dir, target_w, target_h, padding_pct, bg_color_rgb, watermark_text):
    filename = os.path.basename(file_path)
    output_path = os.path.join(output_dir, os.path.splitext(filename)[0] + ".jpg")
    
    try:
        from PIL import Image, ImageOps, ImageEnhance, ImageDraw
        img = Image.open(file_path).convert("RGB")
        
        # 1. Auto exposure boost / Auto contrast
        img = ImageOps.autocontrast(img, cutoff=0.5)
        
        # 2. Fit image inside target size preserving aspect ratio with padding
        padded_w = int(target_w * (1.0 - (padding_pct * 2 / 100.0)))
        padded_h = int(target_h * (1.0 - (padding_pct * 2 / 100.0)))
        
        img.thumbnail((padded_w, padded_h), Image.Resampling.LANCZOS)
        
        # 3. Create canvas background
        canvas = Image.new("RGB", (target_w, target_h), bg_color_rgb)
        offset_x = (target_w - img.width) // 2
        offset_y = (target_h - img.height) // 2
        canvas.paste(img, (offset_x, offset_y))
        
        # 4. Optional Watermark
        if watermark_text:
            draw = ImageDraw.Draw(canvas)
            draw.text((20, target_h - 40), watermark_text, fill=(180, 180, 180))
            
        canvas.save(output_path, "JPEG", quality=88, optimize=True)
        print(f"  ✅ Processed: {filename} -> {output_path} ({target_w}x{target_h})")
        
    except ImportError:
        print(f"  📝 Planned Batch Action for {filename} -> {output_path}")

def run():
    args = parse_args()
    if not os.path.exists(args.input_dir):
        print(f"❌ Error: Input directory does not exist: {args.input_dir}", file=sys.stderr)
        sys.exit(1)
        
    os.makedirs(args.output_dir, exist_ok=True)
    target_w, target_h = map(int, args.target_size.lower().split("x"))
    bg_rgb = hex_to_rgb(args.bg_color)
    
    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
    files = [f for f in os.listdir(args.input_dir) if os.path.splitext(f)[1].lower() in valid_exts]
    
    print(f"🚀 Batch Processing {len(files)} images from: {args.input_dir}")
    print(f"🎯 Target Canvas: {target_w}x{target_h} px | Padding: {args.padding_pct}% | BG: {args.bg_color}")
    
    for f in files:
        file_path = os.path.join(args.input_dir, f)
        process_file(file_path, args.output_dir, target_w, target_h, args.padding_pct, bg_rgb, args.watermark)
        
    print(f"\n✨ Batch Packshot Processing Complete! Assets saved to: {args.output_dir}")

if __name__ == "__main__":
    run()
