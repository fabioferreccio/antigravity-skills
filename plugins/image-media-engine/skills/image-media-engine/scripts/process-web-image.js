#!/usr/bin/env node
/**
 * Parametric Web Image Processing Script
 * Part of image-media-engine Antigravity Skill
 *
 * Usage:
 *   node process-web-image.js --input <file> [options]
 *
 * Options:
 *   --input, -i       Input image file path (Required)
 *   --output-dir, -o  Output directory (default: ./dist-images)
 *   --widths, -w      Comma-separated list of target widths (default: 320,640,1024,1920)
 *   --formats, -f     Comma-separated list of formats (webp,avif,png,jpg) (default: webp,avif)
 *   --dpr             Comma-separated list of DPR multipliers (default: 1,2)
 *   --quality, -q     Compression quality 1-100 (default: 82)
 *   --strip-exif      Strip EXIF privacy metadata (default: true)
 */

import fs from 'fs';
import path from 'path';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    outputDir: './dist-images',
    widths: [320, 640, 1024, 1920],
    formats: ['webp', 'avif'],
    dpr: [1, 2],
    quality: 82,
    stripExif: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output-dir' || arg === '-o') {
      options.outputDir = args[++i];
    } else if (arg === '--widths' || arg === '-w') {
      options.widths = args[++i].split(',').map(Number);
    } else if (arg === '--formats' || arg === '-f') {
      options.formats = args[++i].split(',').map(s => s.trim().toLowerCase());
    } else if (arg === '--dpr') {
      options.dpr = args[++i].split(',').map(Number);
    } else if (arg === '--quality' || arg === '-q') {
      options.quality = parseInt(args[++i], 10);
    }
  }

  return options;
}

async function run() {
  const options = parseArgs();
  if (!options.input) {
    console.error('❌ Error: Missing required parameter --input <file_path>');
    console.log('Usage: node process-web-image.js --input product.jpg --widths 320,640,1024 --formats webp,avif');
    process.exit(1);
  }

  if (!fs.existsSync(options.input)) {
    console.error(`❌ Error: Input file not found: ${options.input}`);
    process.exit(1);
  }

  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }

  console.log(`🖼️  Processing image: ${options.input}`);
  console.log(`🎯 Formats: ${options.formats.join(', ')} | Widths: ${options.widths.join(', ')} | DPR: ${options.dpr.join(', ')}x`);

  // Dynamically load sharp if available, else output CLI execution manifest
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.warn('⚠️  Notice: "sharp" package is not installed locally. Generating execution manifest & fallback specs.');
  }

  const basename = path.basename(options.input, path.extname(options.input));
  const generatedFiles = [];

  for (const format of options.formats) {
    for (const width of options.widths) {
      for (const multiplier of options.dpr) {
        const targetWidth = width * multiplier;
        const dprSuffix = multiplier > 1 ? `@${multiplier}x` : '';
        const filename = `${basename}-${width}w${dprSuffix}.${format}`;
        const outputPath = path.join(options.outputDir, filename);

        if (sharp) {
          let pipeline = sharp(options.input)
            .resize(targetWidth, null, { fit: 'cover', kernel: 'lanczos3' })
            .toColorspace('srgb');

          if (options.stripExif) {
            pipeline = pipeline.withMetadata(false);
          }

          if (format === 'webp') {
            await pipeline.webp({ quality: options.quality }).toFile(outputPath);
          } else if (format === 'avif') {
            await pipeline.avif({ quality: options.quality }).toFile(outputPath);
          } else if (format === 'jpg' || format === 'jpeg') {
            await pipeline.jpeg({ quality: options.quality, progressive: true }).toFile(outputPath);
          } else if (format === 'png') {
            await pipeline.png({ compressionLevel: 8 }).toFile(outputPath);
          }
          console.log(`  ✅ Generated: ${outputPath} (${targetWidth}px)`);
        } else {
          console.log(`  📝 Planned Asset: ${outputPath} (${targetWidth}px)`);
        }

        generatedFiles.push({ filename, width, dpr: multiplier, format, path: outputPath });
      }
    }
  }

  console.log('\n✨ Processing Manifest Completed Successfully!');
  console.log(`📊 Total Assets Configured: ${generatedFiles.length}`);
}

run().catch(err => {
  console.error('❌ Pipeline Execution Error:', err);
  process.exit(1);
});
