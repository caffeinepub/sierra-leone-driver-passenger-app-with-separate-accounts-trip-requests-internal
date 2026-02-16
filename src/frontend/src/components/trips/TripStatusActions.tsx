import { useCancelTrip, useCompleteTrip } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { TripRequest } from '../../backend';
import { TripStatus } from '../../backend';

interface TripStatusActionsProps {
  trip: TripRequest;
  role: 'passenger' | 'driver';
}

export default function TripStatusActions({ trip, role }: TripStatusActionsProps) {
  const cancelMutation = useCancelTrip();
  const completeMutation = useCompleteTrip();

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(trip.id);
    } catch (error) {
      console.error('Cancel trip error:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(trip.id);
    } catch (error) {
      console.error('Complete trip error:', error);
    }
  };

  // Passenger can cancel open trips
  if (role === 'passenger' && trip.status === TripStatus.open) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Trip
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this trip request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Trip'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Driver can complete accepted trips
  if (role === 'driver' && trip.status === TripStatus.accepted) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Trip
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this trip as completed? The fare of {trip.fare?.toString() || '0'} Le will be added to your earnings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not Yet</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} disabled={completeMutation.isPending}>
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                'Yes, Complete Trip'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // No actions available for this status/role combination
  return null;
}
