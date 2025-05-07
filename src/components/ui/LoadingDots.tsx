import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
    </div>
  );
}
