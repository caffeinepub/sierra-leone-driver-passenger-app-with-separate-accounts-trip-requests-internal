import { useState } from 'react';
import { useRequestPayout, useGetDriverEarnings } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle, Banknote } from 'lucide-react';

export default function PayoutRequestForm() {
  const [amount, setAmount] = useState('');
  const { data: earnings } = useGetDriverEarnings();
  const requestMutation = useRequestPayout();

  const availableBalance = Number(earnings || BigInt(0));
  const requestedAmount = amount ? parseInt(amount) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requestedAmount > availableBalance) {
      return;
    }

    try {
      await requestMutation.mutateAsync(BigInt(requestedAmount));
      setAmount('');
    } catch (error) {
      console.error('Payout request error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <Banknote className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <CardTitle>Request Payout</CardTitle>
            <CardDescription>Withdraw your earnings (internal accounting)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is an internal payout request system. No real payments are processed.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Leones)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              min="1"
              max={availableBalance}
            />
            <p className="text-sm text-muted-foreground">
              Available: {availableBalance.toLocaleString()} Le
            </p>
          </div>

          {requestedAmount > availableBalance && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Amount exceeds available balance
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={requestMutation.isPending || requestedAmount > availableBalance || requestedAmount <= 0}
            className="w-full"
          >
            {requestMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              'Request Payout'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
