import { Plan } from "@prisma/client";

export interface PlanLimits {
  docsPerMonth: number; // -1 = unlimited
  aiEnabled: boolean;
  watermark: boolean;
  docTypes: number; // number of doc types accessible
  shareLinks: boolean;
  teamSeats: number;
  apiAccess: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    docsPerMonth: 3,
    aiEnabled: false,
    watermark: true,
    docTypes: 3,       // only privacy policy, ToS, NDA
    shareLinks: false,
    teamSeats: 1,
    apiAccess: false,
    customBranding: false,
    prioritySupport: false,
  },
  STARTER: {
    docsPerMonth: 20,
    aiEnabled: true,
    watermark: false,
    docTypes: 8,       // all 8 types
    shareLinks: true,
    teamSeats: 1,
    apiAccess: false,
    customBranding: true,
    prioritySupport: false,
  },
  PRO: {
    docsPerMonth: -1, // unlimited
    aiEnabled: true,
    watermark: false,
    docTypes: 8,
    shareLinks: true,
    teamSeats: 3,
    apiAccess: false,
    customBranding: true,
    prioritySupport: false,
  },
  BUSINESS: {
    docsPerMonth: -1,
    aiEnabled: true,
    watermark: false,
    docTypes: 8,
    shareLinks: true,
    teamSeats: -1,    // unlimited
    apiAccess: true,
    customBranding: true,
    prioritySupport: true,
  },
};

// Prices in INR (₹)
// Monthly = per month
// Yearly = per month when billed annually (25% discount)
export const PLAN_PRICES = {
  STARTER: { monthly: 499,   yearly: 374,  yearlyTotal: 4499  },
  PRO:     { monthly: 999,   yearly: 749,  yearlyTotal: 8999  },
  BUSINESS:{ monthly: 1999,  yearly: 1499, yearlyTotal: 17999 },
};

export function isWithinLimit(
  plan: Plan,
  usedThisMonth: number
): boolean {
  const limit = PLAN_LIMITS[plan].docsPerMonth;
  if (limit === -1) return true;
  return usedThisMonth < limit;
}

export function getPlanDisplayName(plan: Plan): string {
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}
