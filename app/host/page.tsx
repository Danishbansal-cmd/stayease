import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HostDashboardPage() {
  const mockListings = [
    { id: "1", title: "Luxury Beachfront Villa", price: 25000, bookings: 12, status: "Active" },
    { id: "2", title: "Downtown Loft", price: 12000, bookings: 34, status: "Active" },
    { id: "3", title: "Cozy Mountain Cabin", price: 9500, bookings: 8, status: "Maintenance" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 mt-10">
        
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Host Dashboard</h1>
            <p className="text-zinc-400 mt-2">Manage your properties, reservations, and earnings.</p>
          </div>
          <Badge className="rounded-none bg-indigo-600 hover:bg-indigo-700 text-white border-0 px-4 py-1 text-sm">
            HOST MODE
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-none bg-indigo-900/20 border-indigo-500/30 text-white backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-indigo-300">Total Earnings</CardDescription>
              <CardTitle className="text-3xl text-cyan-400">$12,450</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">+14% from last month</p>
            </CardContent>
          </Card>
          <Card className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Active Listings</CardDescription>
              <CardTitle className="text-3xl text-white">3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">1 in maintenance</p>
            </CardContent>
          </Card>
          <Card className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Upcoming Bookings</CardDescription>
              <CardTitle className="text-3xl text-white">7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">Next check-in: Tomorrow</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl mt-8">
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription className="text-zinc-400">Overview of your current listings performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-zinc-400">Property</TableHead>
                  <TableHead className="text-zinc-400">Price/Night</TableHead>
                  <TableHead className="text-zinc-400">Total Bookings</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockListings.map((listing) => (
                  <TableRow key={listing.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-indigo-100">{listing.title}</TableCell>
                    <TableCell className="text-zinc-300">${listing.price / 100}</TableCell>
                    <TableCell className="text-zinc-300">{listing.bookings}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-none ${listing.status === 'Active' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-red-500/20 text-red-300'} border-0`}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
