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

    const { listingId, checkInDate, checkOutDate, persons } = result.data;

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

    //  persons(guest) validation
    if (persons > listing.maxGuests) {
      return errorResponse("Persons(Guest) limit exceeded", 400);
    }

    // Check for conflicting/overlapping bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        status: {
          not: "CANCELLED",
        },
        AND: [
          // an overlap happens if:
          // (existing.checkInDate < new.checkOutDate) and (existing.checkOutDate > new.checkInDate)
          {
            checkInDate: { lt: checkOutDate },
          },
          {
            checkOutDate: { gt: checkInDate },
          },
        ],
      },
    });

    if (existingBooking) {
      return errorResponse("Listing already booked for selected dates", 400);
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate total price based on nights stayed and listing's daily price
    const totalPrice = nights * listing.pricePerNight;

    const booking = await prisma.booking.create({
      data: {
        userId,
        listingId,
        checkInDate,
        checkOutDate,
        persons,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    return successResponse("Booking successful", booking);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong, Booking creation failed.", 500);
  }
}
