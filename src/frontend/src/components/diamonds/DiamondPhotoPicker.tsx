import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Camera, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface DiamondPhotoPickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function DiamondPhotoPicker({ value, onChange }: DiamondPhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange(dataUrl);
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem(`diamond-photo-${Date.now()}`, dataUrl);
      } catch (e) {
        console.warn('Failed to store photo in localStorage');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label>Photo (Optional)</Label>
      
      <Alert>
        <Camera className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Photos are stored locally on your device for viewing only. They are not proof of authenticity and are not uploaded to any server.
        </AlertDescription>
      </Alert>

      {value ? (
        <div className="relative">
          <img 
            src={value} 
            alt="Diamond" 
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
