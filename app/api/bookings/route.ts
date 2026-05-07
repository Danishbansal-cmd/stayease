import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { bookingSchema } from "@/lib/validators/booking";
import { bookingRateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        listing: true, // show property details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse("Bookings fetched", bookings);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong", 500);
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    // Get client IP
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const identifier = `${ip}:${userId}`;

    // rate limit check
    const { success } = await bookingRateLimit.limit(identifier);

    if (!success) {
      return errorResponse(
        "Too many booking attempts. Please try again later.",
        429,
      );
    }

    const body = await req.json();

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.message, 400);
    }

    const { listingId, checkInDate, checkOutDate, persons, couponId } =
      result.data;

    // invalid date check
    if (checkInDate >= checkOutDate) {
      return errorResponse("Invalid date range", 400);
    }

    const booking = await prisma.$transaction(
      async (tx) => {
        //  Get listing
        const listing = await tx.listing.findUnique({
          where: { id: listingId },
        });

        if (!listing) {
          throw new Error("Listing not found|404");
        }

        // Check macro availability
        if (
          new Date(checkInDate) < listing.availableFrom ||
          new Date(checkOutDate) > listing.availableTo
        ) {
          throw new Error("Listing is not available for these dates|400");
        }

        // Check for conflicting/overlapping bookings
        const overlappingBookings = await tx.booking.count({
          where: {
            listingId,
            status: "CONFIRMED",
            // an overlap happens if:
            // (existing.checkInDate < new.checkOutDate) and (existing.checkOutDate > new.checkInDate)
            AND: [
              { checkInDate: { lt: new Date(checkOutDate) } },
              { checkOutDate: { gt: new Date(checkInDate) } },
            ],
          },
        });

        if (overlappingBookings > 0) {
          throw new Error("Listing is already booked for these dates|400");
        }

        // Check for explicitly blocked dates
        const blockedDatesCount = await tx.availability.count({
          where: {
            listingId,
            isAvailable: false,
            date: {
              gte: new Date(checkInDate),
              lt: new Date(checkOutDate),
            },
          },
        });

        if (blockedDatesCount > 0) {
          throw new Error(
            "Some dates in your range are blocked by the host|400",
          );
        }

        // persons(guest) validation
        if (persons > listing.maxGuests) {
          throw new Error("Persons(Guest) limit exceeded|400");
        }

        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Calculate total price based on nights stayed and listing's daily price
        let totalPrice = nights * listing.pricePerNight;

        if (couponId) {
          const coupon = await tx.coupon.findUnique({
            where: { id: couponId },
          });

          if (!coupon) throw new Error("Invalid coupon|400");
          if (!coupon.isActive) throw new Error("Coupon is not active|400");

          const now = new Date();
          if (now < coupon.validFrom || now > coupon.validUntil) {
            throw new Error("Coupon has expired or is not yet valid|400");
          }

          if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            throw new Error("Coupon usage limit reached|400");
          }

          if (coupon.minAmount && totalPrice < coupon.minAmount) {
            throw new Error(
              "Minimum booking amount not met for this coupon|400",
            );
          }

          if (coupon.perUserLimit) {
            const usage = await tx.couponUsage.findUnique({
              where: { userId_couponId: { userId, couponId } },
            });
            if (usage && usage.usageCount >= coupon.perUserLimit) {
              throw new Error(
                "You have reached your usage limit for this coupon|400",
              );
            }
          }

          // Calculate discount
          let discountAmount = 0;
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = Math.floor(
              (totalPrice * coupon.discountValue) / 100,
            );
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }

          totalPrice = Math.max(0, totalPrice - discountAmount);

          // Note: Coupon usage increment has been moved/added to the payment initiation route
          // so that concurrent users can create PENDING bookings, and only the one who pays gets it.
        }

        return await tx.booking.create({
          data: {
            userId,
            listingId,
            checkInDate,
            checkOutDate,
            persons,
            totalPrice,
            status: "PENDING",
            ...(couponId ? { couponId } : {}),
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return successResponse("Booking reserved successfully", booking);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2034") {
      return errorResponse(
        "The room was booked by someone else while you were checking out.",
        409,
      );
    }

    if (err instanceof Error && err.message.includes("|")) {
      const [message, status] = err.message.split("|");
      return errorResponse(message, parseInt(status, 10));
    }

    return errorResponse("Something went wrong, Booking creation failed.", 500);
  }
}
