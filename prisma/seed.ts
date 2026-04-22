import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter});

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "Danish",
            email: "danishbansal60@gmail.com",
            role: "HOST"
        }
    });

    await prisma.listing.create({
        data: {
            title: "Cozy Apartment",
            description: "Nice place to stay",
            pricePerNight: 250000,
            address: "Delhi",
            city: "Delhi",
            country: "India",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            amenities: ["WiFi", "AC"],
            images: ["img1.jpg"],
            hostId: user.id,
        }
    });

    console.log("🌱 Seed data inserted");
}


main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());