'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mic, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingDots } from '@/components/ui/LoadingDots';

interface VoicePromptFormProps {
  formAction: (payload: FormData) => void;
  currentPromptValue?: string; // To allow resetting from parent
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      aria-label="Send command"
      className="p-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95"
    >
      {pending ? (
        <LoadingDots className="h-5 w-5" />
      ) : (
        <SendHorizonal className="h-5 w-5" />
      )}
    </Button>
  );
}

export function VoicePromptForm({ formAction, currentPromptValue }: VoicePromptFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    // If currentPromptValue from parent is empty, it means the form was reset
    if (currentPromptValue === '') {
      setPrompt('');
    }
  }, [currentPromptValue]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Let react-dom handle the submission via formAction
  };
  
  return (
    <form
      ref={formRef}
      action={(formData) => {
        formAction(formData);
        // The parent will reset the prompt via currentPromptValue if successful
      }}
      onSubmit={handleFormSubmit}
      className="space-y-3"
    >
      <Label htmlFor="prompt" className="sr-only">Your Command</Label>
      <div className="flex items-center space-x-3 p-3 bg-card rounded-xl shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <Mic className="h-6 w-6 text-accent flex-shrink-0" />
        <Input
          id="prompt"
          name="prompt"
          placeholder="Enter command or use voice..."
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow bg-transparent border-0 focus:ring-2 focus:ring-accent/70 focus:border-accent/50 text-base placeholder-muted-foreground h-10"
        />
        <SubmitButton />
      </div>
    </form>
  );
}
