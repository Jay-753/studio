'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract the role and message from a voice prompt for email automation.
 *
 * - extractEmailDetails - A function that processes the voice prompt and returns the extracted role and message.
 * - ExtractEmailDetailsInput - The input type for the extractEmailDetails function, representing the voice prompt.
 * - ExtractEmailDetailsOutput - The output type for the extractEmailDetails function, containing the extracted role and message.
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
  message: z
    .string()
    .describe('The message to be sent to the employee, e.g., \'submit the project files\''),
});
export type ExtractEmailDetailsOutput = z.infer<typeof ExtractEmailDetailsOutputSchema>;

export async function extractEmailDetails(input: ExtractEmailDetailsInput): Promise<ExtractEmailDetailsOutput> {
  return extractEmailDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractEmailDetailsPrompt',
  input: {schema: ExtractEmailDetailsInputSchema},
  output: {schema: ExtractEmailDetailsOutputSchema},
  prompt: `You are an AI assistant tasked with extracting information from voice prompts to automate email sending.

The user will provide a voice prompt, and your task is to identify the role of the employee to contact and the message to send to them.

Voice Prompt: {{{voicePrompt}}}

Extract the role and the message from the voice prompt. The role should be a single word.
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
