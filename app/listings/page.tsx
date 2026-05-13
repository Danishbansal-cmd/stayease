"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchListings } from "@/lib/store/features/listingsSlice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ListingsPage() {
  const dispatch = useAppDispatch();
  const { items: listings, loading, error } = useAppSelector((state) => state.listings);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 mt-10">
        
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Explore Listings</h1>
          <p className="text-zinc-400 mt-2">Find your perfect stay across the globe.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl text-zinc-400">Loading listings...</div>
        ) : error ? (
          <div className="text-center py-20 text-xl text-red-400">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-xl text-zinc-400">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Card key={listing.id} className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 group">
                <div className="h-64 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800"} 
                    alt={listing.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="rounded-none bg-black/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                      ${listing.pricePerNight / 100} / night
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-cyan-400 transition-colors">{listing.title}</CardTitle>
                  <CardDescription className="text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {listing.city}, {listing.country}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 pb-6 border-t border-white/5 mt-4 bg-black/20">
                  <Link href={`/listings/${listing.id}`} className="w-full">
                    <Button className="w-full rounded-none bg-indigo-600 hover:bg-cyan-600 text-white transition-colors">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
