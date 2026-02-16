import { useState } from 'react';
import AppHeader from '../layout/AppHeader';
import ProfileForm from '../profile/ProfileForm';
import DiamondsPanel from '../diamonds/DiamondsPanel';
import BuyersPanel from '../buyers/BuyersPanel';
import CreditsPage from '../../pages/CreditsPage';
import type { UserProfile } from '../../backend';

interface DashboardProps {
  userProfile: UserProfile;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'diamonds' | 'buyers' | 'profile' | 'credits'>('diamonds');

  return (
    <>
      <AppHeader onNavigate={setCurrentView} currentView={currentView} />
      
      <div className="page-container">
        {currentView === 'diamonds' && <DiamondsPanel />}
        
        {currentView === 'buyers' && <BuyersPanel />}
        
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <ProfileForm profile={userProfile} />
          </div>
        )}
        
        {currentView === 'credits' && <CreditsPage />}
      </div>
    </>
  );
}
