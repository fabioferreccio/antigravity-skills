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
export async function install(skillNames, options = {}) {
  printBanner();
  
  const names = Array.isArray(skillNames) ? skillNames : [skillNames];
  
  if (names.length === 0) {
    printError('No skill names provided.');
    process.exit(1);
  }

  const catalog = loadCatalog();
  const scope = options.global ? 'global' : 'workspace';
  
  console.log(`  Installing ${names.length} skill(s) to ${scope}...\n`);

  let hasError = false;
  let successCount = 0;

  for (const rawName of names) {
    const name = formatSkillName(rawName);
    const skill = catalog.skills.find((s) => s.name === name);

    if (!skill) {
      printError(`Skill "${name}" not found in the registry.`);
      hasError = true;
      continue;
    }

    // Check source directory exists
    const sourceDir = join(REGISTRY_ROOT, name);
    if (!existsSync(sourceDir)) {
      printError(`Skill directory not found for "${name}": ${sourceDir}`);
      hasError = true;
      continue;
    }

    // Determine target
    const targetDir = getTargetDir(name, options.global);

    // Check if already installed
    if (existsSync(targetDir) && !options.force) {
      printWarning(`Skill "${name}" is already installed at:\n  ${targetDir}`);
      console.log('  Use --force to overwrite.');
      continue;
    }

    // Create target directory and copy
    try {
      mkdirSync(targetDir, { recursive: true });
      cpSync(sourceDir, targetDir, { recursive: true });

      printSuccess(`Skill "${name}" installed successfully!`);
      console.log(`    📍 Location: ${targetDir}`);
      console.log(`    📦 Version:  ${skill.version}\n`);
      successCount++;
    } catch (err) {
      printError(`Failed to install skill "${name}": ${err.message}`);
      hasError = true;
    }
  }

  console.log(`  Done: ${successCount} of ${names.length} skill(s) installed.`);

  if (hasError) {
    process.exit(1);
  }
}
