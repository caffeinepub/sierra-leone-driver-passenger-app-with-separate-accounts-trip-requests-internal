import { useGetOpenTrips, useAcceptTrip } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2, MapPin, Navigation, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export default function OpenTripsList() {
  const { data: trips, isLoading } = useGetOpenTrips();
  const acceptMutation = useAcceptTrip();

  const handleAccept = async (tripId: bigint) => {
    try {
      await acceptMutation.mutateAsync(tripId);
    } catch (error) {
      console.error('Accept trip error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No open trips available at the moment. Check back soon!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Card key={trip.id.toString()} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Trip #{trip.id.toString()}</CardTitle>
              <Badge>Open</Badge>
            </div>
            <CardDescription className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">{trip.fare?.toString() || '0'} Le</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {trip.pickupLocation.description}
                  </p>
                  {trip.pickupLocation.latitude && trip.pickupLocation.longitude && (
                    <p className="text-xs text-muted-foreground">
                      {trip.pickupLocation.latitude.toFixed(4)}, {trip.pickupLocation.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Navigation className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Dropoff</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {trip.dropoffLocation.description}
                  </p>
                  {trip.dropoffLocation.latitude && trip.dropoffLocation.longitude && (
                    <p className="text-xs text-muted-foreground">
                      {trip.dropoffLocation.latitude.toFixed(4)}, {trip.dropoffLocation.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleAccept(trip.id)}
              disabled={acceptMutation.isPending}
              className="w-full"
            >
              {acceptMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Trip'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
