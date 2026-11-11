import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  path.resolve(__dirname, 'tier1-features.test.ts'),
  path.resolve(__dirname, 'tier2-boundaries.test.ts'),
  path.resolve(__dirname, 'tier3-interactions.test.ts'),
  path.resolve(__dirname, 'tier4-scenarios.test.ts'),
  path.resolve(__dirname, 'tier5-store-stress.test.ts'),
];

console.log('======================================================================');
console.log(' Parent Decoder - Comprehensive 4-Tier Opaque-Box E2E Test Suite');
console.log(' Requirements: R1 (Playbook), R2 (Fallback Scripts), R3 (Pills),');
console.log('               R4 (Setup Guide), R5 (Saved Items Integration)');
console.log('======================================================================\n');

let totalPassed = 0;
let totalFailed = 0;
const startTime = Date.now();

const stream = run({
  files: testFiles,
  concurrency: false,
});

stream.on('test:pass', () => {
  totalPassed++;
});

stream.on('test:fail', () => {
  totalFailed++;
});

stream.compose(new spec()).pipe(process.stdout);

stream.on('end', () => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n======================================================================');
  console.log(' E2E Test Execution Summary');
  console.log('======================================================================');
  console.log(` Tiers Executed : Tier 1 (Features), Tier 2 (Boundaries),`);
  console.log(`                  Tier 3 (Interactions), Tier 4 (Workload Scenarios)`);
  console.log(` Total Tests    : ${totalPassed + totalFailed}`);
  console.log(` Passed         : ${totalPassed}`);
  console.log(` Failed         : ${totalFailed}`);
  console.log(` Total Duration : ${duration}s`);
  console.log('======================================================================\n');

  if (totalFailed > 0) {
    console.error('❌ E2E Test Suite FAILED with ' + totalFailed + ' failure(s).');
    process.exit(1);
  } else {
    console.log('✅ ALL E2E TEST TIERS PASSED SUCCESSFULLY!');
    process.exit(0);
  }
});
