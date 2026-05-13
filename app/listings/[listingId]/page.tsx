import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, BedDouble, Bath, Star } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ listingId: string }> }): Promise<Metadata> {
  const { listingId } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { title: true, description: true }
  });

  if (!listing) return { title: "Listing Not Found | StayEase" };

  return {
    title: `${listing.title} | StayEase`,
    description: listing.description.substring(0, 160),
  };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params;
  
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      host: {
        select: {
          name: true,
          avatar: true,
        }
      },
      reviews: {
        include: {
          user: {
            select: { name: true, avatar: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!listing) {
    notFound();
  }

  // Calculate average rating
  const avgRating = listing.reviews.length > 0
    ? listing.reviews.reduce((acc, rev) => acc + rev.rating, 0) / listing.reviews.length / 100
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              {avgRating > 0 ? avgRating.toFixed(1) : "New"} ({listing.reviews.length} reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-5 h-5 text-indigo-400" />
              {listing.address}, {listing.city}, {listing.country}
            </span>
            <Badge className="bg-white/10 text-cyan-300 hover:bg-white/20 border-white/5">
              {listing.type}
            </Badge>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh] min-h-[400px]">
          <div className="h-full relative rounded-xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={listing.images[0] || "https://images.unsplash.com/photo-1542204165-65bf26472b9b"} 
              alt={listing.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="grid grid-rows-2 gap-4 h-full">
            {listing.images.slice(1, 3).map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden group h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt={`${listing.title} - View ${idx + 2}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
            {/* Fallback if less than 3 images */}
            {listing.images.length < 3 && Array.from({ length: 3 - listing.images.length }).map((_, idx) => (
              <div key={`fallback-${idx}`} className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 h-full flex items-center justify-center">
                <span className="text-zinc-600">No Image Provided</span>
              </div>
            ))}
          </div>
        </div>

        {/* Details & Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Overview stats */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>{listing.maxGuests} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-cyan-400" />
                <span>{listing.bedrooms} Bedrooms • {listing.beds} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-indigo-400" />
                <span>{listing.bathrooms} Bathrooms</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About this place</h2>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold">Reviews</h2>
              {listing.reviews.length === 0 ? (
                <p className="text-zinc-500">No reviews yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listing.reviews.map((review) => (
                    <Card key={review.id} className="bg-white/5 border-white/10 backdrop-blur-md rounded-xl text-white">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-lg font-bold">
                            {review.user.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{review.user.name}</p>
                            <p className="text-sm text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-zinc-300">"{review.comment}"</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(review.rating / 100) ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'}`} 
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Host Info */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold">Meet your host</h2>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-xl text-white">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  {listing.host.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={listing.host.avatar} alt={listing.host.name} className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold border-2 border-white/10 shadow-lg shadow-indigo-500/20">
                      {listing.host.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold">{listing.host.name}</h3>
                    <p className="text-zinc-400 flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Superhost
                    </p>
                  </div>
                  <Button variant="outline" className="md:ml-auto w-full md:w-auto border-white/20 hover:bg-white/10 hover:text-white rounded-xl py-6">
                    Contact Host
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">${listing.pricePerNight / 100}</span>
                    <span className="text-zinc-400 mb-1">/ night</span>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-lg font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25">
                      Reserve Now
                    </Button>
                    <p className="text-center text-sm text-zinc-400">You won't be charged yet</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between text-zinc-300">
                      <span className="underline">Hosted by {listing.host.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
