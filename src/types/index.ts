import type { CollectionEntry } from 'astro:content';
import type { POSTS } from '@/constants';

export type PostsType = CollectionEntry<typeof POSTS>;

export * from '@/types/data';
export * from '@/types/posts';
export * from '@/types/route';
export * from '@/types/tag';
export * from '@/types/user';
