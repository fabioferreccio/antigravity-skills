/**
 * List Command
 *
 * Lists all available skills in the registry catalog.
 */

import { loadCatalog, printBanner } from '../utils/helpers.js';

/**
 * List all available skills.
 */
export async function list(options = {}) {
  printBanner();
  const catalog = loadCatalog();

  if (options.json) {
    console.log(JSON.stringify(catalog, null, 2));
    return;
  }

  if (catalog.skills.length === 0) {
    console.log('\n  No skills found in the registry.\n');
    return;
  }

  if (options.tags) {
    // Group by tags
    const tagMap = new Map();
    catalog.skills.forEach((skill) => {
      skill.tags.forEach((tag) => {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push(skill);
      });
    });

    console.log(`\n  📦 Skills Registry (${catalog.total_skills} skills, grouped by tag):\n`);

    for (const [tag, skills] of [...tagMap.entries()].sort()) {
      console.log(`  🏷️  ${tag}`);
      skills.forEach((s) => {
        console.log(`     • ${s.name} (v${s.version})`);
      });
      console.log('');
    }
  } else {
    console.log(`\n  📦 Skills Registry (${catalog.total_skills} skills):\n`);

    const nameWidth = Math.max(...catalog.skills.map((s) => s.name.length), 4) + 2;
    const verWidth = 8;
    const scopeWidth = 10;

    console.log(
      `  ${'Name'.padEnd(nameWidth)} ${'Version'.padEnd(verWidth)} ${'Scope'.padEnd(scopeWidth)} Tags`
    );
    console.log(
      `  ${'─'.repeat(nameWidth)} ${'─'.repeat(verWidth)} ${'─'.repeat(scopeWidth)} ${'─'.repeat(30)}`
    );

    catalog.skills.forEach((skill) => {
      console.log(
        `  ${skill.name.padEnd(nameWidth)} ${('v' + skill.version).padEnd(verWidth)} ${(skill.scope || 'workspace').padEnd(scopeWidth)} ${skill.tags.join(', ')}`
      );
    });
  }

  console.log(`\n  Use \`antigravity info <name>\` for details.`);
  console.log(`  Use \`antigravity install <name>\` to install.\n`);
}
