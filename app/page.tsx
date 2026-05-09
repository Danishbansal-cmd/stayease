import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Luxury modern villa"
            fill
            className="object-cover brightness-[0.65] transform scale-105 animate-in fade-in zoom-in duration-1000"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-8 mt-16">
          <div className="space-y-4 max-w-4xl animate-in slide-in-from-bottom-8 duration-700 delay-150">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl">
              Find your next <span className="text-primary/90">perfect stay</span>.
            </h1>
            <p className="text-lg md:text-2xl text-zinc-200 max-w-2xl mx-auto drop-shadow-md">
              Discover extraordinary homes with all the comforts of a five-star hotel.
            </p>
          </div>

          {/* Search Bar Component */}
          <div className="w-full max-w-3xl bg-background/95 backdrop-blur-md p-3 md:p-4 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-12 duration-700 delay-300">
            <div className="flex-1 flex items-center px-4 py-2 w-full border-b md:border-b-0 md:border-r border-border/50">
              <MapPin className="h-5 w-5 text-primary mr-3 shrink-0" />
              <div className="flex flex-col w-full text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Where</span>
                <input type="text" placeholder="Search destinations" className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground placeholder:font-normal" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center px-4 py-2 w-full border-b md:border-b-0 md:border-r border-border/50">
              <Calendar className="h-5 w-5 text-primary mr-3 shrink-0" />
              <div className="flex flex-col w-full text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">When</span>
                <input type="text" placeholder="Add dates" className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground placeholder:font-normal" />
              </div>
            </div>

            <Button className="w-full md:w-auto rounded-full h-14 px-8 text-base font-semibold shadow-lg hover:scale-105 transition-transform bg-primary text-primary-foreground">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked homes for your next getaway.</p>
            </div>
            <Link href="/listings" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dummy Listing Cards */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group cursor-pointer flex flex-col gap-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                  {/* We would use actual images here, fallback to gray block for now */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image 
                    src={`/hero.png`} 
                    alt="Listing" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      Luxury Villa {item}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      4.9{item}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">Bali, Indonesia</p>
                  <p className="mt-1 font-semibold">
                    ${150 + item * 50} <span className="text-muted-foreground font-normal text-sm">night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-24 bg-muted/50 border-t">
        <div className="container mx-auto px-4 flex flex-col items-center text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Become a Host Today</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Earn extra income and unlock new opportunities by sharing your space. It&apos;s easy to get started.
          </p>

          <Button size="lg" className="rounded-full text-lg px-8 h-14" asChild>
            <Link href="/host">Learn more about hosting</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
