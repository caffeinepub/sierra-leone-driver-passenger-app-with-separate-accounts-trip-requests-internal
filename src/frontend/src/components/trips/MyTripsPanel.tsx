import { useGetPassengerTrips, useGetDriverTrips } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, MapPin, Navigation, DollarSign, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import TripStatusActions from './TripStatusActions';
import { TripStatus } from '../../backend';

interface MyTripsPanelProps {
  role: 'passenger' | 'driver';
}

export default function MyTripsPanel({ role }: MyTripsPanelProps) {
  const passengerQuery = useGetPassengerTrips();
  const driverQuery = useGetDriverTrips();

  const { data: trips, isLoading } = role === 'passenger' ? passengerQuery : driverQuery;

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case TripStatus.open:
        return 'default';
      case TripStatus.accepted:
        return 'secondary';
      case TripStatus.completed:
        return 'outline';
      case TripStatus.cancelled:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: TripStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          {role === 'passenger' 
            ? 'You have no trip requests yet. Create your first trip above!'
            : 'You have not accepted any trips yet. Check available trips above!'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {trips.map((trip) => (
        <Card key={trip.id.toString()}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Trip #{trip.id.toString()}</CardTitle>
              <Badge variant={getStatusColor(trip.status)}>
                {getStatusLabel(trip.status)}
              </Badge>
            </div>
            <CardDescription className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">{trip.fare?.toString() || '0'} Le</span>
              </span>
              <span className="flex items-center space-x-1 text-xs">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(trip.createdAt)}</span>
              </span>
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
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Navigation className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Dropoff</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {trip.dropoffLocation.description}
                  </p>
                </div>
              </div>
            </div>

            <TripStatusActions trip={trip} role={role} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
