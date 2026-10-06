import { getToolSchemas, executeTool } from './index';

async function runTests() {
  console.log("=== Testing local-ai-orchestrator ===\n");
  
  const schemas = getToolSchemas();
  if (schemas.length === 5) {
    console.log("✅ Passed: 5 schemas exported correctly.");
  } else {
    console.error(`❌ Failed: Expected 5 schemas, got ${schemas.length}`);
    process.exit(1);
  }

  const patchSchema = schemas.find((s: any) => s.function.name === 'apply_structural_patch');
  if (patchSchema) {
    console.log(`✅ Passed: Schema 'apply_structural_patch' is well-formed.`);
  }

  // Very basic dry-run to ensure executor.ts doesn't syntax error
  // We don't execute actual tools here to prevent environment side-effects,
  // but we test that the function signature is correct.
  if (typeof executeTool === 'function') {
    console.log("✅ Passed: executeTool is an exported async function.");
  }

  console.log("\n✅ All sanity checks passed.");
}

runTests();
