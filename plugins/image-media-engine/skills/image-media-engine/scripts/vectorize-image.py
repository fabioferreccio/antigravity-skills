#!/usr/bin/env python3
"""
High-Precision Image Vectorizer (True Vectoring with fill-rule="evenodd")
Part of image-media-engine Antigravity Skill

Extracts mathematical vector contours (<path>) with smooth cubic Bézier curves,
eliminates Base64 raster wrappers, handles transparent inner holes using fill-rule="evenodd",
and supports linear gradients (e.g., metallic gold/silver).

Usage:
    python vectorize-image.py --input logo.jpg --output logo.svg [options]

Options:
    --input, -i       Input image file (PNG, JPG, WEBP) (Required)
    --output, -o      Output vector SVG path (default: output.svg)
    --smoothness, -s  Smoothing factor for Bézier curve approximation (default: 1.2)
    --min-area        Minimum contour area in pixels to ignore noise (default: 25.0)
    --gradient-start  Optional linear gradient start HEX color (e.g. #FFE57F)
    --gradient-end    Optional linear gradient end HEX color (e.g. #FF6F00)
    --invert          Invert threshold mask
"""

import os
import sys
import argparse
import numpy as np
import cv2
from PIL import Image

def parse_args():
    parser = argparse.ArgumentParser(description="High-Precision True Image Vectorizer")
    parser.add_argument("--input", "-i", required=True, help="Input image file (PNG, JPG, WEBP)")
    parser.add_argument("--output", "-o", default="output.svg", help="Output SVG path")
    parser.add_argument("--smoothness", "-s", type=float, default=1.2, help="Curve smoothing threshold")
    parser.add_argument("--min-area", type=float, default=25.0, help="Min area to filter noise")
    parser.add_argument("--gradient-start", help="Gradient start HEX color (e.g. #FFE57F)")
    parser.add_argument("--gradient-end", help="Gradient end HEX color (e.g. #FF6F00)")
    parser.add_argument("--invert", action="store_true", help="Invert binary mask")
    return parser.parse_args()

def points_to_svg_path_data(points, is_closed=True):
    """Converts a contour array of 2D points into a clean SVG path data string with smooth Q curves."""
    if len(points) < 3:
        return ""
    
    pts = points.reshape(-1, 2)
    path_cmds = [f"M {pts[0][0]:.2f} {pts[0][1]:.2f}"]
    
    n = len(pts)
    for i in range(1, n):
        curr = pts[i]
        prev = pts[i - 1]
        
        cp_x = (prev[0] + curr[0]) / 2.0
        cp_y = (prev[1] + curr[1]) / 2.0
        path_cmds.append(f"Q {prev[0]:.2f} {prev[1]:.2f} {cp_x:.2f} {cp_y:.2f}")
        
    if is_closed:
        path_cmds.append("Z")
        
    return " ".join(path_cmds)

def vectorize(input_path, output_path, smoothness=1.2, min_area=25.0, grad_start=None, grad_end=None, invert=False):
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}", file=sys.stderr)
        sys.exit(1)
        
    print(f"[VECTOR] Vectorizing: {input_path} -> {output_path} (True Vectoring, fill-rule=evenodd)")
    img_bgr = cv2.imread(input_path)
    if img_bgr is None:
        print(f"Error: Unable to read image: {input_path}", file=sys.stderr)
        sys.exit(1)
        
    h, w, c = img_bgr.shape
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    
    # 1. Denoising & Gaussian Smoothing
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # 2. Otsu Thresholding
    thresh_type = cv2.THRESH_BINARY_INV if invert else cv2.THRESH_BINARY
    _, thresh = cv2.threshold(blurred, 0, 255, thresh_type + cv2.THRESH_OTSU)
    
    # 3. Morphological Cleaning (remove isolated speckle noise)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    # 4. Contour Extraction with Tree Hierarchy
    contours, hierarchy = cv2.findContours(cleaned, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_L1)
    
    if hierarchy is None or len(contours) == 0:
        print("Warning: No vector contours detected.", file=sys.stderr)
        sys.exit(1)
        
    hierarchy = hierarchy[0]
    
    # Group parent shapes and their child cutout holes
    shape_groups = {}  # parent_idx -> list of contour indices (parent + children)
    
    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        if area < min_area:
            continue
            
        parent_idx = hierarchy[i][3]
        if parent_idx == -1:
            # Top-level outer shape
            if i not in shape_groups:
                shape_groups[i] = [i]
        else:
            # Child hole / cutout contour inside parent
            # Resolve root parent
            root = parent_idx
            while hierarchy[root][3] != -1:
                root = hierarchy[root][3]
            if root not in shape_groups:
                shape_groups[root] = [root]
            shape_groups[root].append(i)
            
    svg_paths = []
    
    # Gradient Definition Header if requested
    defs_xml = ""
    use_gradient = grad_start and grad_end
    if use_gradient:
        defs_xml = f'''  <defs>
    <linearGradient id="brandLinearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{grad_start}" />
      <stop offset="100%" stop-color="{grad_end}" />
    </linearGradient>
  </defs>'''

    for parent_idx, contour_indices in shape_groups.items():
        combined_path_data = []
        parent_cnt = contours[parent_idx]
        
        # Calculate color from centroid of parent shape
        M = cv2.moments(parent_cnt)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            cx = max(0, min(w - 1, cx))
            cy = max(0, min(h - 1, cy))
            b, g, r = img_bgr[cy, cx]
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
        else:
            hex_color = "#000000"
            
        fill_attr = 'fill="url(#brandLinearGradient)"' if use_gradient else f'fill="{hex_color}"'
        
        for c_idx in contour_indices:
            cnt = contours[c_idx]
            epsilon = smoothness * 0.003 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            pdata = points_to_svg_path_data(approx)
            if pdata:
                combined_path_data.append(pdata)
                
        if combined_path_data:
            full_d = " ".join(combined_path_data)
            svg_paths.append(f'  <path d="{full_d}" fill-rule="evenodd" {fill_attr} stroke="none" />')
            
    defs_block = f"\n{defs_xml}\n" if defs_xml else ""
    svg_xml = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<!-- Vectorized with image-media-engine True Vectorizer (fill-rule="evenodd") -->{defs_block}
<g id="vector_master">
{chr(10).join(svg_paths)}
</g>
</svg>'''

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg_xml)
        
    print(f"[OK] True Vectorization Complete: {output_path} ({len(svg_paths)} pure <path> elements with fill-rule=evenodd, {w}x{h}px)")

def main():
    args = parse_args()
    vectorize(
        args.input,
        args.output,
        smoothness=args.smoothness,
        min_area=args.min_area,
        grad_start=args.gradient_start,
        grad_end=args.gradient_end,
        invert=args.invert
    )

if __name__ == "__main__":
    main()
