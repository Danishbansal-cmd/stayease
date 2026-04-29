import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Cleaning database...');
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.availability.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating users...');
  // 1. Create Host
  const host = await prisma.user.create({
    data: {
      name: 'Super Host',
      email: 'host@stayease.com',
      password: hashedPassword,
      role: 'HOST',
      phonenumber: '1234567890',
    },
  });

  // 2. Create Guest
  const guest = await prisma.user.create({
    data: {
      name: 'Traveler Jane',
      email: 'jane@stayease.com',
      password: hashedPassword,
      role: 'GUEST',
      phonenumber: '0987654321',
    },
  });

  console.log('Creating listings...');
  // 3. Create Listing
  const listing = await prisma.listing.create({
    data: {
      title: 'Luxury Beachfront Villa',
      pricePerNight: 25000, // paisa = $250
      type: 'RENTED',
      address: '123 Ocean Drive',
      city: 'Malibu',
      country: 'USA',
      lat: 34.0259,
      long: -118.7798,
      images: [
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      ],
      description: 'A beautiful beachfront villa with amazing views and private access to the ocean.',
      maxGuests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      amenities: ['WiFi', 'Pool', 'Ocean View', 'Kitchen', 'Free Parking'],
      availableFrom: new Date(),
      availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      hostId: host.id,
    },
  });

  console.log('Creating bookings...');
  // 4. Create Booking
  await prisma.booking.create({
    data: {
      totalPrice: 75000, // 3 nights
      status: 'CONFIRMED',
      checkInDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      persons: 2,
      userId: guest.id,
      listingId: listing.id,
    },
  });

  console.log('Creating reviews...');
  // 5. Create Review
  await prisma.review.create({
    data: {
      rating: 500, // 5 stars (out of 500 based on validation constraint)
      comment: 'Absolutely amazing stay! The view was breathtaking.',
      userId: guest.id,
      listingId: listing.id,
    },
  });

  console.log('Dummy data has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });