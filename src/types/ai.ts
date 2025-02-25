import { z } from 'zod';

export interface AIPostPrompt {
  topic: string
  destination: string
  tone: string
  additionalInfo?: string
}

export interface AIPostContent {
  title: string
  content: string
  description: string
  slug: string
  seo_slug: string
  image: string
  tags: string[]
  keywords: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
}

export interface ResearchResult {
  title: string
  answer:string
  content: string
  url: string
}

// Add this interface to define the expected outline format
interface OutlineSection {
  h2: string;
  h3: string[];
}

// Add to existing types
export const outlineSchema = z.array(z.object({
  h2: z.string(),
  h3: z.array(z.string())
}));

export type OutlineSection = z.infer<typeof outlineSchema>; 