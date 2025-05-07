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
    .describe('The role of the employee to be contacted, e.g., \'manager\''),
  coreMessage: z
    .string()
    .describe('A concise summary of the task or instruction, suitable for an email subject line. e.g., \'submit project files\', \'update SDKs\''),
  emailBody: z
    .string()
    .describe('The full, polite email body to be sent, starting with a salutation (e.g., "Respected Manager," or "Respected sir/madam,"), containing the main message derived from the voice prompt, and ending with a professional closing (e.g., "Thank you!\\nBest regards,\\nZoro Assistant"). Use \\n for newlines.'),
});
export type ExtractEmailDetailsOutput = z.infer<typeof ExtractEmailDetailsOutputSchema>;

export async function extractEmailDetails(input: ExtractEmailDetailsInput): Promise<ExtractEmailDetailsOutput> {
  return extractEmailDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractEmailDetailsPrompt',
  input: {schema: ExtractEmailDetailsInputSchema},
  output: {schema: ExtractEmailDetailsOutputSchema},
  prompt: `You are an AI assistant tasked with preparing emails based on voice prompts.
The user will provide a voice prompt. Your tasks are:
1. Identify the role of the employee to contact (e.g., 'manager', 'developer'). This should be a single word or a short common role title.
2. Extract a concise summary of the core task or instruction from the voice prompt. This will be used for the email subject line (e.g., "submit project files", "review PR 123", "update SDKs").
3. Compose the full email body. The email body should:
    - Start with a polite salutation. You can use "Respected [Role]" (e.g., "Respected Manager,") or a generic "Respected sir/madam,".
    - Clearly state the user's request or message derived from the voice prompt, expanding on the core task.
    - End with a professional closing, such as "Thank you!\\nBest regards,\\nZoro Assistant".
    - Use newline characters (\\n) for line breaks where appropriate (e.g., between paragraphs, after salutation, before closing).

Voice Prompt: {{{voicePrompt}}}

Output the extracted role, the concise core message, and the composed email body.

Example 1:
Voice Prompt: "Ask the manager to submit the project files"
Output:
- role: "manager"
- coreMessage: "submit project files"
- emailBody: "Respected Manager,\\n\\nPlease submit the project files.\\n\\nThank you!\\nBest regards,\\nZoro Assistant"

Example 2:
Voice Prompt: "Tell all developers to update their SDKs"
Output:
- role: "developer"
- coreMessage: "update SDKs"
- emailBody: "Respected Developer,\\n\\nPlease update your SDKs at your earliest convenience.\\n\\nThank you!\\nBest regards,\\nZoro Assistant"
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
