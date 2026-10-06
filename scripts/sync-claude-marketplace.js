#!/usr/bin/env node

/**
 * Claude Plugin Marketplace Sync Script
 *
 * Scans all skill directories in .agents/skills/ and generates:
 * 1. Root .claude-plugin/marketplace.json
 * 2. Individual Claude Code / Claude Tag plugins in plugins/<skill-name>/
 *    with .claude-plugin/plugin.json and skills/<skill-name>/SKILL.md
 *
 * Usage:
 *   node scripts/sync-claude-marketplace.js
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  cpSync,
  rmSync,
  readdirSync,
} from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = process.env.ANTIGRAVITY_SKILLS_ROOT || join(ROOT, '.agents', 'skills');
const CLAUDE_PLUGIN_DIR = join(ROOT, '.claude-plugin');
const MARKETPLACE_PATH = join(CLAUDE_PLUGIN_DIR, 'marketplace.json');
const PLUGINS_DIR = join(ROOT, 'plugins');
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
    }
  }

  return result;
}

/**
 * Infer category from skill tags.
 */
function inferCategory(tags = [], name = '') {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  if (tagSet.has('security') || tagSet.has('appsec') || tagSet.has('pentesting') || name.includes('pentest') || name.includes('security')) {
    return 'security';
  }
  if (tagSet.has('architecture') || tagSet.has('ddd') || tagSet.has('clean-code') || tagSet.has('deep-modules')) {
    return 'architecture';
  }
  if (tagSet.has('database') || tagSet.has('sql') || tagSet.has('migration') || name.includes('dba') || name.includes('migration')) {
    return 'database';
  }
  if (tagSet.has('devops') || tagSet.has('sre') || tagSet.has('docker') || tagSet.has('kubernetes')) {
    return 'devops';
  }
  if (tagSet.has('qa') || tagSet.has('testing') || tagSet.has('bug-hunting') || tagSet.has('code-review')) {
    return 'quality';
  }
  if (tagSet.has('frontend') || tagSet.has('ux') || tagSet.has('image-processing') || tagSet.has('branding-identity')) {
    return 'design';
  }
  if (tagSet.has('prompts') || tagSet.has('compound-learning') || tagSet.has('llm') || tagSet.has('retrospective')) {
    return 'ai-engineering';
  }
  if (tagSet.has('product-management') || tagSet.has('strategy')) {
    return 'product';
  }
  return 'development';
}

/**
 * Parse author string into object.
 * e.g. "Fabio Ferreccio <fabioferreccio@gmail.com>"
 */
function parseAuthor(authorStr = 'Fabio Ferreccio <fabioferreccio@gmail.com>') {
  const match = authorStr.match(/^(.*?)(?:\s*<([^>]+)>)?$/);
  if (!match) return { name: authorStr };
  const author = { name: (match[1] || authorStr).trim() };
  if (match[2]) author.email = match[2].trim();
  return author;
}

// ─── Main ───────────────────────────────────────────────────────
console.log('\n  🔌 Syncing Claude Plugin Marketplace...\n');

if (!existsSync(SKILLS_DIR)) {
  console.log('  ⚠️  No skills directory found.\n');
  process.exit(0);
}

if (!existsSync(CLAUDE_PLUGIN_DIR)) {
  mkdirSync(CLAUDE_PLUGIN_DIR, { recursive: true });
}

if (!existsSync(PLUGINS_DIR)) {
  mkdirSync(PLUGINS_DIR, { recursive: true });
}

const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const marketplacePlugins = [];

for (const dir of skillDirs) {
  const skillSrcDir = join(SKILLS_DIR, dir);
  const skillMd = join(skillSrcDir, 'SKILL.md');
  if (!existsSync(skillMd)) continue;

  const content = readFileSync(skillMd, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) continue;

  const skillName = fm.name || dir;
  const version = fm.version || '1.0.0';
  const description = (fm.description || '').trim();
  const author = parseAuthor(fm.author);
  const category = inferCategory(fm.tags, skillName);

  // Target plugin directory: plugins/<skill-name>
  const pluginDir = join(PLUGINS_DIR, skillName);
  const pluginClaudeDir = join(pluginDir, '.claude-plugin');
  const pluginSkillsDir = join(pluginDir, 'skills', skillName);

  // Ensure plugin directories exist
  mkdirSync(pluginClaudeDir, { recursive: true });
  mkdirSync(pluginSkillsDir, { recursive: true });

  // 1. Create plugins/<skill-name>/.claude-plugin/plugin.json
  const pluginManifest = {
    name: skillName,
    version,
    description,
    author,
    homepage: `https://github.com/fabioferreccio/antigravity-skills/tree/main/.agents/skills/${dir}`,
    repository: 'https://github.com/fabioferreccio/antigravity-skills.git',
    license: 'MIT',
    keywords: Array.isArray(fm.tags) ? fm.tags : [],
  };

  writeFileSync(
    join(pluginClaudeDir, 'plugin.json'),
    JSON.stringify(pluginManifest, null, 2) + '\n'
  );

  // 2. Sync skill files into plugins/<skill-name>/skills/<skill-name>/
  // Copy SKILL.md, README.md, references/, examples/, etc.
  cpSync(skillSrcDir, pluginSkillsDir, { recursive: true });

  // 3. Add to marketplace.json
  marketplacePlugins.push({
    name: skillName,
    description,
    version,
    author,
    category,
    source: `./plugins/${skillName}`,
    homepage: `https://github.com/fabioferreccio/antigravity-skills/tree/main/plugins/${skillName}`,
  });

  console.log(`  ✅ Synced plugin: ${skillName} v${version} (${category})`);
}

// Read package version
let packageVersion = '1.2.0';
if (existsSync(PKG_PATH)) {
  const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8'));
  packageVersion = pkg.version;
}

// 4. Generate root .claude-plugin/marketplace.json
const marketplace = {
  $schema: 'https://anthropic.com/claude-code/marketplace.schema.json',
  name: 'antigravity-skills',
  description:
    'Production-grade public registry of reusable skills for software engineering, architecture, QA, security, and AI orchestration.',
  owner: {
    name: 'Fabio Ferreccio',
    email: 'fabioferreccio@gmail.com',
  },
  metadata: {
    version: packageVersion,
    description:
      'Production-grade registry of 29 reusable skills compatible with Antigravity, Claude Code, and Claude Tag.',
  },
  plugins: marketplacePlugins,
};

writeFileSync(MARKETPLACE_PATH, JSON.stringify(marketplace, null, 2) + '\n');

console.log(`\n  📦 Marketplace updated: ${marketplacePlugins.length} plugins registered`);
console.log(`  📂 Written to: ${MARKETPLACE_PATH}\n`);
