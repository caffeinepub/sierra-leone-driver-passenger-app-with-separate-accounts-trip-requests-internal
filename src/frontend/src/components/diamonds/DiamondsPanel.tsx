import { useState } from 'react';
import { useGetMyDiamondRecords } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Plus, Gem } from 'lucide-react';
import DiamondRecordForm from './DiamondRecordForm';
import DiamondRecordCard from './DiamondRecordCard';
import { Alert, AlertDescription } from '../ui/alert';

export default function DiamondsPanel() {
  const { data: diamonds, isLoading } = useGetMyDiamondRecords();
  const [showForm, setShowForm] = useState(false);
  const [selectedDiamond, setSelectedDiamond] = useState<bigint | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gem className="h-8 w-8 text-primary" />
            My Diamonds
          </h1>
          <p className="text-muted-foreground mt-1">
            Document and track your diamond collection
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Diamond
        </Button>
      </div>

      <Alert>
        <AlertDescription>
          All values are user-entered estimates. This app does not verify diamond authenticity or provide professional appraisals.
        </AlertDescription>
      </Alert>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Diamond Record</CardTitle>
            <CardDescription>
              Document your diamond details for your personal records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DiamondRecordForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {diamonds && diamonds.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diamonds.map((diamond) => (
            <DiamondRecordCard 
              key={diamond.id.toString()} 
              diamond={diamond}
              onSelect={() => setSelectedDiamond(diamond.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Gem className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No diamonds recorded yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start documenting your diamond collection by adding your first record
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Diamond
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
