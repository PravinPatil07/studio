// src/ai/flows/donation-schedule-guidance.ts
'use server';

/**
 * @fileOverview Provides personalized donation schedule guidance based on user history.
 *
 * - donationScheduleGuidance - A function that provides personalized donation schedule guidance.
 * - DonationScheduleGuidanceInput - The input type for the donationScheduleGuidance function.
 * - DonationScheduleGuidanceOutput - The return type for the donationScheduleGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DonationScheduleGuidanceInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting donation guidance.'),
  donationHistory: z
    .array(z.object({date: z.string(), amount: z.string()}))
    .describe('The user donation history, including dates and amounts.'),
  bloodType: z.string().describe('The blood type of the user.'),
  healthConsiderations: z
    .string()
    .describe('Any health considerations that may affect donation schedule.'),
});

export type DonationScheduleGuidanceInput = z.infer<
  typeof DonationScheduleGuidanceInputSchema
>;

const DonationScheduleGuidanceOutputSchema = z.object({
  nextDonationDate: z
    .string()
    .describe('Recommended date for the next donation in ISO 8601 format.'),
  reasoning: z
    .string()
    .describe('The explanation for the recommended donation schedule.'),
});

export type DonationScheduleGuidanceOutput = z.infer<
  typeof DonationScheduleGuidanceOutputSchema
>;

export async function donationScheduleGuidance(
  input: DonationScheduleGuidanceInput
): Promise<DonationScheduleGuidanceOutput> {
  return donationScheduleGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'donationScheduleGuidancePrompt',
  input: {schema: DonationScheduleGuidanceInputSchema},
  output: {schema: DonationScheduleGuidanceOutputSchema},
  prompt: `You are an AI assistant that provides personalized donation schedule guidance to users, maximizing impact and maintaining optimal health.

  Analyze the user's donation history, blood type, and any provided health considerations to recommend an optimal donation schedule.

  Consider the usual blood donation rules. A person can donate blood every 56 days.

  User ID: {{{userId}}}
  Donation History: {{#if donationHistory}}{{#each donationHistory}}Date: {{{date}}}, Amount: {{{amount}}}\n{{/each}}{{else}}No donation history available.{{/if}}
  Blood Type: {{{bloodType}}}
  Health Considerations: {{{healthConsiderations}}}

  Based on this information, what is the optimal next donation date, and what is the reasoning behind this recommendation?
  Ensure that the nextDonationDate output field is an ISO 8601 format.
  `,
});

const donationScheduleGuidanceFlow = ai.defineFlow(
  {
    name: 'donationScheduleGuidanceFlow',
    inputSchema: DonationScheduleGuidanceInputSchema,
    outputSchema: DonationScheduleGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
