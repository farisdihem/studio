'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageUp, Loader2, Wand2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn, fileToDataUri } from '@/lib/utils';
import { generateStyledImageAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ImageComparison } from './image-comparison';

const styles = ['Modern', 'Classic', 'Luxury', 'Minimalist', 'Industrial', 'Bohemian'];

export function MainPanel() {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(styles[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setOriginalImageFile(file);
      fileToDataUri(file).then(setOriginalImagePreview);
      setGeneratedImage(null);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (e.g., JPG, PNG).",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleGenerateClick = async () => {
    if (!originalImageFile) {
      toast({
        title: 'No Image Selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const photoDataUri = await fileToDataUri(originalImageFile);
      const result = await generateStyledImageAction({ photoDataUri, style: selectedStyle });
      
      if (result.error) throw new Error(result.error);
      
      setGeneratedImage(result.redesignedImageDataUri!);

    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline tracking-tight">Design Your Space</CardTitle>
          <CardDescription>Upload a photo of your room and select a style to see the magic happen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="font-semibold text-base">1. Upload Image</Label>
            <div
              onDragEnter={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-all duration-300",
                isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30"
              )}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              {originalImagePreview ? (
                <div className="relative w-full aspect-video">
                  <Image src={originalImagePreview} alt="Uploaded room preview" fill className="mx-auto rounded-md object-contain" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
                  <ImageUp className="w-12 h-12" />
                  <p className="font-semibold">Click or drag file to this area to upload</p>
                  <p className="text-sm">Supports all image formats</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="style-select" className="font-semibold text-base">2. Select Style</Label>
            <Select onValueChange={setSelectedStyle} defaultValue={selectedStyle} disabled={isLoading}>
              <SelectTrigger id="style-select" className="text-base">
                <SelectValue placeholder="Choose a style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map(style => (
                  <SelectItem key={style} value={style} className="text-base">{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateClick} disabled={isLoading || !originalImageFile} className="w-full text-lg py-6 font-bold">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Design
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center min-h-[500px] lg:min-h-full">
        {isLoading && (
           <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/50 border-dashed animate-pulse">
             <Loader2 className="w-16 h-16 animate-spin text-primary" />
             <p className="mt-4 text-muted-foreground text-lg">AI is redesigning your room...</p>
             <p className="text-muted-foreground text-sm">This can take up to a minute.</p>
           </Card>
        )}
        {generatedImage && originalImagePreview && (
          <ImageComparison original={originalImagePreview} styled={generatedImage} />
        )}
        {!isLoading && !generatedImage && (
           <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/30 border-dashed">
             <div className="text-center text-muted-foreground p-8">
                <Sparkles className="mx-auto h-16 w-16 text-primary/70 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Your new design will appear here</h3>
                <p className="text-base">Follow the steps on the left to get started.</p>
             </div>
           </Card>
        )}
      </div>
    </div>
  );
}
