import { z } from 'zod';
import { ISSUE_META, ROUTES } from '@/constants';

export const ContentsSchema = z.enum([ROUTES.PROJECT, ROUTES.BLOG, ROUTES.NOTE]);
export const StatusSchema = z.enum(['draft', 'published', 'archived']);

const COMMENT_REGEX = /<!--\s*([\s\S]*?)\s*-->/;

// 本文コメント内のメタデータ用スキーマ
export const IssueMetaSchema = z.object({
  [ISSUE_META.THUMBNAIL]: z.string().optional(),
  // TODO: descriptionのminは後で80に変えて
  [ISSUE_META.DESCRIPTION]: z.string().min(1),
});

// GitHub GraphQL から返ってくるノードの定義 ＋ 整形処理 (transform)
export const githubIssueNodeSchema = z
  .object({
    number: z.number(),
    title: z.string(),
    body: z.string(),
    createdAt: z.string(),
    labels: z.object({
      nodes: z.array(z.object({ name: z.string() })),
    }),
  })
  .transform(issue => {
    const labelNames = issue.labels.nodes.map(node => node.name);

    // --- 1. ラベル解析 ---
    // status:xxx
    const statusLabel = labelNames.find(l => l.startsWith('status:'))?.replace('status:', '');
    const statusParsed = StatusSchema.safeParse(statusLabel);
    const status = statusParsed.success ? statusParsed.data : 'published';

    // contentType:xxx
    const contentLabel = labelNames.find(l => l.startsWith('type:'))?.replace('type:', '');
    const contentParsed = ContentsSchema.safeParse(contentLabel);
    const contentType = contentParsed.success ? contentParsed.data : ROUTES.NOTE;

    // featured
    const featured = labelNames.includes('featured');

    // tag:xxx（それ以外の tag: から始まるものをタグ一覧にする）
    const tags = labelNames.filter(l => l.startsWith('tag:')).map(l => l.replace('tag:', '').trim());

    // --- 2. 本文コメント (HTMLコメント) からメタデータ抽出 ---
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

    // --- 3. UI/ドメイン用の最終的なオブジェクト構造にして返す ---
    return {
      number: issue.number,
      title: issue.title,
      body: cleanBody,
      createdAt: issue.createdAt,
      thumbnail: meta[ISSUE_META.THUMBNAIL],
      description: meta[ISSUE_META.DESCRIPTION],
      status,
      contentType,
      featured,
      tags,
    };
  });

// 検索レスポンス全体のスキーマ
export const IssueSearchResultSchema = z.object({
  search: z.object({
    issueCount: z.number(),
    pageInfo: z.object({
      hasNextPage: z.boolean(),
      endCursor: z.string().nullable(),
    }),
    nodes: z.array(githubIssueNodeSchema),
  }),
});

// 自動抽出される完成型の PostType
export type PostType = z.output<typeof githubIssueNodeSchema>;
