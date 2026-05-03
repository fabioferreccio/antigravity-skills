/**
 * Search Command
 *
 * Searches the catalog for skills matching a query string
 * against name, description, and tags.
 */

import { loadCatalog, printBanner, printWarning } from '../utils/helpers.js';

/**
 * Search for skills by query.
 */
export async function search(query) {
  printBanner();
  const catalog = loadCatalog();
  const q = query.toLowerCase();

  const results = catalog.skills.filter((skill) => {
    const nameMatch = skill.name.toLowerCase().includes(q);
    const descMatch = skill.description.toLowerCase().includes(q);
    const tagMatch = skill.tags.some((t) => t.toLowerCase().includes(q));
    return nameMatch || descMatch || tagMatch;
  });

  if (results.length === 0) {
    printWarning(`No skills found matching "${query}".`);
    console.log('\n  Try a different search term or use `antigravity list` to see all skills.');
    return;
  }

  console.log(`\n  🔍 Found ${results.length} skill(s) matching "${query}":\n`);

  const nameWidth = Math.max(...results.map((s) => s.name.length), 4) + 2;
  const verWidth = 8;

  console.log(
    `  ${'Name'.padEnd(nameWidth)} ${'Version'.padEnd(verWidth)} Description`
  );
  console.log(`  ${'─'.repeat(nameWidth)} ${'─'.repeat(verWidth)} ${'─'.repeat(50)}`);

  results.forEach((skill) => {
    const desc =
      skill.description.length > 50
        ? skill.description.substring(0, 47) + '...'
        : skill.description;
    console.log(
      `  ${skill.name.padEnd(nameWidth)} ${('v' + skill.version).padEnd(verWidth)} ${desc}`
    );
  });

  console.log(`\n  Use \`antigravity info <name>\` for details.`);
  console.log(`  Use \`antigravity install <name>\` to install.\n`);
}
