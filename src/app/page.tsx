import { Header } from '@/components/deco-ai/header';
import { MainPanel } from '@/components/deco-ai/main-panel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <MainPanel />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>DecoAI - حيث تبدأ الأفكار</p>
      </footer>
    </div>
  );
}
