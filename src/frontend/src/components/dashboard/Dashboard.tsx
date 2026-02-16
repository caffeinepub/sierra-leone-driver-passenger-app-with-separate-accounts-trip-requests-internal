import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AppHeader from '../layout/AppHeader';
import ProfileForm from '../profile/ProfileForm';
import PassengerDashboard from './PassengerDashboard';
import DriverDashboard from './DriverDashboard';
import DriverPayoutsPanel from '../payouts/DriverPayoutsPanel';
import CreditsPage from '../../pages/CreditsPage';
import type { UserProfile } from '../../backend';
import { AccountType } from '../../backend';

interface DashboardProps {
  userProfile: UserProfile;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'payouts' | 'credits'>('dashboard');

  const isDriver = userProfile.accountType === AccountType.driver;

  return (
    <>
      <AppHeader onNavigate={setCurrentView} currentView={currentView} />
      
      <div className="page-container">
        {currentView === 'dashboard' && (
          isDriver ? <DriverDashboard /> : <PassengerDashboard />
        )}
        
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <ProfileForm profile={userProfile} />
          </div>
        )}
        
        {currentView === 'payouts' && isDriver && (
          <DriverPayoutsPanel />
        )}
        
        {currentView === 'credits' && (
          <CreditsPage />
        )}
      </div>
    </>
  );
}
