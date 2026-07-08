import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const ratgeber = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ratgeber" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
    segments: z.array(z.enum(["privat", "ferienwohnung", "buero"])).default([]),
    regions: z.array(z.enum(["lausitz", "spreewald", "allgemein"])).default(["allgemein"]),
    relatedServiceIds: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
  }),
});

export const collections = { ratgeber };
