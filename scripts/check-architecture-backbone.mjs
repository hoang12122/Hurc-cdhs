import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'frontend/README.md',
  'backend/README.md',
  'infra/README.md',
  '.claude/rules/00-architecture-backbone.md',
  '.claude/rules/05-vibe-coding-guardrails.md',
  'docs/technical/DAY_ONE_ARCHITECTURE_BACKBONE.md',
];

const requiredInvariants = [
  { file: 'frontend/README.md', pattern: /direct database access/i },
  { file: 'backend/README.md', pattern: /domain, application, API/i },
  { file: 'infra/README.md', pattern: /production private keys/i },
  { file: '.claude/rules/00-architecture-backbone.md', pattern: /frontend -> public API\/contracts -> backend/i },
  { file: '.claude/rules/05-vibe-coding-guardrails.md', pattern: /must not invent a new architectural pattern/i },
  { file: '.claude/rules/05-vibe-coding-guardrails.md', pattern: /business decisions.*frontend code/i },
  { file: '.claude/rules/05-vibe-coding-guardrails.md', pattern: /business rules.*infrastructure code/i },
  { file: '.claude/rules/05-vibe-coding-guardrails.md', pattern: /shadow.*user traffic at 0%/i },
  { file: '.claude/rules/05-vibe-coding-guardrails.md', pattern: /all required CI gates.*successful/i },
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`Missing required architecture file: ${file}`);
  }
}

for (const rule of requiredInvariants) {
  try {
    const content = await readFile(rule.file, 'utf8');
    if (!rule.pattern.test(content)) {
      failures.push(`Architecture invariant missing from ${rule.file}: ${rule.pattern}`);
    }
  } catch {
    // Missing files are already reported above.
  }
}

if (failures.length > 0) {
  console.error('Architecture backbone check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Architecture backbone check passed.');
