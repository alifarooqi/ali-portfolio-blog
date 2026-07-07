import { execSync } from 'child_process';

const steps = [
  { name: 'Linting', cmd: 'npm run lint' },
  { name: 'Typechecking', cmd: 'npm run typecheck' },
  { name: 'Unit Testing', cmd: 'npm run test' },
  { name: 'E2E Testing', cmd: 'PORT=3001 npm run test:e2e' }
];

console.log('🚀 Starting pre-PR validation pipeline...\n');

for (const step of steps) {
  console.log(`[Step] Running ${step.name} (${step.cmd})...`);
  try {
    execSync(step.cmd, { stdio: 'inherit' });
    console.log(`✅ ${step.name} passed!\n`);
  } catch (error) {
    console.error(`❌ ${step.name} failed. Halting PR creation.`);
    process.exit(1);
  }
}

console.log('🎉 All checks passed! Initiating GitHub PR creation...\n');

try {
  execSync('gh pr create --web', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to create PR:', error.message);
  process.exit(1);
}
