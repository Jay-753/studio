'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract the role, a core message (for subject),
 * and a fully composed email body from a voice prompt for email automation.
 *
 * - extractEmailDetails - A function that processes the voice prompt and returns the extracted details.
 * - ExtractEmailDetailsInput - The input type for the extractEmailDetails function, representing the voice prompt.
 * - ExtractEmailDetailsOutput - The output type for the extractEmailDetails function, containing the
 *   extracted role, core message, and composed email body.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractEmailDetailsInputSchema = z.object({
  voicePrompt: z
    .string()
    .describe('The voice prompt from the user, e.g., \'Ask the manager to submit the project files\''),
});
export type ExtractEmailDetailsInput = z.infer<typeof ExtractEmailDetailsInputSchema>;

const ExtractEmailDetailsOutputSchema = z.object({
  role: z
    .string()
    .describe('The role of the employee to be contacted, e.g., \'manager\', \'developer\''),
  coreMessage: z
    .string()
    .describe('A concise summary of the task or instruction, suitable for an email subject line. e.g., \'submit project files\', \'update SDKs\''),
  emailBody: z
    .string()
    .describe('The full, polite, and professionally worded email body. It should start with a formal salutation, optionally include a polite opening, clearly state the request (expanding the core message into a full sentence/paragraph), include a professional closing statement (e.g., "Thank you for your attention to this matter."), and end with the signature "Best regards,\\nZoro Assistant". Use \\n for newlines for proper formatting.'),
});
export type ExtractEmailDetailsOutput = z.infer<typeof ExtractEmailDetailsOutputSchema>;

export async function extractEmailDetails(input: ExtractEmailDetailsInput): Promise<ExtractEmailDetailsOutput> {
  return extractEmailDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractEmailDetailsPrompt',
  input: {schema: ExtractEmailDetailsInputSchema},
  output: {schema: ExtractEmailDetailsOutputSchema},
  prompt: `You are an AI assistant tasked with preparing professional emails based on voice prompts.
The user will provide a voice prompt. Your tasks are:
1. Identify the role of the employee to contact (e.g., 'manager', 'developer', 'team lead'). This should be a single word or a short common role title.
2. Extract a concise summary of the core task or instruction from the voice prompt. This will be used for the email subject line (e.g., "submit project files", "review PR 123", "urgent SDK update").
3. Compose a full, polite, and professionally worded email body. The email body must:
    - Start with a formal salutation addressing the recipient by their role (e.g., "Dear Manager,", "Respected Lead Developer,"). If the role is very generic or if a direct address by role sounds awkward, use "Respected Sir/Madam,".
    - Optionally, include a brief, polite opening phrase (e.g., "I hope this email finds you well." or "This is a quick follow-up regarding...").
    - Clearly and politely state the user's request or instruction derived from the voice prompt. Expand the core task into a full sentence or two, providing necessary context if inferable or keeping it direct if the prompt is simple. For instance, if the core task is "submit project files", the email might state: "This email is to kindly request the submission of the project files at your earliest convenience."
    - If the user's voice prompt implied urgency or a deadline, ensure this is politely conveyed in the email body.
    - Conclude with a professional closing statement (e.g., "Thank you for your time and attention to this matter.", "Your prompt attention to this would be greatly appreciated.").
    - End with the signature: "Best regards,\\nZoro Assistant".
    - Use newline characters (\\n) for line breaks to ensure readability (e.g., after salutation, between paragraphs, before the closing statement, and before the signature).

Voice Prompt: {{{voicePrompt}}}

Output the extracted role, the concise core message, and the composed email body.

Example 1:
Voice Prompt: "Ask the manager to submit the project files"
Output:
- role: "manager"
- coreMessage: "submit project files"
- emailBody: "Dear Manager,\\n\\nI hope this email finds you well.\\n\\nThis email is to kindly request the submission of the project files at your earliest convenience.\\n\\nYour prompt attention to this matter would be greatly appreciated.\\n\\nBest regards,\\nZoro Assistant"

Example 2:
Voice Prompt: "Tell all developers to update their SDKs, it's urgent"
Output:
- role: "developer"
- coreMessage: "urgent SDK update"
- emailBody: "Respected Developer,\\n\\nThis is an urgent notification regarding an important update.\\n\\nPlease update your SDKs as soon as possible. This is critical for maintaining system stability and security.\\n\\nThank you for your immediate attention to this urgent request.\\n\\nBest regards,\\nZoro Assistant"
`,
});

const extractEmailDetailsFlow = ai.defineFlow(
  {
    name: 'extractEmailDetailsFlow',
    inputSchema: ExtractEmailDetailsInputSchema,
    outputSchema: ExtractEmailDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
