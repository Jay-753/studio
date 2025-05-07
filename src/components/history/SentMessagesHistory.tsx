
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
        <CardDescription>Details of the command processed.</CardDescription>
      </CardHeader>
      <CardContent>
        {!historyData || (!historyData.message && !historyData.sentTo?.length && !historyData.extractedRole && !historyData.extractedCoreMessage && !historyData.composedEmailBodyPreview) ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Info className="h-8 w-8 mb-2" />
            <p>No messages sent yet or no action processed.</p>
            <p className="text-xs mt-1">Try giving a voice command above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyData.message && (
              <div className={`flex items-start space-x-3 p-3 rounded-md border ${historyData.success ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                {historyData.success ? <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-400 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mt-0.5 text-red-400 flex-shrink-0" />}
                <p className="text-sm leading-relaxed">{historyData.message}</p>
              </div>
            )}

            {(historyData.extractedRole || historyData.extractedCoreMessage || historyData.composedEmailBodyPreview) && (
               <div className="p-3.5 border rounded-md bg-muted/30 space-y-2 text-sm shadow-inner">
                <h4 className="font-medium text-foreground/90 text-sm mb-1.5 border-b border-border/50 pb-1">Extracted / Composed Details:</h4>
                {historyData.extractedRole && <p className="text-xs"><strong className="font-semibold text-foreground/70">Target Role:</strong> {historyData.extractedRole}</p>}
                {historyData.extractedCoreMessage && <p className="text-xs"><strong className="font-semibold text-foreground/70">Core Message (for Subject):</strong> {historyData.extractedCoreMessage}</p>}
                {historyData.composedEmailBodyPreview && (
                  <div>
                    <strong className="font-semibold text-foreground/70 text-xs">Composed Email Body Preview:</strong>
                    <ScrollArea className="max-h-40 mt-1 p-2 border border-border/40 bg-background/30 rounded-sm text-xs">
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed">{historyData.composedEmailBodyPreview}</pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
            
            {historyData.sentTo && historyData.sentTo.length > 0 && (
              <div className="p-3.5 border rounded-md bg-primary/10 border-primary/30 shadow-inner">
                <h4 className="font-medium text-sm text-primary/90 mb-1.5 border-b border-border/50 pb-1">Successfully Emailed To:</h4>
                <div className="history-sent-to-scrollbar">
                  <ScrollArea className="h-auto max-h-45 mt-1 pr-2"> {/* Increased max-h from 32 to 40 */}
                    <ul className="space-y-1">
                      {historyData.sentTo.map(recipient => (
                        <li key={recipient.email} className="text-xs text-foreground/80 p-1.5 bg-primary/5 rounded-sm">
                          <span className="font-semibold">{recipient.name}</span> ({recipient.role} - {recipient.department})
                          <br />
                          <span className="text-muted-foreground/80">{recipient.email}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

