import type { IssueLabelType } from '@/api/github/schemas/postSchema';

export type TagType = IssueLabelType & { count: number };
