import { useGetDriverEarnings, useGetDriverTrips } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Loader2, Wallet, TrendingUp } from 'lucide-react';
import { TripStatus } from '../../backend';

export default function DriverEarningsCard() {
  const { data: earnings, isLoading: earningsLoading } = useGetDriverEarnings();
  const { data: trips, isLoading: tripsLoading } = useGetDriverTrips();

  const completedTrips = trips?.filter(trip => trip.status === TripStatus.completed) || [];

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  if (earningsLoading || tripsLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Earnings Summary</CardTitle>
            <CardDescription>Your available balance and transaction history</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Balance */}
        <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-primary">
            {earnings?.toString() || '0'} <span className="text-xl">Le</span>
          </p>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold">Recent Earnings</h3>
          </div>
          
          {completedTrips.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No completed trips yet
            </p>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTrips.slice(0, 5).map((trip) => (
                    <TableRow key={trip.id.toString()}>
                      <TableCell className="font-medium">#{trip.id.toString()}</TableCell>
                      <TableCell>{formatDate(trip.completedAt)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        +{trip.fare?.toString() || '0'} Le
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
