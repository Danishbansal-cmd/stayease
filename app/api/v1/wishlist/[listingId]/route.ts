import { errorResponse, successResponse } from "@/lib/api-response";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, {params} : {params : Promise<{listingId: string}>}){
    try {
        const token = req.headers.get("x-access-token");
        if(!token){
            return errorResponse("Unauthorized", 401);
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return errorResponse("Invalid token", 401);
        }

        const {userId, role} = decoded;
        if(role !== "GUEST" && role !== "ADMIN"){
            return errorResponse("Forbidden: Only guests and admins can manage wishlist", 403);
        }
        
        const { listingId } = await params;
        
        // Upsert wishlist and connect the listing
        const wishlist = await prisma.wishlist.upsert({
            where: { userId },
            create: {
                userId,
                listings: {
                    connect: { id: listingId }
                }
            },
            update: {
                listings: {
                    connect: { id: listingId }
                }
            }
        });

        return successResponse("Added to wishlist successfully", wishlist);
    } catch(err) {
        console.error(err);
        return errorResponse("Something went wrong, adding to the wishlist failed", 500);
    }
}

export async function DELETE(req: Request, {params} : {params : Promise<{listingId: string}>}){
    try {
        const token = req.headers.get("x-access-token");
        if(!token){
            return errorResponse("Unauthorized", 401);
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return errorResponse("Invalid token", 401);
        }

        const {userId, role} = decoded;
        if(role !== "GUEST" && role !== "ADMIN"){
            return errorResponse("Forbidden: Only guests and admins can manage wishlist", 403);
        }
        
        const { listingId } = await params;
        
        const existingWishlist = await prisma.wishlist.findUnique({
            where: { userId }
        });

        if (!existingWishlist) {
            return errorResponse("Wishlist not found", 404);
        }

        const wishlist = await prisma.wishlist.update({
            where: { userId },
            data: {
                listings: {
                    disconnect: { id: listingId }
                }
            }
        });

        return successResponse("Removed from wishlist successfully", wishlist);
    } catch(err) {
        console.error(err);
        return errorResponse("Something went wrong, removing from the wishlist failed", 500);
    }
}