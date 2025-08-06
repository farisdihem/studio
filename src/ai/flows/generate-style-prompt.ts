'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a redesigned image based on a user-provided image and a custom style prompt.
 *
 * - generateStyledImage - A function that takes an image and style prompt as input and returns a redesigned image.
 * - GenerateStyledImageInput - The input type for the generateStyledImage function.
 * - GenerateStyledImageOutput - The return type for the generateStyledImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStyledImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  stylePrompt: z.string().describe('A custom style prompt for the image generation.'),
});

export type GenerateStyledImageInput = z.infer<typeof GenerateStyledImageInputSchema>;

const GenerateStyledImageOutputSchema = z.object({
  redesignedImageDataUri: z
    .string()
    .describe(
      'The redesigned image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});

export type GenerateStyledImageOutput = z.infer<typeof GenerateStyledImageOutputSchema>;

export async function generateStyledImage(input: GenerateStyledImageInput): Promise<GenerateStyledImageOutput> {
  return generateStyledImageFlow(input);
}

const generateStyledImageFlow = ai.defineFlow(
  {
    name: 'generateStyledImageFlow',
    inputSchema: GenerateStyledImageInputSchema,
    outputSchema: GenerateStyledImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          {text: "You are an AI interior designer. Your task is to redesign the room in the provided image based on the user's style prompt. You MUST use the provided image as a strong reference, maintaining the original room layout, perspective, and core elements. Only modify the style, furniture, and decor as requested in the prompt."},
          {media: {url: input.photoDataUri}},
          {text: `Redesign the room in the provided image according to the following style prompt: ${input.stylePrompt}.`},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
    return {redesignedImageDataUri: media.url!};
  }
);
