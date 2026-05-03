#!/usr/bin/env node
/**
 * Generates release notes from CHANGELOG.md for a given tag.
 * Usage: node scripts/generate-release-notes.js v1.0.0
 */
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const tag = process.argv[2] || 'v1.0.0';
const version = tag.replace(/^v/, '');

const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
const regex = new RegExp(`## \\[${version.replace(/\./g, '\\.')}\\].*?\\n([\\s\\S]*?)(?=## \\[|$)`);
const match = changelog.match(regex);

if (match) {
  console.log(`# Release ${tag}\n\n${match[1].trim()}`);
} else {
  console.log(`# Release ${tag}\n\nNo changelog entry found for version ${version}.`);
}
