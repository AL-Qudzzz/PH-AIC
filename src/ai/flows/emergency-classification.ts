'use server';

/**
 * @fileOverview An emergency classification AI agent.
 *
 * - classifyEmergency - A function that handles the emergency classification process.
 * - ClassifyEmergencyInput - The input type for the classifyEmergency function.
 * - ClassifyEmergencyOutput - The return type for the classifyEmergency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyEmergencyInputSchema = z.object({
  callTranscript: z
    .string()
    .describe('The transcript of the phone call with the user.'),
});
export type ClassifyEmergencyInput = z.infer<typeof ClassifyEmergencyInputSchema>;

const ClassifyEmergencyOutputSchema = z.object({
  emergencyType: z
    .string()
    .describe(
      'The type of emergency being reported (e.g., fire, medical, police, traffic).' 
    ),
  confidenceScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the confidence level of the classification.'
    ),
});
export type ClassifyEmergencyOutput = z.infer<typeof ClassifyEmergencyOutputSchema>;

export async function classifyEmergency(input: ClassifyEmergencyInput): Promise<ClassifyEmergencyOutput> {
  return classifyEmergencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyEmergencyPrompt',
  input: {schema: ClassifyEmergencyInputSchema},
  output: {schema: ClassifyEmergencyOutputSchema},
  prompt: `You are an AI assistant that analyzes call transcripts from emergency calls and classifies the type of emergency being reported.

Analyze the following call transcript and determine the type of emergency. Provide a confidence score between 0 and 1 for your classification.

Call Transcript: {{{callTranscript}}}

Respond with the emergency type and a confidence score.`,
});

const classifyEmergencyFlow = ai.defineFlow(
  {
    name: 'classifyEmergencyFlow',
    inputSchema: ClassifyEmergencyInputSchema,
    outputSchema: ClassifyEmergencyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
