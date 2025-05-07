'use client';

import { useFormState } from 'react-dom';
import { AppHeader } from '@/components/layout/Header';
import { VoicePromptForm } from '@/components/voice/VoicePromptForm';
import { SentMessagesHistory } from '@/components/history/SentMessagesHistory';
import { ManualEmailForm } from '@/components/email/ManualEmailForm';
import { processVoiceCommandAction, type ProcessVoiceCommandResult } from '@/app/actions';

const initialVoiceCommandState: ProcessVoiceCommandResult | null = null;

export default function ZoroAssistantPage() {
  const [voiceCommandState, voiceCommandFormAction] = useFormState(processVoiceCommandAction, initialVoiceCommandState);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div 
            className="space-y-6 animate-slide-in-up opacity-0" 
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <VoicePromptForm formAction={voiceCommandFormAction} currentPromptValue={voiceCommandState?.promptValue || ''} />
            <SentMessagesHistory historyData={voiceCommandState} />
          </div>

          {/* Right Column */}
          <div 
            className="space-y-6 animate-slide-in-up opacity-0" 
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <ManualEmailForm />
          </div>
        </div>
      </main>
      <footer className="py-4 px-4 md:px-8 border-t border-border/20 text-center text-sm text-muted-foreground bg-card/50">
        <p>&copy; {new Date().getFullYear()} Zoro Assistant. AI-Powered Task Automation.</p>
      </footer>
    </div>
  );
}
