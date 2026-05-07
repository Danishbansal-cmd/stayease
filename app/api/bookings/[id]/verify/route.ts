import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Prisma } from "@/app/generated/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const { id: bookingId } = await params;
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse("Missing payment details", 400);
    }

    // 1. Verify Razorpay Signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return errorResponse("Invalid payment signature", 400);
    }

    // 2. Perform DB Updates in a Transaction
    const result = await prisma.$transaction(
      async (tx) => {
        // Fetch booking and payment
        const booking = await tx.booking.findUnique({
          where: { id: bookingId },
          include: { listing: true },
        });

        if (!booking) throw new Error("Booking not found|404");
        if (booking.userId !== userId) throw new Error("Unauthorized|401");

        const payment = await tx.payment.findUnique({
          where: { razorpaySessionId: razorpay_order_id },
        });

        if (!payment) throw new Error("Payment record not found|404");
        if (payment.status === "SUCCESS") {
          return { alreadyProcessed: true };
        }

        // --- CONCURRENCY CHECK (OVERBOOKING) ---
        // What if another user successfully paid for these dates while this user was on the checkout page?
        const overlappingBookings = await tx.booking.count({
          where: {
            listingId: booking.listingId,
            status: "CONFIRMED",
            id: { not: booking.id },
            AND: [
              { checkInDate: { lt: booking.checkOutDate } },
              { checkOutDate: { gt: booking.checkInDate } },
            ],
          },
        });

        if (overlappingBookings > 0) {
          // Uh oh! Someone else snatched it. We must mark this as failed and issue a refund.
          await tx.booking.update({
            where: { id: booking.id },
            data: { status: "CANCELLED" }, // or FAILED
          });
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          });
          throw new Error("Dates were booked by another user during checkout. We will issue a refund shortly.|409");
        }

        // --- EVERYTHING IS GOOD. UPDATE DB ---

        // A. Mark Payment as Success
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCESS" },
        });

        // B. Mark Booking as Confirmed
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: "CONFIRMED" },
        });

        // C. Update Availability (mark dates as blocked)
        const datesToBlock: Date[] = [];
        let currentDate = new Date(booking.checkInDate);
        while (currentDate < booking.checkOutDate) {
          datesToBlock.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        for (const date of datesToBlock) {
          await tx.availability.upsert({
            where: {
              listingId_date: {
                listingId: booking.listingId,
                date: date,
              },
            },
            update: { isAvailable: false },
            create: {
              listingId: booking.listingId,
              date: date,
              isAvailable: false,
            },
          });
        }

        // D. Increment Coupon Usage
        if (booking.couponId) {
          await tx.coupon.update({
            where: { id: booking.couponId },
            data: { usedCount: { increment: 1 } },
          });

          await tx.couponUsage.upsert({
            where: { userId_couponId: { userId, couponId: booking.couponId } },
            update: { usageCount: { increment: 1 } },
            create: { userId, couponId: booking.couponId, usageCount: 1 },
          });
        }

        return { success: true };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return successResponse("Payment verified and booking confirmed", result);
  } catch (err: any) {
    console.error("Verification error:", err);
    if (err instanceof Error && err.message.includes("|")) {
      const [message, status] = err.message.split("|");
      return errorResponse(message, parseInt(status, 10));
    }
    return errorResponse("Payment verification failed", 500);
  }
}
