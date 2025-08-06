# **App Name**: DecoGenius

## Core Features:

- Image Upload: Allow the user to upload an image of a room to be redesigned.
- Style Selection: Present the user with a list of styles to choose from. Limit initially to Modern, Classic, Luxury, and Minimal.
- Image Storage: Store the original uploaded image in Firebase Storage, prior to sending it for AI processing.
- AI Image Generation: Send the stored image's URL, plus the selected style, to the external AI image generation API to generate a redesigned image using an image-to-image AI model. This feature may use a tool to reason about which AI models or services to use based on real-time performance and cost factors.
- Image Display: Display the original and the AI-generated images side-by-side for comparison.
- Before/After Slider: Incorporate a before/after slider to compare the original and styled images.
- Image Download: Provide a download button for the user to download the AI-generated image.

## Style Guidelines:

- Primary color: HSL 40, 90%, 50% - A vibrant yellow-orange (#F0A202) to represent creativity and innovation in design.
- Background color: HSL 40, 20%, 95% - A very light desaturated yellow-orange (#F9F3EC) provides a soft, warm backdrop that won't distract from the images.
- Accent color: HSL 10, 70%, 40% - A deep orange-red (#B33607) provides contrast, ideal for call-to-action buttons.
- Body and headline font: 'Inter' sans-serif font for a clean and modern aesthetic.
- Use modern and minimalist icons for a sleek and professional feel.
- Responsive layout using Tailwind CSS to support both web and mobile devices; the layout will support a future enhancement for right-to-left (RTL) layouts, especially for Arabic.
- Subtle transitions and animations to enhance user experience.