import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Loader2 } from 'lucide-react';
import AuthWelcome from './components/auth/AuthWelcome';
import RoleSelectCard from './components/profile/RoleSelectCard';
import Dashboard from './components/dashboard/Dashboard';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show loading during initialization
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show welcome/login screen if not authenticated
  if (!isAuthenticated) {
    return <AuthWelcome />;
  }

  // Show loading while fetching profile
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show role selection if authenticated but no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  
  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-background">
        <RoleSelectCard />
      </div>
    );
  }

  // Show main dashboard if authenticated and has profile
  if (userProfile) {
    return (
      <AppLayout>
        <Dashboard userProfile={userProfile} />
      </AppLayout>
    );
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
