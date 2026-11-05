import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/insights',
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string(),
    language: z.enum(['en', 'tr']),
    translationKey: z.string(),
    takeaways: z.array(z.string()).optional(),
    category: z.string(),
    tags: z.array(z.string()),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  insights,
};