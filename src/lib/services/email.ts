
import nodemailer from 'nodemailer';

/**
 * CORE EMAIL SERVICE
 * Supports Gmail, Outlook 365, and custom SMTP.
 */
export async function sendPasswordResetEmail(email: string, tempPassword: string) {
    const subject = "Mật khẩu tạm thời - HURC No.1 CDHS";
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #d9534f; text-align: center;">HURC No.1 CDHS - Khôi phục Mật khẩu</h2>
                <p>Xin chào,</p>
                <p>Quản trị viên đã phê duyệt yêu cầu đặt lại mật khẩu của bạn. Dưới đây là mật khẩu tạm thời để bạn đăng nhập:</p>
                <div style="text-align: center; margin: 25px 0;">
                    <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #fcecec; color: #d9534f; border-radius: 5px; border: 1px dashed #d9534f;">
                        ${tempPassword}
                    </span>
                </div>
                <p><b>Lưu ý quan trọng:</b> Vì lý do bảo mật, bạn sẽ được yêu cầu đổi mật khẩu ngay sau khi đăng nhập thành công bằng mật khẩu này.</p>
                <p>Nếu bạn không yêu cầu hành động này, vui lòng liên hệ ngay với bộ phận Kỹ thuật - An toàn.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                <p style="font-size: 12px; color: #888; text-align: center;">
                    Đây là một email tự động. Vui lòng không trả lời.
                </p>
            </div>
        </div>
    `;

    return await sendMail(email, subject, html);
}

// Internal helper to get transporter
function getTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '465');
    const secure = process.env.EMAIL_SECURE !== 'false'; // default true

    if (!user || !pass) {
        console.warn("Email credentials missing. Falling back to console log.");
        return null;
    }

    // Special handling for Gmail/Outlook if service is provided
    if (process.env.EMAIL_SERVICE) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: { user, pass }
        });
    }

    // Default custom SMTP
    return nodemailer.createTransport({
        host: host || 'smtp.gmail.com',
        port,
        secure,
        auth: { user, pass }
    });
}

async function sendMail(to: string, subject: string, html: string) {
    const transporter = getTransporter();
    
    if (!transporter) {
        console.log("------------------------------------------");
        console.log(`[MOCK EMAIL] To: ${to}`);
        console.log(`[MOCK EMAIL] Subject: ${subject}`);
        console.log(`[MOCK EMAIL] Content: ${html.replace(/<[^>]*>?/gm, '').substring(0, 200)}...`);
        console.log("------------------------------------------");
        return true;
    }

    try {
        await transporter.sendMail({
            from: `"HURC No.1 CDHS" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        return false;
    }
}

export async function sendVerificationEmail(email: string, otp: string, subjectLine = "Mã Xác thực của bạn") {
    const html = generateOtpEmailHtml(otp, subjectLine);
    return await sendMail(email, `HURC No.1 CDHS - ${subjectLine}`, html);
}

function generateOtpEmailHtml(otp: string, subjectLine: string): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #0056b3; text-align: center;">HURC No.1 CDHS - ${subjectLine}</h2>
                <p>Xin chào,</p>
                <p>Vui lòng sử dụng mã xác thực dưới đây để hoàn tất thao tác của bạn. Mã này có hiệu lực trong 10 phút.</p>
                <div style="text-align: center; margin: 25px 0;">
                    <span style="font-size: 28px; font-weight: bold; letter-spacing: 8px; padding: 10px 20px; background-color: #f0f4f8; border-radius: 5px;">
                        ${otp}
                    </span>
                </div>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                <p style="font-size: 12px; color: #888; text-align: center;">
                    Đây là một email tự động. Vui lòng không trả lời.
                </p>
            </div>
        </div>
    `;
}
