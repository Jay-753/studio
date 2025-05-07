'use client';

import { useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { sendManualEmailAction, type SendManualEmailResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { LoadingDots } from '@/components/ui/LoadingDots';

const initialManualEmailState: SendManualEmailResult | null = null;

function ManualSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95"
    >
      {pending ? (
        <>
          <LoadingDots className="mr-2" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Send Email
        </>
      )}
    </Button>
  );
}

export function ManualEmailForm() {
  const [state, formAction] = useFormState(sendManualEmailAction, initialManualEmailState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
          variant: 'default',
        });
        formRef.current?.reset();
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="w-full shadow-xl rounded-lg border border-border/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <Mail className="mr-3 h-6 w-6 text-accent" />
          Manual Email
        </CardTitle>
        <CardDescription>
          Compose and send an email directly.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="to" className="text-sm font-medium">To</Label>
            <Input
              id="to"
              name="to"
              type="email"
              placeholder="recipient@example.com"
              required
              className="text-base bg-input border-border/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Email Subject"
              required
              className="text-base bg-input border-border/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body" className="text-sm font-medium">Body</Label>
            <Textarea
              id="body"
              name="body"
              placeholder="Compose your email..."
              rows={5}
              required
              className="text-base bg-input border-border/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/70"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2">
          <ManualSubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
