import { AppHeader } from '@/components/layout/Header';
import { EmailForm } from '@/components/email/EmailForm';
import { EmployeeListReference } from '@/components/email/EmployeeListReference';
import { Separator } from '@/components/ui/separator';

export default function ZoroAssistantPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <EmailForm />
          </div>
          <div className="lg:col-span-1 hidden lg:block">
             <EmployeeListReference />
          </div>
        </div>
        {/* Employee list for mobile/tablet, shown below form */}
        <div className="mt-8 lg:hidden">
          <Separator className="my-6" />
          <h2 className="text-xl font-semibold mb-4 text-center">Employee Directory</h2>
          <EmployeeListReference />
        </div>
      </main>
      <footer className="py-4 px-4 md:px-8 border-t border-border/50 text-center text-sm text-muted-foreground bg-card">
        <p>&copy; {new Date().getFullYear()} Zoro Assistant. AI-Powered Task Automation.</p>
      </footer>
    </div>
  );
}
