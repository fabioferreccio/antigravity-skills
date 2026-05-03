/**
 * Update Command
 *
 * Checks installed skills against the registry catalog
 * and updates them to the latest version.
 */

import { existsSync, readFileSync, cpSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadCatalog, printBanner, printSuccess, printWarning, printError } from '../utils/helpers.js';

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
 * Get all installed skill directories.
 */
function getInstalledSkills() {
  const locations = [
    join(process.cwd(), '.agents', 'skills'),
    join(homedir(), '.gemini', 'antigravity', 'skills'),
  ];

  const installed = [];

  for (const loc of locations) {
    if (!existsSync(loc)) continue;
    const { readdirSync } = await import('fs');
    const entries = readdirSync(loc, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const version = getInstalledVersion(join(loc, entry.name));
        installed.push({
          name: entry.name,
          version,
          path: join(loc, entry.name),
          scope: loc.includes('.gemini') ? 'global' : 'workspace',
        });
      }
    }
  }

  return installed;
}

/**
 * Update installed skills.
 */
export async function update(options = {}) {
  printBanner();
  const catalog = loadCatalog();

  console.log('\n  🔄 Checking for updates...\n');

  const { readdirSync } = await import('fs');
  const locations = [
    { dir: join(process.cwd(), '.agents', 'skills'), scope: 'workspace' },
    { dir: join(homedir(), '.gemini', 'antigravity', 'skills'), scope: 'global' },
  ];

  let updatesFound = 0;

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
          } catch (err) {
            printError(`  ❌ Failed to update ${entry.name}: ${err.message}`);
          }
        }
      }
    }
  }

  if (updatesFound === 0) {
    console.log('  ✅ All installed skills are up to date.\n');
  } else if (!options.all && !options.name) {
    console.log(`\n  Run \`antigravity update --all\` to apply all updates.\n`);
  }
}
