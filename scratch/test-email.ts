import fs from 'fs';
import path from 'path';
import { sendVerificationEmail } from '../src/lib/services/email';

// Load .env manually
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const index = trimmed.indexOf('=');
            if (index !== -1) {
                const key = trimmed.substring(0, index).trim();
                const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
                process.env[key] = val;
            }
        }
    });
}

async function runTest() {
    console.log("=== EMAIL SMTP TEST ===");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
    console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
    console.log("EMAIL_SECURE:", process.env.EMAIL_SECURE);
    
    const otp = "123456";
    const email = "nhhoang@hurc.vn";
    
    console.log(`Sending OTP '${otp}' to '${email}'...`);
    const success = await sendVerificationEmail(email, otp);
    console.log("Send success result:", success);
}

runTest().catch(console.error);
