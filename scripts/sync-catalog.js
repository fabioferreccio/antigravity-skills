#!/usr/bin/env node

/**
 * Catalog Sync Script
 *
 * Scans all skill directories in .agents/skills/ and regenerates
 * .agents/catalog.json with current metadata from each SKILL.md.
 *
 * Usage:
 *   node scripts/sync-catalog.js
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = process.env.ANTIGRAVITY_SKILLS_ROOT || join(ROOT, '.agents', 'skills');
const CATALOG_PATH = process.env.ANTIGRAVITY_CATALOG_PATH || join(ROOT, '.agents', 'catalog.json');
const PKG_PATH = join(ROOT, 'package.json');

/**
 * Parse YAML frontmatter from SKILL.md content.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1].replace(/\r/g, '');
  const result = {};
  let currentKey = null;
  let isMultilineString = false;

  for (const line of yaml.split('\n')) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      isMultilineString = value === '>' || value === '|';

      if (isMultilineString) {
        result[currentKey] = '';
      } else if (value === 'true') {
        result[currentKey] = true;
      } else if (value === 'false') {
        result[currentKey] = false;
      } else if (value === '') {
        result[currentKey] = '';
      } else {
        result[currentKey] = value;
      }
    } else if (line.match(/^\s+-\s+/) && currentKey) {
      const item = line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '');
      if (!Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      result[currentKey].push(item);
    } else if (line.match(/^\s+\w/) && currentKey && isMultilineString) {
      result[currentKey] = (result[currentKey] + ' ' + line.trim()).trim();
    } else if (line.match(/^\s+\w/) && currentKey && typeof result[currentKey] === 'object' && !Array.isArray(result[currentKey])) {
      // Nested YAML object
      const nestedMatch = line.match(/^\s+(\w[\w-]*):\s*(.*)$/);
      if (nestedMatch) {
        if (typeof result[currentKey] !== 'object' || Array.isArray(result[currentKey])) {
          result[currentKey] = {};
        }
        let val = nestedMatch[2].trim();
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        result[currentKey][nestedMatch[1]] = val;
      }
    }
  }

  return result;
}

/**
 * Parse security section from frontmatter.
 */
function parseSecurity(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1].replace(/\r/g, '');
  const securityMatch = yaml.match(/security:\n((?:\s+\w.*\n)*)/);
  if (!securityMatch) return {};

  const security = {};
  const lines = securityMatch[1].split('\n').filter(Boolean);
  for (const line of lines) {
    const kvMatch = line.match(/^\s+(\w+):\s*(.+)$/);
    if (kvMatch) {
      let val = kvMatch[2].trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      security[kvMatch[1]] = val;
    }
  }
  return security;
}

// ─── Main ───────────────────────────────────────────────────────
console.log('\n  📦 Syncing catalog.json...\n');

if (!existsSync(SKILLS_DIR)) {
  console.log('  ⚠️  No skills directory found. Creating empty catalog.\n');
  writeFileSync(
    CATALOG_PATH,
    JSON.stringify({ version: '1.0.0', generated: new Date().toISOString(), total_skills: 0, skills: [] }, null, 2)
  );
  process.exit(0);
}

const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const skills = [];

for (const dir of skillDirs) {
  const skillMd = join(SKILLS_DIR, dir, 'SKILL.md');
  if (!existsSync(skillMd)) {
    console.log(`  ⚠️  Skipping ${dir}: no SKILL.md found`);
    continue;
  }

  const content = readFileSync(skillMd, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) {
    console.log(`  ⚠️  Skipping ${dir}: invalid frontmatter`);
    continue;
  }

  const security = parseSecurity(content);

  skills.push({
    name: fm.name || dir,
    version: fm.version || '0.0.0',
    description: (fm.description || '').trim(),
    author: fm.author || 'Unknown',
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    scope: fm.scope || 'workspace',
    path: `.agents/skills/${dir}`,
    security: Object.keys(security).length > 0 ? security : undefined,
  });

  console.log(`  ✅ Indexed: ${fm.name || dir} v${fm.version || '?'}`);
}

// Read package version
let packageVersion = '1.0.0';
if (existsSync(PKG_PATH)) {
  const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8'));
  packageVersion = pkg.version;
}

const catalog = {
  version: packageVersion,
  generated: new Date().toISOString(),
  total_skills: skills.length,
  skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
};

writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n');

console.log(`\n  📦 Catalog updated: ${skills.length} skills indexed`);
console.log(`  📂 Written to: ${CATALOG_PATH}\n`);
