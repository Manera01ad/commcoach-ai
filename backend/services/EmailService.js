import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'CommCoach AI <noreply@commcoach.ai>';

/**
 * Send account approval email
 */
export async function sendApprovalEmail(email, fullName) {
  if (!resend) {
    console.warn('[EMAIL] Resend not configured (missing RESEND_API_KEY). Skipping approval email.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your CommCoach AI account has been approved!',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #111;">Welcome aboard, ${fullName || 'there'}!</h1>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Your CommCoach AI account has been approved. You now have full access to the platform.
          </p>
          <a href="${process.env.FRONTEND_URL || 'https://commcoach-ai.vercel.app'}/login"
             style="display: inline-block; margin-top: 24px; padding: 12px 32px; background: #4f46e5; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Sign In Now
          </a>
          <p style="margin-top: 32px; font-size: 13px; color: #999;">CommCoach AI - Master Your Communication</p>
        </div>
      `,
    });
    console.log(`[EMAIL] Approval email sent to ${email}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send approval email:', error.message);
  }
}

/**
 * Send account rejection email
 */
export async function sendRejectionEmail(email, fullName) {
  if (!resend) {
    console.warn('[EMAIL] Resend not configured (missing RESEND_API_KEY). Skipping rejection email.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'CommCoach AI - Account Update',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #111;">Hi ${fullName || 'there'},</h1>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            We've reviewed your registration for CommCoach AI. Unfortunately, we're unable to approve your account at this time.
          </p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            If you believe this was a mistake, please contact our support team.
          </p>
          <p style="margin-top: 32px; font-size: 13px; color: #999;">CommCoach AI - Master Your Communication</p>
        </div>
      `,
    });
    console.log(`[EMAIL] Rejection email sent to ${email}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send rejection email:', error.message);
  }
}
