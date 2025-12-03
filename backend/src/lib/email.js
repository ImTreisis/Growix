import { Resend } from 'resend';

let resendClient;

function getResendClient() {
  if (resendClient) return resendClient;

  const { RESEND_API_KEY } = process.env;

  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is missing - password reset emails will not be sent');
    return null;
  }

  resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}

export async function sendPasswordResetEmail({ to, name = 'there', token }) {
  const client = getResendClient();
  const appUrl = process.env.APP_BASE_URL || 'https://www.growix.lt';
  const resetLink = `${appUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const replyTo = process.env.RESEND_REPLY_TO || fromEmail;

  const subject = 'Reset your Growix password';
  const text = [
    `Hello ${name || 'there'},`,
    '',
    'You requested to reset your password for your Growix account.',
    '',
    'To reset your password, copy and paste this link into your browser:',
    '',
    resetLink,
    '',
    'This link will expire in 1 hour for security reasons.',
    '',
    'If you did not request a password reset, please ignore this email. Your password will remain unchanged.',
    '',
    'Best regards,',
    'The Growix Team'
  ].join('\n');

  // Professional HTML email with better styling
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-top: 0; margin-bottom: 20px;">Reset Your Password</h1>
        
        <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Hello ${name || 'there'},</p>
        
        <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
          You requested to reset your password for your Growix account. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #888; font-size: 14px; margin-bottom: 10px;">
          Or copy and paste this link into your browser:
        </p>
        <p style="color: #0066cc; font-size: 14px; word-break: break-all; margin-bottom: 30px;">
          ${resetLink}
        </p>
        
        <p style="color: #888; font-size: 14px; margin-bottom: 20px;">
          This link will expire in 1 hour for security reasons.
        </p>
        
        <p style="color: #555; font-size: 14px; margin-bottom: 10px;">
          If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #888; font-size: 12px; margin: 0;">
          Best regards,<br>
          <strong>The Growix Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;

  if (!client) {
    console.log('📧 Password reset email (mock):', { to, subject, text });
    return;
  }

  try {
    await client.emails.send({
      from: fromEmail,
      to,
      replyTo,
      subject,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': `password-reset-${Date.now()}`,
      },
    });
    console.log('✅ Password reset email sent to:', to);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw error;
  }
}
