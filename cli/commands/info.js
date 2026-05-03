/**
 * Info Command
 *
 * Displays detailed information about a specific skill
 * from the registry catalog.
 */

import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadCatalog, printBanner, printError } from '../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REGISTRY_ROOT = resolve(__dirname, '..', '..', '.agents', 'skills');

/**
 * Show detailed info about a skill.
 */
export async function info(skillName) {
  printBanner();
  const catalog = loadCatalog();
  const skill = catalog.skills.find((s) => s.name === skillName);

  if (!skill) {
    printError(`Skill "${skillName}" not found in the registry.`);
    process.exit(1);
  }

  console.log(`\n  📦 ${skill.name} v${skill.version}\n`);
  console.log(`  ${'─'.repeat(60)}\n`);
  console.log(`  📝 Description:`);
  console.log(`     ${skill.description}\n`);
  console.log(`  👤 Author:  ${skill.author}`);
  console.log(`  🎯 Scope:   ${skill.scope || 'workspace'}`);
  console.log(`  📂 Path:    ${skill.path}`);
  console.log(`  🏷️  Tags:    ${skill.tags.join(', ')}`);

  if (skill.security) {
    console.log(`\n  🔐 Security:`);
    console.log(`     Filesystem: ${skill.security.filesystem || 'none'}`);
    console.log(`     Terminal:   ${skill.security.terminal || 'none'}`);
    console.log(`     Network:    ${skill.security.network || false}`);
  }

  // Try to read README
  const readmePath = join(REGISTRY_ROOT, skill.name, 'README.md');
  if (existsSync(readmePath)) {
    const readme = readFileSync(readmePath, 'utf8');
    const firstSection = readme.split('\n## ').slice(0, 2).join('\n## ');
    console.log(`\n  📖 README Preview:`);
    console.log(`  ${'─'.repeat(60)}`);
    firstSection.split('\n').forEach((line) => {
      console.log(`  ${line}`);
    });
  }

  console.log(`\n  ${'─'.repeat(60)}`);
  console.log(`\n  Install: npx antigravity install ${skill.name}`);
  console.log(`  Global:  npx antigravity install ${skill.name} --global\n`);
}
