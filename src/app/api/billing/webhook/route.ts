import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpayWebhook, getPlanFromRazorpayPlanId } from "@/lib/razorpay";
import { sendWelcomeUpgradeEmail, sendFailedPaymentEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // ── 1. Verify webhook signature ───────────────────────────────
  if (!verifyRazorpayWebhook(body, signature)) {
    console.error("[WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; payload: Record<string, { entity: Record<string, unknown> }> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = event.event;
  const subscription = event.payload?.subscription?.entity as Record<string, unknown> | undefined;
  const payment = event.payload?.payment?.entity as Record<string, unknown> | undefined;

  console.log(`[WEBHOOK] ${eventName}`, subscription?.id ?? payment?.id);

  try {
    switch (eventName) {

      // ── Subscription activated (after first payment or trial) ─
      case "subscription.activated": {
        if (!subscription) break;
        const subId = subscription.id as string;
        const planId = subscription.plan_id as string;
        const notes = subscription.notes as Record<string, string> | undefined;
        const userId = notes?.userId;

        if (!userId) {
          console.error("[WEBHOOK] No userId in notes for subscription", subId);
          break;
        }

        const plan = getPlanFromRazorpayPlanId(planId) ?? "STARTER";
        const currentStart = subscription.current_start
          ? new Date((subscription.current_start as number) * 1000)
          : new Date();
        const currentEnd = subscription.current_end
          ? new Date((subscription.current_end as number) * 1000)
          : null;

        await prisma.subscription.update({
          where: { userId },
          data: {
            plan: plan as "STARTER" | "PRO" | "BUSINESS",
            status: "ACTIVE",
            razorpaySubscriptionId: subId,
            razorpayPlanId: planId,
            razorpayCustomerEmail: notes?.userEmail,
            currentPeriodStart: currentStart,
            currentPeriodEnd: currentEnd,
          },
        });

        // Send welcome email
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (user?.email) {
          await sendWelcomeUpgradeEmail(user.email, user.name ?? "there", plan);
        }
        break;
      }

      // ── Payment charged (recurring) ───────────────────────────
      case "subscription.charged": {
        if (!payment || !subscription) break;
        const subId = subscription.id as string;
        const paymentId = payment.id as string;
        const orderId = payment.order_id as string | undefined;
        const invoiceId = payment.invoice_id as string | undefined;

        // Idempotency check
        if (invoiceId) {
          const existing = await prisma.payment.findUnique({
            where: { razorpayInvoiceId: invoiceId },
          });
          if (existing) {
            console.log("[WEBHOOK] Duplicate charged event, skipping");
            break;
          }
        }

        // Update subscription period
        const currentStart = subscription.current_start
          ? new Date((subscription.current_start as number) * 1000)
          : new Date();
        const currentEnd = subscription.current_end
          ? new Date((subscription.current_end as number) * 1000)
          : null;

        const dbSub = await prisma.subscription.findFirst({
          where: { razorpaySubscriptionId: subId },
        });

        if (dbSub) {
          await prisma.$transaction([
            prisma.subscription.update({
              where: { id: dbSub.id },
              data: {
                status: "ACTIVE",
                currentPeriodStart: currentStart,
                currentPeriodEnd: currentEnd,
              },
            }),
            prisma.payment.create({
              data: {
                subscriptionId: dbSub.id,
                razorpayPaymentId: paymentId,
                razorpayOrderId: orderId,
                razorpayInvoiceId: invoiceId,
                amount: (payment.amount as number) ?? 0,
                currency: (payment.currency as string) ?? "INR",
                status: "paid",
                paidAt: new Date(),
              },
            }),
          ]);
        }
        break;
      }

      // ── Payment failed ─────────────────────────────────────────
      case "subscription.halted": {
        if (!subscription) break;
        const subId = subscription.id as string;
        const notes = subscription.notes as Record<string, string> | undefined;

        const dbSub = await prisma.subscription.findFirst({
          where: { razorpaySubscriptionId: subId },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { status: "PAST_DUE" },
          });

          // Record failed payment
          await prisma.payment.create({
            data: {
              subscriptionId: dbSub.id,
              amount: 0,
              currency: "INR",
              status: "failed",
              failureReason: "Subscription halted after multiple failed retries",
            },
          });

          // Send dunning email
          const user = await prisma.user.findFirst({
            where: { id: dbSub.userId },
          });
          const email = user?.email ?? notes?.userEmail;
          if (email) {
            await sendFailedPaymentEmail(email, user?.name ?? "there", 1);
          }
        }
        break;
      }

      // ── Subscription cancelled ────────────────────────────────
      case "subscription.cancelled": {
        if (!subscription) break;
        const subId = subscription.id as string;

        await prisma.subscription.updateMany({
          where: { razorpaySubscriptionId: subId },
          data: {
            plan: "FREE",
            status: "CANCELED",
            canceledAt: new Date(),
            razorpaySubscriptionId: null,
            razorpayPlanId: null,
          },
        });
        break;
      }

      // ── Subscription completed (all billing cycles done) ──────
      case "subscription.completed": {
        if (!subscription) break;
        const subId = subscription.id as string;
        await prisma.subscription.updateMany({
          where: { razorpaySubscriptionId: subId },
          data: { plan: "FREE", status: "COMPLETED" },
        });
        break;
      }

      // ── Subscription updated (plan change) ────────────────────
      case "subscription.updated": {
        if (!subscription) break;
        const subId = subscription.id as string;
        const newPlanId = subscription.plan_id as string;
        const newPlan = getPlanFromRazorpayPlanId(newPlanId);

        if (newPlan) {
          await prisma.subscription.updateMany({
            where: { razorpaySubscriptionId: subId },
            data: {
              plan: newPlan as "FREE" | "STARTER" | "PRO" | "BUSINESS",
              razorpayPlanId: newPlanId,
            },
          });
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_PROCESSING_ERROR]", error);
    // Return 200 to acknowledge receipt even on processing error
    // Razorpay retries on non-200 responses
    return NextResponse.json({ received: true, warning: "Processing error" });
  }
}
