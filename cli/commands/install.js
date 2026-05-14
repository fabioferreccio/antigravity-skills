/**
 * Install Command
 *
 * Copies a skill from the registry to the target location.
 * Supports workspace-local and global installation for both
 * Antigravity (Google) and Claude Code (Anthropic) clients.
 *
 * Target paths:
 *   Antigravity workspace:  ./.agents/skills/<name>/
 *   Antigravity global:     ~/.gemini/antigravity/skills/<name>/
 *   Claude Code workspace:  ./.claude/skills/<name>/
 *   Claude Code global:     ~/.claude/skills/<name>/
 */

import { existsSync, mkdirSync, cpSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadCatalog, formatSkillName, printBanner, printSuccess, printError, printWarning, printInfo } from '../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REGISTRY_ROOT = resolve(__dirname, '..', '..', '.agents', 'skills');

/**
 * Supported client configurations.
 * Each client defines its workspace and global installation paths.
 */
const CLIENTS = {
  antigravity: {
    name: 'Antigravity',
    workspacePath: (skillName) => join(process.cwd(), '.agents', 'skills', skillName),
    globalPath: (skillName) => join(homedir(), '.gemini', 'antigravity', 'skills', skillName),
  },
  claude: {
    name: 'Claude Code',
    workspacePath: (skillName) => join(process.cwd(), '.claude', 'skills', skillName),
    globalPath: (skillName) => join(homedir(), '.claude', 'skills', skillName),
  },
};

/**
 * Resolves the target installation directory based on client and scope.
 *
 * @param {string} skillName - The skill name
 * @param {string} client - The client key ('antigravity' or 'claude')
 * @param {boolean} isGlobal - Whether to install globally
 * @returns {string} The resolved target directory path
 */
function getTargetDir(skillName, client, isGlobal) {
  const config = CLIENTS[client];
  if (!config) {
    throw new Error(`Unknown client: "${client}". Supported clients: ${Object.keys(CLIENTS).join(', ')}`);
  }
  return isGlobal ? config.globalPath(skillName) : config.workspacePath(skillName);
}

/**
 * Resolves which clients to install for based on options.
 *
 * @param {object} options - Command options
 * @returns {string[]} Array of client keys to install for
 */
function resolveClients(options) {
  const clients = [];

  if (options.claude) {
    clients.push('claude');
  }

  // Default to antigravity if no specific client flag was provided,
  // or if --all-clients is set, or if antigravity is explicitly requested
  if (options.allClients) {
    return Object.keys(CLIENTS);
  }

  if (clients.length === 0) {
    clients.push('antigravity');
  }

  return clients;
}

/**
 * Install a skill from the registry.
 *
 * @param {string|string[]} skillNames - Skill name(s) to install
 * @param {object} options - Installation options
 * @param {boolean} [options.global] - Install to global directory
 * @param {boolean} [options.force] - Overwrite existing installations
 * @param {boolean} [options.claude] - Install for Claude Code client
 * @param {boolean} [options.allClients] - Install for all supported clients
 */
export async function install(skillNames, options = {}) {
  printBanner();
  
  const names = Array.isArray(skillNames) ? skillNames : [skillNames];
  
  if (names.length === 0) {
    printError('No skill names provided.');
    process.exit(1);
  }

  const catalog = loadCatalog();
  const clients = resolveClients(options);
  const scope = options.global ? 'global' : 'workspace';
  const clientLabels = clients.map((c) => CLIENTS[c].name).join(' + ');
  
  console.log(`  Installing ${names.length} skill(s) to ${scope} for ${clientLabels}...\n`);

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

    // Install for each target client
    for (const client of clients) {
      const clientConfig = CLIENTS[client];
      const targetDir = getTargetDir(name, client, options.global);

      // Check if already installed
      if (existsSync(targetDir) && !options.force) {
        printWarning(`Skill "${name}" is already installed for ${clientConfig.name} at:\n  ${targetDir}`);
        console.log('  Use --force to overwrite.');
        continue;
      }

      // Skip if source and target are the same (running from inside the registry)
      if (resolve(sourceDir) === resolve(targetDir)) {
        printWarning(`Skill "${name}" source and target are the same for ${clientConfig.name}. Skipping.`);
        continue;
      }

      // Create target directory and copy
      try {
        mkdirSync(targetDir, { recursive: true });
        cpSync(sourceDir, targetDir, { recursive: true });

        printSuccess(`Skill "${name}" installed for ${clientConfig.name}!`);
        console.log(`    📍 Location: ${targetDir}`);
        console.log(`    📦 Version:  ${skill.version}`);
        console.log(`    🎯 Client:   ${clientConfig.name}\n`);
        successCount++;
      } catch (err) {
        printError(`Failed to install skill "${name}" for ${clientConfig.name}: ${err.message}`);
        hasError = true;
      }
    }
  }

  const totalExpected = names.length * clients.length;
  console.log(`  Done: ${successCount} of ${totalExpected} installation(s) completed.`);

  if (clients.length > 1) {
    printInfo('Skills installed for multiple clients. Each client reads from its own directory.');
  }

  if (hasError) {
    process.exit(1);
  }
}
