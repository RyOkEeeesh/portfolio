import type { CollectionEntry } from 'astro:content';
import type { POSTS } from '@/constants';

export type PostsType = CollectionEntry<typeof POSTS>;
