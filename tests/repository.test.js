/**
 * Repository-level tests for the validation and catalog sync scripts.
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync, mkdtempSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

describe('Validation & Catalog Scripts - Isolated Fixtures', () => {
  let tempRoot;
  let env;

  const runScript = (script, additionalArgs = '') => {
    return execSync(`node "scripts/${script}" ${additionalArgs}`, { 
      cwd: ROOT, 
      encoding: 'utf8', 
      env 
    });
  };

  const runScriptExpectingError = (script, additionalArgs = '') => {
    try {
      execSync(`node "scripts/${script}" ${additionalArgs}`, { 
        cwd: ROOT, 
        encoding: 'utf8', 
        env,
        stdio: 'pipe'
      });
      assert.fail('Should have failed');
    } catch (err) {
      if (err.name === 'AssertionError') throw err;
      return err.stdout + err.stderr;
    }
  };

  before(() => {
    // Create temporary fixtures
    tempRoot = mkdtempSync(join(tmpdir(), 'repo-test-'));
    const skillsDir = join(tempRoot, '.agents', 'skills');
    const catalogPath = join(tempRoot, '.agents', 'catalog.json');
    mkdirSync(skillsDir, { recursive: true });

    env = { 
      ...process.env, 
      ANTIGRAVITY_SKILLS_ROOT: skillsDir,
      ANTIGRAVITY_CATALOG_PATH: catalogPath
    };

    // 1. Valid skill
    const validSkill = join(skillsDir, 'valid-skill');
    mkdirSync(join(validSkill, 'examples'), { recursive: true });
    mkdirSync(join(validSkill, 'tests'), { recursive: true });
    writeFileSync(join(validSkill, 'examples', 'example.txt'), 'test');
    writeFileSync(join(validSkill, 'tests', 'test.txt'), 'test');
    writeFileSync(join(validSkill, 'README.md'), '# Valid Skill');
    writeFileSync(join(validSkill, 'SKILL.md'), `---\nname: valid-skill\ndescription: A valid skill\nversion: 1.0.0\nauthor: Test\ntags:\n  - test\n---\nValid`);

    // 2. Malformed Frontmatter skill
    const malformedSkill = join(skillsDir, 'malformed-skill');
    mkdirSync(join(malformedSkill, 'examples'), { recursive: true });
    mkdirSync(join(malformedSkill, 'tests'), { recursive: true });
    writeFileSync(join(malformedSkill, 'examples', 'example.txt'), 'test');
    writeFileSync(join(malformedSkill, 'tests', 'test.txt'), 'test');
    writeFileSync(join(malformedSkill, 'README.md'), '# Malformed');
    writeFileSync(join(malformedSkill, 'SKILL.md'), `This file has no frontmatter.`);

    // 3. Missing files skill
    const missingFilesSkill = join(skillsDir, 'missing-skill');
    mkdirSync(missingFilesSkill, { recursive: true });
    writeFileSync(join(missingFilesSkill, 'SKILL.md'), `---\nname: missing-skill\ndescription: missing\nversion: 1.0.0\nauthor: Test\ntags:\n  - test\n---\nMissing`);
  });

  after(() => {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  describe('Validation Script', () => {
    it('should fail validation when files are missing', () => {
      const output = runScriptExpectingError('validate.js');
      assert.match(output, /missing-skill\/README.md is MISSING/);
      assert.match(output, /missing-skill\/examples\/ is MISSING/);
    });

    it('should fail validation when frontmatter is invalid', () => {
      const output = runScriptExpectingError('validate.js', '--frontmatter');
      assert.match(output, /malformed-skill\/SKILL.md has NO valid YAML frontmatter/);
    });

    it('should pass structure validation for valid skills', () => {
      const output = runScriptExpectingError('validate.js', '--structure');
      assert.match(output, /valid-skill\/SKILL.md exists/);
      assert.match(output, /valid-skill\/examples\/ exists and is not empty/);
    });
  });

  describe('Catalog Sync Script', () => {
    it('should generate a valid catalog.json skipping malformed ones', () => {
      runScript('sync-catalog.js');
      const catalogPath = join(tempRoot, '.agents', 'catalog.json');
      assert.ok(existsSync(catalogPath), 'catalog.json should exist');

      const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
      assert.ok(catalog.skills, 'catalog should have skills array');
      // valid-skill and missing-skill have valid frontmatter
      assert.strictEqual(catalog.skills.length, 2, 'Should index 2 valid frontmatters');
      assert.ok(catalog.skills.find(s => s.name === 'valid-skill'));
      assert.ok(catalog.skills.find(s => s.name === 'missing-skill'));
    });
  });

  describe('Empty State', () => {
    it('should fail validate if skills directory is empty', () => {
      const emptyDir = mkdtempSync(join(tmpdir(), 'empty-'));
      const emptyEnv = { ...env, ANTIGRAVITY_SKILLS_ROOT: emptyDir };
      try {
        execSync(`node "scripts/validate.js"`, { cwd: ROOT, encoding: 'utf8', env: emptyEnv, stdio: 'pipe' });
        assert.fail('Should have failed');
      } catch (err) {
        if (err.name === 'AssertionError') throw err;
        assert.match(err.stdout + err.stderr, /No skill directories found/);
      }
      rmSync(emptyDir, { recursive: true, force: true });
    });
  });
});
