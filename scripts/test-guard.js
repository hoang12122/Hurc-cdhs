// scripts/test-guard.js - Integration Test Suite for guard-install.js
const { spawnSync } = require('child_process');
const path = require('path');

const GUARD_PATH = path.resolve(__dirname, './guard-install.js');

const testCases = [
  {
    name: '🟢 Case 1: npm ci in CI/Deploy context (Must PASS)',
    env: {
      CI: 'true',
      npm_command: 'ci',
      npm_config_argv: undefined,
    },
    expectedCode: 0,
  },
  {
    name: '🔴 Case 2: npm install in CI context (Must FAIL)',
    env: {
      CI: 'true',
      npm_command: 'install',
      npm_config_argv: undefined,
    },
    expectedCode: 1,
  },
  {
    name: '🟢 Case 3: npm install in local dev (non-CI) context (Must PASS)',
    env: {
      CI: undefined,
      DEPLOY: undefined,
      GITHUB_ACTIONS: undefined,
      npm_command: 'install',
      npm_config_argv: undefined,
    },
    expectedCode: 0,
  },
  {
    name: '🟢 Case 4: npm ci in CI context via legacy npm_config_argv (Must PASS)',
    env: {
      CI: 'true',
      npm_command: undefined,
      npm_config_argv: JSON.stringify({ original: ['ci'] }),
    },
    expectedCode: 0,
  },
  {
    name: '🔴 Case 5: npm install in CI context via legacy npm_config_argv (Must FAIL)',
    env: {
      CI: 'true',
      npm_command: undefined,
      npm_config_argv: JSON.stringify({ original: ['install'] }),
    },
    expectedCode: 1,
  },
  {
    name: '🟢 Case 6: Local production build check with NODE_ENV=production but non-CI (Must PASS)',
    env: {
      CI: undefined,
      DEPLOY: undefined,
      NODE_ENV: 'production',
      npm_command: 'install',
      npm_config_argv: undefined,
    },
    expectedCode: 0,
  },
];

console.log('======================================================');
console.log('🧪 RUNNING INTEGRATION TESTS FOR guard-install.js...');
console.log('======================================================');

let failures = 0;

testCases.forEach((tc) => {
  console.log(`\nRunning: ${tc.name}`);
  
  // Construct clean environment object by merging current env but overriding target vars
  const runEnv = { ...process.env };
  
  // Apply test case overrides
  Object.keys(tc.env).forEach((key) => {
    const val = tc.env[key];
    if (val === undefined) {
      delete runEnv[key];
    } else {
      runEnv[key] = val;
    }
  });

  const result = spawnSync('node', [GUARD_PATH], { env: runEnv, encoding: 'utf8' });

  if (result.status === tc.expectedCode) {
    console.log(`✅ [SUCCESS] Exited with code ${result.status} as expected.`);
  } else {
    console.error(`❌ [FAILURE] Expected exit code ${tc.expectedCode}, but got ${result.status}.`);
    console.error(`Stdout: ${result.stdout}`);
    console.error(`Stderr: ${result.stderr}`);
    failures++;
  }
});

console.log('\n======================================================');
if (failures === 0) {
  console.log('🎉 ALL TEST CASES PASSED SUCCESSFULLY!');
  console.log('======================================================');
  process.exit(0);
} else {
  console.error(`💥 ${failures} TEST CASES FAILED!`);
  console.log('======================================================');
  process.exit(1);
}
