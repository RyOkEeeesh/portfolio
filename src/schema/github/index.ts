import { z } from 'zod';

export const IssueSchema = z.object({
  number: z.number(),
  title: z.string(),
  url: z.string(),
  state: z.string(),
  createdAt: z.string(),
  labels: z.object({
    nodes: z.array(z.object({ name: z.string() })),
  }),
});

export const SearchResultSchema = z.object({
  search: z.object({
    issueCount: z.number(),
    pageInfo: z.object({
      hasNextPage: z.boolean(),
      endCursor: z.string().nullable(),
    }),
    nodes: z.array(IssueSchema),
  }),
});
