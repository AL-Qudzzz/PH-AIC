'use server';

/**
 * @fileOverview An AI agent to detect potential large-scale events by identifying clusters of similar reports from the same area within a short timeframe.
 *
 * - detectIncidentCluster - A function that handles the incident cluster detection process.
 * - DetectIncidentClusterInput - The input type for the detectIncidentCluster function.
 * - DetectIncidentClusterOutput - The return type for the detectIncidentCluster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectIncidentClusterInputSchema = z.object({
  reports: z
    .array(
      z.object({
        location: z.string().describe('The location of the incident.'),
        description: z.string().describe('The description of the incident.'),
        timestamp: z.string().describe('The timestamp of the incident.'),
      })
    )
    .describe('An array of incident reports.'),
  timeframeMinutes: z
    .number()
    .default(60)
    .describe('The timeframe in minutes to consider for clustering.'),
  similarityThreshold: z
    .number()
    .default(0.8)
    .describe('The minimum similarity score (0-1) for clustering reports.'),
  minClusterSize: z
    .number()
    .default(3)
    .describe('The minimum number of reports to form a cluster.'),
});
export type DetectIncidentClusterInput = z.infer<typeof DetectIncidentClusterInputSchema>;

const DetectIncidentClusterOutputSchema = z.object({
  clusters: z.array(
    z.object({
      location: z.string().describe('The location of the incident cluster.'),
      reports: z.array(
        z.object({
          location: z.string().describe('The location of the incident.'),
          description: z.string().describe('The description of the incident.'),
          timestamp: z.string().describe('The timestamp of the incident.'),
        })
      ),
    })
  ),
});
export type DetectIncidentClusterOutput = z.infer<typeof DetectIncidentClusterOutputSchema>;

export async function detectIncidentCluster(
  input: DetectIncidentClusterInput
): Promise<DetectIncidentClusterOutput> {
  return detectIncidentClusterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectIncidentClusterPrompt',
  input: {schema: DetectIncidentClusterInputSchema},
  output: {schema: DetectIncidentClusterOutputSchema},
  prompt: `You are an expert in detecting incident clusters from a list of reports.\n\n  Given the following incident reports within a timeframe of {{timeframeMinutes}} minutes, identify potential large-scale events by clustering similar reports from the same area.\n\n  Reports:\n  {{#each reports}}
  - Location: {{this.location}}, Description: {{this.description}}, Timestamp: {{this.timestamp}}\n  {{/each}}\n\n  Consider reports as part of the same cluster if they are from the same area and their descriptions are highly similar (similarity score >= {{similarityThreshold}}). A cluster must have at least {{minClusterSize}} reports to be considered a potential large-scale event.\n\n  Output the clusters, each containing the location and the list of reports that belong to that cluster.\n  The current timestamp is now. timestamps are strings in ISO format. Only group the reports within the last {{timeframeMinutes}} minutes.
\n  Make sure to convert location to lowercase before grouping.
  Make sure to filter out similar timestamps.
  Make sure to respond in valid JSON format.\n  `, // Added timeframeMinutes to the prompt
});

const detectIncidentClusterFlow = ai.defineFlow(
  {
    name: 'detectIncidentClusterFlow',
    inputSchema: DetectIncidentClusterInputSchema,
    outputSchema: DetectIncidentClusterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
