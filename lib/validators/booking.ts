import { z } from "zod";

export const bookingSchema = z.object({
  // totalPrice: z.coerce.number().int().positive(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),

  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),

  persons: z.coerce.number().int().positive(),
  
  listingId: z.string(),
  userId: z.string(),
  couponId: z.string().optional(),
});
