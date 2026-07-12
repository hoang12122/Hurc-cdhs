import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  getInternalUserByEmail,
  updateInternalUser,
  updateUserPassword,
} from '@/lib/services/user-service';

const DEFAULT_EMAILS = [
  'admin.final@hurc.cdhs',
  'superadmin@hurc.cdhs',
  'admin.new@hurc.cdhs',
];

const emails = (process.env.ROTATE_ADMIN_EMAILS || DEFAULT_EMAILS.join(','))
  .split(',')
  .map(value => value.trim().toLowerCase())
  .filter(Boolean);

function temporaryPassword(): string {
  return `H!${crypto.randomBytes(18).toString('base64url')}a9`;
}

async function main() {
  const rotated: Array<{ email: string; temporaryPassword: string }> = [];

  for (const email of emails) {
    const user = await getInternalUserByEmail(email);
    if (!user) {
      console.warn(`[credential-rotation] User not found: ${email}`);
      continue;
    }

    const password = temporaryPassword();
    await updateUserPassword(user.id, password, 'security-rotation');
    await updateInternalUser(user.id, {
      mustChangePassword: true,
      activeSessionId: crypto.randomUUID(),
      failedLoginAttempts: 0,
      lockoutUntil: null,
    });
    rotated.push({ email, temporaryPassword: password });
  }

  const outputPath = path.join(process.cwd(), 'security-rotation-output.json');
  await fs.writeFile(
    outputPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), rotated }, null, 2),
    { mode: 0o600 },
  );

  console.log(
    `[credential-rotation] Rotated ${rotated.length} account(s). `
      + `One-time credentials written to ${outputPath} with mode 0600.`,
  );
}

main().catch(error => {
  console.error('[credential-rotation] Failed:', error);
  process.exit(1);
});
