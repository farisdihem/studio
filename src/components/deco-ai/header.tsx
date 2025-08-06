import { Brush } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brush className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline tracking-tight">DecoAI</h1>
        </div>
      </div>
    </header>
  );
}
