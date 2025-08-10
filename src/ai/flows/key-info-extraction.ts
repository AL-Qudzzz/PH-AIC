'use server';

/**
 * @fileOverview A flow for extracting key information from a call transcript.
 *
 * - extractKeyInfo - A function that extracts key details ('what' and 'where') from a call transcript.
 * - KeyInfoExtractionInput - The input type for the extractKeyInfo function.
 * - KeyInfoExtractionOutput - The return type for the extractKeyInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KeyInfoExtractionInputSchema = z.object({
  callTranscript: z.string().describe('The transcript of the call.'),
});
export type KeyInfoExtractionInput = z.infer<typeof KeyInfoExtractionInputSchema>;

const KeyInfoExtractionOutputSchema = z.object({
  whatHappened: z.string().describe('A summary of what happened during the incident.'),
  whereItHappened: z.string().describe('The location where the incident occurred.'),
});
export type KeyInfoExtractionOutput = z.infer<typeof KeyInfoExtractionOutputSchema>;

export async function extractKeyInfo(input: KeyInfoExtractionInput): Promise<KeyInfoExtractionOutput> {
  return extractKeyInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'keyInfoExtractionPrompt',
  input: {schema: KeyInfoExtractionInputSchema},
  output: {schema: KeyInfoExtractionOutputSchema},
  prompt: `You are an AI assistant that extracts key information from emergency call transcripts.

  Given the following call transcript, please extract the key details of what happened and where it happened.
  What happened should be a concise summary of the incident.
  Where it happened should be the location where the incident occurred.  If the location is not mentioned in the transcript, indicate that the location is unknown.

  Call Transcript: {{{callTranscript}}}
  `,
});

const extractKeyInfoFlow = ai.defineFlow(
  {
    name: 'extractKeyInfoFlow',
    inputSchema: KeyInfoExtractionInputSchema,
    outputSchema: KeyInfoExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
