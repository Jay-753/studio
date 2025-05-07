import type { Employee } from '@/services/email';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, UserCircle, Briefcase, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Card className="w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-center space-x-3">
          <UserCircle className="h-10 w-10 text-primary" />
          <div>
            <CardTitle className="text-lg font-semibold">{employee.name}</CardTitle>
            <CardDescription className="text-xs">{employee.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-accent" />
          <span>Role: </span>
          <Badge variant="secondary" className="ml-2">{employee.role}</Badge>
        </div>
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-2 text-accent" />
          <span>Department: </span>
          <Badge variant="outline" className="ml-2">{employee.department}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
