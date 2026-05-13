import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { listingId } = await params;
    
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    return successResponse("Listing fetched", listing);
  } catch (err) {
    console.error(err);
    return errorResponse("Something went wrong", 500);
  }
}
