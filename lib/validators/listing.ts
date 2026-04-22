import { title } from "process";
import { z } from "zod";

export const listingSchema = z.object({
    title: z.string(),
    description: z.string(),

    pricePerNight: z.number().positive(),

    address: z.string(),
    city: z.string(),
    country: z.string(),

    lat: z.coerce.number().min(-90).max(90).optional().nullable(),
    long: z.coerce.number().min(-180).max(180).optional().nullable(),

    maxGuests: z.number().int().positive(),
    bedrooms: z.number().int().min(0),
    beds: z.number().int().positive(),
    bathrooms: z.number().int().positive(),

    images: z.array(z.string()),
    amenities: z.array(z.string()),
});