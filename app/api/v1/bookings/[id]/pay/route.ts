import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { Prisma } from "@/app/generated/prisma/client";
import { verifyToken } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("x-access-token");
    if (!token) return errorResponse("Unauthorized", 401);

    const decoded = verifyToken(token);
    if (!decoded) return errorResponse("Invalid token", 401);

    const userId = decoded.userId;

    const { id: bookingId } = await params;

    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Fetch the booking
        const booking = await tx.booking.findUnique({
          where: { id: bookingId },
          include: { listing: true },
        });

        if (!booking) {
          throw new Error("Booking not found|404");
        }

        if (booking.userId !== userId) {
          throw new Error("Unauthorized|401");
        }

        if (booking.status !== "PENDING") {
          throw new Error(`Booking is already ${booking.status}|400`);
        }

        // 2. Double-check for overlapping CONFIRMED bookings before initiating payment
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
          // Auto-cancel this pending booking so they don't try again
          await tx.booking.update({
            where: { id: booking.id },
            data: { status: "CANCELLED" },
          });
          throw new Error("Sorry, someone else just confirmed this booking for these dates.|409");
        }

        // 3. Check for explicitly blocked dates
        const blockedDatesCount = await tx.availability.count({
          where: {
            listingId: booking.listingId,
            isAvailable: false,
            date: {
              gte: booking.checkInDate,
              lt: booking.checkOutDate,
            },
          },
        });

        if (blockedDatesCount > 0) {
          throw new Error("Some dates are no longer available.|400");
        }

        // 3.5 Re-validate and consume coupon usage if the booking used a coupon
        // Doing this here ensures concurrent users can create PENDING bookings,
        // but only the ones who proceed to payment will actually consume the coupon limit.
        if (booking.couponId) {
          const coupon = await tx.coupon.findUnique({
            where: { id: booking.couponId },
          });

          if (!coupon) throw new Error("Invalid coupon|400");
          if (!coupon.isActive) throw new Error("Coupon is no longer active|400");

          const now = new Date();
          if (now < coupon.validFrom || now > coupon.validUntil) {
            throw new Error("Coupon has expired|400");
          }

          if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            throw new Error("Coupon usage limit reached by another user. Please create a new booking without the coupon.|400");
          }

          if (coupon.perUserLimit) {
            const usage = await tx.couponUsage.findUnique({
              where: { userId_couponId: { userId, couponId: booking.couponId } },
            });
            if (usage && usage.usageCount >= coupon.perUserLimit) {
              throw new Error("You have reached your usage limit for this coupon|400");
            }
          }

          // Note: We DO NOT increment the coupon here. 
          // We only validate it so they don't proceed to payment if it's already invalid.
          // The actual increment happens in the Webhook when payment succeeds.
        }

        // 4. Create Razorpay Order
        const order = await razorpay.orders.create({
          amount: booking.totalPrice, // in paisa
          currency: "INR",
          receipt: booking.id,
        });

        // 5. Create Payment record
        const payment = await tx.payment.create({
          data: {
            userId,
            bookingId: booking.id,
            amount: booking.totalPrice,
            razorpaySessionId: order.id,
            status: "PENDING",
          },
        });

        // 6. Return the order to the frontend so they can open the Razorpay checkout.
        // We DO NOT confirm the booking or block availability here. That happens in the Webhook.
        return { order, paymentId: payment.id };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return successResponse("Payment initiated", result);
  } catch (err: any) {
    console.error(err);
    if (err instanceof Error && err.message.includes("|")) {
      const [message, status] = err.message.split("|");
      return errorResponse(message, parseInt(status, 10));
    }

    return errorResponse("Failed to initiate payment", 500);
  }
}
