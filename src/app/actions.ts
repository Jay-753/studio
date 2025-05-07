'use server';

import { extractEmailDetails, type ExtractEmailDetailsInput } from '@/ai/flows/extract-email-details';
import { getEmployees, sendEmail, type Employee } from '@/services/email';

export interface ProcessPromptResult {
  success: boolean;
  message: string;
  sentTo?: { name: string; email: string; role: string, department: string }[];
  extractedRole?: string;
  extractedMessage?: string;
}

export async function processAndSendEmailAction(
  prevState: ProcessPromptResult | null,
  formData: FormData
): Promise<ProcessPromptResult> {
  const prompt = formData.get('prompt') as string;

  if (!prompt) {
    return { success: false, message: 'Prompt cannot be empty.' };
  }

  try {
    const aiInput: ExtractEmailDetailsInput = { voicePrompt: prompt };
    const extractedDetails = await extractEmailDetails(aiInput);
    
    if (!extractedDetails || !extractedDetails.role || !extractedDetails.message) {
      return { success: false, message: 'AI could not extract role or message from the prompt.' };
    }

    const { role: extractedRole, message: extractedUserMessage } = extractedDetails;

    const employees = await getEmployees();
    const targetEmployees = employees.filter(emp => 
      emp.role.toLowerCase().includes(extractedRole.toLowerCase())
    );

    if (targetEmployees.length === 0) {
      return { 
        success: false, 
        message: `No employees found with the role: ${extractedRole}.`,
        extractedRole,
        extractedMessage: extractedUserMessage
      };
    }

    const emailSubject = `Action Required: ${extractedUserMessage.substring(0,30)}${extractedUserMessage.length > 30 ? '...' : ''}`;
    
    const sentToDetails: ProcessPromptResult['sentTo'] = [];

    for (const employee of targetEmployees) {
      const emailBody = `Respected ${employee.name},\n\n${extractedUserMessage}\n\nThank you!\nBest regards,\nZoro Assistant`;
      // Simulate sending email
      await sendEmail(employee.email, emailSubject, emailBody);
      sentToDetails.push({ name: employee.name, email: employee.email, role: employee.role, department: employee.department });
    }
    
    const recipientNames = sentToDetails.map(s => `${s.name} (${s.role} - ${s.department})`).join(', ');
    return { 
      success: true, 
      message: `Email successfully sent to: ${recipientNames}.`,
      sentTo: sentToDetails,
      extractedRole,
      extractedMessage: extractedUserMessage
    };

  } catch (error) {
    console.error('Error processing prompt:', error);
    return { success: false, message: `An error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}
