/**
 * Doctor Command
 *
 * Diagnoses the Antigravity installation and reports
 * configuration issues, missing directories, and version mismatches.
 */

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { printBanner, loadCatalog } from '../utils/helpers.js';

/**
 * Run diagnostic checks.
 */
export async function doctor() {
  printBanner();
  console.log('\n  🩺 Antigravity Doctor — Diagnosing your installation...\n');

  const checks = [];
  let passed = 0;
  let failed = 0;
  let warned = 0;

  // ─── Check 1: Node.js version ──────────────────────────────────
  const nodeVersion = process.versions.node;
  const [major] = nodeVersion.split('.').map(Number);
  if (major >= 18) {
    checks.push({ name: 'Node.js version', status: '🟢 Pass', detail: `v${nodeVersion}` });
    passed++;
  } else {
    checks.push({ name: 'Node.js version', status: '🔴 Fail', detail: `v${nodeVersion} (requires >=18)` });
    failed++;
  }

  // ─── Check 2: Workspace skills directory ──────────────────────
  const workspaceSkills = join(process.cwd(), '.agents', 'skills');
  if (existsSync(workspaceSkills)) {
    const count = readdirSync(workspaceSkills, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
    checks.push({ name: 'Workspace skills dir', status: '🟢 Pass', detail: `${workspaceSkills} (${count} skills)` });
    passed++;
  } else {
    checks.push({ name: 'Workspace skills dir', status: '🟡 Warning', detail: `Not found: ${workspaceSkills}` });
    warned++;
  }

  // ─── Check 3: Global skills directory ─────────────────────────
  const globalSkills = join(homedir(), '.gemini', 'antigravity', 'skills');
  if (existsSync(globalSkills)) {
    const count = readdirSync(globalSkills, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
    checks.push({ name: 'Global skills dir', status: '🟢 Pass', detail: `${globalSkills} (${count} skills)` });
    passed++;
  } else {
    checks.push({ name: 'Global skills dir', status: '🟡 Warning', detail: `Not found: ${globalSkills}` });
    warned++;
  }

  // ─── Check 4: Catalog file ────────────────────────────────────
  try {
    const catalog = loadCatalog();
    checks.push({ name: 'Catalog file', status: '🟢 Pass', detail: `${catalog.total_skills} skills indexed` });
    passed++;
  } catch {
    checks.push({ name: 'Catalog file', status: '🔴 Fail', detail: 'catalog.json not found or invalid' });
    failed++;
  }

  // ─── Check 5: Package version ─────────────────────────────────
  try {
    const { readFileSync } = await import('fs');
    const { fileURLToPath } = await import('url');
    const { dirname } = await import('path');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
    checks.push({ name: 'Package version', status: '🟢 Pass', detail: `v${pkg.version}` });
    passed++;
  } catch {
    checks.push({ name: 'Package version', status: '🔴 Fail', detail: 'package.json not found' });
    failed++;
  }

  // ─── Output Results ───────────────────────────────────────────
  const nameWidth = Math.max(...checks.map((c) => c.name.length)) + 2;
  const statusWidth = 12;

  console.log(`  ${'Check'.padEnd(nameWidth)} ${'Status'.padEnd(statusWidth)} Details`);
  console.log(`  ${'─'.repeat(nameWidth)} ${'─'.repeat(statusWidth)} ${'─'.repeat(50)}`);

  checks.forEach((c) => {
    console.log(`  ${c.name.padEnd(nameWidth)} ${c.status.padEnd(statusWidth)} ${c.detail}`);
  });

  console.log('');
  console.log(`  ✅ Passed: ${passed}  ⚠️ Warnings: ${warned}  ❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n  Some checks failed. Please fix the issues above.');
    process.exit(1);
  } else if (warned > 0) {
    console.log('\n  Some warnings detected. These are optional but recommended.');
  } else {
    console.log('\n  Everything looks great! Your installation is healthy. 🚀');
  }
  console.log('');
}
