import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.FROM_EMAIL ?? "noreply@docuseal.ai";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "DocuSeal";

// ─── Email Verification ────────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Verify your email — ${APP_NAME}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h1 style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">Verify your email</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Click the button below to verify your email address and activate your DocuSeal account.</p>
        <a href="${url}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Verify Email</a>
        <p style="color:#9ca3af;font-size:13px;margin-top:24px;">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

// ─── Password Reset ────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Reset your password — ${APP_NAME}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h1 style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">Reset your password</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Someone requested a password reset for your account. Click below to set a new password.</p>
        <a href="${url}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Reset Password</a>
        <p style="color:#9ca3af;font-size:13px;margin-top:24px;">Link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

// ─── Dunning / Failed Payment ──────────────────────────────────────────────

export async function sendFailedPaymentEmail(
  email: string,
  name: string,
  attempt: number
) {
  const billingUrl = `${APP_URL}/settings/billing`;
  const subjects = [
    `Action required: Payment failed — ${APP_NAME}`,
    `Reminder: Your payment didn't go through — ${APP_NAME}`,
    `Final notice: Update your payment details — ${APP_NAME}`,
  ];

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: subjects[Math.min(attempt - 1, 2)],
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h1 style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">Payment failed</h1>
        <p style="color:#6b7280;margin-bottom:8px;">Hi ${name}, we couldn't process your subscription payment.</p>
        <p style="color:#6b7280;margin-bottom:24px;">To keep your subscription active, please visit your billing settings and update your payment details.</p>
        <a href="${billingUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Update Payment Details</a>
        ${attempt >= 3 ? `<p style="color:#ef4444;font-size:13px;margin-top:16px;"><strong>This is our final notice.</strong> Your account will be downgraded to the Free plan if payment isn't updated within 24 hours.</p>` : ""}
      </div>
    `,
  });
}


// ─── Welcome Email (after plan upgrade) ───────────────────────────────────

export async function sendWelcomeUpgradeEmail(
  email: string,
  name: string,
  plan: string
) {
  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Welcome to ${plan} — ${APP_NAME}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h1 style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;">You're on ${plan} 🎉</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Hi ${name}, your upgrade is live. All premium features are now unlocked.</p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Go to Dashboard</a>
      </div>
    `,
  });
}
