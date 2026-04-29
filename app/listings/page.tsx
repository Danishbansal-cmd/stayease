import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ListingsPage() {
  const mockListings = [
    {
      id: "1",
      title: "Neon Cyber Loft",
      location: "Tokyo, Japan",
      price: 15000,
      image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800",
      type: "RENTED"
    },
    {
      id: "2",
      title: "Oceanview Minimalist Villa",
      location: "Malibu, CA",
      price: 45000,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      type: "OWNED"
    },
    {
      id: "3",
      title: "Historic Canal House",
      location: "Amsterdam, NL",
      price: 22000,
      image: "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&q=80&w=800",
      type: "RENTED"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 mt-10">
        
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Explore Listings</h1>
          <p className="text-zinc-400 mt-2">Find your perfect stay across the globe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockListings.map((listing) => (
            <Card key={listing.id} className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-64 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="rounded-none bg-black/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    ${listing.price / 100} / night
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-cyan-400 transition-colors">{listing.title}</CardTitle>
                <CardDescription className="text-zinc-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {listing.location}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 pb-6 border-t border-white/5 mt-4 bg-black/20">
                <Button className="w-full rounded-none bg-indigo-600 hover:bg-cyan-600 text-white transition-colors">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
