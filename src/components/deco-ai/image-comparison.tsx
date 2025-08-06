'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Download, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  original: string;
  styled: string;
}

export function ImageComparison({ original, styled }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = styled;
    link.download = 'decoai-styled-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle>غرفتك المعاد تصميمها</CardTitle>
        <CardDescription>حرك لمقارنة الصور الأصلية والمصممة.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video select-none" ref={containerRef}>
          <Image
            src={original}
            alt="Original room"
            fill
            className="rounded-md object-contain"
            unoptimized
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <Image
              src={styled}
              alt="Styled room"
              fill
              className="rounded-md object-contain"
              unoptimized
            />
          </div>
          
          <Slider
            defaultValue={[50]}
            onValueChange={(value) => setSliderPosition(value[0])}
            className={cn(
              'absolute inset-0 w-full h-full opacity-0 cursor-ew-resize',
              '[&_[role=slider]]:focus-visible:ring-0 [&_[role=slider]]:focus-visible:ring-offset-0'
            )}
          />

          <div
            className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm -translate-x-1/2 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold">
          <Download className="ml-2 h-5 w-5" />
          تنزيل الصورة المصممة
        </Button>
      </CardFooter>
    </Card>
  );
}
