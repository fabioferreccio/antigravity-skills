/**
 * CLI Utility Helpers
 *
 * Shared functions for catalog loading, formatting, and terminal output.
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CATALOG_PATH = resolve(__dirname, '..', '..', '.agents', 'catalog.json');

/**
 * Load the skills catalog from disk.
 */
export function loadCatalog() {
  if (!existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog not found at: ${CATALOG_PATH}`);
  }
  return JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
}

/**
 * Normalize a skill name to lowercase, hyphen-separated.
 */
export function formatSkillName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Print the CLI banner.
 */
export function printBanner() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║     🚀 Antigravity Skills Registry          ║');
  console.log('  ║     AI-Native Skill Management               ║');
  console.log('  ╚══════════════════════════════════════════════╝');
}

/**
 * Print a success message.
 */
export function printSuccess(message) {
  console.log(`\n  ✅ ${message}`);
}

/**
 * Print an error message.
 */
export function printError(message) {
  console.log(`\n  ❌ ${message}`);
}

/**
 * Print a warning message.
 */
export function printWarning(message) {
  console.log(`\n  ⚠️  ${message}`);
}

/**
 * Print an info message.
 */
export function printInfo(message) {
  console.log(`\n  ℹ️  ${message}`);
}
