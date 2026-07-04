/**
 * Update Command
 *
 * Checks installed skills against the registry catalog
 * and updates them to the latest version.
 */

import { existsSync, readFileSync, cpSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadCatalog, printBanner, printSuccess, printWarning, printError } from '../utils/helpers.js';
import { CLIENTS, getTargetDir } from './install.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REGISTRY_ROOT = resolve(__dirname, '..', '..', '.agents', 'skills');

/**
 * Extract version from a SKILL.md frontmatter.
 */
function getInstalledVersion(skillDir) {
  const skillMd = join(skillDir, 'SKILL.md');
  if (!existsSync(skillMd)) return null;

  const content = readFileSync(skillMd, 'utf8');
  const match = content.match(/^version:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Get all installed skill directories dynamically from supported clients.
 */
function getLocations() {
  const locations = [];
  for (const client of Object.keys(CLIENTS)) {
    // We pass a dummy formattedName '' and resolve its parent directory
    locations.push({
      dir: resolve(getTargetDir('', client, false), '..'),
      scope: 'workspace',
      client: CLIENTS[client].name
    });
    locations.push({
      dir: resolve(getTargetDir('', client, true), '..'),
      scope: 'global',
      client: CLIENTS[client].name
    });
  }
  return locations;
}

/**
 * Update installed skills.
 */
export async function update(options = {}) {
  printBanner();
  const catalog = loadCatalog();

  console.log('\n  🔄 Checking for updates...\n');

  const { readdirSync } = await import('fs');
  const locations = getLocations();

  let updatesFound = 0;
  const updatedSkills = new Map(); // name -> version

  for (const { dir, scope } of locations) {
    if (!existsSync(dir)) continue;

    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      if (options.name && entry.name !== options.name) continue;

      const installedVersion = getInstalledVersion(join(dir, entry.name));
      const catalogEntry = catalog.skills.find((s) => s.name === entry.name);

      if (!catalogEntry) continue;

      if (installedVersion !== catalogEntry.version) {
        updatesFound++;
        console.log(
          `  📦 ${entry.name}: ${installedVersion || '?'} → ${catalogEntry.version} (${scope})`
        );

        if (options.all || options.name) {
          const sourceDir = join(REGISTRY_ROOT, entry.name);
          const targetDir = join(dir, entry.name);

          try {
            cpSync(sourceDir, targetDir, { recursive: true });
            printSuccess(`  ✅ Updated ${entry.name} to v${catalogEntry.version}`);
            
            if (scope === 'workspace') {
              updatedSkills.set(entry.name, catalogEntry.version);
            }
          } catch (err) {
            printError(`  ❌ Failed to update ${entry.name}: ${err.message}`);
          }
        }
      }
    }
  }

  // Save updated local workspace skills to package.json
  if (updatedSkills.size > 0) {
    const localPkgPath = join(process.cwd(), 'package.json');
    if (existsSync(localPkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(localPkgPath, 'utf8'));
        pkg.antigravity = pkg.antigravity || {};
        pkg.antigravity.skills = pkg.antigravity.skills || {};
        
        for (const [sName, sVersion] of updatedSkills.entries()) {
          pkg.antigravity.skills[sName] = `^${sVersion}`;
        }
        
        writeFileSync(localPkgPath, JSON.stringify(pkg, null, 2) + '\n');
        console.log(`  ℹ️  Updated package.json with new skill version(s).\n`);
      } catch (err) {
        printWarning(`  ⚠️  Could not update package.json: ${err.message}`);
      }
    }
  }

  if (updatesFound === 0) {
    console.log('  ✅ All installed skills are up to date.\n');
  } else if (!options.all && !options.name) {
    console.log(`\n  Run \`antigravity update --all\` to apply all updates.\n`);
  }
}
