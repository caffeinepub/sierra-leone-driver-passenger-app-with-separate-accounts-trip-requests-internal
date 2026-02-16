import { useState } from 'react';
import { useRegisterUser } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, Car, User } from 'lucide-react';
import { AccountType } from '../../backend';

export default function RoleSelectCard() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<AccountType | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  const registerMutation = useRegisterUser();

  const handleRoleSelect = (role: AccountType) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      await registerMutation.mutateAsync({
        accountType: selectedRole,
        fullName,
        phone,
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Choose Your Role</CardTitle>
            <CardDescription className="text-base">
              Select how you'll use SL GPS
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect(AccountType.passenger)}
              className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all p-8 text-left bg-card hover:bg-accent/50"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Passenger</h3>
                  <p className="text-sm text-muted-foreground">
                    Request rides and travel across Sierra Leone
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect(AccountType.driver)}
              className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-secondary transition-all p-8 text-left bg-card hover:bg-accent/50"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Car className="h-10 w-10 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Driver</h3>
                  <p className="text-sm text-muted-foreground">
                    Accept trips and earn money driving
                  </p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            {selectedRole === AccountType.driver ? 'Driver' : 'Passenger'} Information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 XX XXX XXXX"
                required
              />
            </div>

            {selectedRole === AccountType.driver && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType} required>
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="taxi">Taxi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate">Vehicle Plate Number</Label>
                  <Input
                    id="vehiclePlate"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="ABC 1234"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('role')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex-1"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
