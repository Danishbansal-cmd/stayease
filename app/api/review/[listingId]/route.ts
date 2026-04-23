import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(
  req: Request,
  { params }: { params: { listingId: string } },
) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        listingId: params.listingId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse("Reviews fetched", reviews);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong", 500);
  }
}
