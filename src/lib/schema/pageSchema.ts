import { z } from 'zod';

export const sectionSchema = z.object({
  sectionId: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.any()),
});

export const pageSchema = z.object({
  pageId: z.string(),
  slug: z.string(),
  title: z.string(),
  sections: z.array(sectionSchema),
});

export type Section = z.infer<typeof sectionSchema>;
export type Page = z.infer<typeof pageSchema>;
