'use server';
/**
 * @fileOverview Suggests style variations for a given image and style using GenAI.
 *
 * - suggestStyleVariations - A function that generates style variations for an image.
 * - SuggestStyleVariationsInput - The input type for the suggestStyleVariations function.
 * - SuggestStyleVariationsOutput - The return type for the suggestStyleVariations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStyleVariationsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  style: z.string().describe('The interior decoration style to apply.'),
  variationType: z
    .enum(['more minimalist', 'more luxurious'])
    .describe('The type of style variation to suggest.'),
});
export type SuggestStyleVariationsInput = z.infer<typeof SuggestStyleVariationsInputSchema>;

const SuggestStyleVariationsOutputSchema = z.object({
  variedPhotoDataUri: z.string().describe('The styled photo, as a data URI.'),
});
export type SuggestStyleVariationsOutput = z.infer<typeof SuggestStyleVariationsOutputSchema>;

export async function suggestStyleVariations(
  input: SuggestStyleVariationsInput
): Promise<SuggestStyleVariationsOutput> {
  return suggestStyleVariationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStyleVariationsPrompt',
  input: {schema: SuggestStyleVariationsInputSchema},
  output: {schema: SuggestStyleVariationsOutputSchema},
  prompt: `You are an interior design assistant. Given an image of a room and a style, you will generate a new image of the room with a style variation. The variation should be either more minimalist or more luxurious than the original style.

Original Style: {{{style}}}
Variation Type: {{{variationType}}}

Original Image: {{media url=photoDataUri}}

Please generate a new image of the room with the style variation. Return the new image as a data URI.
`,
});

const suggestStyleVariationsFlow = ai.defineFlow(
  {
    name: 'suggestStyleVariationsFlow',
    inputSchema: SuggestStyleVariationsInputSchema,
    outputSchema: SuggestStyleVariationsOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: prompt.prompt(input) as string},
        {media: {url: input.photoDataUri}},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {variedPhotoDataUri: media.url};
  }
);
