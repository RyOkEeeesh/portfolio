import { ISSUE_META } from '@/constants';
import type { IssueMetaType, IssueType } from '@/types/github';

export function getIssueMeta(rawBody: IssueType['body']): { meta: IssueMetaType; content: string } {
  const metaMatch = rawBody.match(/<!--\s*([\s\S]*?)\s*-->/);

  const meta: IssueMetaType = {};

  if (metaMatch) {
    const commentContent = metaMatch[1];

    const thumbnailRegex = new RegExp(`^${ISSUE_META.THUMBNAIL}:\\s*(.+)$`, 'm');
    const descriptionRegex = new RegExp(`^${ISSUE_META.DESCRIPTION}:\\s*(.+)$`, 'm');

    const thumbnailMatch = commentContent.match(thumbnailRegex);
    const descriptionMatch = commentContent.match(descriptionRegex);

    if (thumbnailMatch) {
      meta[ISSUE_META.THUMBNAIL] = thumbnailMatch[1].trim();
    }
    if (descriptionMatch) {
      meta[ISSUE_META.DESCRIPTION] = descriptionMatch[1].trim();
    }
  }

  const content = rawBody.replace(/<!--[\s\S]*?-->/, '').trim();

  return { meta, content };
}
