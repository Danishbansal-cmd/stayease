import {z} from "zod";

export const reviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5).transform((val) => val * 100),
    comment: z.string().min(1),
    listingId: z.string()
});