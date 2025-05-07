
'use client';

import { useEffect, useState, useMemo } from 'react';
import type { Employee } from '@/services/email';
import { getEmployees } from '@/services/email';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Users, Briefcase, Mail, Building, Search as SearchIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmployeeDirectoryProps {
  onEmployeeSelect: (email: string) => void;
}

export function EmployeeDirectory({ onEmployeeSelect }: EmployeeDirectoryProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employees.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  const handleRowClick = (email: string) => {
    onEmployeeSelect(email);
  };

  return (
    <Card className="w-full shadow-xl rounded-lg border border-border/50 hover:shadow-2xl hover:scale-[1.005] transition-all duration-300 ease-in-out animate-slide-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-primary">
          <Users className="mr-3 h-6 w-6 text-primary" />
          Employee Directory
        </CardTitle>
        <CardDescription>Browse and search company employees. Click a row to email an employee.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, role, department, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-input border-border/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/70"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border border-border/30 rounded-md bg-card/50 animate-pulse">
                <Skeleton className="h-10 w-10 rounded-full bg-muted/70" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4 bg-muted/70" />
                  <Skeleton className="h-4 w-1/2 bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 text-red-400 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
            <AlertTriangle className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium">Error Loading Employees</p>
            <p className="text-sm text-center">{error}</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground p-4 bg-muted/20 border border-border/30 rounded-md">
            <Users className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium">No Employees Found</p>
            <p className="text-sm text-center">{searchTerm ? 'No employees match your search.' : 'The employee directory is currently empty.'}</p>
          </div>
        ) : (
          <div className="employee-directory-scrollbar">
            <ScrollArea className="h-[calc(100vh-450px)] md:h-[calc(100vh-420px)] lg:h-auto lg:max-h-[55vh] pr-2"> {/* Adjusted pr-3 to pr-2 */}
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="w-[25%]"><Users className="inline-block mr-2 h-4 w-4 text-primary" />Name</TableHead>
                    <TableHead className="w-[25%]"><Briefcase className="inline-block mr-2 h-4 w-4 text-primary" />Role</TableHead>
                    <TableHead className="w-[25%]"><Building className="inline-block mr-2 h-4 w-4 text-primary" />Department</TableHead>
                    <TableHead className="w-[25%]"><Mail className="inline-block mr-2 h-4 w-4 text-primary" />Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee, index) => (
                    <TableRow 
                      key={employee.email} 
                      onClick={() => handleRowClick(employee.email)}
                      className="cursor-pointer animate-fade-in opacity-0 hover:bg-muted/50 transition-colors duration-150"
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleRowClick(employee.email)}
                    >
                      <TableCell className="font-medium py-3">{employee.name}</TableCell>
                      <TableCell className="py-3">{employee.role}</TableCell>
                      <TableCell className="py-3">{employee.department}</TableCell>
                      <TableCell className="py-3 text-sm">{employee.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

