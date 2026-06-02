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

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } from 'fs';
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
  
  let names = skillNames;
  if (!names || (Array.isArray(names) && names.length === 0)) {
    names = [];
  } else if (!Array.isArray(names)) {
    names = [names];
  }

  const catalog = loadCatalog();

  // If no skill names provided, attempt to load them from package.json in the current working directory
  if (names.length === 0) {
    const localPkgPath = join(process.cwd(), 'package.json');
    if (existsSync(localPkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(localPkgPath, 'utf8'));
        const skillsToInstall = pkg.antigravity?.skills || {};
        const skillEntries = Object.keys(skillsToInstall);
        if (skillEntries.length > 0) {
          names = skillEntries.map((n) => `${n}@${skillsToInstall[n]}`);
          printInfo(`Found ${names.length} skill(s) defined in package.json. Installing...`);
        } else {
          printError('No skills found in package.json under "antigravity.skills".');
          process.exit(1);
        }
      } catch (err) {
        printError(`Failed to read or parse local package.json: ${err.message}`);
        process.exit(1);
      }
    } else {
      printError('No skill names provided, and no local package.json found.');
      process.exit(1);
    }
  }

  const clients = resolveClients(options);
  const scope = options.global ? 'global' : 'workspace';
  const clientLabels = clients.map((c) => CLIENTS[c].name).join(' + ');
  
  console.log(`  Installing ${names.length} skill(s) to ${scope} for ${clientLabels}...\n`);

  let hasError = false;
  let successCount = 0;
  const installedSkills = new Map(); // name -> version

  for (const rawName of names) {
    // Parse name and version if specified (format: name@version)
    const atIndex = rawName.lastIndexOf('@');
    let name = rawName;
    let requestedVersion = null;
    if (atIndex > 0) {
      name = rawName.slice(0, atIndex);
      requestedVersion = rawName.slice(atIndex + 1);
      // Strip range characters like ^ or ~ if present for lookup
      requestedVersion = requestedVersion.replace(/^[~^]/, '');
    }

    const formattedName = formatSkillName(name);
    const skill = catalog.skills.find((s) => s.name === formattedName);

    if (!skill) {
      printError(`Skill "${formattedName}" not found in the registry.`);
      hasError = true;
      continue;
    }

    if (requestedVersion && skill.version !== requestedVersion) {
      printWarning(`Requested version ${requestedVersion} for "${formattedName}", but only version ${skill.version} is available in this registry.`);
      console.log(`    Installing version ${skill.version} instead.`);
    }

    // Check source directory exists
    const sourceDir = join(REGISTRY_ROOT, formattedName);
    if (!existsSync(sourceDir)) {
      printError(`Skill directory not found for "${formattedName}": ${sourceDir}`);
      hasError = true;
      continue;
    }

    // Install for each target client
    for (const client of clients) {
      const clientConfig = CLIENTS[client];
      const targetDir = getTargetDir(formattedName, client, options.global);

      // Check if already installed
      if (existsSync(targetDir) && !options.force) {
        printWarning(`Skill "${formattedName}" is already installed for ${clientConfig.name} at:\n  ${targetDir}`);
        console.log('  Use --force to overwrite.');
        continue;
      }

      // Skip if source and target are the same (running from inside the registry)
      if (resolve(sourceDir) === resolve(targetDir)) {
        printWarning(`Skill "${formattedName}" source and target are the same for ${clientConfig.name}. Skipping.`);
        continue;
      }

      // Create target directory and copy
      try {
        mkdirSync(targetDir, { recursive: true });
        cpSync(sourceDir, targetDir, { recursive: true });

        printSuccess(`Skill "${formattedName}" installed for ${clientConfig.name}!`);
        console.log(`    📍 Location: ${targetDir}`);
        console.log(`    📦 Version:  ${skill.version}`);
        console.log(`    🎯 Client:   ${clientConfig.name}\n`);
        successCount++;
        installedSkills.set(formattedName, skill.version);
      } catch (err) {
        printError(`Failed to install skill "${formattedName}" for ${clientConfig.name}: ${err.message}`);
        hasError = true;
      }
    }
  }

  // Save successfully installed local workspace skills to package.json
  if (installedSkills.size > 0 && !options.global && options.save !== false) {
    const localPkgPath = join(process.cwd(), 'package.json');
    if (existsSync(localPkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(localPkgPath, 'utf8'));
        pkg.antigravity = pkg.antigravity || {};
        pkg.antigravity.skills = pkg.antigravity.skills || {};
        
        for (const [sName, sVersion] of installedSkills.entries()) {
          pkg.antigravity.skills[sName] = `^${sVersion}`;
        }

        // Configure scripts.postinstall to run antigravity install
        pkg.scripts = pkg.scripts || {};
        if (!pkg.scripts.postinstall) {
          pkg.scripts.postinstall = 'antigravity install';
        } else if (!pkg.scripts.postinstall.includes('antigravity')) {
          pkg.scripts.postinstall += ' && antigravity install';
        }
        
        writeFileSync(localPkgPath, JSON.stringify(pkg, null, 2) + '\n');
        printInfo(`Updated package.json with installed skill(s) and configured postinstall script.`);
      } catch (err) {
        printWarning(`Could not update package.json: ${err.message}`);
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
