import { useState } from 'react';
import { useCreateTripRequest } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import type { Location } from '../../backend';

export default function TripRequestForm() {
  const [pickupDesc, setPickupDesc] = useState('');
  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [dropoffDesc, setDropoffDesc] = useState('');
  const [dropoffLat, setDropoffLat] = useState('');
  const [dropoffLng, setDropoffLng] = useState('');
  const [fare, setFare] = useState('');

  const createMutation = useCreateTripRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pickup: Location = {
      description: pickupDesc,
      latitude: pickupLat ? parseFloat(pickupLat) : undefined,
      longitude: pickupLng ? parseFloat(pickupLng) : undefined,
    };

    const dropoff: Location = {
      description: dropoffDesc,
      latitude: dropoffLat ? parseFloat(dropoffLat) : undefined,
      longitude: dropoffLng ? parseFloat(dropoffLng) : undefined,
    };

    try {
      await createMutation.mutateAsync({
        pickup,
        dropoff,
        fare: BigInt(fare),
      });

      // Reset form
      setPickupDesc('');
      setPickupLat('');
      setPickupLng('');
      setDropoffDesc('');
      setDropoffLat('');
      setDropoffLng('');
      setFare('');
    } catch (error) {
      console.error('Create trip error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Trip Request</CardTitle>
        <CardDescription>Enter your pickup and dropoff locations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Location */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Pickup Location</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pickupDesc">Location Description *</Label>
              <Input
                id="pickupDesc"
                value={pickupDesc}
                onChange={(e) => setPickupDesc(e.target.value)}
                placeholder="e.g., Lumley Beach, Freetown"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pickupLat">Latitude (optional)</Label>
                <Input
                  id="pickupLat"
                  type="number"
                  step="any"
                  value={pickupLat}
                  onChange={(e) => setPickupLat(e.target.value)}
                  placeholder="8.4657"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupLng">Longitude (optional)</Label>
                <Input
                  id="pickupLng"
                  type="number"
                  step="any"
                  value={pickupLng}
                  onChange={(e) => setPickupLng(e.target.value)}
                  placeholder="-13.2317"
                />
              </div>
            </div>
          </div>

          {/* Dropoff Location */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-secondary" />
              <Label className="text-base font-semibold">Dropoff Location</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dropoffDesc">Location Description *</Label>
              <Input
                id="dropoffDesc"
                value={dropoffDesc}
                onChange={(e) => setDropoffDesc(e.target.value)}
                placeholder="e.g., Cotton Tree, Central Freetown"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dropoffLat">Latitude (optional)</Label>
                <Input
                  id="dropoffLat"
                  type="number"
                  step="any"
                  value={dropoffLat}
                  onChange={(e) => setDropoffLat(e.target.value)}
                  placeholder="8.4840"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoffLng">Longitude (optional)</Label>
                <Input
                  id="dropoffLng"
                  type="number"
                  step="any"
                  value={dropoffLng}
                  onChange={(e) => setDropoffLng(e.target.value)}
                  placeholder="-13.2299"
                />
              </div>
            </div>
          </div>

          {/* Fare */}
          <div className="space-y-2">
            <Label htmlFor="fare">Fare Amount (Leones) *</Label>
            <Input
              id="fare"
              type="number"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              placeholder="50000"
              required
              min="0"
            />
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Request...
              </>
            ) : (
              'Request Trip'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
