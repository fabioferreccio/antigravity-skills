/**
 * Repository-level tests for the validation and catalog sync scripts.
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

describe('Validation Script', () => {
  it('should pass validation for the repository', () => {
    const result = execSync('node scripts/validate.js', { cwd: ROOT, encoding: 'utf8' });
    assert.ok(result.includes('Validation PASSED'), 'Validation should pass');
  });

  it('should detect structure issues', () => {
    const result = execSync('node scripts/validate.js --structure', { cwd: ROOT, encoding: 'utf8' });
    assert.ok(result.includes('PASS'), 'Structure checks should have passes');
  });

  it('should detect frontmatter issues', () => {
    const result = execSync('node scripts/validate.js --frontmatter', { cwd: ROOT, encoding: 'utf8' });
    assert.ok(result.includes('PASS'), 'Frontmatter checks should have passes');
  });
});

describe('Catalog Sync', () => {
  it('should generate a valid catalog.json', () => {
    execSync('node scripts/sync-catalog.js', { cwd: ROOT, encoding: 'utf8' });
    const catalogPath = join(ROOT, '.agents', 'catalog.json');
    assert.ok(existsSync(catalogPath), 'catalog.json should exist');

    const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
    assert.ok(catalog.skills, 'catalog should have skills array');
    assert.ok(catalog.total_skills >= 2, 'catalog should have at least 2 skills');
    assert.ok(catalog.version, 'catalog should have a version');
  });
});

describe('Skill Structure', () => {
  const skillsDir = join(ROOT, '.agents', 'skills');

  for (const skill of ['repository-maintainer', 'skill-creator']) {
    it(`${skill} should have all required files`, () => {
      const dir = join(skillsDir, skill);
      assert.ok(existsSync(join(dir, 'SKILL.md')), `${skill}/SKILL.md should exist`);
      assert.ok(existsSync(join(dir, 'README.md')), `${skill}/README.md should exist`);
      assert.ok(existsSync(join(dir, 'examples')), `${skill}/examples/ should exist`);
      assert.ok(existsSync(join(dir, 'tests')), `${skill}/tests/ should exist`);
    });
  }
});
