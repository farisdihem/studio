
'use server';

import { generateStyledImage } from '@/ai/flows/generate-style-prompt';
import { z } from 'zod';

const actionSchema = z.object({
  photoDataUri: z.string().refine(val => val.startsWith('data:image/'), {
    message: 'Invalid image data URI',
  }),
  style: z.string(),
});

export async function generateStyledImageAction(input: { photoDataUri: string; style: string }) {
  try {
    const { photoDataUri, style } = actionSchema.parse(input);

    const stylePrompt = `Redesign this room in a ${style} interior design style. Focus on creating a photorealistic and aesthetically pleasing result.`;

    const result = await generateStyledImage({
      photoDataUri,
      stylePrompt,
    });

    if (!result.redesignedImageDataUri) {
      throw new Error('The AI model did not return an image.');
    }

    return { redesignedImageDataUri: result.redesignedImageDataUri };
  } catch (error) {
    console.error('Error in generateStyledImageAction:', error);
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input provided.' };
    }
    return { error: 'Failed to generate image. Please try again later.' };
  }
}
