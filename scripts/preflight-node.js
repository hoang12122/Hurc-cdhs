const fs = require('fs');
const path = require('path');

try {
  const nvmrcPath = path.join(__dirname, '..', '.nvmrc');
  if (!fs.existsSync(nvmrcPath)) {
    console.error("❌ Error: .nvmrc file not found!");
    process.exit(1);
  }

  const expectedVersion = fs.readFileSync(nvmrcPath, 'utf8').trim().replace(/^v/, '');
  const actualVersion = process.versions.node;

  console.log(`🔎 [Preflight] Expected Node version: v${expectedVersion}`);
  console.log(`🔎 [Preflight] Actual Node version: v${actualVersion}`);

  if (actualVersion !== expectedVersion) {
    console.error("\n❌❌❌ NODE.JS VERSION MISMATCH DETECTED! ❌❌❌");
    console.error("--------------------------------------------------------");
    console.error(`Your active Node.js version is v${actualVersion}, but this project`);
    console.error(`strictly requires Node.js v${expectedVersion}.`);
    console.error("--------------------------------------------------------");
    console.error("👉 Action Required:");
    console.error("   If you use NVM (Node Version Manager), please run:");
    console.error(`     nvm install ${expectedVersion}`);
    console.error(`     nvm use ${expectedVersion}`);
    console.error(`\n   Otherwise, please download and install Node.js v${expectedVersion}`);
    console.error(`   manually from: https://nodejs.org/dist/v${expectedVersion}/`);
    console.error("--------------------------------------------------------\n");
    process.exit(1);
  }

  console.log("✅ [Preflight] Node.js version matches .nvmrc successfully.");
} catch (err) {
  console.error("❌ Error in preflight-node script:", err.message);
  process.exit(1);
}
