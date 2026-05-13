import Link from "next/link";
import { Home, Twitter, Facebook, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary/10 text-primary p-1.5 rounded-xl">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">StayEase</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Find your perfect stay, anywhere in the world. Seamless booking, secure payments, and unforgettable experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/listings" className="hover:text-primary transition-colors">All Listings</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Featured Properties</Link></li>
              <li><Link href="/coupons" className="hover:text-primary transition-colors">Special Offers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Host</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/host" className="hover:text-primary transition-colors">List Your Property</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Host Dashboard</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Host Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Insurance & Protection</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Safety Information</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cancellation Options</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StayEase. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
