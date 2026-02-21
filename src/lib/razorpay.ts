import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ─── Plan ID mapping ─────────────────────────────────────────────
// These are the Razorpay Plan IDs you create in the Razorpay Dashboard
// or via API. They look like: plan_XXXXXXXXXXXXXXXX

export const RAZORPAY_PLAN_IDS = {
  STARTER: {
    MONTHLY: process.env.RAZORPAY_STARTER_MONTHLY_PLAN_ID!,
    YEARLY: process.env.RAZORPAY_STARTER_YEARLY_PLAN_ID!,
  },
  PRO: {
    MONTHLY: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID!,
    YEARLY: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID!,
  },
  BUSINESS: {
    MONTHLY: process.env.RAZORPAY_BUSINESS_MONTHLY_PLAN_ID!,
    YEARLY: process.env.RAZORPAY_BUSINESS_YEARLY_PLAN_ID!,
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────────────

export type PlanName = "STARTER" | "PRO" | "BUSINESS";
export type BillingInterval = "MONTHLY" | "YEARLY";

export function getPlanFromRazorpayPlanId(planId: string): string | null {
  for (const [plan, intervals] of Object.entries(RAZORPAY_PLAN_IDS)) {
    for (const [, id] of Object.entries(intervals)) {
      if (id === planId) return plan;
    }
  }
  return null;
}

// Razorpay amounts are in paise (1 INR = 100 paise)
// or smallest currency unit for international
export function toRazorpayAmount(inr: number) {
  return inr * 100; // convert rupees to paise
}

export function fromRazorpayAmount(paise: number) {
  return paise / 100;
}

// Verify Razorpay webhook signature
import crypto from "crypto";

export function verifyRazorpayWebhook(body: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
