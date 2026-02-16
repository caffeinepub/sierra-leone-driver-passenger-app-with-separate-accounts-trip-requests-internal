import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Gem, Copy, Check, Calendar } from 'lucide-react';
import { useGenerateDiamondSummary } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { DiamondRecord } from '../../backend';

interface DiamondRecordCardProps {
  diamond: DiamondRecord;
  onSelect?: () => void;
}

export default function DiamondRecordCard({ diamond, onSelect }: DiamondRecordCardProps) {
  const [copied, setCopied] = useState(false);
  const generateSummary = useGenerateDiamondSummary();

  const handleCopySummary = async () => {
    try {
      const summary = await generateSummary.mutateAsync(diamond.id);
      
      if (summary) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        toast.success('Summary copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Failed to generate summary');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to copy summary');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Diamond #{diamond.id.toString()}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopySummary}
            disabled={generateSummary.isPending}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {formatDate(diamond.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {diamond.photoUrl && (
          <img 
            src={diamond.photoUrl} 
            alt="Diamond" 
            className="w-full h-32 object-cover rounded-md"
          />
        )}

        <div className="space-y-2">
          {diamond.carat !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Carat:</span>
              <Badge variant="secondary">{diamond.carat.toFixed(2)}</Badge>
            </div>
          )}

          {diamond.estimatedValue !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estimated Value:</span>
              <Badge variant="outline">${diamond.estimatedValue.toString()}</Badge>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-1">Notes:</p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {diamond.notes}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic">
          User estimate - not a professional appraisal
        </p>
      </CardContent>
    </Card>
  );
}
