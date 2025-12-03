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

  const subject = 'Growix password reset';
  const text = [
    `Hi ${name || 'there'},`,
    '',
    'We received a request to reset your Growix password.',
    'If you made this request, click the link below to choose a new password:',
    resetLink,
    '',
    'If you did not ask to reset your password, you can safely ignore this email.',
    '',
    'This link will stop working in 1 hour.',
    '',
    '— The Growix team'
  ].join('\n');

  // HTML version
  const html = `
    <p>Hi ${name || 'there'},</p>
    <p>We received a request to reset your Growix password.</p>
    <p><a href="${resetLink}" target="_blank" rel="noopener noreferrer">Click here to choose a new password.</a></p>
    <p>If you didn't ask to reset your password, you can ignore this email. This link expires in 1 hour.</p>
    <p>— The Growix team</p>
  `;

  if (!client) {
    console.log('📧 Password reset email (mock):', { to, subject, text });
    return;
  }

  try {
    await client.emails.send({
      from: fromEmail,
      to,
      subject,
      text,
      html
    });
    console.log('✅ Password reset email sent to:', to);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw error;
  }
}
