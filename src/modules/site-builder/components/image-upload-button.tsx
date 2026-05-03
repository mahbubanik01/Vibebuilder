import React, { useRef } from 'react';
import { Button } from '@/components/ui-kit/button';
import { Upload, Loader2 } from 'lucide-react';
import { useFileUpload } from '../hooks/use-file-upload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  className?: string;
}

export function ImageUploadButton({ onUploadSuccess, className }: ImageUploadButtonProps) {
  const { uploadFile, isUploading } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type and size (e.g., max 5MB)
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please select an image file.',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Image size must be less than 5MB.',
      });
      return;
    }

    const url = await uploadFile(file);
    if (url) {
      onUploadSuccess(url);
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error uploading your image.',
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="outline"
        size="icon"
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        title="Upload Image"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      </Button>
    </div>
  );
}
