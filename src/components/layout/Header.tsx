import { BotMessageSquare } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/30 shadow-sm bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-3">
        <BotMessageSquare className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Zoro Assistant
        </h1>
      </div>
    </header>
  );
}
