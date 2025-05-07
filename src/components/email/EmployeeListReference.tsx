import { getEmployees, type Employee } from '@/services/email';
import { EmployeeCard } from './EmployeeCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export async function EmployeeListReference() {
  const employees = await getEmployees();

  return (
    <Card className="w-full shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Users className="mr-3 h-6 w-6 text-primary" />
          Employee Directory
        </CardTitle>
        <CardDescription>
          Reference list of all employees in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-18rem)] pr-3"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 gap-4">
            {employees.map((employee) => (
              <EmployeeCard key={employee.email} employee={employee} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
