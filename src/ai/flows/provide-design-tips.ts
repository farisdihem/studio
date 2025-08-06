'use server';

/**
 * @fileOverview This file defines a Genkit flow to provide design tips based on an image and style.
 *
 * It exports:
 * - `provideDesignTips`: An async function that takes an image data URI and style, and returns design tips.
 * - `ProvideDesignTipsInput`: The input type for the `provideDesignTips` function.
 * - `ProvideDesignTipsOutput`: The output type for the `provideDesignTips` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideDesignTipsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  style: z.string().describe('The interior design style to provide tips for.'),
});

export type ProvideDesignTipsInput = z.infer<typeof ProvideDesignTipsInputSchema>;

const ProvideDesignTipsOutputSchema = z.object({
  designTips: z.array(z.string()).describe('An array of design tips related to the style and image.'),
});

export type ProvideDesignTipsOutput = z.infer<typeof ProvideDesignTipsOutputSchema>;

export async function provideDesignTips(input: ProvideDesignTipsInput): Promise<ProvideDesignTipsOutput> {
  return provideDesignTipsFlow(input);
}

const provideDesignTipsPrompt = ai.definePrompt({
  name: 'provideDesignTipsPrompt',
  input: {schema: ProvideDesignTipsInputSchema},
  output: {schema: ProvideDesignTipsOutputSchema},
  prompt: `You are an interior design expert. Given an image of a room and a design style, provide a few actionable design tips that the user can use.

Image: {{media url=photoDataUri}}
Style: {{{style}}}

Focus on the specifics of the image when creating the tips.

Return an array of tips.`,
});

const provideDesignTipsFlow = ai.defineFlow(
  {
    name: 'provideDesignTipsFlow',
    inputSchema: ProvideDesignTipsInputSchema,
    outputSchema: ProvideDesignTipsOutputSchema,
  },
  async input => {
    const {output} = await provideDesignTipsPrompt(input);
    return output!;
  }
);
