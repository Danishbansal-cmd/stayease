import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const bookingId = params.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return errorResponse("Booking not found", 404);
    }

    // Ensure user owns this booking
    if (booking.userId !== userId) {
      return errorResponse("Forbidden", 403);
    }

    // Prevent cancelling past bookings
    if (booking.checkInDate < new Date()) {
      return errorResponse("Cannot cancel past bookings", 400);
    }

    // Prevent double cancel
    if (booking.status === "CANCELLED") {
      return errorResponse("Booking already cancelled", 400);
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });

    return successResponse("Booking cancelled", updated);
  } catch (err) {
    console.error(err);
    return errorResponse(
      "Something went wrong, Booking cancellation failed.",
      500,
    );
  }
}
