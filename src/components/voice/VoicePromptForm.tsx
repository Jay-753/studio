
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mic, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoicePromptFormProps {
  formAction: (payload: FormData) => void;
  currentPromptValue?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      aria-label="Send command"
      className="p-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 flex-shrink-0"
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
  // Initialize local prompt state with currentPromptValue.
  // This ensures that if the parent provides an initial value (e.g. on error recovery), it's used.
  const [prompt, setPrompt] = useState(currentPromptValue || '');
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(false);

  // Effect for setting up Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        setIsSpeechApiSupported(true);
        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;

        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          toast({ title: "Listening...", description: "Speak your command.", duration: 3000 });
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setPrompt(transcript); // Update local prompt state with speech result
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          let errorMessage = 'An error occurred during speech recognition.';
          if (event.error === 'no-speech') {
            errorMessage = 'No speech was detected. Please try again.';
          } else if (event.error === 'audio-capture') {
            errorMessage = 'Audio capture failed. Ensure your microphone is working.';
          } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            errorMessage = 'Microphone access denied. Please enable it in your browser settings.';
          }
          toast({ variant: 'destructive', title: 'Voice Error', description: errorMessage });
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsSpeechApiSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current && typeof recognitionRef.current.stop === 'function') {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // console.warn("Error stopping speech recognition on unmount:", e);
        }
      }
    };
  }, [toast]); // toast is stable, so this effect runs once on mount.

  // Effect to synchronize local `prompt` state with `currentPromptValue` from parent.
  // This handles cases like form reset (parent sets currentPromptValue to '')
  // or when the parent provides a new value (e.g., error recovery).
  useEffect(() => {
    const parentValue = currentPromptValue || '';
    if (prompt !== parentValue) {
      setPrompt(parentValue);
    }

    // If the parent cleared the prompt (e.g., after successful submission)
    // and the microphone was listening, stop listening.
    if (parentValue === '' && isListening && recognitionRef.current && typeof recognitionRef.current.stop === 'function') {
      try {
        recognitionRef.current.stop();
      } catch (e) { /* ignore */ }
    }
  // Only run this effect if currentPromptValue from the parent changes.
  // isListening is read here but should not trigger re-sync if it's the only thing changing.
  // Adding isListening to dependency array to satisfy exhaustive-deps,
  // but the core logic is driven by currentPromptValue changes.
  }, [currentPromptValue, isListening]);


  const handleToggleListening = () => {
    if (!isSpeechApiSupported || !recognitionRef.current) {
      toast({ variant: 'destructive', title: 'Unsupported', description: 'Speech recognition is not supported in this browser.' });
      return;
    }

    const recognition = recognitionRef.current;
    if (isListening) {
      recognition.stop();
    } else {
      try {
        // Clear previous prompt before starting new recognition
        // setPrompt(''); // Optional: clear prompt on new listen start
        recognition.start();
      } catch (e) {
        console.error("Error calling recognition.start():", e);
        toast({ variant: 'destructive', title: 'Voice Error', description: 'Could not start voice recognition. Please try again.' });
        setIsListening(false); 
      }
    }
  };
  
  return (
    <form
      ref={formRef}
      action={(formData) => {
        // Ensure the form uses the latest `prompt` state for submission
        // This is important if `prompt` is updated by speech after initial `currentPromptValue`
        formData.set('prompt', prompt);
        formAction(formData);
      }}
      className="space-y-3"
    >
      <Label htmlFor="prompt" className="sr-only">Your Command</Label>
      <div className={cn(
        "flex items-center space-x-2 p-2 bg-card rounded-xl shadow-lg border border-border/50",
        "focus-within:ring-2 focus-within:ring-primary/70 focus-within:border-primary/50",
        "hover:shadow-xl transition-all duration-300 ease-in-out"
      )}>
        <Button
          type="button"
          onClick={handleToggleListening}
          disabled={!isSpeechApiSupported}
          variant="ghost"
          size="icon"
          className={cn(
            "p-2.5 rounded-lg flex-shrink-0 text-primary/80 hover:text-primary hover:bg-primary/10",
            "w-10 h-10 transition-colors duration-200",
            isListening && "bg-accent/20 text-accent animate-pulse ring-2 ring-accent/50",
            !isSpeechApiSupported && "opacity-60 cursor-not-allowed"
          )}
          aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          title={isSpeechApiSupported ? (isListening ? 'Stop listening' : 'Activate voice command') : 'Voice input not supported'}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Input
          id="prompt"
          name="prompt" // Name attribute is still important for FormData on submit if JS fails or for non-JS scenarios
          placeholder={isListening ? "Listening..." : "Type or say your command"}
          required
          value={prompt} // Controlled component using local `prompt` state
          onChange={(e) => setPrompt(e.target.value)} // Update local `prompt` state on typing
          className="flex-grow bg-transparent border-0 focus:ring-0 focus:outline-none text-base placeholder:text-muted-foreground h-10 px-2"
        />
        <SubmitButton />
      </div>
      {typeof window !== 'undefined' && !isSpeechApiSupported && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          Voice input is not supported by your browser. You can still type commands.
        </p>
      )}
    </form>
  );
}

