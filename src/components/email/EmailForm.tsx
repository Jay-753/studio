'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Send, Mic, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { processAndSendEmailAction, type ProcessPromptResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState: ProcessPromptResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95">
      {pending ? (
        <>
          <LoadingDots className="mr-2" />
          Processing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Send Email
        </>
      )}
    </Button>
  );
}


export function EmailForm() {
  const [state, formAction] = useFormState(processAndSendEmailAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
          variant: 'default',
          action: <CheckCircle2 className="text-green-500" />,
        });
        formRef.current?.reset(); // Reset form fields
        setPrompt(''); // Clear prompt state
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
          action: <AlertTriangle className="text-red-500" />,
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="w-full shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Mic className="mr-3 h-7 w-7 text-primary" />
          Voice Prompt Command
        </CardTitle>
        <CardDescription>
          Enter your command (e.g., "Ask the manager to submit project files"). Zoro will extract the role and message, then send an email.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-base font-medium">Your Command</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="e.g., Ask developers to push their latest code by EOD"
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="text-base transition-colors duration-300 focus:border-primary focus:ring-primary"
            />
          </div>

          {state && (state.extractedRole || state.extractedMessage) && (
            <div className="p-4 border rounded-md bg-muted/50 space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Extracted Details:</h4>
              {state.extractedRole && <p className="text-xs"><span className="font-medium">Target Role:</span> {state.extractedRole}</p>}
              {state.extractedMessage && <p className="text-xs"><span className="font-medium">Message:</span> {state.extractedMessage}</p>}
            </div>
          )}
          
          {state?.sentTo && state.sentTo.length > 0 && (
            <div className="p-4 border rounded-md bg-green-50 border-green-200">
              <h4 className="font-semibold text-sm text-green-700">Successfully Emailed:</h4>
              <ScrollArea className="h-24 mt-1">
                <ul className="list-disc list-inside text-xs text-green-600 space-y-1">
                  {state.sentTo.map(recipient => (
                    <li key={recipient.email}>
                      {recipient.name} ({recipient.role} - {recipient.department})
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
