import { useState } from 'react';
import { useCreateDiamondRecord } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import DiamondPhotoPicker from './DiamondPhotoPicker';

interface DiamondRecordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DiamondRecordForm({ onSuccess, onCancel }: DiamondRecordFormProps) {
  const [notes, setNotes] = useState('');
  const [carat, setCarat] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const createMutation = useCreateDiamondRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      toast.error('Please add some notes about the diamond');
      return;
    }

    try {
      await createMutation.mutateAsync({
        notes: notes.trim(),
        carat: carat ? parseFloat(carat) : undefined,
        estimatedValue: estimatedValue ? BigInt(estimatedValue) : undefined,
        photoUrl: photoUrl || undefined,
      });

      toast.success('Diamond record created successfully');
      setNotes('');
      setCarat('');
      setEstimatedValue('');
      setPhotoUrl(null);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create diamond record');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DiamondPhotoPicker value={photoUrl} onChange={setPhotoUrl} />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Required)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe the diamond (color, clarity, cut, origin, etc.)"
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="carat">Carat (Optional)</Label>
          <Input
            id="carat"
            type="number"
            step="0.01"
            min="0"
            value={carat}
            onChange={(e) => setCarat(e.target.value)}
            placeholder="e.g., 1.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Estimated Value (Optional)</Label>
          <Input
            id="estimatedValue"
            type="number"
            min="0"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            placeholder="e.g., 5000"
          />
          <p className="text-xs text-muted-foreground">
            User estimate only - not a professional appraisal
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Diamond Record'
          )}
        </Button>
      </div>
    </form>
  );
}
