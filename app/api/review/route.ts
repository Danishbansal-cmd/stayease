import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { reviewSchema } from "@/lib/validators/review";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.message, 400);
    }

    const { listingId, rating, comment } = result.data;

    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        listingId,
        status: "CONFIRMED",
      },
    });

    if (!booking) {
      return errorResponse("You can only review after booking", 400);
    }

    // 🧠 Check if already reviewed
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existingReview) {
      return errorResponse("You have already reviewed this listing", 400);
    }

    const review = await prisma.review.create({
      data: {
        userId,
        listingId,
        rating,
        comment,
      },
    });

    return successResponse("Review added", review);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong, Creating review failed.", 500);
  }
}
