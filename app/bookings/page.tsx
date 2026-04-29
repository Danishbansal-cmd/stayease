import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BookingsPage() {
  const mockBookings = [
    { id: "B-1001", property: "Neon Cyber Loft", dates: "Oct 12 - Oct 15", guests: 2, total: 45000, status: "CONFIRMED" },
    { id: "B-1002", property: "Oceanview Minimalist Villa", dates: "Nov 01 - Nov 07", guests: 4, total: 270000, status: "PENDING" },
    { id: "B-1003", property: "Historic Canal House", dates: "Dec 20 - Dec 27", guests: 2, total: 154000, status: "CANCELLED" },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'PENDING': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 mt-10">
        
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">My Bookings</h1>
          <p className="text-zinc-400 mt-2">Track and manage your upcoming and past reservations.</p>
        </div>

        <Card className="rounded-none bg-white/5 border-white/10 text-white backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Reservation History</CardTitle>
            <CardDescription className="text-zinc-400">All your bookings are listed below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-zinc-400">Booking ID</TableHead>
                  <TableHead className="text-zinc-400">Property</TableHead>
                  <TableHead className="text-zinc-400">Dates</TableHead>
                  <TableHead className="text-zinc-400">Guests</TableHead>
                  <TableHead className="text-zinc-400">Total</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-mono text-xs text-zinc-500">{booking.id}</TableCell>
                    <TableCell className="font-medium text-indigo-100">{booking.property}</TableCell>
                    <TableCell className="text-zinc-300">{booking.dates}</TableCell>
                    <TableCell className="text-zinc-300">{booking.guests}</TableCell>
                    <TableCell className="text-zinc-300">${booking.total / 100}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-none border ${getStatusColor(booking.status)}`}>
                        {booking.status}
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
