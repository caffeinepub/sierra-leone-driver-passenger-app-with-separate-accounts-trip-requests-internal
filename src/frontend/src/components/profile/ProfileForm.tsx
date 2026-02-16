import { useState } from 'react';
import { useUpdateProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Loader2, User, Car } from 'lucide-react';
import type { UserProfile } from '../../backend';
import { AccountType } from '../../backend';

interface ProfileFormProps {
  profile: UserProfile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);

  const updateMutation = useUpdateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ fullName, phone });
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setPhone(profile.phone);
    setIsEditing(false);
  };

  const isDriver = profile.accountType === AccountType.driver;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDriver ? 'bg-secondary/10' : 'bg-primary/10'}`}>
              {isDriver ? (
                <Car className="h-6 w-6 text-secondary" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                <Badge variant={isDriver ? 'secondary' : 'default'} className="mt-1">
                  {isDriver ? 'Driver' : 'Passenger'}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editFullName">Full Name</Label>
              <Input
                id="editFullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone Number</Label>
              <Input
                id="editPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Full Name</Label>
              <p className="text-lg font-medium">{profile.fullName}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Phone Number</Label>
              <p className="text-lg font-medium">{profile.phone}</p>
            </div>

            <Button onClick={() => setIsEditing(true)} className="w-full">
              Edit Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
