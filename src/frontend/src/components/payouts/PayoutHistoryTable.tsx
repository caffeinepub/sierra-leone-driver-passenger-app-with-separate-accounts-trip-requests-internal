import { useGetPayoutHistory } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Loader2, History } from 'lucide-react';
import { PayoutStatus } from '../../backend';

export default function PayoutHistoryTable() {
  const { data: payouts, isLoading } = useGetPayoutHistory();

  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.requested:
        return 'default';
      case PayoutStatus.approved:
        return 'secondary';
      case PayoutStatus.paid:
        return 'outline';
      case PayoutStatus.rejected:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: PayoutStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
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
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
            <History className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>Track your payout requests and their status</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!payouts || payouts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No payout requests yet
          </p>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id.toString()}>
                    <TableCell className="font-medium">#{payout.id.toString()}</TableCell>
                    <TableCell className="text-sm">{formatDate(payout.createdAt)}</TableCell>
                    <TableCell className="font-semibold">{payout.amount.toString()} Le</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payout.status)}>
                        {getStatusLabel(payout.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
