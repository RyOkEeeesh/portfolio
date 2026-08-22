import { z } from 'zod';
import { ISSUE_META, ROUTES } from '@/constants';

export const ContentsSchema = z.enum([ROUTES.PROJECT, ROUTES.BLOG, ROUTES.NOTE]);
export const StatusSchema = z.enum(['draft', 'published', 'archived']);

const COMMENT_REGEX = /<!--\s*([\s\S]*?)\s*-->/;

export const IssueMetaSchema = z.object({
  [ISSUE_META.THUMBNAIL]: z.string().optional(),
  [ISSUE_META.DESCRIPTION]: z.string().min(1),
});

// ① 生データ（GraphQLのレスポンスそのまま）のスキーマ
export const RawIssueNodeSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  labels: z.object({
    nodes: z.array(z.object({ name: z.string() })),
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

export type RawIssueNodeType = z.infer<typeof RawIssueNodeSchema>;

// ② トランスフォーム処理だけを行う単体関数
export function transformIssueNode(issue: RawIssueNodeType) {
  const labelNames = issue.labels.nodes.map(node => node.name);

  // --- 1. ラベル解析 ---
  const statusLabel = labelNames.find(l => l.startsWith('status:'))?.replace('status:', '');
  const statusParsed = StatusSchema.safeParse(statusLabel);
  const status = statusParsed.success ? statusParsed.data : 'published';

  const contentLabel = labelNames.find(l => l.startsWith('type:'))?.replace('type:', '');
  const contentParsed = ContentsSchema.safeParse(contentLabel);
  const contentType = contentParsed.success ? contentParsed.data : ROUTES.NOTE;

  const featured = labelNames.includes('featured');
  const tags = labelNames.filter(l => l.startsWith('tag:')).map(l => l.replace('tag:', '').trim());

  // --- 2. メタデータ抽出 ---
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

  // --- 3. UI/ドメイン用の最終構造 ---
  return {
    id: String(issue.number),
    collection: 'posts' as const,
    body: cleanBody,
    data: {
      title: issue.title,
      description: meta[ISSUE_META.DESCRIPTION],
      thumbnail: meta[ISSUE_META.THUMBNAIL],
      status,
      contentType,
      featured,
      tags,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    },
  };
}
