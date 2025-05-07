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

const SENDER_EMAIL = 'myzoroai@gmail.com';

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
    `Sending email from ${SENDER_EMAIL} to ${recipient} with subject '${subject}' and body:\n${body}`
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
      name: 'JayJay',
      email: 'nezukodvl@gmail.com',
      role: 'Manager',
      department: 'Engineering',
    },
    {
      name: 'Yuri',
      email: 'yuri.hanamitchi@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Namjoon',
      email: 'namjoonhyung.kim@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Aein',
      email: 'nekko.fvr@example.com',
      role: 'Manager',
      department: 'Marketing',
    },
    {
      name: 'Jeon Jungkook',
      email: 'jungkook.jeon@example.com',
      role: 'Sales Representative',
      department: 'Sales',
    },
    {
      name: 'Kim Taehyung',
      email: 'taehyungie.kim@example.com',
      role: 'Sales Representative',
      department: 'Sales',
    },
    {
      name: 'Jayshu',
      email: 'jayashreejananis@gmail.com',
      role: 'Team Lead',
      department: 'Sales',
    },
    {
      name: 'Jasper Jean Mariano',
      email: 'shreejayalakshmis@gmail.com',
      role: 'Project Manager',
      department: 'Product Management',
    },
    {
      name: 'Calix',
      email: 'calix.sece@example.com',
      role: 'Analyst',
      department: 'Product Management',
    },
    {
      name: 'CiN',
      email: 'cin.pernalta@example.com',
      role: 'Analyst',
      department: 'Finance',
    },
    {
      name: 'Park Jimin',
      email: 'jiminshi.mochi@example.com',
      role: 'Accountant',
      department: 'Finance',
    },
    {
      name: 'Mark Keifer Watson',
      email: 'keifer.mulloch@example.com',
      role: 'HR Manager',
      department: 'Human Resources',
    },
    {
      name: 'Kim Seok Jin',
      email: 'jinhyung.kim@example.com',
      role: 'Recruiter',
      department: 'Human Resources',
    },
    {
      name: 'Min Yoongi',
      email: 'agustd.suga@example.com',
      role: 'Intern',
      department: 'Engineering',
    },
    {
      name: 'Jung Hoseok',
      email: 'hobihyung.hoba@example.com',
      role: 'Intern',
      department: 'Marketing',
    },
  ];
}
