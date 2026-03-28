
'use server';

import nodemailer from 'nodemailer';

// This function is now internal to this module and not exported
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
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với quản trị viên nếu bạn cho rằng có hoạt động đáng ngờ.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                <p style="font-size: 12px; color: #888; text-align: center;">
                    Đây là một email tự động. Vui lòng không trả lời.
                </p>
            </div>
        </div>
    `;
}

// This is the single exported function for sending OTPs. It is async.
export async function sendVerificationEmail(email: string, otp: string, subjectLine = "Mã Xác thực của bạn") {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email service is not configured. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.");
        // For this demo, we'll log and silently fail instead of throwing an error.
        return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465, // Standard for SMTPS
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = generateOtpEmailHtml(otp, subjectLine);

    try {
        await transporter.sendMail({
            from: `"HURC No.1 CDHS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `HURC No.1 CDHS - ${subjectLine}`,
            html: emailHtml,
        });
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        // Do not re-throw error to client to avoid leaking information
    }
}
