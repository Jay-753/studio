'use client';

import type { ProcessVoiceCommandResult } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface SentMessagesHistoryProps {
  historyData: ProcessVoiceCommandResult | null;
}

export function SentMessagesHistory({ historyData }: SentMessagesHistoryProps) {
  return (
    <Card className="w-full shadow-xl rounded-lg border border-border/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Sent Messages History</CardTitle>
        <CardDescription>Details of the last voice command processed.</CardDescription>
      </CardHeader>
      <CardContent>
        {!historyData || (!historyData.message && !historyData.sentTo?.length) ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Info className="h-8 w-8 mb-2" />
            <p>No messages sent yet or no action processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyData.message && (
              <div className={`flex items-start space-x-2 p-3 rounded-md border ${historyData.success ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                {historyData.success ? <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-400" /> : <AlertTriangle className="h-5 w-5 mt-0.5 text-red-400" />}
                <p className="text-sm">{historyData.message}</p>
              </div>
            )}

            {(historyData.extractedRole || historyData.extractedCoreMessage || historyData.composedEmailBodyPreview) && (
               <div className="p-3 border rounded-md bg-muted/30 space-y-1 text-sm">
                <h4 className="font-medium text-foreground/90 text-xs mb-1">Extracted / Composed Details:</h4>
                {historyData.extractedRole && <p className="text-xs"><span className="font-semibold text-foreground/70">Target Role:</span> {historyData.extractedRole}</p>}
                {historyData.extractedCoreMessage && <p className="text-xs"><span className="font-semibold text-foreground/70">Core Message (Subject):</span> {historyData.extractedCoreMessage}</p>}
                {historyData.composedEmailBodyPreview && <p className="text-xs whitespace-pre-line"><span className="font-semibold text-foreground/70">Composed Email Body:</span><br/> {historyData.composedEmailBodyPreview}</p>}
              </div>
            )}
            
            {historyData.sentTo && historyData.sentTo.length > 0 && (
              <div className="p-3 border rounded-md bg-primary/10 border-primary/30">
                <h4 className="font-medium text-sm text-primary/90 mb-1">Successfully Emailed:</h4>
                <ScrollArea className="h-auto max-h-32 mt-1">
                  <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5">
                    {historyData.sentTo.map(recipient => (
                      <li key={recipient.email}>
                        {recipient.name} ({recipient.role} - {recipient.department})
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
