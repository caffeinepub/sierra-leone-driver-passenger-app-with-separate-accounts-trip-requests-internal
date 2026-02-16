import { useState } from 'react';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu, Gem, User, Award, ShoppingBag } from 'lucide-react';
import { AccountType } from '../../backend';

interface AppHeaderProps {
  onNavigate?: (view: 'diamonds' | 'buyers' | 'profile' | 'credits') => void;
  currentView?: string;
}

export default function AppHeader({ onNavigate, currentView }: AppHeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (view: 'diamonds' | 'buyers' | 'profile' | 'credits') => {
    onNavigate?.(view);
    setIsOpen(false);
  };

  const navItems = [
    { id: 'diamonds', label: 'My Diamonds', icon: Gem },
    { id: 'buyers', label: 'Buyers', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'credits', label: 'Credits', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/generated/diamond-logo.dim_512x512.png" 
              alt="Diamond Scout" 
              className="h-10 w-10 rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Diamond Scout</h1>
              {userProfile && (
                <p className="text-xs text-muted-foreground">
                  {userProfile.fullName}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavClick(item.id as any)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            <div className="ml-4">
              <LoginButton />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <LoginButton />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? 'default' : 'ghost'}
                        className="justify-start"
                        onClick={() => handleNavClick(item.id as any)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
