import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/validators/listing";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const persons = searchParams.get("persons");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const searchTitle = searchParams.get("searchTitle");

    // Build dynamic filter
    const where: any = {};

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (searchTitle) {
      where.title = {
        contains: searchTitle,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {};

      if (minPrice) {
        where.pricePerNight.gte = Number(minPrice) * 100;
      }

      if (maxPrice) {
        where.pricePerNight.lte = Number(maxPrice);
      }
    }

    if (persons) {
      where.maxGuests = {
        gte: Number(persons),
      };
    }

    if (checkIn && checkOut) {
      where.bookings = {
        none: {
          AND: [
            {
              checkInDate: { lt: new Date(checkOut) },
            },
            {
              checkOutDate: { gt: new Date(checkIn) },
            },
          ],
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        host: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse("Listings fetched", listings);
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
    const result = listingSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.message, 400);
    }

    const listing = await prisma.listing.create({
      data: {
        ...result.data,
        hostId: userId,
      },
    });

    return successResponse("Listing created successfully.", listing);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong, listing creation failed.", 500);
  }
}
