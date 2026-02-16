import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Gem, ShoppingBag, FileText } from 'lucide-react';

export default function AuthWelcome() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/generated/diamond-logo.dim_512x512.png" 
              alt="Diamond Scout Logo" 
              className="h-20 w-20 rounded-2xl shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Diamond Scout</h1>
              <p className="text-muted-foreground">Assess & Connect with Buyers</p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/assets/generated/diamond-hero.dim_1600x600.png" 
              alt="Diamond Assessment" 
              className="w-full h-auto"
            />
          </div>

          {/* Welcome Card */}
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Welcome to Diamond Scout</CardTitle>
              <CardDescription className="text-base">
                Document your diamonds and connect with verified buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Gem className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Record Diamond Details</p>
                    <p className="text-sm text-muted-foreground">Document carat, estimated value, and observations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Track Your Collection</p>
                    <p className="text-sm text-muted-foreground">Keep organized records with photos and notes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ShoppingBag className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Connect with Buyers</p>
                    <p className="text-sm text-muted-foreground">Access curated buyer platforms and share details</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={login} 
                disabled={isLoggingIn}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure authentication powered by Internet Identity
              </p>
            </CardContent>
          </Card>

          <div className="max-w-md text-center">
            <p className="text-xs text-muted-foreground italic">
              Note: All values shown are user-entered estimates. This app does not verify diamond authenticity or provide professional appraisals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
