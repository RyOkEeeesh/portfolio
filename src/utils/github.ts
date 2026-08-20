import { ISSUE_META } from '@/constants';
import { IssueMetaSchema } from '@/schema';
import type { IssueType, PostType } from '@/types';

const COMMENT_REGEX = /<!--\s*([\s\S]*?)\s*-->/;

export function getIssueMetaAndBody(rawBody: IssueType['body']): Pick<PostType, 'thumbnail' | 'description' | 'body'> {
  const metaMatch = rawBody.match(COMMENT_REGEX);
  const rawMeta: Record<string, string> = {};

  if (metaMatch) {
    const commentContent = metaMatch[1];

    for (const line of commentContent.split('\n')) {
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
  const body = rawBody.replace(COMMENT_REGEX, '').trim();

  return { ...meta, body };
}
