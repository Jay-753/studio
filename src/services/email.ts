/**
 * Represents an employee with their name, email, role, and department.
 */
export interface Employee {
  /**
   * The name of the employee.
   */
  name: string;
  /**
   * The email address of the employee.
   */
  email: string;
  /**
   * The role of the employee.
   */
  role: string;
  /**
   * The department of the employee.
   */
  department: string;
}

/**
 * Sends an email to the specified recipient with the given subject and body.
 *
 * @param recipient The email address of the recipient.
 * @param subject The subject of the email.
 * @param body The body of the email.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendEmail(
  recipient: string,
  subject: string,
  body: string
): Promise<void> {
  // TODO: Implement this by calling an email API.
  console.log(
    `Sending email to ${recipient} with subject '${subject}' and body:\n${body}`
  );
}

/**
 * Retrieves a list of employees from a data source.
 *
 * @returns A promise that resolves to an array of Employee objects.
 */
export async function getEmployees(): Promise<Employee[]> {
  // TODO: Implement this by fetching employee data from a database or other source.
  return [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Manager',
      department: 'Engineering',
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Bob Williams',
      email: 'bob.williams@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Eve Davis',
      email: 'eve.davis@example.com',
      role: 'Manager',
      department: 'Marketing',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Sales Representative',
      department: 'Sales',
    },
    {
      name: 'Diana Miller',
      email: 'diana.miller@example.com',
      role: 'Sales Representative',
      department: 'Sales',
    },
    {
      name: 'Frank Wilson',
      email: 'frank.wilson@example.com',
      role: 'Team Lead',
      department: 'Sales',
    },
    {
      name: 'Grace Taylor',
      email: 'grace.taylor@example.com',
      role: 'Project Manager',
      department: 'Product Management',
    },
    {
      name: 'Harry Moore',
      email: 'harry.moore@example.com',
      role: 'Analyst',
      department: 'Product Management',
    },
    {
      name: 'Irene Jackson',
      email: 'irene.jackson@example.com',
      role: 'Analyst',
      department: 'Finance',
    },
    {
      name: 'Jack Thomas',
      email: 'jack.thomas@example.com',
      role: 'Accountant',
      department: 'Finance',
    },
    {
      name: 'Kelly White',
      email: 'kelly.white@example.com',
      role: 'HR Manager',
      department: 'Human Resources',
    },
    {
      name: 'Liam Harris',
      email: 'liam.harris@example.com',
      role: 'Recruiter',
      department: 'Human Resources',
    },
    {
      name: 'Molly Martin',
      email: 'molly.martin@example.com',
      role: 'Intern',
      department: 'Engineering',
    },
    {
      name: 'Noah Thompson',
      email: 'noah.thompson@example.com',
      role: 'Intern',
      department: 'Marketing',
    },
  ];
}
