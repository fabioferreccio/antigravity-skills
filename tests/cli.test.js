/**
 * Integration tests for the CLI commands.
 */
import { execSync } from 'child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { tmpdir } from 'os';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const CLI_ENTRY = join(ROOT, 'cli', 'index.js');

describe('CLI Commands', () => {
  let tempDir;
  let env;

  const runCLI = (command, additionalOpts = {}) => {
    return execSync(`node "${CLI_ENTRY}" ${command}`, { 
      encoding: 'utf8', 
      cwd: ROOT, 
      env,
      ...additionalOpts
    });
  };

  const runCLIExpectingError = (command) => {
    try {
      execSync(`node "${CLI_ENTRY}" ${command}`, { 
        encoding: 'utf8', 
        cwd: ROOT, 
        env,
        stdio: 'pipe'
      });
      assert.fail('Should have failed');
    } catch (err) {
      if (err.name === 'AssertionError') throw err;
      assert.strictEqual(err.status, 1, 'Process should exit with status 1 on failure');
      return err.stdout + err.stderr;
    }
  };

  before(() => {
    // Create a temporary sandbox directory
    tempDir = mkdtempSync(join(tmpdir(), 'antigravity-cli-test-'));
    
    // Setup a dummy package.json to test local installation hooks without breaking real things
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({
      name: "test-workspace"
    }));

    env = { 
      ...process.env, 
      USERPROFILE: tempDir, // Mock Windows homedir
      HOME: tempDir         // Mock POSIX homedir
    };
  });

  after(() => {
    // Cleanup sandbox
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('list command should display skills', () => {
    const result = runCLI('list');
    assert.match(result, /clean-architecture/, 'List should output clean-architecture');
    assert.match(result, /repository-maintainer/, 'List should output repository-maintainer');
  });

  it('search command should find matching skills', () => {
    const result = runCLI('search clean');
    assert.match(result, /clean-architecture/, 'Search for "clean" should find clean-architecture');
  });

  it('info command should display skill details', () => {
    const result = runCLI('info clean-architecture');
    assert.match(result, /clean-architecture/, 'Info should display skill name');
    assert.match(result, /Security:/, 'Info should display security sections');
  });

  it('info command should gracefully fail for non-existent skill', () => {
    const output = runCLIExpectingError('info non-existent-skill-1234');
    assert.match(output, /not found/i, 'CLI should inform user that skill was not found gracefully');
  });

  it('doctor command should run health checks', () => {
    const result = runCLI('doctor');
    assert.match(result, /Antigravity Doctor/, 'Doctor should output a report');
  });

  it('install command with "all" should install globally for all clients', () => {
    // Install all skills globally and for all clients
    const result = runCLI('install all --global --all-clients', { cwd: tempDir });

    assert.match(result, /Flag 'all' detected/, 'Should recognize "all" flag');
    assert.match(result, /Antigravity/, 'Should mention Antigravity client');
    assert.match(result, /Claude Code/, 'Should mention Claude Code client');

    // Verify paths were created in the mocked homedir (tempDir)
    const antigravityGlobalPath = join(tempDir, '.gemini', 'antigravity', 'skills', 'clean-architecture', 'SKILL.md');
    const claudeGlobalPath = join(tempDir, '.claude', 'skills', 'clean-architecture', 'SKILL.md');
    
    assert.ok(existsSync(antigravityGlobalPath), 'Skill should be installed in global antigravity path');
    assert.ok(existsSync(claudeGlobalPath), 'Skill should be installed in global claude path');
  });

  it('update command should check and update globally installed skills', () => {
    // Overwrite the SKILL.md of one of the globally installed skills in the sandbox
    const skillPath = join(tempDir, '.gemini', 'antigravity', 'skills', 'clean-architecture', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    
    try {
      const newContent = content.replace(/version:\s*([^\s]+)/, 'version: 0.0.1');
      writeFileSync(skillPath, newContent);

      // Run update with --all
      const result = runCLI('update --all', { cwd: tempDir });
      assert.match(result, /Updated clean-architecture/, 'Should mention updating clean-architecture');
      
      // Verify version is restored
      const updatedContent = readFileSync(skillPath, 'utf8');
      assert.ok(!updatedContent.includes('version: 0.0.1'), 'Version should no longer be 0.0.1');
    } finally {
      // Ensure we restore even if assertions fail
      writeFileSync(skillPath, content);
    }
  });
});
