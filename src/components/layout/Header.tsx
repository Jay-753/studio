import { BotMessageSquare } from 'lucide-react'; // Using BotMessageSquare as a placeholder for a "Zoro" or AI logo

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/50 shadow-sm bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <BotMessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Zoro Assistant
        </h1>
      </div>
    </header>
  );
}
