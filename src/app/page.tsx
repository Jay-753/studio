
'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { AppHeader } from '@/components/layout/Header';
import { VoicePromptForm } from '@/components/voice/VoicePromptForm';
import { SentMessagesHistory } from '@/components/history/SentMessagesHistory';
import { ManualEmailForm } from '@/components/email/ManualEmailForm';
import { processVoiceCommandAction, type ProcessVoiceCommandResult } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeDirectory } from '@/components/directory/EmployeeDirectory';
import { BotMessageSquare, Users } from 'lucide-react';

const initialVoiceCommandState: ProcessVoiceCommandResult | null = null;

export default function ZoroAssistantPage() {
  const [voiceCommandState, voiceCommandFormAction] = useFormState(processVoiceCommandAction, initialVoiceCommandState);
  const [selectedEmailForManualForm, setSelectedEmailForManualForm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('assistant');

  const handleEmployeeSelect = (email: string) => {
    setSelectedEmailForManualForm(email);
    setActiveTab('assistant'); // Switch to assistant tab to show the manual email form
    // Scroll to manual email form can be added here if needed
    // setTimeout(() => {
    //   document.getElementById('manual-email-form-card')?.scrollIntoView({ behavior: 'smooth' });
    // }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex md:mx-0 mb-6 bg-muted border border-border/50 shadow-md rounded-lg p-1">
            <TabsTrigger 
              value="assistant" 
              className="flex-1 md:flex-initial px-4 py-2.5 text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg rounded-md transition-all duration-200 ease-in-out hover:bg-accent/10"
            >
              <BotMessageSquare className="mr-2 h-5 w-5 text-primary" />
              Zoro Assistant
            </TabsTrigger>
            <TabsTrigger 
              value="directory" 
              className="flex-1 md:flex-initial px-4 py-2.5 text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg rounded-md transition-all duration-200 ease-in-out hover:bg-accent/10"
            >
              <Users className="mr-2 h-5 w-5 text-primary" />
              Employee Directory
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant" className="focus-visible:ring-0 focus-visible:ring-offset-0">
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
                id="manual-email-form-card"
                className="space-y-6 animate-slide-in-up opacity-0" 
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
              >
                <ManualEmailForm initialToEmail={selectedEmailForManualForm} onEmailSent={() => setSelectedEmailForManualForm(null)} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="directory" className="focus-visible:ring-0 focus-visible:ring-offset-0">
            <EmployeeDirectory onEmployeeSelect={handleEmployeeSelect} />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-4 px-4 md:px-8 border-t border-border/20 text-center text-sm text-muted-foreground bg-card/50">
        <p>&copy; {new Date().getFullYear()} Zoro Assistant. AI-Powered Task Automation.</p>
      </footer>
    </div>
  );
}

