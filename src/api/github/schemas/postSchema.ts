import { z } from 'zod';
import { FEATURED, ISSUE_META, POSTS, ROUTES } from '@/constants';
import { ContentsSchema } from '@/schema';

export const StatusSchema = z.enum(['draft', 'published', 'archived']);

const COMMENT_REGEX = /<!--\s*([\s\S]*?)\s*-->/;

export const IssueMetaSchema = z.object({
  [ISSUE_META.THUMBNAIL]: z.string().optional(),
  [ISSUE_META.DESCRIPTION]: z.string().min(1),
});

export const IssueLabelSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const RawIssueNodeSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string(),
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  labels: z.object({
    nodes: z.array(IssueLabelSchema),
  }),
});

export const RawIssueSearchResultSchema = z.object({
  search: z.object({
    issueCount: z.number(),
    pageInfo: z.object({
      hasNextPage: z.boolean(),
      endCursor: z.string().nullable(),
    }),
    nodes: z.array(RawIssueNodeSchema),
  }),
});

export const CollectionSchema = z.object({
  title: z.string(),
  description: z.string().min(10), // TODO 文字数制限
  thumbnail: z.string().optional(),
  url: z.string(),
  status: z.string(),
  contentType: z.string(),
  featured: z.boolean(),
  tags: z.array(IssueLabelSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TransformCollectionSchema = z.object({
  id: z.string(),
  collection: z.literal(POSTS),
  body: z.string(),
  data: CollectionSchema,
});

export type IssueLabelType = z.infer<typeof IssueLabelSchema>;

export type RawIssueNodeType = z.infer<typeof RawIssueNodeSchema>;

export type TransformCollectionType = z.infer<typeof TransformCollectionSchema>;

export function transformIssueNode(issue: RawIssueNodeType): TransformCollectionType {
  const statusLabel = issue.labels.nodes.find(l => l.name.startsWith('status:'))?.name.replace('status:', '');
  const statusParsed = StatusSchema.safeParse(statusLabel);
  const status = statusParsed.success ? statusParsed.data : StatusSchema.enum.published;

  const contentLabel = issue.labels.nodes.find(l => l.name.startsWith('type:'))?.name.replace('type:', '');
  const contentParsed = ContentsSchema.safeParse(contentLabel);
  const contentType = contentParsed.success ? contentParsed.data : ROUTES.NOTE;

  const featured = issue.labels.nodes.some(l => l.name === FEATURED);
  const tags = issue.labels.nodes
    .filter(l => l.name.startsWith('tag:'))
    .map(l => ({ name: l.name.replace('tag:', '').trim(), color: l.color }));

  const metaMatch = issue.body.match(COMMENT_REGEX);
  const rawMeta: Record<string, string> = {};

  if (metaMatch) {
    for (const line of metaMatch[1].split('\n')) {
      const [key, ...valueParts] = line.split(':');
      if (!key || valueParts.length === 0) continue;

      const trimmedKey = key.trim();
      const value = valueParts.join(':').trim();

      if (trimmedKey === ISSUE_META.THUMBNAIL || trimmedKey === ISSUE_META.DESCRIPTION) {
        rawMeta[trimmedKey] = value;
      }
    }
  }

  const meta = IssueMetaSchema.parse(rawMeta);
  const cleanBody = issue.body.replace(COMMENT_REGEX, '').trim();

  return {
    id: String(issue.number),
    collection: POSTS,
    body: cleanBody,
    data: {
      title: issue.title,
      description: meta[ISSUE_META.DESCRIPTION],
      thumbnail: meta[ISSUE_META.THUMBNAIL],
      url: issue.url,
      status,
      contentType,
      featured,
      tags,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    },
  };
}
