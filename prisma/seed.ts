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

  const listing2 = await prisma.listing.create({
    data: {
      title: 'Neon Cyber Loft',
      pricePerNight: 15000, // $150
      type: 'RENTED',
      address: '404 Shibuya Crossing',
      city: 'Tokyo',
      country: 'Japan',
      lat: 35.6595,
      long: 139.7005,
      images: [
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800'
      ],
      description: 'A futuristic loft in the heart of Tokyo.',
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'City View'],
      availableFrom: new Date(),
      availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      hostId: host.id,
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      title: 'Historic Canal House',
      pricePerNight: 22000, // $220
      type: 'RENTED',
      address: '101 Herengracht',
      city: 'Amsterdam',
      country: 'Netherlands',
      lat: 52.3676,
      long: 4.9041,
      images: [
        'https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&q=80&w=800'
      ],
      description: 'Charming 17th-century house on the famous canals.',
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Heating', 'Kitchen', 'Waterfront'],
      availableFrom: new Date(),
      availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      hostId: host.id,
    },
  });

  const listing4 = await prisma.listing.create({
    data: {
      title: 'Rustic Mountain Cabin',
      pricePerNight: 12000, // $120
      type: 'OWNED',
      address: '77 Pine Ridge',
      city: 'Aspen',
      country: 'USA',
      lat: 39.1911,
      long: -106.8175,
      images: [
        'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&q=80&w=800'
      ],
      description: 'Cozy cabin perfect for a winter getaway.',
      maxGuests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Ski-in/Ski-out'],
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