import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ReviewsPage() {
  const mockReviews = [
    { id: "1", property: "Neon Cyber Loft", rating: 5, user: "Alice", comment: "Absolutely stunning place! The lighting is incredible.", date: "Oct 16, 2026" },
    { id: "2", property: "Oceanview Minimalist Villa", rating: 4, user: "Bob", comment: "Great views, but the Wi-Fi was a bit slow.", date: "Nov 08, 2026" },
    { id: "3", property: "Neon Cyber Loft", rating: 5, user: "Charlie", comment: "Perfect location for exploring the city.", date: "Sep 20, 2026" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 mt-10">
        
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Community Reviews</h1>
          <p className="text-zinc-400 mt-2">See what others are saying about our top properties.</p>
        </div>

        <div className="space-y-6">
          {mockReviews.map((review) => (
            <Card key={review.id} className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-colors">
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <Avatar className="h-10 w-10 rounded-none border border-cyan-500/30">
                  <AvatarFallback className="rounded-none bg-indigo-900 text-cyan-200">
                    {review.user[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-indigo-100">{review.user}</CardTitle>
                      <CardDescription className="text-cyan-500/70">{review.property}</CardDescription>
                    </div>
                    <div className="flex text-cyan-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-cyan-400" : "text-zinc-700"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 border-t border-white/5">
                <p className="text-zinc-300 mt-4 leading-relaxed">
                  "{review.comment}"
                </p>
                <p className="text-xs text-zinc-600 mt-4">{review.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
