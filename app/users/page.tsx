import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 mt-10">
        
        <div className="flex items-center space-x-6 bg-white/5 border border-white/10 p-8 shadow-xl backdrop-blur-md">
          <Avatar className="h-24 w-24 rounded-none border border-white/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="rounded-none bg-indigo-900 text-indigo-200 text-2xl">JD</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">John Doe</h1>
            <p className="text-zinc-400">john.doe@example.com • +1 234 567 890</p>
            <Badge className="rounded-none bg-indigo-500/20 text-cyan-300 hover:bg-indigo-500/30 border-0">GUEST</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl hover:border-cyan-500/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Quick Stats</CardTitle>
              <CardDescription className="text-zinc-400">Your activity summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Total Bookings</span>
                <span className="font-bold text-cyan-400">4</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Reviews Left</span>
                <span className="font-bold text-cyan-400">2</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-zinc-400">Coupons Used</span>
                <span className="font-bold text-cyan-400">1</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl hover:border-cyan-500/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription className="text-zinc-400">Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="h-2 w-2 bg-cyan-500"></div>
                  Booked <span className="text-white font-medium">Luxury Villa in Bali</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="h-2 w-2 bg-indigo-500"></div>
                  Left a review for <span className="text-white font-medium">Cozy Cabin in Alps</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
