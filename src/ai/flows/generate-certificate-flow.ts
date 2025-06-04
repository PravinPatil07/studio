
'use server';
/**
 * @fileOverview Generates a blood donation certificate image.
 *
 * - generateCertificate - A function that generates a certificate image.
 * - GenerateCertificateInput - The input type for the generateCertificate function.
 * - GenerateCertificateOutput - The return type for the generateCertificate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {format} from 'date-fns';

const GenerateCertificateInputSchema = z.object({
  donorName: z.string().describe('The name of the blood donor.'),
  donationDate: z
    .string()
    .describe('The date of the donation in ISO 8601 format.'),
  issuingOrganization: z
    .string()
    .describe('The name of the organization issuing the certificate.'),
  donationId: z.string().describe('A unique ID for the donation.'),
});

export type GenerateCertificateInput = z.infer<
  typeof GenerateCertificateInputSchema
>;

const GenerateCertificateOutputSchema = z.object({
  certificateDataUri: z
    .string()
    .describe('The generated certificate image as a data URI.'),
});

export type GenerateCertificateOutput = z.infer<
  typeof GenerateCertificateOutputSchema
>;

export async function generateCertificate(
  input: GenerateCertificateInput
): Promise<GenerateCertificateOutput> {
  return generateCertificateFlow(input);
}

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: GenerateCertificateInputSchema,
    outputSchema: GenerateCertificateOutputSchema,
  },
  async ({donorName, donationDate, issuingOrganization, donationId}) => {
    const formattedDonationDate = format(new Date(donationDate), 'MMMM dd, yyyy');

    const prompt = `Generate an image for a blood donation certificate with the following details and style:
- Title: "BLOOD DONATION CERTIFICATE" in a prominent, elegant, dark red or maroon font.
- Award Text: "This certificate is awarded to" in a smaller, standard font.
- Donor Name: "${donorName}" displayed in a large, bold, centered, dark red or maroon font below the award text.
- Main Message: "to honor their selfless act of donating blood, which has helped save lives and bring hope to those in need." in a standard font below the donor's name.
- Date Text: "Given on this day, ${formattedDonationDate}." in a dark red or maroon font.
- Issuing Organization: "${issuingOrganization}" placed in the bottom right corner, in a smaller, dark red or maroon font.
- Seal/Badge: Include a circular, rosette-style seal or badge graphic, primarily gold and red, in the bottom left corner.
- Design Accents: Incorporate modern, clean geometric shapes or bands in shades of red and dark red in the top-left and bottom-right corners of the certificate. The overall background should be white or very light cream.
- Overall Style: The certificate should look formal, appreciative, and professional. Use clear, legible fonts.
- Aspect Ratio: The image should be in a landscape orientation, suitable for a certificate (e.g., 4:3 or similar).
- Do not include any placeholder text like "[Donor Name]" or "[Date]". Use the actual values provided.
`;

    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          // Add safety settings if needed, e.g., to allow specific content types
          // safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }]
        },
      });

      if (!media || !media.url) {
        throw new Error('Image generation failed or returned no media URL.');
      }
      return {certificateDataUri: media.url};
    } catch (error) {
      console.error('Error generating certificate image:', error);
      // Fallback or rethrow error
      // As a simple fallback, we could return a placeholder or a predefined error image data URI.
      // For now, rethrowing to indicate failure.
      throw new Error(
        `Failed to generate certificate image for donation ${donationId}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);
