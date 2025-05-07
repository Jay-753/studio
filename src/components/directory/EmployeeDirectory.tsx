
'use client';

import { useEffect, useState } from 'react';
import type { Employee } from '@/services/email';
import { getEmployees } from '@/services/email';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Users, Briefcase, Mail, Building } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate network delay for skeleton visibility
        // await new Promise(resolve => setTimeout(resolve, 1500)); 
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

  return (
    <Card className="w-full shadow-xl rounded-lg border border-border/50 hover:shadow-2xl hover:scale-[1.005] transition-all duration-300 ease-in-out animate-slide-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <Users className="mr-3 h-6 w-6 text-accent" />
          Employee Directory
        </CardTitle>
        <CardDescription>Browse company employees and their roles.</CardDescription>
      </CardHeader>
      <CardContent>
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
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground p-4 bg-muted/20 border border-border/30 rounded-md">
            <Users className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium">No Employees Found</p>
            <p className="text-sm text-center">The employee directory is currently empty.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-380px)] md:h-[calc(100vh-350px)] lg:h-auto lg:max-h-[60vh] pr-3">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead className="w-[25%]"><Users className="inline-block mr-2 h-4 w-4 text-accent" />Name</TableHead>
                  <TableHead className="w-[25%]"><Briefcase className="inline-block mr-2 h-4 w-4 text-accent" />Role</TableHead>
                  <TableHead className="w-[25%]"><Building className="inline-block mr-2 h-4 w-4 text-accent" />Department</TableHead>
                  <TableHead className="w-[25%]"><Mail className="inline-block mr-2 h-4 w-4 text-accent" />Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow 
                    key={employee.email} 
                    className="animate-fade-in opacity-0 hover:bg-muted/30 transition-colors duration-150"
                    style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'forwards' }}
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
        )}
      </CardContent>
    </Card>
  );
}
