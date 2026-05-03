#!/usr/bin/env node

/**
 * Validation Script
 *
 * Validates the antigravity-skills repository against all quality rules:
 * - Directory structure compliance
 * - YAML frontmatter validity
 * - Semantic versioning correctness
 * - Documentation presence
 * - Test and example presence
 * - Duplicate name detection
 * - Catalog consistency
 *
 * Usage:
 *   node scripts/validate.js              # Run all checks
 *   node scripts/validate.js --structure  # Structure only
 *   node scripts/validate.js --frontmatter # Frontmatter only
 *   node scripts/validate.js --catalog    # Catalog only
 *   node scripts/validate.js --duplicates # Duplicate names only
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, '.agents', 'skills');
const CATALOG_PATH = join(ROOT, '.agents', 'catalog.json');

// ─── Parse CLI Flags ─────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
  structure: args.includes('--structure') || args.includes('--all') || args.length === 0,
  frontmatter: args.includes('--frontmatter') || args.includes('--all') || args.length === 0,
  catalog: args.includes('--catalog') || args.includes('--all') || args.length === 0,
  duplicates: args.includes('--duplicates') || args.includes('--all') || args.length === 0,
  versions: args.includes('--versions'),
  readmeCheck: args.includes('--readme-check') || args.includes('--all') || args.length === 0,
  versionBumpRequired: args.includes('--version-bump-required'),
  changed: args.includes('--changed') ? JSON.parse(args[args.indexOf('--changed') + 1]) : null,
};

// ─── State ────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;
let passed = 0;

function pass(msg) {
  console.log(`  🟢 PASS: ${msg}`);
  passed++;
}

function warn(msg) {
  console.log(`  🟡 WARN: ${msg}`);
  warnings++;
}

function fail(msg) {
  console.log(`  🔴 FAIL: ${msg}`);
  errors++;
}

// ─── Get All Skill Directories ──────────────────────────────────
function getSkillDirs() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// ─── Parse YAML Frontmatter ─────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Simple YAML parser for flat and array fields
  let currentKey = null;
  for (const line of yaml.split('\n')) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === '' || value === '>') {
        result[currentKey] = '';
      } else if (value === 'true') {
        result[currentKey] = true;
      } else if (value === 'false') {
        result[currentKey] = false;
      } else {
        result[currentKey] = value;
      }
    } else if (line.match(/^\s+-\s+/) && currentKey) {
      const item = line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '');
      if (!Array.isArray(result[currentKey])) {
        result[currentKey] = result[currentKey] ? [result[currentKey]] : [];
      }
      result[currentKey].push(item);
    } else if (line.match(/^\s+\w/) && currentKey) {
      // Multi-line value continuation
      result[currentKey] += ' ' + line.trim();
    }
  }

  return result;
}

// ─── Validate Structure ─────────────────────────────────────────
function validateStructure(skillName) {
  const skillDir = join(SKILLS_DIR, skillName);
  const required = ['SKILL.md', 'README.md'];
  const requiredDirs = ['examples', 'tests'];

  for (const file of required) {
    const filePath = join(skillDir, file);
    if (existsSync(filePath)) {
      pass(`${skillName}/${file} exists`);
    } else {
      fail(`${skillName}/${file} is MISSING`);
    }
  }

  for (const dir of requiredDirs) {
    const dirPath = join(skillDir, dir);
    if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
      const contents = readdirSync(dirPath);
      if (contents.length > 0) {
        pass(`${skillName}/${dir}/ exists and is not empty`);
      } else {
        fail(`${skillName}/${dir}/ exists but is EMPTY`);
      }
    } else {
      fail(`${skillName}/${dir}/ is MISSING`);
    }
  }
}

// ─── Validate Frontmatter ───────────────────────────────────────
function validateFrontmatter(skillName) {
  const skillMd = join(SKILLS_DIR, skillName, 'SKILL.md');
  if (!existsSync(skillMd)) {
    fail(`${skillName}/SKILL.md not found — cannot validate frontmatter`);
    return;
  }

  const content = readFileSync(skillMd, 'utf8');
  const fm = parseFrontmatter(content);

  if (!fm) {
    fail(`${skillName}/SKILL.md has NO valid YAML frontmatter`);
    return;
  }

  // Required fields
  const requiredFields = ['name', 'description', 'version', 'author', 'tags'];
  for (const field of requiredFields) {
    if (fm[field]) {
      pass(`${skillName}: frontmatter field '${field}' present`);
    } else {
      fail(`${skillName}: frontmatter field '${field}' is MISSING`);
    }
  }

  // Name must match directory name
  if (fm.name && fm.name !== skillName) {
    fail(`${skillName}: frontmatter 'name' ("${fm.name}") does NOT match directory name`);
  } else if (fm.name) {
    pass(`${skillName}: frontmatter 'name' matches directory name`);
  }

  // Version must be valid semver
  if (fm.version) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (semverRegex.test(fm.version)) {
      pass(`${skillName}: version "${fm.version}" is valid semver`);
    } else {
      fail(`${skillName}: version "${fm.version}" is NOT valid semver`);
    }
  }

  // Name must be kebab-case
  if (fm.name) {
    const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (kebabRegex.test(fm.name)) {
      pass(`${skillName}: name is valid kebab-case`);
    } else {
      fail(`${skillName}: name "${fm.name}" is NOT valid kebab-case`);
    }
  }
}

// ─── Check Duplicates ───────────────────────────────────────────
function checkDuplicates(skills) {
  const names = new Map();
  for (const skill of skills) {
    const skillMd = join(SKILLS_DIR, skill, 'SKILL.md');
    if (!existsSync(skillMd)) continue;

    const content = readFileSync(skillMd, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm || !fm.name) continue;

    if (names.has(fm.name)) {
      fail(`Duplicate skill name "${fm.name}" in directories: ${names.get(fm.name)}, ${skill}`);
    } else {
      names.set(fm.name, skill);
    }
  }

  if (names.size === skills.length) {
    pass(`No duplicate skill names found (${names.size} unique names)`);
  }
}

// ─── Validate Catalog ───────────────────────────────────────────
function validateCatalog(skills) {
  if (!existsSync(CATALOG_PATH)) {
    fail('catalog.json does NOT exist');
    return;
  }

  try {
    const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));

    if (!catalog.skills || !Array.isArray(catalog.skills)) {
      fail('catalog.json has invalid structure (missing skills array)');
      return;
    }

    // Check all skill dirs are in catalog
    for (const skill of skills) {
      const inCatalog = catalog.skills.some((s) => s.name === skill);
      if (inCatalog) {
        pass(`${skill} is listed in catalog.json`);
      } else {
        warn(`${skill} is NOT listed in catalog.json — run \`npm run catalog:sync\``);
      }
    }

    // Check catalog doesn't have orphan entries
    for (const entry of catalog.skills) {
      if (!skills.includes(entry.name)) {
        warn(`catalog.json contains orphan entry: "${entry.name}"`);
      }
    }

    pass(`catalog.json is valid JSON with ${catalog.skills.length} entries`);
  } catch (err) {
    fail(`catalog.json parse error: ${err.message}`);
  }
}

// ─── Main ───────────────────────────────────────────────────────
console.log('\n  ══════════════════════════════════════════════');
console.log('  🔍 Antigravity Skills — Validation Suite');
console.log('  ══════════════════════════════════════════════\n');

const skills = getSkillDirs();

if (skills.length === 0) {
  warn('No skill directories found in .agents/skills/');
} else {
  console.log(`  Found ${skills.length} skill(s): ${skills.join(', ')}\n`);

  if (flags.structure) {
    console.log('  ── Structure Validation ──────────────────────\n');
    for (const skill of skills) {
      validateStructure(skill);
    }
    console.log('');
  }

  if (flags.frontmatter) {
    console.log('  ── Frontmatter Validation ────────────────────\n');
    for (const skill of skills) {
      validateFrontmatter(skill);
    }
    console.log('');
  }

  if (flags.duplicates) {
    console.log('  ── Duplicate Detection ───────────────────────\n');
    checkDuplicates(skills);
    console.log('');
  }

  if (flags.catalog) {
    console.log('  ── Catalog Validation ────────────────────────\n');
    validateCatalog(skills);
    console.log('');
  }
}

// ─── Summary ────────────────────────────────────────────────────
console.log('  ══════════════════════════════════════════════');
console.log(`  ✅ Passed: ${passed}  ⚠️ Warnings: ${warnings}  ❌ Failed: ${errors}`);
console.log('  ══════════════════════════════════════════════\n');

if (errors > 0) {
  console.log('  Validation FAILED. Please fix the errors above.\n');
  process.exit(1);
} else {
  console.log('  Validation PASSED. Repository is compliant. 🚀\n');
}
