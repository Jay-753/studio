'use server';

import { extractEmailDetails, type ExtractEmailDetailsInput } from '@/ai/flows/extract-email-details';
import { getEmployees, sendEmail, type Employee } from '@/services/email';

export interface ProcessPromptResult {
  success: boolean;
  message: string;
  sentTo?: { name: string; email: string; role: string, department: string }[];
  extractedRole?: string;
  extractedCoreMessage?: string; // Renamed from extractedMessage, now for subject
  composedEmailBodyPreview?: string; // New: for the full AI composed email body
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
    
    if (!extractedDetails || !extractedDetails.role || !extractedDetails.coreMessage || !extractedDetails.emailBody) {
      return { 
        success: false, 
        message: 'AI could not extract role, core message, or compose email body from the prompt.' 
      };
    }

    const { role: extractedRole, coreMessage: extractedCoreMessage, emailBody: composedEmailBody } = extractedDetails;

    const employees = await getEmployees();
    const targetEmployees = employees.filter(emp => 
      emp.role.toLowerCase().includes(extractedRole.toLowerCase())
    );

    if (targetEmployees.length === 0) {
      return { 
        success: false, 
        message: `No employees found with the role: ${extractedRole}.`,
        extractedRole,
        extractedCoreMessage,
        composedEmailBodyPreview: composedEmailBody 
      };
    }

    const emailSubject = `Action Required: ${extractedCoreMessage.substring(0,30)}${extractedCoreMessage.length > 30 ? '...' : ''}`;
    
    const sentToDetails: ProcessPromptResult['sentTo'] = [];

    for (const employee of targetEmployees) {
      // Use the AI-composed email body directly
      await sendEmail(employee.email, emailSubject, composedEmailBody);
      sentToDetails.push({ name: employee.name, email: employee.email, role: employee.role, department: employee.department });
    }
    
    const recipientNames = sentToDetails.map(s => `${s.name} (${s.role} - ${s.department})`).join(', ');
    return { 
      success: true, 
      message: `Email successfully sent to: ${recipientNames}.`,
      sentTo: sentToDetails,
      extractedRole,
      extractedCoreMessage,
      composedEmailBodyPreview: composedEmailBody
    };

  } catch (error) {
    console.error('Error processing prompt:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Attempt to return extracted details if available even on error
    // This part depends on whether `extractedDetails` would be available in catch block scope and if it's populated
    // For now, keeping it simple, but could be enhanced.
    return { 
        success: false, 
        message: `An error occurred: ${errorMessage}` 
        // Potentially include partial extracted data if error happens after AI call
        // extractedRole: extractedDetails?.role, 
        // extractedCoreMessage: extractedDetails?.coreMessage,
        // composedEmailBodyPreview: extractedDetails?.emailBody
    };
  }
}
