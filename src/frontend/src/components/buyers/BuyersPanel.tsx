import { useGetBuyerPlatforms } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, ExternalLink, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export default function BuyersPanel() {
  const { data: platforms, isLoading } = useGetBuyerPlatforms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          Buyer Platforms
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect with verified diamond buyers and marketplaces
        </p>
      </div>

      <Alert>
        <AlertDescription>
          These are curated buyer platforms. Use the "Copy summary" button on your diamond records to share details with potential buyers.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {platforms?.map((platform) => (
          <Card key={platform.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {platform.name}
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>Diamond marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="default"
                className="w-full"
                onClick={() => window.open(platform.url, '_blank', 'noopener,noreferrer')}
              >
                Visit Platform
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">How to Connect with Buyers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Document your diamond details in the "My Diamonds" section</p>
          <p>2. Use the copy button to copy a plain-English summary of your diamond</p>
          <p>3. Visit a buyer platform and share your diamond details</p>
          <p>4. Follow the platform's process for evaluation and offers</p>
        </CardContent>
      </Card>
    </div>
  );
}
