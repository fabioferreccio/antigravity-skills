#!/usr/bin/env node

/**
 * Antigravity Skills CLI
 *
 * A command-line tool for discovering, installing, and managing
 * Antigravity Skills from the public registry.
 *
 * Usage:
 *   npx antigravity install <skill-name>
 *   npx antigravity install <skill-name> --global
 *   npx antigravity search <query>
 *   npx antigravity list
 *   npx antigravity update
 *   npx antigravity doctor
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const program = new Command();

program
  .name('antigravity')
  .description('🚀 Antigravity Skills — Discover, install, and manage AI agent skills')
  .version(pkg.version);

// ─── Install Command ──────────────────────────────────────────────
program
  .command('install <skill-names...>')
  .alias('i')
  .description('Install one or more skills from the registry')
  .option('-g, --global', 'Install to global skills directory (~/.gemini/antigravity/skills/)')
  .option('-f, --force', 'Overwrite existing skill if present')
  .action(async (skillNames, options) => {
    const { install } = await import('./commands/install.js');
    await install(skillNames, options);
  });

// ─── Search Command ───────────────────────────────────────────────
program
  .command('search <query>')
  .alias('s')
  .description('Search for skills by name, tag, or description')
  .action(async (query) => {
    const { search } = await import('./commands/search.js');
    await search(query);
  });

// ─── List Command ─────────────────────────────────────────────────
program
  .command('list')
  .alias('ls')
  .description('List all available skills in the registry')
  .option('-t, --tags', 'Group by tags')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    const { list } = await import('./commands/list.js');
    await list(options);
  });

// ─── Update Command ──────────────────────────────────────────────
program
  .command('update')
  .alias('u')
  .description('Check for and apply skill updates')
  .option('-a, --all', 'Update all installed skills')
  .option('-n, --name <skill-name>', 'Update a specific skill')
  .action(async (options) => {
    const { update } = await import('./commands/update.js');
    await update(options);
  });

// ─── Doctor Command ──────────────────────────────────────────────
program
  .command('doctor')
  .description('Diagnose installation and configuration issues')
  .action(async () => {
    const { doctor } = await import('./commands/doctor.js');
    await doctor();
  });

// ─── Info Command ────────────────────────────────────────────────
program
  .command('info <skill-name>')
  .description('Show detailed information about a skill')
  .action(async (skillName) => {
    const { info } = await import('./commands/info.js');
    await info(skillName);
  });

program.parse();
