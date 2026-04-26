import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators/booking";

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

    const body = await req.json();

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.message, 400);
    }

    const { listingId, checkInDate, checkOutDate, persons, couponId } = result.data;

    // invalid date check
    if (checkInDate >= checkOutDate) {
      return errorResponse("Invalid date range", 400);
    }

    //  Get listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    // Check macro availability
    if (
      new Date(checkInDate) < listing.availableFrom ||
      new Date(checkOutDate) > listing.availableTo
    ) {
      return errorResponse("Listing is not available for these dates", 400);
    }

    // Check for conflicting/overlapping bookings
    const overlappingBookings = await prisma.booking.count({
      where: {
        listingId,
        status: {
          not: "CANCELLED",
        },
        // an overlap happens if:
        // (existing.checkInDate < new.checkOutDate) and (existing.checkOutDate > new.checkInDate)
        AND: [
          { checkInDate: { lt: new Date(checkOutDate) } },
          { checkOutDate: { gt: new Date(checkInDate) } },
        ],
      },
    });

    if (overlappingBookings > 0) {
      return errorResponse("Listing is already booked for these dates", 400);
    }

    // Check for explicitly blocked dates
    const blockedDatesCount = await prisma.availability.count({
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
      return errorResponse("Some dates in your range are blocked by the host", 400);
    }

    // persons(guest) validation
    if (persons > listing.maxGuests) {
      return errorResponse("Persons(Guest) limit exceeded", 400);
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate total price based on nights stayed and listing's daily price
    let totalPrice = nights * listing.pricePerNight;
    
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId }
      });

      if (!coupon) return errorResponse("Invalid coupon", 400);
      if (!coupon.isActive) return errorResponse("Coupon is not active", 400);
      
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return errorResponse("Coupon has expired or is not yet valid", 400);
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return errorResponse("Coupon usage limit reached", 400);
      }

      if (coupon.minAmount && totalPrice < coupon.minAmount) {
        return errorResponse("Minimum booking amount not met for this coupon", 400);
      }

      if (coupon.perUserLimit) {
        const usage = await prisma.couponUsage.findUnique({
          where: { userId_couponId: { userId, couponId } }
        });
        if (usage && usage.usageCount >= coupon.perUserLimit) {
          return errorResponse("You have reached your usage limit for this coupon", 400);
        }
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.floor((totalPrice * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      totalPrice = Math.max(0, totalPrice - discountAmount);

      // Increment coupon usage counts
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      });

      await prisma.couponUsage.upsert({
        where: { userId_couponId: { userId, couponId } },
        update: { usageCount: { increment: 1 } },
        create: { userId, couponId, usageCount: 1 }
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        listingId,
        checkInDate,
        checkOutDate,
        persons,
        totalPrice,
        status: "CONFIRMED",
        ...(couponId ? { couponId } : {}),
      },
    });

    return successResponse("Booking successful", booking);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong, Booking creation failed.", 500);
  }
}
