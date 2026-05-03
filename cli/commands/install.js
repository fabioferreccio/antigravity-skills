/**
 * Install Command
 *
 * Copies a skill from the registry to the target location.
 * Supports workspace-local and global installation.
 */

import { existsSync, mkdirSync, cpSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadCatalog, formatSkillName, printBanner, printSuccess, printError, printWarning } from '../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REGISTRY_ROOT = resolve(__dirname, '..', '..', '.agents', 'skills');

/**
 * Resolves the target installation directory based on scope.
 */
function getTargetDir(skillName, isGlobal) {
  if (isGlobal) {
    return join(homedir(), '.gemini', 'antigravity', 'skills', skillName);
  }
  return join(process.cwd(), '.agents', 'skills', skillName);
}

/**
 * Install a skill from the registry.
 */
export async function install(skillName, options = {}) {
  printBanner();
  const name = formatSkillName(skillName);

  // 1. Verify skill exists in registry
  const catalog = loadCatalog();
  const skill = catalog.skills.find((s) => s.name === name);

  if (!skill) {
    printError(`Skill "${name}" not found in the registry.`);
    console.log('\n  Available skills:');
    catalog.skills.forEach((s) => console.log(`    • ${s.name} (v${s.version})`));
    console.log(`\n  Use \`antigravity search ${skillName}\` to find similar skills.`);
    process.exit(1);
  }

  // 2. Check source directory exists
  const sourceDir = join(REGISTRY_ROOT, name);
  if (!existsSync(sourceDir)) {
    printError(`Skill directory not found: ${sourceDir}`);
    process.exit(1);
  }

  // 3. Determine target
  const targetDir = getTargetDir(name, options.global);
  const scope = options.global ? 'global' : 'workspace';

  // 4. Check if already installed
  if (existsSync(targetDir) && !options.force) {
    printWarning(`Skill "${name}" is already installed at:\n  ${targetDir}`);
    console.log('\n  Use --force to overwrite.');
    process.exit(0);
  }

  // 5. Create target directory and copy
  try {
    mkdirSync(targetDir, { recursive: true });
    cpSync(sourceDir, targetDir, { recursive: true });

    printSuccess(`Skill "${name}" installed successfully!`);
    console.log(`\n  📍 Location: ${targetDir}`);
    console.log(`  📦 Version:  ${skill.version}`);
    console.log(`  🎯 Scope:    ${scope}`);
    console.log(`  🏷️  Tags:     ${skill.tags.join(', ')}`);
    console.log('\n  The skill is now available to Antigravity agents.');
  } catch (err) {
    printError(`Failed to install skill: ${err.message}`);
    process.exit(1);
  }
}
